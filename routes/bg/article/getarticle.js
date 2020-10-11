var dbget=require("../../../moudules/bg/article.js");
var route=require("express").Router();
var url=require("url");
/**
 *Description:获取文章 有三种请求方式 / 匹配全部 ?articleid= 匹配某个文章  ?articleid=&&paswword= 请求加密文章
 *Author:邓洪
 *Date:2019/11/12
 **/
route.get("/",function (req,res) {
   let params=url.parse(req.url,true).query;
   let flag=0;//是否有权限（游客或者是博主）
    if(req.session.userinfo&&req.session.userinfo.account!=="")
       flag=1;
    params.flag=flag;
    dbget.getartcle(params, function (vals) {
        if (vals.flag===1){
        res.send({code:200,data:vals,msg:"已解密"})
        }else {
         res.send({code:201,data:vals,msg:"未解密或解密失败"})
        }
    });
});
exports.route=route;