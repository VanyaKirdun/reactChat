import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { createChat, delChatFromList, getAllChat, globalSearch } from "../actions/chat";
import { useAppDispatch } from "../hooks/hooks";
import useChat from "../hooks/useChat";
import { RootState } from "../store";
import LinkMenu from "./linkMenu";
import SideBar from "./SideBar";

const Menu = () =>{
  const dispatch = useAppDispatch()
  const isAuth = useSelector((state: RootState) => state.user.isAuth)
  const chatList = useSelector((state: RootState) => state.chat.list)
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();
  const [search, setSearch] = useState<any>('')
  const [chats, setChats] = useState<any>([])
  const [usersSearch, setUsersSearch] = useState<any>([])
  const [roomsSearch, setRoomsSearch] = useState<any>([])
  const chatId = useSelector((state: RootState)=>state.chat.chatId)
  const userId = useSelector((state: RootState) => state.user.userId)
  const { userInvite, removeUser } = useChat()

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = (event) => {
      setWidth(event.target.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect( () => {
    if(isAuth){
      setChats(chatList)
    }
  }, [chatList, isAuth] );

  useEffect( () => {
    setUsersSearch([])
    setRoomsSearch([])
    if(isAuth){
      setChats(chatList.filter((item: any)=>item.name.includes(search)))
    }
  }, [search, isAuth] );

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && search.trim() !== '') {
      dispatch(globalSearch(search)).then((e: any)=>{
        setUsersSearch(e.users)
        setRoomsSearch(e.rooms)
      })
    }
  }

  const relocateToChat = (item: any) =>{
    dispatch(createChat('', true, false, item.id)).then((e: any)=>{
      if(e.message=== 'RELOCATE') {
        navigate(`/chat/${e.result.id}`, { replace: true });
      } else{
        dispatch(getAllChat())
        userInvite(item.id, e.insertId)
      }
    })
  }

  const deleteChat = (chatData: any) => {
    if(chatData.public === 1 && userId === chatData.admins){
      alert("Ты админ чучело! Передай роль!")
    } else{
      if(chatId && +chatId === chatData.id) {
        navigate('/', { replace: true });
      }
      dispatch(delChatFromList(chatData.id))
      removeUser(chatData.id, user, false)
      setChats(chatList)
    }
  }

  const openMenu = async()=>{
    if(document.getElementById('nav') !==null) document?.getElementById('nav')?.classList.toggle("nav-mobile_open");
  }

  return(
    <>
      <SideBar />
      <div className="row">
        <button className="btn col-2 col-sm-1 col-md-1 col-lg-2 p-0 m-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" role="button">
          <i className="bi bi-list fs-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"></i>
        </button>
        <div className="col-8 col-sm-10 col-md-10 col-lg-10 p-0 m-0">
          <input className="form-control" value={search} onKeyDown={(event)=>handleKeyDown(event)} onChange={(event)=>{setSearch(event.target.value)}} type='text' placeholder="Введите название"/>
        </div>
        {width < 992 && <button className="btn col-2 col-sm-1 col-md-1 col-lg-2 p-0 m-0" onClick={()=>openMenu()} role="button">
          <i className="bi bi-arrow-right fs-3"></i>
        </button>}
      </div>

      <nav className="navbar navbar-default d-flex flex-column align-items-start">
        <div className="w-100">
          <h5>Ваши чаты</h5>
          <ul className="nav navbar-nav">
            {!isAuth && <li><Link to={'/login'}>Login</Link></li>}
            {!isAuth && <li><Link to={'/registration'}>Regestration</Link></li>}
            {isAuth && chats?.map((chat: any) => 
              <LinkMenu key={chat.id} chat={chat} deleteChat={deleteChat} click={openMenu}/>
            )}
          </ul>
        </div>

        {isAuth && roomsSearch.length > 0 && <hr/>}
        {isAuth && roomsSearch.length > 0 && <div>
          <h5>Найденны чаты</h5>
          {isAuth && roomsSearch.length > 0 && <ul className="nav navbar-nav">
            {roomsSearch?.map((chat: any) => 
              <LinkMenu key={chat.id} type='ROOMS' chat={chat} click={openMenu}/>
            )}
          </ul>}
        </div>}

        {isAuth && usersSearch.length > 0 && <hr/>}
        {isAuth && usersSearch.length > 0 && <div>
          <h5>Найденны пользователи</h5>
          {<ul className="nav navbar-nav">
            {usersSearch?.map((even: any) => 
              <LinkMenu key={even.id} type='USERS' chat={even} relocateToChat={relocateToChat} click={openMenu}/>
            )}
          </ul>}
        </div>}
      </nav>
    </>
  )
}
export default Menu;