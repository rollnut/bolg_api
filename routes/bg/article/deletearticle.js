var dbo=require("../../../moudules/db2");
var dbget=require("../../../moudules/bg/article.js");
var  route=require("express").Router();
var url=require("url");
var fs=require("fs");
/**
 *Description:删除文章
 * 参数:articleid
 *Author:邓洪
 *Date:2019/11/12
 **/
function getExecStrs (str) {
        let list = [];
        let paths;
        paths=str.match(/http[^)]+\.(png|jpg)/g);
        console.log(paths);
        for (let x in paths){
            list.push(paths[x].substr(paths[x].lastIndexOf("\/")))
        }
    return list
    }//获取文本中所有的
route.get("/",function (req,res) {

    let params=url.parse(req.url,true).query;
    console.log(params.articleid);
    let flag=0;//是否有权限（游客或者是博主）
    if(req.session.userinfo&&req.session.userinfo.account!=="")
       flag=1;
    params.flag=flag;
    let filenames=[];
    dbget.getartcle(params, function (vals) {
        if (vals.flag===1){
            console.log(vals);
            filenames=getExecStrs(vals.content);
            for (let x in filenames){
                fs.unlink('upload'+filenames[x],function (err) {
                    if (err) throw err;
                    res.send({code:200,data:{},msg:"删除成功"})
                });
            }
        }else {
         console.log("未获取到内容")
        }
    });
    dbo.delete("article",{where:`articleid = '${params.articleid}'`},function (vals) {
        if (vals&&vals.affectedRows>0){
            res.send({code:200,data:{},msg:"删除成功"});
        }
        else {
            res.send({code:204,data:{},msg:"删除内容不存在"})
        }
    });

});
module.exports=route;
