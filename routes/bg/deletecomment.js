var route=require("express").Router();
var comment=require("../../moudules/comment");
/**
 *Description:删除评论
 *Author:邓洪
 *Date:2019/11/16
 **/
route.get("/",function (req,res) {
   comment.deletecomment(req,function (vals) {
       if (vals&&vals.affectedRows>0){
        res.send({code:200,data:{},msg:"ok"})
       }
       else {
         res.send({code:202,data:{},msg:"删除失败"})
       }
   })
});

module.exports=route;