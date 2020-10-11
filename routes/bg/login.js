var express=require("express");
var route=express.Router();
var db=require("../../moudules/db2");
var multiparty=require("multiparty");
var seesion=require("express-session");
var crypt=require("../../moudules/crypto");
    /*
route.use("/",function (req,res) {

  db.insert('user',{insert:{
            password:"666666",
            account:"super"
        }},function (result) {

    });
    db.find('user',{where:"account='root'"},function (res) {
        console.log(res);
    });
    db.delete('user',{where:"id!=1"},function (result) {
        console.log(result);
    });
    db.update("user",{set:{
        password:'123456'
        },where:'id = 1'},function (res) {
        console.log(res);
    });
        db.find('articlelock',{},function (res) {
        console.log(res);
    });

}); */
route.post("/",function (req,res) {
    if (req.session.userinfo&&req.session.userinfo.account!==''){
        res.send({code:302,data:{},msg:"你已经登陆勿重复登陆"});
       }else {
        var form=new multiparty.Form();
        form.parse(req,function(err,fields,files){
            if (typeof(fields)==="undefined"){
                res.send({code:203,date:{},msg:"未登陆，格式不正确"})
            }else {
             let re= /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
            let user={
               account:fields.account[0],
                password:fields.password[0]
            };
            if (re.test(user.account)||re.test(user.account)){
               return  res.send("OHHHHHHH Gurad point");
            }//含有sql注入
            else {
                db.find("user",{where:`account='${user.account}'`},function (result) {
                    if (user.password===crypt.decrypt(result[0].password))
                    {
                        req.session.userinfo=user;
                        return   res.send({code:200,date:{},msg:"登陆成功"});
                    }else
                       {
                        return   res.send({code:204,date:{},msg:"登陆失败"});
                       }
                });
            }
            }

        })
    }
});

module.exports=route;