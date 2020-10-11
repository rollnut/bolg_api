var express=require("express");
var route=express.Router();
route.get("/",function (req,res) {
    req.session.destroy(function(err){
        if (err) {
            console.log(err);
             res.send({code:302,data:{},msg:"你已经退出了"});
        } ;
        res.send({code:200,data:{},msg:"退出成功"});
    })
});
module.exports=route;