var route=require("express").Router();
var db=require("../../moudules/db2");
var url=require("url");
route.get("/",function (req,res) {
    let params=url.parse(req.url,true).query;
    console.log(params);
    if (params.flag){
        if (parseInt(params.flag)===1){//点评
            db.qy({sql:`insert into star(articleid,star,unstar) values('${params.articleid}',1,0) on duplicate key update star=star+1`},function (vals) {
                console.log(vals);
              res.send({code:200,data:{},msg:'赞ok'})
            })
        }else {//取消
            db.qy({sql:`insert into star(articleid,star,unstar) values('${params.articleid}',0,0) on duplicate key update star=star-1`},function (vals) {
                console.log(vals);
                res.send({code:201,data:{},msg:'赞取消'})
            })
        }
    }
    else {
        res.send("请确认请求参数")
    }
});
module.exports=route;