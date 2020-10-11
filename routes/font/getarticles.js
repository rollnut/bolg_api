var minarticle=require("../../moudules/bg/articlemin");
var article=require("../../moudules/bg/article.js");
var dbo=require("../../moudules/db2");
var route=require("express").Router();
var url=require("url");
var count=require("../../moudules/cfg");
/**
 *Description:返回文章
 * 参数：/ ({}) 匹配所有文章，返回简略信息|| params  ?articleid= 匹配某个文章  ?articleid=&&paswword= 请求加密文章 返回详细信息
 *Author:邓洪
 *Date:2019/11/16
 **/
route.get("/",function (req,res) {
    let params=url.parse(req.url,true).query;
    if(req.url !== '/favicon.ico') {count.count++};
   // console.log(params);
    //params.flag=0;//私密文章前端默认加密显示
    let articleid=params.articleid;
    if (Object.keys(params).length===0){//默认无参数

        minarticle.getarticleMin({},function (vals) {
        if (vals){
            res.send({code:200,data:vals,msg:"ok"})
        }
        else {
             res.send({code:404,data:{},msg:"资源未找到"})
        }
    });
    }else {
        article.getartcle(params,function (vals) {
            if (vals){
                let num=1+vals.clicks;
                //console.log(typeof (num));
                res.send({code:200,data:vals,msg:"ok"});
                dbo.update("article",{set:{clicks:num},where:{articleid}})
            } else {
                res.send({code:404,data:{},msg:"资源未找到或密码错误"})
            }
        })
    }

});
module.exports=route;
