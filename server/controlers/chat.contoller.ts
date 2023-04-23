import db from '../db.js'

class ChatController{
  async getChatData(req: any, res: any){
    try{
      if(!isNaN(req.params.id)){
        db.query(`SELECT * FROM room WHERE id = ${req.params.id}`, function (err:any, result:any) {
          if (err) throw err;
          if(result.length<1) {
            res.status(400)
            res.json({
              message: 'This chat is not exist!'
            })
          } else if(JSON.parse(JSON.parse(JSON.stringify(result))[0].ban).some((even: any)=>even===req.user.id)){
            res.json({
              message: 'BAN'
            })
          }else{
            db.query(`SELECT * FROM list_room WHERE user_id = ${req.user.id} && room_id = ${req.params.id};`, function(errs: any, results:any){
              if (errs) throw errs;
              if(Object.values(results).length>0){
                if(!result[0].public){
                  db.query(`SELECT * FROM users, list_room WHERE room_id = ${req.params.id} && not user_id = ${req.user.id} && id = user_id;`, function(error: any, resultUser:any){
                    res.json({
                      '0':{
                        ...result[0],
                        name: resultUser[0].name,
                        icon: resultUser[0].icon
                      }
                    })
                  })
                }else{
                  res.json(result)
                }
              } else if(!result[0].private && Object.values(results).length<1){
                db.query(`INSERT list_room(room_id, user_id) VALUES (${req.params.id}, ${req.user.id});`)
                res.json({
                  result, 
                  message: 'ADD'
                })
              } else{
                res.status(400)
                res.json({
                  message: 'ТЫ НЕ ГРАЖДАНИН!'
                })
              }
            })
          }
        });
      } else{
        res.status(400)
        res.json({
          message: 'This chat is not exist!'
        })
      }
    } catch(e){
      console.log(e)
    }
  }

  async getUserId(req: any, res: any){
    try{
      const dataMass:any[] = [];
      db.query(`SELECT * FROM list_room WHERE user_id = ${req.user.id}`, function (err:any, result:any) {
        result.forEach((item: any) => {
          dataMass.push(Object.values(item)[0])
        });
        
        db.query(`SELECT room.id, room.name, private, admins, moderators, public, ban, room.icon, if((public = 0 && users.id != ${req.user.id}) || (public = 1 && users.id = ${req.user.id}), users.name, false) as amount FROM room, list_room, users WHERE room.id in (${[...dataMass]}) && room.id = list_room.room_id && list_room.user_id = users.id`, function (errs:any, results:any) {
          if(!results){
            res.json([])
          } else{
            res.json(results.filter((ever:any) => ever.amount !== '0'))
          }
        })
      });
    } catch(e){
      console.log(e)
    }
  }

  async createChat(req: any, res: any){
    try{
      const {name, privateMode, publicType, inviteId} = req.body;
      if(!publicType) {
        db.query(`SELECT id FROM list_room, room WHERE user_id = ${req.user.id} && exists (select * from list_room as lists where user_id = ${inviteId} && lists.room_id = list_room.room_id) && room_id = id && public = 0;`, function (err:any, result:any) {
          if(result && result.length>0){
            res.json({
              result: result[0],
              message: 'RELOCATE'
            })
          } else{
            db.query(`INSERT room(name, private, admins, moderators, public, ban) VALUES ('${name}', ${privateMode}, null, '[]', ${publicType}, '[]');`, function (err:any, result:any) {
              if (err) throw err;
              db.query(`INSERT list_room(room_id, user_id) VALUES (${result.insertId}, ${req.user.id});`, function (errs:any, results:any) {
                if (errs) throw errs;
                res.json(result)
              });
            });
          }
        })
      } else{
        db.query(`INSERT room(name, private, admins, moderators, public, ban) VALUES ('${name}', ${privateMode}, ${req.user.id}, '[]', ${publicType}, '[]');`, function (err:any, result:any) {
          if (err) throw err;
          db.query(`INSERT list_room(room_id, user_id) VALUES (${result.insertId}, ${req.user.id});`, function (errs:any, results:any) {
            if (errs) throw errs;
            res.json(result)
          });
        });
      }
    } catch(e){
      console.log(e)
    }
  }

