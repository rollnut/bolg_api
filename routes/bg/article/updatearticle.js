var route=require("express").Router();
var dbo=require("../../../moudules/db2");
var url=require("url");
var multiparty=require("multiparty");
var crypto=require("../../../moudules/crypto");
var EventListener=require("../../../moudules/dolisten").EventListener;
/*var fs=require("fs");*/
/**
 *Description:更新文章
 *Author:邓洪
 *Date:2019/11/12
 **/
route.post("/",function (req,res) {
    let form=new multiparty.Form();
    form.parse(req,  function (err, fields, files) {
        ///let re= /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
        /// let articleid =JSON.parse(fields.articleid[0]);
        let articleid = fields.articleid[0];
        //console.log(articleid);
        let type = fields.type[0];
        let password;
        let title = fields.title[0];
        let description = fields.description[0];
        let content = fields.content[0];
        let alock = fields.alock[0];
        let openview = fields.openview[0];
        let tag = fields.tag[0];
        let flag = 0;//记录修改成功信息
        let articledata = {
            description,
            content,
            title,
            alock,
            openview
        };//文章表
        let tagdata = {
            tag
        };//tag表
        let typedata = {
            type
        };//type表
        let alockdata = {};
        if (alock === 1 || alock === '1') {//对内容和解锁密码进行加密
            password = fields.password[0];
            articledata.content = crypto.encrypt(articledata.content);
            password = crypto.encrypt(password);
            alockdata = {
                password
            }//添加lock表
        } else {//不管存TMD密码存不存在，删！
            dbo.delete("articlelock", {where: `articleid ='${articleid}'`})
        }
        ///console.log(articledata);
        dbo.update("article", {set: articledata, where: {articleid}}, function (vals) {
            //console.log(vals)
            if (vals.affectedRows > 0) {
                res.send({code: 200, data: {}, msg: "修改成功"});
                EventListener({type: "修改", params: {title: articledata.title, articleid: articleid}})
            } else {
                res.send({code: 201, data: {}, msg: "修改失败"})
            }
        });

        dbo.update("articletype", {set: typedata, where: {articleid: articleid}}, function (vals) {
            if (vals && vals.affectedRows > 0) {
                ///console.log("articletype ok")
            }
        });
        dbo.update("tag", {set: tagdata, where: {articleid: articleid}}, function (vals) {

            if (vals && vals.affectedRows > 0) {
                // console.log("tag ok")
            }
        });
        if (Object.keys(alockdata).length > 0) {//maik 数据不存在
            dbo.qy({sql: `insert into articlelock(articleid,password) values('${articleid}','${password}'}) on duplicate key update password='${password}'`}, function (vals) {
                ///console.log(vals);
            })
            /*dbo.update("articlelock",{set:alockdata,where:{articleid:articleid}},function (vals) {
                if (vals&&vals.affectedRows>0){
                }
            });*/
        }//lock不为空
    })
});
module.exports=route;