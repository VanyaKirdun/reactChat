import fs from 'fs';
import db from '../db.js'
import { removeFile } from '../utils/file.js';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const _dirname = dirname(fileURLToPath(import.meta.url))


export default function messageHandlers(io: any, socket: any, messages: any, onlineUsers: any, setLog) {
  const { roomId, userName, icon } = socket

  if (!messages[roomId]) {
    messages[roomId] = {}
  }
  const updateMessageList = () => {
    io.in(roomId).emit('message_list:update', messages[roomId])
  }

  socket.on('message:get', async () => {
    try { 
      if(roomId!== '' && Object.keys(messages[roomId]).length<1){
        db.query(`SELECT * FROM chat_list WHERE room_id = ${roomId}`, function (err:any, result:any) {
          if (err) throw err;
          let messagesData: any = {}
          JSON.parse(JSON.stringify(result)).forEach((even: any)=>{
            messagesData[even.id]= even
            let name = 'User was deleted'
            let icon = null
            if(onlineUsers[even.user_id] && !isNaN(even.user_id)) {
              const dirPath = join(_dirname, '../icons/profile', `${even.user_id}`)
              if(onlineUsers[even.user_id].icon !== null) icon = join(`/profile/${even.user_id}/`, fs.readdirSync(dirPath)[0])
              name = onlineUsers[even.user_id].name
            }
            messagesData[even.id].user_name = name
            messagesData[even.id].icon = icon
          })
          messages[roomId] = messagesData
          updateMessageList()
        });
      } else{
        Object.keys(messages[roomId]).forEach((keys: any) => {
          if(messages[roomId][keys].user_id!==null){
            let icon = null
            let name = 'User was deleted'
            const dirPath = join(_dirname, '../icons/profile', `${messages[roomId][keys].user_id}`)

            if(messages[roomId][keys].icon !== null) icon = join(`/profile/${messages[roomId][keys].user_id}/`, fs.readdirSync(dirPath)[0])
            if(onlineUsers[messages[roomId][keys].user_id]) name = onlineUsers[messages[roomId][keys].user_id].name
            messages[roomId][keys].icon = icon
            messages[roomId][keys].user_name = name
          }
        });
        updateMessageList()
      }
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('message:add', (message: any) => {
    try{
      
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const {user_id, room_id, type, text, textOrPathToFile, typeMessage} = message;
      db.query(`INSERT chat_list(user_id, room_id, time_stamp, type, text, textOrPathToFile, typeMessage) VALUES (${user_id}, ${room_id}, '${date}', '${type}', '${text}', '${textOrPathToFile}', '${typeMessage}');`, function (err:any, result:any) {
        if (err) throw err;
        const dirPath = join(_dirname, '../icons/profile', `${user_id}`)
        let name = ''
        let iconUniq = null
        if(!isNaN(user_id) && typeMessage !== 'system') {
          name = userName
          if(onlineUsers[user_id].icon !== null) iconUniq= join(`/profile/${user_id}/`, fs.readdirSync(dirPath)[0])
        }

        messages[roomId][result.insertId]={
          id: result.insertId,
          user_id: user_id,
          room_id: room_id,
          time_stamp: date,
          type: type,
          text: text,
          checked: null,
          textOrPathToFile: textOrPathToFile,
          user_name: name,
          icon: iconUniq,
          typeMessage: typeMessage
        }
        updateMessageList()
    }
        
    );
    } catch(e){
      console.log(e)
    }
  })

  socket.on('message:remove', (message: any) => {
    const { id, type, textOrPathToFile } = message
    db.query(`DELETE from chat_list WHERE id = ${id};`, function (err:any, result:any) {
      if (err) throw err;
      if(type !== 'text'){
        removeFile(textOrPathToFile)
      }
    });
    delete messages[roomId][id];
    updateMessageList()
  })
}