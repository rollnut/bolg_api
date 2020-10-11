var express=require("express");
var route=express.Router();
var img=require("../../moudules/resolveImg");
route.post("/",function (req,res) {
    img.resove(req,res);
});
module.exports=route;