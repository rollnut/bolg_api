var express=require("express");
var route=express.Router();
var url=require("url");
var login=require("./bg/login");
var getarticle=require("./bg/article/getarticle");
var deletearticle=require("./bg/article/deletearticle");
var updatearticle=require("./bg/article/updatearticle");
var insertarticle=require("./bg/article/insertarticle");
var limits=require("./bg/limits");
var getarticlemin=require("./bg/article/getartcleMin");
var getallcomment=require("./bg/getallcomment");
var resolvecomment=require("./bg/resolvecomment");
var deletecomment=require("./bg/deletecomment");
var getwebsiteinfo=require("./bg/getwebsiteinfo");
var logout=require("./bg/logout");
var uploadImg=require("./bg/uploadImg");
var deleteImg=require("./bg/deleteImg");
route.use(function (req,res,next) {
    const whiteList = ['/login',"/getwebsiteinfo","/aticle"];//白名单
    if (whiteList.includes(url.parse(req.url).pathname)){
        next();
   }else {
       if (req.session.userinfo&&req.session.userinfo.account!==''){
          next();
       }
       else {
           res.send({'code':302,date:{"redirect url":'/login'},msg:'你还未登陆！'})
       }
   }
});///登陆控制
route.use("/login",login);
route.use("/logout",logout);
route.use("/getarticle",getarticle.route);
route.use("/deletearticle",deletearticle);
route.use("/updatearticle",updatearticle);
route.use("/insertarticle",insertarticle);
route.use("/limits",limits);
route.use("/getarticlemin",getarticlemin);
route.use("/getallcomment",getallcomment);
route.use('/resolvecomment',resolvecomment);
route.use('/deletecomment',deletecomment);
route.use('/getwebsiteinfo',getwebsiteinfo);
route.use("/uploadImg",uploadImg);
route.use("/deleteImg",deleteImg);

module.exports=route;