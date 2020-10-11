var route=require("express").Router();
var db=require("../../moudules/db2");
var Os = require("os");

route.get("/",function (req,res) {
    let data={};
    let osdata={};
    osdata.SysName=Os.type();
    osdata.RunningTime=Math.ceil(Os.uptime()/60)+"Min";
    osdata.TotalMemory=(Os.totalmem()/(1024*1024)).toFixed(2)+"Mb";
    osdata.FreeMemory=(Os.freemem()/(1024*1024)).toFixed(2)+"Mb";
    db.find("website",{},function (vals,resolve) {
        if (vals){
            data=vals[0];
            data.os=osdata;
            //data.time=data.time.toString();
            res.send({code:200,data:data,msg:"ok"})
        }
        else {
             res.send({code:404,data:data,msg:"资源未找到"})
        }
        resolve();
    }).catch(err=>{
          console.log(err);});
});
module.exports=route;