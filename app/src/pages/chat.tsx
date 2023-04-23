import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate, useParams } from "react-router-dom"; 
import { getAllChat, getBaned, getChat, getMembers, getMessages } from "../actions/chat";
import { useAppDispatch } from "../hooks/hooks";
import useChat from "../hooks/useChat";
import MessageInput from "../components/messageMenager/MessageInput";
import MessageOutput from "../components/messageMenager/MessageOutput";



const Chat = ({loading, setLoading}: {loading: any, setLoading: any}) => {
  const dispatch = useAppDispatch()
  const isAuth = useSelector((state: RootState) => state.user.isAuth)
  const user = useSelector((state: RootState) => state.user)
  const messages = useSelector((state: RootState) => state.chat.messages)
  const chatId = useSelector((state: RootState)=>state.chat.chatId)
  

  const [message, setMessage] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState<File|null>(null)
  const [atFirst, setAtFirst] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate();


  const { usersSocket, messagesSocket, socket, banedSocket, usersOnline, changeQuery, userAdd, messageGet, getUsers } = useChat()

  const liftDown=()=>{
    const elem = document.getElementsByClassName('chatList')[0]
    setTimeout(()=>{
      elem.scrollTo(0, elem.scrollHeight);
    }, 250)
  }



  useEffect(() => {
    if(file && file !== null) setShowPreview(true)
  }, [file, setShowPreview])

  useEffect(() => {
    if(isAuth && id){
      dispatch(getChat(+id)).then((e)=>{
        switch (e) {
          case false:
            navigate('/', { replace: true });
            break;

          case 'ADD':
            setAtFirst(!atFirst)
            dispatch(getAllChat())
            break;

          case 'NOADD':
            dispatch(getAllChat())
            break;
          default:
            break;
        }
      }) 
    }
  }, [isAuth, id] );

  useEffect(()=>{

    if(chatId){
      changeQuery()
      messageGet()
      getUsers(chatId, user);
      usersOnline()
    }
  }, [chatId, socket])

  useEffect(()=>{
    if(atFirst) {
      userAdd()
    }
  }, [atFirst])

  useEffect(()=>{
    dispatch(getMessages(messagesSocket)).then(()=>{
      liftDown()
    })
  }, [messagesSocket])

  useEffect(()=>{
    dispatch(getMembers(usersSocket))
    dispatch(getBaned(banedSocket))
  }, [usersSocket, banedSocket])

  return(
    <div className="p-0 m-0 flex-grow-1 d-flex flex-column">
      <MessageOutput messages={messages} loading={loading} setLoading={setLoading}/>
      <MessageInput file={file} setFile={setFile} showPreview={showPreview} liftDown={liftDown} message={message} setMessage={setMessage}/>
    </div>
  )

}

export default Chat;