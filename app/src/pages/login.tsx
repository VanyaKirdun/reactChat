import { useState } from "react"
import { logIn } from "../actions/user"
import { useAppDispatch } from '../hooks/hooks'

const Login = () =>{
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const dispatch = useAppDispatch()

  const authorization = () =>{
    let dirty = false;
    if(login.trim() === '') dirty = true
    if(password.trim() === '') dirty = true
    if(!dirty) dispatch(logIn(login, password))
  }

  return(
  <div className="vh-100 row p-0 m-0">
    <form className="align-self-center col-md-9 mx-auto bg-light bg-gradient" role="form">
      <div className="form-group col-md-9 mx-auto text-dark row px-0 py-5 m-0">
        <h3>Введите свои данные:</h3>
        <input className="form-control" value={login} onChange={(event)=>{setLogin(event.target.value)}} type='text' placeholder="Введите логин"/>
        <input className="form-control" value={password} onChange={(event)=>{setPassword(event.target.value)}} type='password' placeholder="Введите пароль"/>
        <input className="btn btn-success" type="button" value="Ввойти" onClick={()=>authorization()}/>
      </div>
    </form>
  </div>
  )
}

export default Login;