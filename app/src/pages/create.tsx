import { useState } from "react"
import { useAppDispatch } from '../hooks/hooks'
import { createChat, getAllChat } from "../actions/chat"

const Create = () =>{
  const [name, setName] = useState<string>('')

  const dispatch = useAppDispatch()
  const [checked, setChecked] = useState(false);

  const toggle = (value: boolean)=>{
    return !value;
  }

  const updateMenuList = () => {
    dispatch(createChat(name, checked, true)).then(()=>dispatch(getAllChat()))
    
  }

  return(
  <div className="vh-100 row p-0 m-0">
    <form className="align-self-center col-md-9 mx-auto bg-light bg-gradient" role="form">
        <div className="form-group col-md-9 mx-auto text-dark row px-0 py-5 m-0">
          <h3>Введите данные для чата:</h3>
          <input className="form-control" value={name} onChange={(event)=>{setName(event.target.value)}} type='text' placeholder="Введите название"/>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="privateMode" checked={checked} onChange={() => setChecked(toggle)}/>
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Приватный?
            </label>
          </div>
          <input className="btn btn-success" type="button" value="Создать" onClick={updateMenuList}/>
        </div>
      </form>
  </div>
  )
}

export default Create;