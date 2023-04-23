import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import inknownIcon from '../icons/unknowIcon.png'
import { SERVER_URL } from "../config";

const LinkMenu = (props: any) =>{
  let element; 
  const [iconLink, setIconLink] = useState<string>(inknownIcon)

  useEffect(()=>{
    switch (props.chat.icon && props.chat.icon !==null) {
      case true:
        setIconLink(`${SERVER_URL}/icons${props.chat.icon}`)
        break;
    
      default:
        break;
    }
  }, [props])
  

  switch (props.type) {
    case 'USERS':
      element = <li>
                  <div className="d-flex justify-content-between align-items-center hover-effect" onClick={()=>{
                      props.relocateToChat(props.chat)
                      props.click()
                    }} role="button">
                    <img src={iconLink}
                      alt="" className={"img-fluid rounded-circle border border-dark border-3 m-2"}
                      style={{width: "50px"}}/>
                    <h5 className="flex-grow-1 overflow">{props.chat.name}</h5>
                  </div>
                </li>
      break;

    case 'ROOMS':
      element = <li>
                  <Link to={`/chat/${props.chat.id}`} className="d-flex justify-content-between align-items-center hover-effect" onClick={()=>props.click()} role="button">
                    <img src={iconLink}
                      alt="" className={"img-fluid rounded-circle border border-dark border-3 m-2"}
                      style={{width: "50px"}}/>
                    <h5 className="flex-grow-1 overflow">{props.chat.name}</h5>
                  </Link>
                </li>
      break;

    default:
      element = <li>
                  <div className="d-flex align-items-center">
                    <Link to={`/chat/${props.chat.id}`} className="d-flex justify-content-between align-items-center flex-grow-1 hover-effect" onClick={()=>props.click()} role="button">
                      <img src={iconLink}
                        alt="" className={"img-fluid rounded-circle border border-dark border-3 m-2"}
                        style={{width: "50px"}}/>
                      <h5 className="flex-grow-1 overflow">{props.chat.public === 0? props.chat.amount: props.chat.name}</h5>
                    </Link>
                    <h5><i className="bi bi-trash p-2 hover-effect" role="button" onClick={()=>props.deleteChat(props.chat)}></i></h5>
                  </div>
                </li>
      break;
  }

  return(
    <>
      {element}
    </>
  )
}
export default LinkMenu;