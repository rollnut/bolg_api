var db=require("./db2");
var minarticle=require("./bg/articlemin");
var multiparty=require("multiparty");
var url=require("url");
/**
 *Description:模块功能 ：查看评论 回复评论 删除评论
 *Author:邓洪
 *Date:2019/11/16
 **/
exports.getComment=function ({articleid=""}={},callback) {
   let rarticle={};
   let rcomment={};
   if (articleid!==""){//获取指定文章id评论
       minarticle.getarticleMin({articleid},function (vals) {
           //console.log(vals);
           if (vals&&vals.length>0)
               rarticle=vals[0];
           db.find("comment",{where:'articleid='+articleid+"order by commentdate asc"},function (vals,resolve) {
          if (vals&&vals.length>0)
                rcomment=vals;
                rarticle.comment=rcomment;
                callback(rarticle);
                resolve();

          }).catch(err=>{
              console.log(err);});
       });
   }else {//获取所有文章信息及其评论
      minarticle.getarticleMin({},function (vals) {
           if (vals&&vals.length>0)
               rarticle=vals;
           db.find("comment",{where:"1 order by commentdate asc"},function (vals,resolve) {
          if (vals&&vals.length>0){
              rcomment=vals;
              for (let i=0;i<rarticle.length;i++){
                  rarticle[i].comment=[];
                  for (let j=0;j<rcomment.length;j++){
                      if (rarticle[i].articleid===rcomment[j].articleid){
/*                          console.log(rcomment[j]);
                          console.log(rarticle[i].comment);*/
                          rarticle[i].comment.push(rcomment[j]);
                      }
                  }
              }
              console.log(rarticle);
              callback(rarticle);
              resolve();
          }
          }).catch(err=>{
              console.log(err);});
       });
   }
};

exports.resolvecomment=function (req,callback) {//插入评论
    let form=new multiparty.Form();
    form.parse(req,function (err,fields,files) {
        let articleid=fields.articleid[0];
        let commentcontent=fields.commentcontent[0];
        let commentator="博主";
        let contact=fields.contact[0];
        let commentdate=fields.commentdate[0];
        let forid=fields.forid[0];
        let data={
            articleid,
            commentcontent,
            commentator,
            contact,
            commentdate,
            forid
        };
        db.insert("comment",{insert:data},function (vals) {
            callback(vals);
    })
  });
};
exports.deletecomment=function (req,callback) {
    var commentid=url.parse(req.url,true).query.commentid;//获取删除评论的id
    db.delete("comment",{where:`commentid = '${commentid}' or forid ='${commentid}'`},function (vals) {
        callback(vals);
    })
};