  async getChatMembers(req: any, res: any){
    try{
      const dataMass:any[] = [];
      db.query(`SELECT * FROM list_room WHERE room_id = ${req.params.id}`, function (err:any, result:any) {
        if (err) throw err;
        result.forEach((item: any) => {
          dataMass.push(Object.values(item)[1])
        });
        if(dataMass.length<1) {
          res.status(400)
          res.json({
            message: 'This chat is not exist!'
          })
        } else{
          db.query(`SELECT * FROM users WHERE id in (${[...dataMass]})`, function (errs:any, results:any) {
            if (errs) throw errs;
            res.json(results)
          });
        }
      });
    } catch(e){
      console.log(e)
    }
  }

  async deleteChatFromList(req: any, res: any){
    try{
      db.query(`SELECT moderators from room WHERE id = ${req.params.id}`, function(err:any, result:any) {
        if(result.length > 0){
          const mass: any[] = JSON.parse(JSON.parse(JSON.stringify(result))[0].moderators).filter((even: any)=>+even !== req.user.id);
          db.query(`UPDATE room SET moderators= '[${[...mass]}]' WHERE id = ${req.params.id};`)
        }
      })
      db.query(`DELETE from list_room WHERE user_id = ${req.user.id} && room_id = ${req.params.id}`, function (err:any, result:any) {
        if (err) throw err;
        res.json(result)
      });
    } catch(e){
      console.log(e)
    }
  }

  async sendMessage(req: any, res: any){
    try{
      var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const {user_id, room_id, type, text} = req.body;
      db.query(`INSERT chat_list(user_id, room_id, time_stamp, type, text) VALUES (${user_id}, ${room_id}, '${date}', '${type}', '${text}');`, function (err:any, result:any) {
        if (err) throw err;
        res.json(result)
      });
    } catch(e){
      console.log(e)
    }
  }

  async getMessages(req: any, res: any){
    try{
      db.query(`SELECT * FROM chat_list WHERE room_id = ${req.params.id}`, function (err:any, result:any) {
        if (err) throw err;
        res.json(result)
      });
    } catch(e){
      console.log(e)
    }
  }

  async deleteUserFromChat(req: any, res: any){
    try{
      const {userId, room_id} = req.body;
      db.query(`SELECT moderators from room WHERE id = ${room_id}`, function(err:any, result:any) {
        if(result.length > 0){
          const mass: any[] = JSON.parse(JSON.parse(JSON.stringify(result))[0].moderators).filter((even: any)=>+even !== userId);
          db.query(`UPDATE room SET moderators= '[${[...mass]}]' WHERE id = ${room_id};`)
        }
      })
      db.query(`DELETE from list_room WHERE room_id = ${room_id} && user_id = ${userId}`, function (err:any, result:any) {
        if (err) throw err;
      });
    } catch(e){
      console.log(e)
    }
  }

  async globalSearch(req: any, res: any){
    try{
      const {text} = req.body;
      db.query(`SELECT room_id FROM list_room WHERE user_id = ${req.user.id};`, function (error:any, result:any) {
        let mass = JSON.parse(JSON.stringify(result)).map((even: any)=>even.room_id)
        db.query(`SELECT id, name, icon FROM users WHERE name like '${text}%'`, function (err:any, resultUsers:any) {
          if (err) throw err;
          let sql = `SELECT id, name, icon FROM room WHERE name LIKE '${text}%' && private = 0`
          if(mass.length>0){
            sql = sql + ` && id NOT IN (${[...mass]})`
          }
            
          db.query(sql, function (errs:any, resultRooms:any) {
            if (errs) throw errs;
            res.json({
              users: resultUsers,
              rooms: resultRooms
            })
          });
        });
      })
    } catch(e){
      console.log(e)
    }
  }
}

export default new ChatController()