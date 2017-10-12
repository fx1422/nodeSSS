const express = require('express');
const http = require('http');
const https = require('https');
const request = require('request');
const querystring = require('querystring');
const static = require('express-static');//设置静态资源
const cookieParser = require('cookie-parser');//获取cookie
const cookieSession = require('cookie-session');//获取session
const bodyParser = require('body-parser');//解析url 数据
const multer = require('multer');//解析图片，文件等
const consolidate = require('consolidate');
const ejs = require('ejs')
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
server.use('/data/klineData', (req, res) => {
    db.query("SELECT open,time,volume,high,low,date,close FROM k_table", (err, data) => {
        if (err) {
            res.status(500).send('database error').end()
        } else {
            res.send(data).end();
        }
    })
});
/*--------------注册---------------*/
server.use('/register', (req, res) => {
    const data = req.body;
    const value = [data.tel, data.password, data.inviteCode, data.phoneCode];
    db.query("SELECT tel FROM register_table where tel=?", [data.tel], (err, result) => {

        if (result.length <= 0) {
            db.query("INSERT INTO register_table(tel,password,invitecode,phonecode) VALUES (?,?,?,?)", value, function (err, data) {
                if (err) {
                    res.status(500).send({"code": 1}).end()
                } else {
                    res.send({"code": 0}).end();
                }
            })
        } else {
            res.send({"code": 2, "message": "手机号已经注册"}).end();
        }
    });

});
/*--------------登录---------------*/
server.use('/login', (req, res) => {
    const user = req.body;
    db.query("SELECT * FROM register_table WHERE tel=?", [user.tel], (err, data) => {
        if (err) {
            res.status(500).send('database error').end();
        } else {
            if (data.length <= 0) {
                res.send({'code': 1, 'message': '用户不存在'})
            } else if (data[0].password !== user.password) {
                res.send({'code': 2, 'message': '密码不正确'})
            } else {
                req.session.user = data[0].tel;
                res.send({'code': 0, 'message': '登录成功'});
            }
        }
    })
});

/*-----------------短信验证码---------------*/
server.use('/getNoteCode', (req, res) => {
    const mobile = req.body.tel;
    const text = '【火鸡音乐】您的验证码是7788';
    const key = 'b4f94fb4b3253259e1187050a0f8523d';
    const uri = "https://sms.yunpian.com/v2/sms/single_send.json";
    var host = 'sms.yunpian.com';
    var data = {
        mobile: mobile,
        text: text,
        apikey: key
    };
    smsPost(uri,querystring.stringify(data),host,res)
})


function smsPost(uri,content,host,resp){
    var options = {
        hostname: host,
        port: 443,
        path: uri,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (result) {
            console.log(typeof result)
            console.log( result)
            if(JSON.parse(result).code==0){
                resp.send("success").end();
            }else {
                resp.send("fail").end();
            }
        });
    });
    req.write(content);
    req.end();
}
/*---------------*/
server.use('/toLogin', (req, res) => {
    res.render('login');
})

/*----------过滤器--------------*/
server.use(function (req, res, next) {
    const url = req.url;
    if (url.indexOf("/register.html") < 0 && url.indexOf("/login.html") < 0 && url.indexOf("/index.html" +
            "") < 0 && url.indexOf("/css/") < 0 && url.indexOf("/libs/") < 0
        && url.indexOf("/favicon.ico") < 0 && !req.session.user) {
        return res.redirect("/login.html");
    }
    next();
});


/*server.use(function (req, res, next) {
    const url = req.url;
    if (url.indexOf("/login.html")<0&&url.indexOf( "/index.html" +
            "" )<0&&url.indexOf( "/css/" )<0&& url.indexOf( "/libs/" )<0
        &&url.indexOf("/favicon.ico" )<0&&!req.session.user) {
        return res.redirect("/login.html");
    }
    next();
});*/
/*-----------------页面渲染---------------*/
//4.配置模板引擎
//输出什么---放在哪-----用哪一种------
server.engine('html', ejs.__express);
server.set('views', './template');
server.set('view engine', 'html');

//4.static数据

server.use(static('./www'));

