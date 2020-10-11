var route=require("express").Router();
var dbo=require("../../moudules/db2");
var url=require("url");
var crypt=require("../../moudules/crypto");
/**
 *Description:处理文章权限更改的操作， 开启某篇评论或者加密文章
 * 请求参数: articleid,password,openview,alock
 *Author:邓洪
 *Date:2019/11/12
 **/
route.get("/",function (req,res) {
    let  params=url.parse(req.url,true).query;
    let {articleid,password,...insert}=params;
    ///console.log(params);

    let flag=0;// 解密解密标识
    let cache="";
   dbo.find("article",{where:`articleid = '${articleid}'`},function (vals,resolve) {
       if (insert.alock&&vals[0].alock.toString()!==insert.alock){//改动了加密标识
           flag=parseInt(insert.alock)//1 重新加密内容 0 解密内容
           console.log(flag);
           if (flag===1){
               cache=crypt.encrypt(vals[0].content);
           }else {
               cache=crypt.decrypt(vals[0].content)
           }
          /// console.log(cache);
           insert.content=cache;
       }
        resolve();
    }).then(function () {
       dbo.update("article",{set:insert,where:{articleid:articleid}},function (vals) {
        if (vals&&vals.affectedRows>0){
            res.send({code:200,data:{},msg:"修改成功"})
        }
        else {
            res.send({code:202,data:{},msg:"修改失败"})
        }
     });
       if (flag===1){//加密。添加密码
            password=crypt.encrypt(password);
            dbo.insert("articlelock",{insert:{articleid,password}})
       }
       else {//解除密码
            dbo.delete("articlelock",{where:`articleid = '${articleid}'`});
       }
   });
});




module.exports=route;