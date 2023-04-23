import db from '../db.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from '../config.js'

class UserController{
  async createUser(req: any, res: any){
    const {login, password, name} = req.body;
    db.query(`SELECT * FROM chatdb.users WHERE login = '${login}';`, async function (err: any, result: any) {
      if (err) throw err;
      if(result.length !== 0){
        res.status(400).json({message: `User with login ${login} already exist`})
      } else {
        const hashPassword = await bcrypt.hash(password, 8)

        let sql = `INSERT INTO users (login, password, name) VALUES ('${login}', '${hashPassword}', '${name}');`;
        db.query(sql, function (err: any, result: any) {
          if (err) throw err;
          db.query(`SELECT * FROM users WHERE id = ${result.insertId}`, function (err: any, result1: any) {
            if (err) throw err;
            const token = jwt.sign({id: result1[0].id}, SECRET_KEY, {expiresIn: "1h"})
            return res.json({
              token,
              user: {
                id: result1[0].id,
                name: result1[0].name,
              }
            });
          });
        });
      }
    });
  }

  async logIn(req: any, res: any){
    const {login, password} = req.body;
    db.query(`SELECT * FROM chatdb.users WHERE login = '${login}';`, function (err: any, result: any){
      if (err) throw err;
      if (result.length===0) {
        return res.status(404).json({message: "User not found"})
      }
      const isPassValid = bcrypt.compareSync(password, result[0].password)
      if (!isPassValid){
        return res.status(404).json({message: "Invalid password"})
      }
      const token = jwt.sign({id: result[0].id}, SECRET_KEY, {expiresIn: "1h"})
      return res.json({
        token,
        user: {
          id: result[0].id,
          name: result[0].name,
        }
      });
    })
  }

  async auth(req: any, res: any){
    db.query(`SELECT * FROM users WHERE id = '${req.user.id}';`, function (err: any, result: any){
      if (err) throw err;

      const token = jwt.sign({id: result[0].id}, SECRET_KEY, {expiresIn: "1h"})
      return res.json({
        token,
        user: {
          id: result[0].id,
          name: result[0].name,
          icon: result[0].icon
        }
      });
    })
  }

  async loginChange(req: any, res: any){
    const {login, password} = req.body;
    db.query(`SELECT * FROM users WHERE id = '${req.user.id}';`, function(err: any, result: any){
      const isPassValid = bcrypt.compareSync(password, result[0].password)
      if (!isPassValid){
        return res.status(404).json({message: "Invalid password"})
      }
      db.query(`UPDATE users SET login = '${login}' WHERE id = '${req.user.id}';`);
    });
  }

  async passwordChange(req: any, res: any){
    const {passwordOld, passwordNew} = req.body;
    db.query(`SELECT * FROM users WHERE id = '${req.user.id}';`, function(err: any, result: any){
      const isPassValid = bcrypt.compareSync(passwordOld, result[0].password)
      if (!isPassValid){
        return res.status(404).json({message: "Invalid password"})
      }
      db.query(`UPDATE users SET password = '${passwordNew}' WHERE id = '${req.user.id}';`);
    });
  }
  
}

export default new UserController()
