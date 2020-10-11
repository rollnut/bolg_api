var express=require("express");
var route=express.Router();
var img=require("../../moudules/resolveImg");
route.get("/",function (req,res) {
    img.delete(req,res);
});
module.exports=route;