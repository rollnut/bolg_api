var dbo=require("../../moudules/db2");
var route=require("express").Router();
route.get("/",function (req,res) {

    dbo.find("event",{},function (vals) {
        console.log(vals);
        if (vals){
             res.send({code:200,data:vals,msg:"ok"})
        } else {
             res.send({code:404,data:vals,msg:"not found"})
        }
    })

});
module.exports=route;