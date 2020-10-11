var express=require("express");
var route=express.Router();
var getarticles=require("./font/getarticles");
var updatecomment=require("./font/updatecomment");
var updatestar=require("./font/updatestar");
var updateunstar=require("./font/updateunstar");
var getEventFlow=require("./font/getEventFlow");

route.use("/getarticles",getarticles);
route.use("/updatecomment",updatecomment);
route.use("/updatestar",updatestar);
route.use("/updateunstar",updateunstar);
route.use("/getEventFlow",getEventFlow);

module.exports=route;