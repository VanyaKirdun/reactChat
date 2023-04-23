import { useEffect, useState } from 'react';
import './App.scss';
import Menu from './components/Menu';
import Header from './components/Header';
import {  Route, Routes, useNavigate } from 'react-router-dom';
import Index from './pages';
import Login from './pages/login';
import Registration from './pages/registration';
import { RootState } from './store';
import { useSelector } from 'react-redux';
import { auth } from './actions/user';
import { useAppDispatch } from './hooks/hooks';
import { getAllChat } from './actions/chat';
import Chat from './pages/chat';
import Create from './pages/create';
import Profile from './pages/profile';
import { io } from 'socket.io-client'
import { SERVER_URL } from './config';

function App() {
  const isAuth = useSelector((state: RootState) => state.user.isAuth)
  const user = useSelector((state: RootState) => state.user)
  const chatList = useSelector((state: RootState) => state.chat.list)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)

  const dispatch = useAppDispatch()
  
  useEffect( () => {
    if(localStorage.getItem('token')){
      dispatch(auth())
      if(isAuth){
        dispatch(getAllChat())
      }
    }
  }, [isAuth] );

  useEffect( () => {
    if(isAuth && user && chatList){
      const socket = io(SERVER_URL, {
        query: {
          roomId: '',
          userName: user.name,
          userId: user.userId,
        }
      })
      socket.emit('user:enter', chatList) 
      socket.on('user:chatList_update', (redirect: boolean = false) => {
        if(redirect){
          navigate('/', { replace: true });
        }
        dispatch(getAllChat())
      }) 
      socket.on('user:user_updated', ()=>{
        dispatch(auth())
      })
      socket.on('log', (logs: any) => {
        alert(logs)
      })
      
      window.onbeforeunload = ((event: any)=>{
        event.preventDefault();
        socket.emit('disconnectUser', chatList);
      })
      return () => {
        socket.disconnect();
      } 
    }
  }, [isAuth, user, chatList] );

  return (
    <div className="container-fluid">
      <div className="row">
        <div id='nav' className={`col-xs-12 col-sm-12 col-lg-3 col-xl-3 p-0 m-0 vh-100 bg-secondary nav-mobile`}>
          <Menu></Menu>
        </div>
        <div className="col-xs-12 col-sm-12 col-lg-9 col-xl-9 p-0 m-0 vh-100 bg-dark d-flex flex-column">
          <Header loading ={loading}></Header>
          <Routes>
            <Route path='/' element={<Index/>}></Route>
            {!isAuth && <Route path='/login' element={<Login/>}></Route>}
            {!isAuth && <Route path='/registration' element={<Registration/>}></Route>}
            {isAuth && <Route path='/profile' element={<Profile/>}></Route>}
            {isAuth && <Route path='/chat/create' element={<Create/>}></Route>}
            {isAuth && <Route path='/chat/:id' element={<Chat loading ={loading} setLoading={setLoading}/>}></Route>}
          </Routes>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossOrigin="anonymous"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/4.0.0/js/jasny-bootstrap.min.js"></script>
    </div>
  );
}

export default App;
