var express=require("express");
var app=express();
var session=require("express-session");
var bg=require("./routes/bg.js");
var font=require("./routes/font.js");
var url=require("url");
var website=require("./moudules/dolisten");
//app.use('/bg', express.static('upload')); //托管静态文件
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Access-Control-Allow-Credentials",true);
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });//解决跨域问题
app.use(session({
    secret:'cat',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*30
    },
    rolling:true
}));//全局配置session
app.get("/",function (req,res) {
   res.send("Hello");
});
website.listen();
app.use('/',function (req,res,next) {
    let re= /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
   let params=url.parse(req.url,true).query;

    if (re.test(params.id)||re.test(params.password)){
       res.send({code:300,data:{},msg:'GP'});
   }else {
        next();
   }
});//自动过滤url上的sql注入
app.use('/bg',bg);
app.use('/font',font);
app.use(express.static('upload'));
app.listen(8009,"0.0.0.0");
console.log('Server running');