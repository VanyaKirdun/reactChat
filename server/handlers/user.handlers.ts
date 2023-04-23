import { dirname, join } from 'path'
import db from '../db.js'
import { fileURLToPath } from 'url'
import { rmdir } from 'fs'

let usersBan: any = {}



export default function userHandlers(io: any, socket: any, onlineUsers: any, users: any, setLog) {
  const { roomId, userName, userId } = socket

  if (!users[roomId]) {
    users[roomId] = {}
  }

  if(!usersBan[roomId]){
    usersBan[roomId] = {}
  }



  const updateUserList = () => {
    if(users[roomId] && usersBan[roomId]) {
      updateUserOnline()
      io.in(roomId).emit('user_list:update', users[roomId], usersBan[roomId])  
    }
  }

  const updateUserOnline = () => {
    let mass: any = {}
      Object.keys(users[roomId]).forEach((key: any) =>{
      let element = users[roomId][key];
      let status: string = 'offline'
      if(onlineUsers[element.userId]){
        status = onlineUsers[element.userId].status;
      }
      mass[element.userId] = status
    });
    io.in(roomId).emit('user_online:update', mass)
  }

  socket.on('user:get', async (id:any, user: any) => {
    try{
      if(Object.keys(users[roomId]).length<1){
        const dataMass:any[] = [];
        db.query(`SELECT * FROM list_room WHERE room_id = ${id}`, function (err:any, result:any) {
          if (err) throw err;
          result.forEach((item: any) => {
            dataMass.push(Object.values(item)[1])
          });
          if(dataMass.length<1) {
            setLog(socket, roomId, 'This chat is not exist!')
          } else{
            db.query(`SELECT * FROM users WHERE id in (${[...dataMass]})`, function (errs:any, results:any) {
              if (errs) throw errs;
              JSON.parse(JSON.stringify(results)).forEach((element: any) => {
                users[id][element.id]= {
                  roomId: roomId,
                  userName: element.name,
                  userId: element.id,
                }
              });
              updateUserList()
            });
          }
        });
      } else{
        updateUserList()
      }
    } catch(e){
      console.log(e)
    }
  })

  socket.on('user:getBanned', async (id:any) => {
    try{
      if(Object.keys(usersBan[roomId]).length<1){
        db.query(`SELECT ban FROM room WHERE id = ${id}`, function (err:any, result:any) {
          if (err) throw err;
          const dataMass:any[] = JSON.parse(JSON.parse(JSON.stringify(result))[0].ban)
          if(dataMass.length<1) {
            updateUserList()
          } else{
            db.query(`SELECT * FROM users WHERE id in (${[...dataMass]})`, function (errs:any, results:any) {
              if (errs) throw errs;
              JSON.parse(JSON.stringify(results)).forEach((element: any) => {
                usersBan[id][element.id]= {
                  roomId: roomId,
                  userName: element.name,
                  userId: element.id,
                }
              });

              updateUserList()
            });
          }
        });
      } else{
        updateUserList()
      }
    } catch(e){
      console.log(e)
    }
  })


  socket.on('user:add', async (user: any) => {
    if(!users[roomId][user.userId]){
      
      users[roomId][user.userId]={
        roomId,
        userName,
        userId: user.userId,
      }
      setLog(socket, roomId, `User: ${userName} has entered!`)
      
    }
    
    updateUserList()
  })

  socket.on('user:invite', async (newUserId: any, chatId: any) => {
    if(!chatId) chatId = roomId;
    if(!users[chatId]) users[chatId]={}
    if (!users[chatId][userId]) {
      users[chatId][userId] = {
        roomId: chatId,
        userName,
        userId,
      }
    }
    if(!users[chatId][newUserId]){
      db.query(`SELECT * FROM users WHERE id = ${newUserId}`, function (err:any, result:any) {
        if (err) throw err;
        if(result.length>0){
          const {name, id, login} = JSON.parse(JSON.stringify(result))[0]
          setLog(socket, chatId, `User: ${userName} has entered!`)
          db.query(`INSERT list_room(room_id, user_id) VALUES (${chatId}, ${newUserId});`, function (errs:any, results:any) {
            if (errs) throw errs;
            users[chatId][id] = {
              roomId: chatId,
              userName: name,
              userId: id,
            }
      
            updateUserList()
            if(onlineUsers[id] && onlineUsers[id].status === 'online'){
              io.to(onlineUsers[id].socketId).emit('user:chatList_update');
            }
          })
        } else{
          io.in(onlineUsers[userId].socketId).emit('log', 'There is no user with that id!');
        }
      });
    }
  })

  socket.on('user:remove', async (chatId: any, user: any, type: boolean) => {
      db.query(`SELECT * FROM room WHERE id = ${chatId}`, function (err:any, result:any) {
        if(!JSON.parse(JSON.stringify(result))[0].public){
          db.query(`DELETE from list_room WHERE room_id = ${chatId}`, function (err:any) {
            if (err) throw err;
            db.query(`DELETE from chat_list WHERE room_id = ${chatId}`)
            db.query(`DELETE from room WHERE id = ${chatId}`)
            
              let secondUserSockeId = onlineUsers[Object.keys(users[chatId]).filter((ever: any)=>+ever !== +user.userId)[0]].socketId;
              
              delete users[chatId];
              if(secondUserSockeId!==null) io.to(secondUserSockeId).emit('user:chatList_update', true);
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

              
            
          });
        } else{ 
          if(users[chatId]){
            delete users[chatId][user.userId];
          }
          
          db.query(`DELETE from list_room WHERE room_id = ${chatId} && user_id = ${user.userId}`, function (err:any, result:any) {
            if (err) throw err;
            if(Object.keys(users[chatId]).length<1){
              db.query(`DELETE from chat_list WHERE room_id = ${chatId}`)
              db.query(`DELETE from room WHERE id = ${chatId}`)
              
              if(users[chatId]){
  
                delete users[chatId];
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

                io.in(roomId).emit('chat:deleted')
              }
            } else{
              if(type){
                io.to(onlineUsers[user.userId].socketId).emit('user:chatList_update', true);
                setLog(io, roomId, `User ${user.userName} was kicked!`, user.userId)
              } else {
                setLog(io, roomId, `User ${user.name} has left!`, user.userId)
              } 
              updateUserList()
            }
          });
          
        }
        
      })
  })

  socket.on('user:delete', async () => {
    Object.keys(users).forEach((key: any)=>{
      if(users[key][userId]) {
        delete users[key][userId]
      
        if(Object.keys(users[key]).length<1){
          if(!isNaN(key)){
            db.query(`DELETE from room WHERE id = ${+key}`)
            db.query(`DELETE from chat_list WHERE room_id = ${+key}`)
          }
          
        } else{
          setLog(io, key, `User ${userName} was deleted!`, userId)
          db.query(`SELECT moderators from room WHERE id = ${key}`, function(err:any, result:any) {
            if(result.length > 0){
              const mass: any[] = JSON.parse(JSON.parse(JSON.stringify(result))[0].moderators).filter((even: any)=>+even !== +userId);
              db.query(`UPDATE room SET moderators= '[${[...mass]}]' WHERE id = ${key};`)
            }
          })
          io.in(key).emit('users_status:update')
        }
      }
    })
    if(onlineUsers[userId]) delete onlineUsers[userId]
    db.query(`DELETE from list_room WHERE user_id = ${userId};`)
    db.query(`DELETE from users WHERE id = ${userId};`)
  })

  socket.on('users:online', () => {
    updateUserList()
  })

  socket.on('users:update_name', (id: any, name: any) => {
    db.query(`UPDATE users SET name = '${name}' WHERE id =${id}`, function (err:any, result:any) {
      if (err) throw err;

      Object.keys(users).filter((key:any)=>key!=''&&users[key][id]).map((key: any)=>{
        users[key][id].userName = name
      })

      onlineUsers[userId].name = name;
      io.in(Object.keys(users).filter((key:any)=>key!=''&&users[key][id])).emit('users_status:update')
      io.to(socket.id).emit('user:user_updated');
    })
  })

  socket.on('users:update_icon', (name: any) => {
    db.query(`UPDATE users SET icon = '${name}' WHERE id =${userId}`, function (err:any, result:any) {
      if (err) throw err;

      onlineUsers[userId].icon = name;
      io.in(Object.keys(users).filter((key:any)=>key!=''&&users[key][userId])).emit('users_status:update')
      io.to(socket.id).emit('user:user_updated');
    })
  })

  socket.on('user:enter', (chatList: any) => {
    onlineUsers[userId].status = 'online'
    onlineUsers[userId].socketId = socket.id
    io.in(chatList.map((even:any)=>even.id)).emit('users_status:update')
  })

  socket.on('user:take_moderator', (id: any, moderators: any) =>{
    const mass: any[] = JSON.parse(moderators);
    mass.push(id)
    db.query(`UPDATE room SET moderators= '[${[...mass]}]' WHERE id = ${roomId};`, function (err:any, result:any) {
      if (err) throw err;
      io.in(roomId).emit('user:type_update')
    })
  })

  socket.on('user:remove_moderator', (id: any, moderators: any) =>{
    const mass: any[] = JSON.parse(moderators).filter((even: any)=>+even !== id);
    db.query(`UPDATE room SET moderators= '[${[...mass]}]' WHERE id = ${roomId};`, function (err:any, result:any) {
      if (err) throw err;
      io.in(roomId).emit('user:type_update')
    })
  })

  socket.on('user:reset_admin', (id: any, moderators: any)=>{
    const mass: any[] = JSON.parse(moderators).filter((even: any)=>+even !== id);
    db.query(`UPDATE room SET moderators= '[${[...mass]}]' WHERE id = ${roomId};`)
    db.query(`UPDATE room SET admins= ${id} WHERE id = ${roomId};`, function (err:any, result:any) {
      if (err) throw err;
      io.in(roomId).emit('user:type_update')
    })
  })

  socket.on('user:ban', (id: any, baned: any) =>{
    if(!usersBan[roomId][id]){
      const mass: any[] = Object.keys(usersBan[roomId])
      mass.push(id)
      db.query(`UPDATE room SET ban= '[${[...mass]}]' WHERE id = ${roomId};`, function (err:any, result:any) {
        if (err) throw err;
        usersBan[roomId][id] = users[roomId][id]
        updateUserList()
        io.in(roomId).emit('user:type_update')
      })
    }
  })

  socket.on('user:remove_ban', (id: any, baned: any) =>{
    if(usersBan[roomId][id]){
      delete usersBan[roomId][id]
      const mass: any[] = Object.keys(usersBan[roomId])
      db.query(`UPDATE room SET ban= '[${[...mass]}]' WHERE id = ${roomId};`, function (err:any, result:any) {
        if (err) throw err;
        updateUserList()
      })
    }
  })


  socket.on('disconnectUser', (chatList: any) => {
    onlineUsers[userId].status = 'offline' 
    onlineUsers[userId].socketId = undefined
    io.emit('users_status:update')
  })
}