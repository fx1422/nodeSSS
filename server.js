const express = require('express');
const static = require('express-static');//设置静态资源
const cookieParser = require('cookie-parser');//获取cookie
const cookieSession = require('cookie-session');//获取session
const bodyParser = require('body-parser');//解析url 数据
const multer = require('multer');//解析图片，文件等
const consolidate = require('consolidate');
const mysql = require('mysql');

//连接池
const db = mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'blog'
    }
);


const server = express();


server.listen(8081);

//1.解析cookie
server.use(cookieParser('sdasadasdsdsdsds'));


//2.使用session
const arr = [];
for (let i = 0; i < 100000; i++) {
    arr.push('keys_' + Math.random())
}
server.use(cookieSession({name: 'zjq_sees_id', keys: arr, maxAge: 20 * 3600 * 1000}));
//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/upload'}).any());


//输出什么---放在哪-----用哪一种------


//用户请求
/* server.use('/', function (req, res, next) {
    //GET---POST---FILES--COOKIE---SESSION----
    console.log(req.query, req.body, req.files, req.cookies, req.session)
    next()
}) */

//接收用户请求
/*--------------获取经纪人数据---------------*/
server.use('/income/getData', function (req, res) {
    if (req.body.type === 'JJR') {
        db.query("SELECT time,money,total,code FROM incomeList", (err, data) => {
            if (err) {
                res.status(500).send('database error').end()
            } else {
                res.send(data);
                res.end();
            }
        })
    } else if (req.body.type === 'TX') {
        db.query("SELECT time,money,total FROM withdraw_table", (err, data) => {
            if (err) {
                res.status(500).send('database error').end()
            } else {
                res.send(data);
                res.end();
            }
        })
    } else {
        db.query("SELECT time,money,total FROM recharge_table", (err, data) => {
            if (err) {
                res.status(500).send('database error').end()
            } else {
                res.send(data);
                res.end();
            }
        })
    }

});
/*--------------获取k线数据---------------*/
server.use('/data/klineData',(req,res)=>{
  db.query("SELECT open,time,volume,high,low,date,close FROM k_table", (err,data)=> {
      if(err){
          res.status(500).send('database error').end()
      }else {
          res.send(data).end();
      }
  })
});
/*--------------注册---------------*/
server.use('/login',(req,res)=>{
    const data = req.body;
    const value = [data.tel,data.password,data.inviteCode,data.phoneCode]
    console.log(value)
    db.query("INSERT INTO register_table(tel,password,invitecode,phonecode) VALUES (?,?,?,?)",value,function (err,data1) {
        if(err){
            res.status(500).send({"code":1}).end()
        }else {
            console.log(data1)
            res.send({"code":0}).end();
        }
    })
});



//4.static数据 

server.use(static('./www'));