var comment=require("../../moudules/comment");
var route=require("express").Router();
/**
 *Description:获取所有文章简介及其下面的评论
 *Author:邓洪
 *Date:2019/11/13
 **/
route.get("/",function (req,res) {

    comment.getComment({},function (vals) {
        if (vals){
            res.send({code:200,data:vals,msg:"ok"})
        }
        else {
              res.send({code:202,data:vals,msg:"查找失败"})
        }

    })
});
module.exports=route;
