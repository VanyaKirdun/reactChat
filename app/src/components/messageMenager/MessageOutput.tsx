import {  useEffect, useState,  } from "react";
import { useSelector } from "react-redux";
import useChat from "../../hooks/useChat";
import { RootState } from "../../store";
import MessageItem from "./MessageItem";
import inknownIcon from '../../icons/unknowIcon.png'
import { SERVER_URL } from "../../config";
let BootstrapMenu = require('bootstrap-menu');



export default function MessageOutput({messages, loading, setLoading}: {messages: string, loading: boolean, setLoading: (param: any) => boolean}) {
  const userId = useSelector((state: RootState) => state.user.userId)
  const { removeMessage} = useChat()
  const adminId = useSelector((state: RootState)=>state.chat.admins)
  const moderators = useSelector((state: RootState)=>state.chat.moderators)

  const [messageList, setMessageList] = useState({});

  useEffect(() => {
    setLoading(true)
    setMessageList(messages);
  }, [messages] );

  useEffect(()=>{
    if(Object.keys(messageList).length>0) {
      if(messageList['0']) setMessageList({})
      setLoading(false)
    }
  }, [messageList])

  const callContextMenu = (event: any, item: any)=>{
    event.preventDefault()
    if( adminId === userId || item.user_id===userId) {
      var menu = new BootstrapMenu('.message', {
        actions: [
          {
            name: 'Удалить',
            onClick: function() {
              removeMessage(item);
            }
          }
        ]
      });
    }
  }

  return(
    <>
      {loading && <div className="spinner-border text-primary" role="status">
        <span className="sr-only"></span>
      </div>}

      <div className="flex-grow-1 p-2 overflow-auto chatList" style={{height: 0}}>
        {messageList['0']!==null && Object.keys(messageList).map((key: any) =>
          <section className="mt-3" key={messageList[key].id} >
            {messageList[key].typeMessage !== 'system' && <div className={"message p-2 rounded col-12 col-sm-4 col-md-4 col-lg-4 " + (messageList[key].user_id === userId ? 'ms-auto text-white bg-primary' : 'mr-auto bg-secondary')} 
              onContextMenu={(event)=>callContextMenu(event, messageList[key])}>

              {messageList[key].user_id &&
                <div className="d-flex align-items-center">
                  <img src={messageList[key].icon === null ? inknownIcon  : `${SERVER_URL}/icons${messageList[key].icon}`}
                    alt="" className={"img-fluid rounded-circle border border-dark border-3 me-2"}
                    style={{width: "50px"}}/>
                    
                  <div className="text-info" key={messageList[key].id}><span className="overflow">{messageList[key].user_name}</span>{adminId === messageList[key].user_id ? '(admin)' : JSON.parse(moderators).some((even:any)=>even===messageList[key].user_id) ? '(moderator)' : ''}</div>
                </div>
              }
              <MessageItem item={messageList[key]}/>
              <div className="ms-auto text-white-50" style={{width: "fit-content"}}>{messageList[key].time_stamp.slice(10, 16).replace('T', ' ')}</div>
            </div>}

            {messageList[key].typeMessage === 'system' && 
            <div className={"message text-center p-2 rounded mx-auto text-white text-break"} 
              onContextMenu={(event)=>callContextMenu(event, messageList[key])}>
                {messageList[key].text}
            </div>}
          </section>
        )}
      </div>
    </>
  )
}