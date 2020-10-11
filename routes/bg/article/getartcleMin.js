var route=require("express").Router()
var getarticle=require("../../../moudules/bg/articlemin");
var url=require("url");
/**
 *Description:获取所有文章的简略信息
 * 参数 ：默认{}
 *Author:邓洪
 *Date:2019/11/16
 **/
route.get("/",function (req,res) {
    var params=url.parse(req.url,true).query;
    getarticle.getarticleMin(params,function (vals) {
        if (vals&&vals.title!==""){
          res.send({code:200,data:vals,msg:"ok"})
      }
      else {
           res.send({code:201,data:{},msg:"未找到资源"})
      }
    })
});
module.exports=route;