import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'
import { getAllChat, getChat } from '../actions/chat';
import { RootState } from '../store';
import { useAppDispatch } from './hooks';
import { auth } from '../actions/user';
import { logout } from '../reducers/userReducer';
import { SERVER_URL } from '../config';


export default function useChat() {
  const dispatch = useAppDispatch()
  const chatId = useSelector((state: RootState)=>state.chat.chatId)
  const chatList = useSelector((state: RootState) => state.chat.list)
  const user = useSelector((state: RootState) => state.user) 
  const [usersSocket, setUsersSocket] = useState([])
  const [banedSocket, setBanedSocket] = useState([])
  const [messagesSocket, setMessagesSocket] = useState([])
  const [userOnlineSocket, setUsersOnlineSocket] = useState([])
  const [log, setLog] = useState(null)
  const navigate = useNavigate();
  const [socket, setSocket] = useState(
    io(SERVER_URL, {
      autoConnect: false,
      query: {
        roomId: chatId,
        userName: user.name,
        userId: user.userId,
      }
    })
  )




  useEffect(()=>{
    socket.disconnect()
    setSocket(io(SERVER_URL, {
      query: {
        roomId: chatId,
        userName: user.name,
        userId: user.userId
      }
    }))

    return()=>{
      socket.off('user_list:update')
      socket.off('user_online:update')
      socket.off('users_status:update')
      socket.off('log')
      socket.off('message_list:update')
      socket.off('chat:deleted')
      socket.off('chat:update')
      socket.off('user:type_update')
      socket.off('user:user_updated')
      socket.disconnect();
    }
  }, [chatId, user])

  useEffect(()=>{
    socket.connect()
    socket.on('user:user_updated', ()=>{
      dispatch(auth())
    })

    socket.on('user_list:update', (users: any, baned: any) => { 
      setUsersSocket(users)
      setBanedSocket(baned)
    })

    socket.on('user_online:update', (users: any) => {
      setUsersOnlineSocket(users)
    })

    socket.on('users_status:update', () => {
      socket.emit('users:online')
      socket.emit('message:get')
    })

    socket.on('log', (logs: any, id: number) => {
      if(id && user.userId === id){
        navigate('/', { replace: true });
        dispatch(getAllChat())
      } else {
        socket.emit('message:get')
        setLog(logs)
      }
      
    })

    socket.on('message_list:update', (messages: any) => {
      let list = messages;
      if(Object.keys(messages).length<1) list = {'0': null}
      setMessagesSocket(list)
    }) 

    socket.on('user:type_update', () => {
      dispatch(getChat(chatId)).then((e:any)=>{
        if(!e) {
          navigate('/', { replace: true });
        }
      })
    }) 

    socket.on('chat:update', ()=>{
      dispatch(getChat(+chatId)).then(()=>{
        dispatch(getAllChat())
      })
    })

    socket.on('chat:deleted', ()=>{
      navigate('/', { replace: true });
      dispatch(getAllChat())
    })
    
    return()=>{
      socket.off('user_list:update')
      socket.off('user_online:update')
      socket.off('users_status:update')
      socket.off('log')
      socket.off('message_list:update')
      socket.off('chat:deleted')
      socket.off('chat:update')
      socket.off('user:type_update')
      socket.off('user:user_updated')
      socket.disconnect();
    }
  }, [socket])

  const changeQuery = () => {
    socket.disconnect()
    socket.connect()
  }

  const userInvite = (userId: number, chatId: number|undefined = undefined) =>{
    socket.connect()
    socket.emit('user:invite', +userId, chatId)
  }

  const userAdd = () =>{
    socket.connect()
    socket.emit('user:add', user)
  }

  const usersOnline = () =>{
    socket.connect()
    socket.emit('users:online')
  }

  const messageGet = () =>{
    socket.connect()
    socket.emit('message:get')
  }

  const changeChatName = (name: string) => {
    socket.connect()
    socket.emit('chat:name_change', name)
  }

  const sendMessage = (message: any) => {
    socket.connect()
    socket.emit('message:add', message)
  }

  const removeMessage = (message: string) => {
    socket.connect()
    socket.emit('message:remove', message)
  }

  const getUsers = (id: number, user: any) =>{
    socket.connect()
    socket.emit('user:get', id, user)
    socket.emit('user:getBanned', id)
  }

  const changeName = (name: string) =>{
    socket.connect()
      socket.emit('users:update_name', user.userId, name)
  }

  const changeIconProfile = (path: string) => {
    socket.connect()
    socket.emit('users:update_icon', path)
  }

  const changeIconChat = (path: string) => {
    socket.connect()
    socket.emit('chat:update_icon', path)
  }

  const takeModerator = (userId: number, moderators: any) =>{
    socket.connect()
    socket.emit('user:take_moderator', +userId, moderators)
  }

  const removeModerator = (userId: number, moderators: any) =>{
    socket.connect()
    socket.emit('user:remove_moderator', +userId, moderators)
  }

  const resetAdmin = (id: number) =>{
    socket.connect()
    socket.emit('user:reset_admin', id)
  }

  const takeBan = (userId: number, baned: any) =>{
    socket.connect()
    socket.emit('user:ban', +userId, baned)
  }

  const removeBan = (userId: number, baned: any) =>{
    socket.connect()
    socket.emit('user:remove_ban', +userId, baned)
  }

  const removeUser = (idChat: number, user: any, type: boolean) =>{
    socket.connect()
    socket.emit('user:remove', idChat, user, type)    
  }

  const userDelete = () =>{
    if(chatList.some((even: any)=> even.admins === user.userId)){
      alert("Вы является админом в одном из чатов. Передайте роль или удалить чат!")
    } else{
      socket.connect()
      socket.emit('user:delete')
      dispatch(logout())
    }
  }

  const chatDelete = () =>{
    socket.connect()
    socket.emit('chat:delete')
  }

  const setPrivate = () =>{
    socket.connect()
    socket.emit('chat:set_private')
  }

  const setPublic = () =>{
    socket.connect()
    socket.emit('chat:set_public')
  }

  return { usersSocket, banedSocket, messagesSocket, userOnlineSocket, socket, log, usersOnline, changeIconProfile, changeIconChat, setPrivate, setPublic, resetAdmin, takeBan, removeBan, chatDelete, userDelete, changeName, changeChatName, takeModerator, removeModerator, userInvite, changeQuery, userAdd, messageGet, sendMessage, removeMessage, removeUser, getUsers }
}