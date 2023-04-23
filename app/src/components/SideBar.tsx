import { useEffect, useState } from "react";
import {  useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { RootState } from "../store";
import inknownIcon from '../icons/unknowIcon.png'
import { SERVER_URL } from "../config";

const SideBar = () =>{
  const userIcon = useSelector((state: RootState) => state.user.icon)
  const isAuth = useSelector((state: RootState) => state.user.isAuth)
  const [iconLink, setIconLink] = useState<string>(inknownIcon)
  const userName = useSelector((state: RootState) => state.user.name)
  const [name, setName] = useState<string>('')

  useEffect( () => {
    if(isAuth){
      if(userIcon === null){
        setIconLink(inknownIcon)
      } else setIconLink(`${SERVER_URL}/icons${userIcon}`);
    }
  }, [userIcon, isAuth] );

  useEffect( () => {
    if(isAuth){
      setName(userName)
    }
  }, [userName, isAuth] );

  return(
    <>
      <div className="offcanvas offcanvas-start w-50"  tabIndex={-1} id="offcanvas" data-bs-keyboard="false" data-bs-backdrop="true">
        <div className="offcanvas-header">
            <img src={iconLink}
                  alt="" className={"img-fluid rounded-circle border border-dark border-3"}
                  style={{width: "50px"}}/>
            <h5 className="offcanvas-title d-sm-block" id="offcanvas">{name}</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <hr/>

        <div className="offcanvas-body px-0">
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                <li className="nav-item">
                    <Link className="nav-link text-truncate" to={`/profile`}>
                      <i className="bi bi-person-circle">
                        <span className="ms-1 d-sm-inline">Профиль</span>
                      </i>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-truncate" to={`/chat/create`}>
                      <i className="bi bi-plus-square">
                        <span className="ms-1 d-sm-inline">Создать чат</span>
                      </i>
                    </Link>
                </li>
            </ul>
        </div>
    </div>
    </>
  )
}
export default SideBar;