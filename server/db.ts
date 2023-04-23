import mysql from 'mysql';

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Snake_assassin090401",
  database: "chatDb",
  charset: 'utf8mb4'
});

export default con;