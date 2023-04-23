import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createChat, deleteUserFromChat, getAllChat } from "../actions/chat"
import { useAppDispatch } from "../hooks/hooks"
import useChat from "../hooks/useChat"
import { logout } from "../reducers/userReducer"
import { RootState } from "../store"
import fileApi from "../api/file.api"
import inknownIcon from '../icons/unknowIcon.png'
import { SERVER_URL } from "../config"
var BootstrapMenu = require('bootstrap-menu');




const Header = ({loading}) => {
  const dispatch = useAppDispatch()
  const isAuth = useSelector((state: RootState) => state.user.isAuth)
  const currentChatName = useSelector((state: RootState) => state.chat.name)
  const chats = useSelector((state: RootState)=>state.chat.members)
  const [chatName, setChatName] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [baned, setBaned] = useState<any[]>([])
  const chatId = useSelector((state: RootState)=>state.chat.chatId)
  const userId = useSelector((state: RootState) => state.user.userId)
  const adminId = useSelector((state: RootState)=>state.chat.admins)
  const moderators = useSelector((state: RootState)=>state.chat.moderators)
  const chatPrivate = useSelector((state: RootState)=>state.chat.private)
  const ban = useSelector((state: RootState)=>state.chat.ban)
  const navigate = useNavigate();

  const { userOnlineSocket, chatDelete, changeIconChat, setPrivate, setPublic, resetAdmin, takeBan, removeBan, changeChatName, takeModerator, removeModerator, userInvite, removeUser } = useChat()
  const [file, setFile] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [iconLink, setIconLink] = useState<any>(inknownIcon)
  const chatIcon = useSelector((state: RootState) => state.chat.icon)

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
      setChatName(currentChatName);
      setMembers(chats)
      setBaned(ban)
    }
  }, [currentChatName, isAuth, chats, chatId] );

  const openMenu = async()=>{
    if(document.getElementById('nav') !==null) document?.getElementById('nav')?.classList.toggle("nav-mobile_open");
  }

  const sendIconChat = async()=>{
    try {
      await fileApi.uploadIconChat({ file, userId }).then((path)=>{
        changeIconChat(path)
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!file && inputRef.current != null) {
      inputRef.current.value = ''
    } else if(file){
      sendIconChat()
    }
  }, [file])

  useEffect( () => {
    if(isAuth){
      if(chatIcon === null){
        setIconLink(inknownIcon)
      } else setIconLink(`${SERVER_URL}/icons${chatIcon}`);
    }
  }, [chatIcon, isAuth] );

  const callContextUsersMenu = (event: any, item: any)=>{
    event.preventDefault()
    new BootstrapMenu('.dropdown-item', {
      actions: [
        {
          name: 'Удалить пользователя',
          onClick: function() {
            if(item.userId !== adminId){
              removeUser(chatId, item, true)
              dispatch(deleteUserFromChat(chatId, item));
            } else {
              alert('Сначал передай права админа!')
            }
          },
          isShown: function() {
            return userId === adminId
          }
        },
        {
          name: 'Удалить пользователя',
          onClick: function() {
            if(item.userId !== adminId && !JSON.parse(moderators).some((even:any)=>even===item.userId)){
              removeUser(chatId, item, true)
              dispatch(deleteUserFromChat(chatId, item));
            } else {
              alert('Вы не обладаете достаточным уровнем прав, чтобы удалить этого пользователя!')
            }
          },
          isShown: function() {
            return JSON.parse(moderators).some((even:any)=>even===userId)
          }
        },
        {
          name: 'Сделать модератором',
          onClick: function() {
            takeModerator(item.userId, moderators)
          },
          isShown: function() {
            return userId === adminId && !JSON.parse(moderators).some((even:any)=>even===item.userId)
          }
        },
        {
          name: 'Убрать из модераторов',
          onClick: function() {
            removeModerator(item.userId, moderators)
          },
          isShown: function() {
            return userId === adminId && JSON.parse(moderators).some((even:any)=>even===item.userId)
          }
        },
        {
          name: 'Передать админа',
          onClick: function() {
            resetAdmin(item.userId)
          },
          isShown: function() {
            return userId === adminId
          }
        },
        {
          name: 'Забанить',
          onClick: function() {
            if(item.userId !== adminId){
              takeBan(item.userId, baned)
            } else {
              alert('Админа забанить НИЗЯ!')
            }
            
          },
          isShown: function() {
            return userId === adminId
          }
        },
        {
          name: 'Забанить',
          onClick: function() {
            if(item.userId !== adminId && !JSON.parse(moderators).some((even:any)=>even===item.userId)){
              takeBan(item.userId, baned)
            } else {
              alert('Вы не обладаете достаточным уровнем прав, чтобы удалить этого пользователя!')
            }
            
          },
          isShown: function() {
            return JSON.parse(moderators).some((even:any)=>even===userId)
          }
        },
        {
          name: 'Начать персональную беседу',
          onClick: function() {
            let name = prompt('Введите название', '');
            if(name) dispatch(createChat(name, true, false, item.userId)).then((e: any)=>{
              if(e.message=== 'RELOCATE') {
                navigate(`/chat/${e.result.id}`, { replace: true });
              } else{
                dispatch(getAllChat())
                userInvite(item.userId, e.insertId)
              }
            })
          },
        }
      ]
    });
  }

  const callContextBanedMenu = (event: any, item: any)=>{
    event.preventDefault()
    new BootstrapMenu('.dropdown-item', {
      actions: [
        {
          name: 'Разбанить нахуй',
          onClick: function() {
            removeBan(item.userId, baned)
          },
          isShown: function() {
            return userId === adminId || JSON.parse(moderators).some((even:any)=>even===userId)
          }
        },
        {
          name: 'Начать персональную беседу',
          onClick: function() {
            dispatch(createChat('', true, false, item.userId)).then((e: any)=>{
              if(e.message=== 'RELOCATE') {
                navigate(`/chat/${e.result.room_id}`, { replace: true });
              } else{
                dispatch(getAllChat())
                userInvite(item.userId, e.insertId)
              }
            })
          },
        }
      ]
    });
  }

  const callContextChatMenu = (event: any)=>{
    event.preventDefault()
    new BootstrapMenu('#chatName', {
      actions: [
        {
          name: 'Добавить пользователя',
          onClick: function() {
            let id = prompt('Введите id пользователя', '');
            if(id!==null && id!==undefined) userInvite(+id)
          },
          isShown: function() {
            return userId === adminId || JSON.parse(moderators).some((even:any)=>even===userId)
          }
        },
        {
          name: 'Поменять иконку чата',
          onClick: function() {
            if(inputRef.current != null){
              inputRef.current.click()
            }
          },
          isShown: function() {
            return userId === adminId 
          }
        },
        {
          name: 'Поменять название чата',
          onClick: function() {
            let name = prompt('Введите новое название', '');
            if(name!==null && name!==undefined) changeChatName(name)
          },
          isShown: function() {
            return userId === adminId 
          }
        },
        {
          name: 'Удалить чат',
          onClick: function() {
            chatDelete()
          },
          isShown: function() {
            return userId === adminId 
          }
        },
        {
          name: 'Сделать чат приватным',
          onClick: function() {
            setPrivate()
          },
          isShown: function() {
            return userId === adminId && chatPrivate !==1
          }
        },
        {
          name: 'Сделать чат публичным',
          onClick: function() {
            setPublic()
          },
          isShown: function() {
            return userId === adminId && chatPrivate ===1
          }
        },
      ]
    });
  }

  return(
    <div className="col-sm-12 col-md-12 col-lg-12">
      <ul className="d-flex bg-secondary p-0">
        {width<992 && <li>
          <button className="btn p-0 m-0" onClick={()=>openMenu()} role="button">
              <i className="bi bi-arrow-left fs-3" ></i>
          </button>
        </li>}
        {Number.isInteger(chatId) && width >600 && !loading && <li>
          <input
              type='file'
              accept='image/*'
              onChange={(e: any) => setFile(e.target.files[0])}
              className='visually-hidden'
              ref={inputRef}
            />
          <img src={iconLink}
                  alt="" className={"img-fluid rounded-circle border border-dark border-3 mx-2"}
                  style={{width: "40px"}}/>
        </li>}
        {Number.isInteger(chatId) && !loading && <li>
          <div className="text-primary dropdown">
            <div className="dropdown">
              <div className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Участники:
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {Object.keys(members)?.map((key: any) =>
                  <li key={members[key].userId}><div className="dropdown-item" onContextMenu={(event)=>callContextUsersMenu(event, members[key])}>{members[key].userId === adminId? 'Администратор: ': JSON.parse(moderators).some((even:any)=>even===members[key].userId)? 'Модератор: ': 'Пользователь: '} {members[key].userName}: {userOnlineSocket[members[key].userId]}</div></li>
                )}
              </ul>
            </div>
          </div>
        </li>}
        {Number.isInteger(chatId) && !loading && <li>
          <div className="text-primary dropdown">
            <div className="dropdown">
              <div className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                Забаненые:
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                {Object.keys(baned)?.map((key: any) =>
                  <li key={baned[key].userId}><div className="dropdown-item" onContextMenu={(event)=>callContextBanedMenu(event, baned[key])}>Пользователь: {baned[key].userName}</div></li>
                )}
              </ul>
            </div>
          </div>
        </li>}
        {Number.isInteger(chatId) && !loading && <li id="chatName" className="p-2 flex-grow-1 text-white" onContextMenu={(event)=>callContextChatMenu(event)}>{chatName}</li>}
        <li className="ms-auto"><div className="btn btn-danger" onClick={()=>dispatch(logout())}>Выйти</div></li>
      </ul>
      
    </div>
  )
}

export default Header;