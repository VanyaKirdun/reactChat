import { rmdir } from 'fs'
import db from '../db.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export default function chatHandlers(io: any, socket: any, users: any, setLog) {
  const { roomId, userName, userId } = socket

  const updateChatData = () => {
    io.in(roomId).emit('chat:update')
  }

  socket.on('chat:name_change', async (name: any) => {
    try { 
        
        db.query(`UPDATE room SET name= '${name}' WHERE id = ${roomId};`, function (err:any, result:any) {
          if (err) throw err;
          updateChatData()
        });
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('chat:delete', async () => {
    try { 
      db.query(`DELETE from list_room WHERE room_id = ${roomId}`, async function (err:any, result:any) {
        if (err) throw err;
        io.in(roomId).emit('chat:deleted')
        db.query(`DELETE from chat_list WHERE room_id = ${roomId}`)
        db.query(`DELETE from room WHERE id = ${roomId}`)
        
        if(users[roomId]){

          delete users[roomId];
          const _dirname = dirname(fileURLToPath(import.meta.url))

          const fileDir = join(_dirname, `../files/${roomId}`)
          const iconDir = join(_dirname, `../icons/chat/${roomId}`)

          rmdir( fileDir, 
          { recursive:true }, 
          (err) => { 
            console.error(err); 
          });

          rmdir( iconDir, 
          { recursive:true }, 
          (err) => { 
            console.error(err); 
          });
        }
      });
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('chat:set_private', async()=>{
    try { 
      db.query(`UPDATE room SET private = true WHERE id = ${roomId}`, function (err:any, result:any) {
        if (err) throw err;
        updateChatData()
        io.in(roomId).emit('log', "Chat is public now!")
      });
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('chat:set_public', async()=>{
    try { 
      db.query(`UPDATE room SET private = false WHERE id = ${roomId}`, function (err:any, result:any) {
        if (err) throw err;
        updateChatData()
        io.in(roomId).emit('log', "Chat is privat now!")
      });
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('chat:update_icon', (name: any) => {
    
    db.query(`UPDATE room SET icon = '${name}' WHERE id =${roomId}`, function (err:any, result:any) {
      if (err) throw err;

      updateChatData()
    })
  })
}