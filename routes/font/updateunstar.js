var route=require("express").Router();
var url=require("url");
var db=require("../../moudules/db2");

route.get("/",function (req,res) {
    let params=url.parse(req.url,true).query;
    console.log(params);
    if (params.flag){
        if (parseInt(params.flag)===1){//点评
            db.qy({sql:`insert into star(articleid,star,unstar) values('${params.articleid}',0,1) on duplicate key update unstar=unstar+1`},function (vals) {
                console.log(vals);
              res.send({code:200,data:{},msg:'踩ok'})
            })
        }else {//取消
            db.qy({sql:`insert into star(articleid,star,unstar) values('${params.articleid}',0,0) on duplicate key update unstar=unstar-1`},function (vals) {
                console.log(vals);
                res.send({code:201,data:{},msg:'踩取消'})
            })
        }
    }
    else {
        res.send("请确认请求参数")
    }
});

module.exports=route;