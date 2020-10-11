var db=require("./db2");
var count=require("./cfg");
var nowdata={};
var events = require('events');
var url=require("url");
var multiparty=require("multiparty");
var uid=require("uuid/v1");
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
/**
 *Description:监听访问，并统计网站数据保存到数据库
 *Author:邓洪
 *Date:2019/11/16
 **/

var listenEvent=function ({type="",params={}}={}) {
   // console.log(params);
    if (type==="发布"&&params){
        //console.log("do insert");
        doEvent({type:type,articleid:params.articleid,title:params.title})
    }
    else if (type==="修改"&&params){
        //console.log("do update");
        doEvent({type:type,articleid:params.articleid,title:params.title})
    }
};
var doEvent=function ({title,articleid,type}={}){
    let eventid=uid();
    db.insert("event",{insert:{articleid,eventid,type,title}});
};
var listen= function(){
    setInterval(function () {
        getdata(function (data) {
            //console.log(data);
            doupdate(data)
        });
    },1000*10)//每十秒更新一次数据库
};
/*function doinsert(data) {
    db.insert("website",{data},function (vals) {
        if (vals&&vals.affectedRows>0){
            console.log("ok");
        }
    })
};*/
function doupdate() {
    let websiteid="";
    db.find("website",{where:"1 order by time desc"},function (vals,resolve) {
       websiteid=vals[0].websiteid;
        resolve();
    }).then(function () {
        db.update("website",{set:nowdata,where:{websiteid}});
    })
}
var getdata=async function (callback)  {//获取上一个时间节点到现在应该更新的数据
    let owebdata={};
    await db.find("website",{sql:"select sum(visitorsnum) as visitorsnum from website"},function (vals,resolve) {
        if (vals){
            owebdata=vals[0];
        }
        resolve();
    }).catch(err=>{
          console.log(err);});
    await db.find("comment",{sql:"select count(commentid) as commentnum from comment"},function (vals,resolve) {
        if (vals){
        nowdata.commentnum=vals[0].commentnum;
        }
         resolve();
    }).catch(err=>{
          console.log(err);});
    await db.find("star",{sql:"select sum(star) as starnum ,sum(unstar) as unstarnum from star"},function (vals,resolve) {
        if (vals){
        nowdata.starnum=vals[0].starnum;
        nowdata.unstarnum=vals[0].unstarnum;
        }
         resolve();
    }).catch(err=>{
          console.log(err);});
    await db.find("article",{sql:"select count(articleid) as articlenum from article"},function (vals,resolve) {
        if (vals){
        nowdata.articlenum=vals[0].articlenum;
        }
         resolve();
    }).catch(err=>{
          console.log(err);});
     nowdata.visitorsnum=count.count+owebdata.visitorsnum;
     count.count=0;
     callback(nowdata)
};
exports.listen=listen;
exports.EventListener=listenEvent;
/*var dolistendayly= function() {//每日监测一次数据库
  let date=new Date();
  if (date.getDate()===1){//每月1日插入新记录
      console.log("do insert")
  }
    console.log(date.getDate());
};*/