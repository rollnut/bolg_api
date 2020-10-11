var route=require("express").Router();
var dbo=require("../../../moudules/db2");
var multiparty=require("multiparty");
var crypto=require("../../../moudules/crypto");
var uid=require("uuid/v1");
var EventListener=require("../../../moudules/dolisten").EventListener;
/*var fs=require("fs");*/
/**
 *Description:插入文章
 *Author:邓洪
 *Date:2019/11/12
 **/
route.post("/",function (req,res) {
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,files) {
         let re= /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
        //console.log(fields);
        let articleid =uid();
        let password;
         let type =fields.type[0];
         let title =fields.title[0];
         let description =fields.description[0];
         let content=fields.content[0];
         let alock=fields.alock[0];
         let openview=fields.openview[0];
         let tag=fields.tag[0];
        let articledata={
            articleid,
            description,
            content,
            title,
            alock,
            openview,
        };//文章表
        let tagdata={
            articleid,
            tag
        };//tag表
        let typedata={
            articleid,
            type
        };//type表
        let alockdata={};
        if (alock==1){//对内容和解锁密码进行加密
            password=fields.password[0];
            articledata.content=crypto.encrypt(articledata.content);
            password=crypto.encrypt(password);
            alockdata={
                articleid,
                password
            }//添加lock表
         }
      dbo.insert("article",{insert:articledata},function (vals) {
            if (vals&&vals.affectedRows>0){
                 res.send({code:200,data:{},msg:"上传成功"});
                 EventListener({type:"发布",params:{title:articledata.title,articleid:articledata.articleid}})
            }else {
                res.send({code:201,data:{},msg:"上传失败"});
            }
        });
      dbo.insert("articletype",{insert:typedata},function (vals) {
            if (vals&&vals.affectedRows>0){
               console.log("ok2")
            }
        });
      dbo.insert("tag",{insert:tagdata},function (vals) {
            if (vals&&vals.affectedRows>0){
               console.log("ok3")
            }
        });
           if(Object.keys(alockdata).length>0)
        {
            dbo.insert("articlelock",{insert:alockdata},function (vals) {
                if (vals&&vals.affectedRows>0){
                   console.log("ok4")
                }
            });
        }//lock不为空
    })


});
module.exports=route;
