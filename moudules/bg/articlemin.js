var db=require("../db2");
/**
 *Description:获取简略的文章信息 不包括内容 其中评论
 * 参数: {} ：获取所有文章简略信息 || articleid 获取指定id文章简略信息
 *Author:邓洪
 *Date:2019/11/12
 **/
exports.getarticleMin= async function ({articleid}={},callback) {
    if (articleid){
        let rartcile={};
        let rtype={};
        let rtag=[];
        await  db.find("article",{cls:"articleid,title,description,date,clicks",where:`articleid= ${articleid}`},function (vals,resolve) {
          if (vals&&vals.length>0){
               rartcile=vals[0];
          }
          resolve();
        }).catch(err=>{
          console.log(err);});
        await db.find("articletype",{cls:"type",where:'articleid='+articleid},function (vals,resolve) {
          if (vals&&vals.length>0)
              rtype=vals[0];
          resolve();
      }).catch(err=>{
          console.log(err);});
        await db.find("tag",{cls:"tag",where:'articleid='+articleid},function (vals,resolve) {
          if (vals&&vals.length>0)
          {
              for (x in vals)
              rtag.push(vals[x].tag)
          }
          resolve();
      }).catch(err=>{
          console.log(err);});
        rartcile=Object.assign(rartcile,rtype);
        rartcile.tag=rtag;
        callback(rartcile);
    }else {
        db.find("",{sql:"select a.articleid,a.description,a.alock,a.date,a.clicks,a.openview,a.title,at.type,t.tag" +
            " from article as a left join articletype as at on(a.articleid=at.articleid) left join tag " +
            "as t on(a.articleid=t.articleid)"},function (vals,resolve) {
        callback(vals);
        resolve();
        }).catch(err=>{
            if (err) throw err
        })
    }


};
