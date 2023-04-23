import { useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/hooks";
import useChat from "../../hooks/useChat";
import { RootState } from "../../store";
import EmojiMart from "./Emodji"
import FileInput from "./FileInput"
import fileApi from "../../api/file.api";
import { getMessages } from "../../actions/chat";
import Recorder from "./Recorder/Recorder";

export default function MessageInput({file, setFile, liftDown, message, setMessage}: {file: File|null, setFile: any, showPreview: boolean, liftDown: any, message:string, setMessage: any}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const userId = useSelector((state: RootState) => state.user.userId)
  const { messagesSocket, sendMessage} = useChat()
  const chatId = useSelector((state: RootState)=>state.chat.chatId)

  const send = async() =>{
    if (!file) {
      if(chatId) {
        if(message.trim()!==''){
          sendMessage({      
            text: message,
            type: 'text',
            user_id: userId,
            room_id: +chatId,
            typeMessage: 'simple'
          })
        }
      }
    } else{
      try {
        if(chatId){
          await fileApi.uploadFile({ file, chatId }).then((path)=>{
            const type = file.type.split('/')[0]
            sendMessage({      
              type: type,
              user_id: userId,
              room_id: +chatId,
              textOrPathToFile: path,
              typeMessage: 'simple'
            })
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    setMessage('')
    setFile(null)
    dispatch(getMessages(messagesSocket)).then(()=>liftDown())
    
  }

  return(
    <form className="d-flex align-items-center bg-secondary px-2 position-relative" style={{height: "50px"}} onSubmit={(event)=> {event.preventDefault()}}>
      <EmojiMart setText={setMessage} messageInput={inputRef.current}/>
      <input className="form-control bg-secondary border-0 text-white"  value={message} onChange={(event)=>{setMessage(event.target.value)}} ref={inputRef} type='text' placeholder="Написать сообщение..."/>
      <button className="p-2 rounded bg-transparent border-0 btn btn-lg" style={{color: 'darkgray'}} onClick={send}><i className="bi bi-send"></i></button>
      <FileInput file={file} setFile={setFile} send={send}/>
      <Recorder setFile={setFile}/>
    </form>
  )
}