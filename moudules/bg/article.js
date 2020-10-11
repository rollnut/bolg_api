var db=require("../db2");
var crypt=require("../crypto");
exports.getartcle=async function ({articleid='',password='',flag=0}={},callback) {
    /**
     *Description:获取文章 参数为{} 默认输出全部文章，参数 1 id 输出指定id文章， 参数2 文章解密密码 参数三:访问权限
     *Author:邓洪
     *Date:2019/11/9
     * 修改getartcile 中tags-》tag
     **/
    var rartcle={};
    var rartcletype={};
    var rcomment={};
    var rstar={};
    var rtag=[];
   // var flag2;//是否文章加密 0未加密 1加密
    var res=0;//解密是否成功标识
    if (articleid!==''){//具体查询BY Id

        await  db.find("article",{where:`articleid= '${articleid}'`},function (vals,resolve) {
           // console.log(vals);
            if (vals&&vals.length>0){
                 rartcle=vals[0];
              //console.log(rartcle);
              if (parseInt(rartcle.alock)===1) {
                    //flag2 = 1;
                    resolve(1);
               }else {
                   //flag2 = 0;
                    resolve(0)
              }
          }

        }).catch(err=>{
          console.log(err);}).then( async function (flag2) {
            //console.log(flag2);
            if (flag2 === 1) {//flag2
                console.log("已加密", res);
                if (flag === 1) {//有访问权限
                    //解密
                    rartcle.content = crypt.decrypt(rartcle.content);
                    res = 1;
                    console.log("权限解密")
                }
                if (password !== "") {
                    await db.find("articlelock", {where: `articleid ='${articleid}'`}, function (vals, resolve) {
                        // console.log(vals);
                        // console.log(crypt.decrypt(vals[0].password));
                        if (vals && vals.length > 0) {
                            if (crypt.decrypt(vals[0].password) == password) {
                                //加密验证成功解密赋值
                                console.log("解密成功");
                                rartcle.content = crypt.decrypt(rartcle.content);
                                res = 1;
                            }
                        }
                        resolve()

                    }).catch(err => {
                        console.log(err);
                    })
                } else {

                }

            }
        });

      await db.find("articletype",{where:`articleid= '${articleid}'`},function (vals,resolve) {
          if (vals&&vals.length>0)
              rartcletype=vals[0];
          resolve();
      }).catch(err=>{
          console.log(err);});
      await db.find("tag",{where:`articleid= '${articleid}'`},function (vals,resolve) {
          if (vals&&vals.length>0)
          {
              for ( let x in vals)
              rtag.push(vals[x].tag)
          }
          resolve();
      }).catch(err=>{
          console.log(err);});
      await db.find("star",{where:`articleid= '${articleid}'`},function (vals,resolve) {
          if (vals&&vals.length>0)
            rstar=vals[0];
          resolve();

      }).catch(err=>{
          console.log(err);});
      await db.find("comment",{where:`articleid= '${articleid}' order by commentdate asc `},function (vals,resolve) {
          if (vals&&vals.length>0)
                rcomment=vals;
          resolve();
      }).catch(err=>{
          console.log(err);});
      rartcle=Object.assign(rartcle,rstar,rartcletype);
      rartcle.comment=rcomment;
      rartcle.tag=rtag;
      if (rtag.length===0){
          rartcle={}
      }
     // console.log(rartcle);
      rartcle.flag=res;
      callback(rartcle);
    }
    else {
        let result;
    await db.find('',{sql:"select * from article as a left join star as s on" +
            " (a.articleid=s.articleid) left join articletype as at on(a.articleid=at.articleid) " +
            "left join tag as t on(a.articleid=t.articleid)"},function (vals,resolve) {

         if (vals&&vals.length>0)
                result=vals;
        else result={};
        callback(result);
         resolve();
    }).catch(err=>{
          console.log(err);})
    }
};