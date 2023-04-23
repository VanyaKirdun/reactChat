import axios from 'axios'
import { setUser } from '../reducers/userReducer'
import { Dispatch } from 'redux';
import { SERVER_URL } from '../config';

export const registration = (login: string, password: string, name: string) => {
  return async (dispatch: Dispatch) => {
      try{
          const response = await axios.post(`${SERVER_URL}/api/auth/registration`, {
              login,
              password,
              name
          })
          dispatch(setUser(response.data.user))
          localStorage.setItem('token', response.data.token)
      } catch(e: any){
          alert(e.response.data.message)
      }
      
  }
}

export const logIn = (login: string, password: string) => {
  return async (dispatch: Dispatch) => {
      try{
          const response = await axios.post(`${SERVER_URL}/api/auth/login`, {
              login,
              password
          })
          dispatch(setUser(response.data.user))
          localStorage.setItem('token', response.data.token)
      } catch(e: any){
          alert(e.response.data.message)
      }
  }
}

export const auth = () => {
  return async (dispatch: Dispatch) => {  
       try{
          const response = await axios.get(`${SERVER_URL}/api/auth/auth`, 
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
          )
          dispatch(setUser(response.data.user))
          localStorage.setItem('token', response.data.token)
      } catch(e: any){
          alert(e.response.data.message)
          localStorage.removeItem('token')
      }
  }
}

export const loginChange = async (login: string, password: string) => {
    try{
        await axios.post(`${SERVER_URL}/api/auth/login/change`, 
            {
            login,
            password
            },
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
        )
    } catch(e: any){
        alert(e.response.data.message)
    }
}

export const passwordChange = async (passwordOld: string, passwordNew: string) => {
    try{
        await axios.post(`${SERVER_URL}/api/auth/password/change`, 
            {
            passwordOld,
            passwordNew
            },
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
        )
    } catch(e: any){
        alert(e.response.data.message)
    }
}


