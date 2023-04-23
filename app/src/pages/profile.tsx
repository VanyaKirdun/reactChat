import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { reset } from "../reducers/chatReducer";
import useChat from "../hooks/useChat";
import ModalWindow from "../components/ModalWindow";
import { loginChange } from "../actions/user";
import inknownIcon from '../icons/unknowIcon.png'
import fileApi from "../api/file.api";
import { getAllChat } from "../actions/chat";
import { useAppDispatch } from "../hooks/hooks";
import { SERVER_URL } from "../config";

const Profile = () =>{
  const dispatch = useDispatch();
  const dispathcer = useAppDispatch();
  const isAuth = useSelector((state: RootState) => state.user.isAuth)
  const userName = useSelector((state: RootState) => state.user.name)
  const userId = useSelector((state: RootState) => state.user.userId)
  const { changeName, changeIconProfile, userDelete } = useChat()
  const userIcon = useSelector((state: RootState) => state.user.icon)
  
  const [iconLink, setIconLink] = useState<string>(inknownIcon)
  const [name, setName] = useState<string>('')
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordNew, setPasswordNew] = useState<string>('')
  const [file, setFile] = useState<File|null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sendIconProfile = async()=>{
    try {
      if(file!=null){
        await fileApi.uploadIconProfile({ file, userId }).then((path)=>{
          changeIconProfile(path)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!file && inputRef.current != null) {
      inputRef.current.value = ''
    } else if(file){
      sendIconProfile()
    }
  }, [file])

  useEffect( () => {
    dispatch(reset())
    if(isAuth) dispathcer(getAllChat())
  }, [] );

  useEffect( () => {
    if(isAuth){
      if(userIcon === null){
        setIconLink(inknownIcon)
      } else setIconLink(`${SERVER_URL}/icons${userIcon}`);
    }
  }, [userIcon, isAuth] );

  return(
    <div className="vh-100 row p-0 m-0">
    {isAuth && <div className="form-group bg-light col-md-9 mx-auto text-dark row px-0 py-5 m-0 align-self-center">
        <div>Ваш id: {userId}</div>
        <div className='d-flex'>
          <input
            type='file'
            accept='image/*'
            onChange={(e: any) => setFile(e.target.files[0])}
            className='visually-hidden'
            ref={inputRef}
          />
          <button
            type='button'
            className='btn mx-auto'
            onClick={() => {
              if(inputRef.current != null){
                inputRef.current.click()
              }
            }}
          >
            <img src={iconLink}
                  alt="" className={"img-fluid rounded-circle border border-dark border-3"}
                  style={{width: "50px"}}/>
          </button>
        </div>
          


        <button type='button' className='p-2 rounded bg-transparent border-0 btn btn-lg' 
        data-bs-toggle="modal" data-bs-target="#modalNameChangeWindow">
          <span>Поменять имя пользователя: {userName}</span>
        </button>
        <ModalWindow id={'modalNameChangeWindow'}>
          <div className="modal-body">
            <div>Старое имя: {userName}</div>
            <div className="d-flex align-items-center">
              <span className="me-2">Имя: </span>
              <input className="form-control" value={name} onChange={(event)=>{setName(event.target.value)}} type='text' placeholder="Новое имя"/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{setName('')}}>Close</button>
            <button type="button" className="btn btn-primary" onClick={()=>{changeName(name)}}>Save changes</button>
          </div>
        </ModalWindow>

        <button type='button' className='p-2 rounded bg-transparent border-0 btn btn-lg' 
        data-bs-toggle="modal" data-bs-target="#modalLoginChangeWindow">
          <span>Поменять логин</span>
        </button>
        <ModalWindow id={'modalLoginChangeWindow'}>
          <div className="modal-body">
            <div className="d-flex align-items-center">
              <span className="me-2">New Login: </span>
              <input className="form-control" value={login} onChange={(event)=>{setLogin(event.target.value)}} type='text' placeholder="Новый логин"/>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2">Password: </span>
              <input className="form-control" value={password} onChange={(event)=>{setPassword(event.target.value)}} type='text' placeholder="Введите пароль"/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{setName('')}}>Close</button>
            <button type="button" className="btn btn-primary" onClick={()=>{loginChange(login, password)}}>Save changes</button>
          </div>
        </ModalWindow>

        <button type='button' className='p-2 rounded bg-transparent border-0 btn btn-lg' 
        data-bs-toggle="modal" data-bs-target="#modalPasswordChangeWindow">
          <span>Поменять пароль</span>
        </button>
        <ModalWindow id={'modalPasswordChangeWindow'}>
          <div className="modal-body">
            <div className="d-flex align-items-center">
              <span className="me-2">Old password: </span>
              <input className="form-control" value={password} onChange={(event)=>{setPassword(event.target.value)}} type='text' placeholder="Введите старый пароль"/>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2">New Password: </span>
              <input className="form-control" value={passwordNew} onChange={(event)=>{setPasswordNew(event.target.value)}} type='text' placeholder="Введите новый пароль"/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{setName('')}}>Close</button>
            <button type="button" className="btn btn-primary" onClick={()=>{loginChange(login, password)}}>Save changes</button>
          </div>
        </ModalWindow>

        <button type='button' className='p-2 rounded border-0 btn btn-danger' 
        data-bs-toggle="modal" data-bs-target="#modalDeleteWindow">
          <span>Удалить аккаунт</span>
        </button>
        <ModalWindow id={'modalDeleteWindow'}>
          <div className="modal-body">
            <div className="d-flex align-items-center">
              <span className="me-2">Ты сука уверен?</span>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No, I've joked</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>{userDelete()}}>Yes, delete</button>
          </div>
        </ModalWindow>
      </div>}
    </div>
  )
}

export default Profile;