import userHandlers from './handlers/user.handlers.js'
import messageHandlers from './handlers/message.handlers.js'
import chatHandlers from './handlers/chat.handlers.js'
import db from './db.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

let onlineUsers: any = {}
let users:any = {}
let messages: any = {};

db.query(`SELECT * FROM users`, function(err:any, result:any){
  JSON.parse(JSON.stringify(result)).forEach((even: any)=>{
    onlineUsers[even.id] = {
      status: 'offline', 
      name: even.name, 
      socketId: null,
      icon: even.icon
    }
  })
  db.query(`SELECT * FROM list_room`, function(errs: any, results: any){
    JSON.parse(JSON.stringify(results)).forEach((element: any)=>{
      if(!users[element.room_id]) users[element.room_id]= {}
      users[element.room_id][element.user_id]= {
        roomId: element.room_id,
        userName: onlineUsers[element.user_id].name,
        userId: element.user_id,
      }
    })
  })
})


const _dirname = dirname(fileURLToPath(import.meta.url))

const onConnection = (io: any, socket: any) => {
  const { roomId, userName, userId } = socket.handshake.query

  socket.roomId = roomId
  socket.userName = userName
  socket.userId = userId

  if(!onlineUsers[userId]) onlineUsers[userId] = {status: 'online', name: userName, socketId: socket.id, icon: null}

  const setLog = (socketIo: any, room: any, text: string, id:any = undefined)=>{
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query(`INSERT chat_list(user_id, room_id, time_stamp, type, text, textOrPathToFile, typeMessage) VALUES (${null}, ${room}, '${date}', 'text', '${text}', null, 'system');`, function (err:any, result:any) {
      if (err) throw err;
      if(!messages[room]) messages[room]= {}
      messages[room][result.insertId]={
        id: result.insertId,
        user_id: null,
        room_id: room,
        time_stamp: date,
        type: 'text',
        text: text,
        checked: null,
        textOrPathToFile: null,
        user_name: '',
        icon: null,
        typeMessage: 'system'
      }
      io.in(+room).emit('log', text, id)
    })
  }

  socket.join(roomId)
  userHandlers(io, socket, onlineUsers, users, setLog)

  messageHandlers(io, socket, messages, onlineUsers, setLog)

  chatHandlers(io, socket, users, setLog)
}
export default onConnection;