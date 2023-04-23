import axios from 'axios'
import { allChat, deleteChatFromList, setBaned, setChat, setMembers, setMessages } from '../reducers/chatReducer'
import { Dispatch } from 'redux';
import { SERVER_URL } from '../config';


export const getChat = (id: number) => {
  return async (dispatcher: Dispatch) => {
      try{
          const response = await axios.get(`${SERVER_URL}/api/chat/get/chatData/${id}`, 
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
          )
          switch (response.data.message) {
            case 'ADD':
              dispatcher(setChat(response.data.result))
              return response.data.message
            
            case false:
              return response.data.message

            case 'BAN':
              alert('ТЫ ТУТ ЗАБАНЕН НАХУЙ!')
              return false

            default:
              dispatcher(setChat(response.data))
              return 'NOADD';
          }
      } catch(e: any){
          alert(e.response.data.message)
          return false;
      }
      
  }
}

export const delChatFromList = (id: number) => {
  return async (dispatcher: Dispatch) => {
      try{
          await axios.delete(`${SERVER_URL}/api/chat/delete/user/${id}`, 
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
          )   
          dispatcher(deleteChatFromList(id)) 
      } catch(e: any){
          console.log(e)
      }
      
  }
}

export const getAllChat = () => {
  return async (dispatcher: Dispatch) => {
      try{
          const response = await axios.get(`${SERVER_URL}/api/chat/get/user/`, 
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
          )
          dispatcher(allChat(response.data))
      } catch(e: any){
          alert(e.response)
      }
      
  }
}

export const createChat = (name: string, privateMode: boolean, publicType: boolean, inviteId: number|undefined = undefined) => {
  return async (dispatcher: Dispatch) => {
      try{
          const response = await axios.post(`${SERVER_URL}/api/chat/create`, 
            {
              name: name,
              privateMode: privateMode,
              publicType: publicType,
              inviteId
            },
            { 
              headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            }
          )
          return response.data
      } catch(e: any){
          alert(e.response)
      }
      
  }
}

export const sendMessage = (text: string, type: any, user_id: number, room_id: number) => {
  return async (dispatcher: Dispatch) => {
      try{
          await axios.post(`${SERVER_URL}/api/chat/send/message`, 
            {
              
              text: text,
              type: type,
              user_id: user_id,
              room_id: room_id
            },
            { 
              headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            }
          )
      } catch(e: any){
          alert(e.response)
      }
      
  }
}

export const getMessages = (messages: any[]) => {
  return async (dispatcher: Dispatch) => {
      try{

          dispatcher(setMessages(messages))
      } catch(e: any){
          alert(e.response.data.message)
      }
  }
}

export const getMembers = (users: any) => {
  return async (dispatcher: Dispatch) => {
      try{
          dispatcher(setMembers(users))
      } catch(e: any){
          alert(e.response.data.message)
      }
  }
}

export const getBaned = (baned: any) => {
  return async (dispatcher: Dispatch) => {
      try{
          dispatcher(setBaned(baned))
      } catch(e: any){
          console.log(e)
      }
  }
}

export const deleteUserFromChat = (id: number, user: any) =>{
  return async (dispatcher: Dispatch) =>{
    try{
      const response = await axios.delete(`${SERVER_URL}/api/user/delete/chat/`, 
      {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        data: {
          userId: user.userId,
          room_id: id
        }
      }
      )
      dispatcher(allChat(response.data))
    } catch(e: any){
        alert(e.response.data.message)
    }
  }
}

export const globalSearch = (text: string) =>{
  return async (dispatcher: Dispatch) =>{
    try{
      const response = await axios.post(`${SERVER_URL}/api/globalSearch/`, 
      {
        text
      },
      { 
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
      }
      )
      return response.data
    } catch(e: any){
        alert(e.response.data.message)
    }
  }  
}



