
var route=require("express").Router();
var comment=require("../../moudules/comment");
route.post("/",function (req,res) {
    comment.resolvecomment(req,function (vals) {
        if (vals&&vals.affectedRows>0){
                res.send({code:200,data:{},msg:"ok"})
            }else{
                console.log(vals);
                 res.send({code:202,data:{},msg:"插入失败"})
            }
        })
});

module.exports=route;
