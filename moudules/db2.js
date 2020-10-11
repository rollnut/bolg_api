var db=require("./dbPool");
/**
 *Description:改造数据库封装，改用mysql连接池，除了update insert 操作其他都支持原生sql操作数据库
 *Author:邓洪
 *Date:2019/11/6
 **/
exports.find=function(table,{cls='*',where="1",sql=`select ${cls} from ${table} where ${where}`}={},callback){
      //console.log(sql);
    return new Promise((resolve,reject) => {
         db.connect(function (conn) {
            conn.query(sql,function (err,vals,fields) {
                conn.release();
                if (err){
                    console.log(err);
                    reject()
                }
            callback(vals,resolve);
            //事件驱动回调
        });
    });
    },)

};
exports.qy=function({sql=''}={},callback){

    db.connect(function (conn) {
        conn.query(sql,function (err,vals,fields) {
                 if (err) throw err;
                conn.release();
                 if (callback) callback(vals);
                //事件驱动回调
                });

    })

}
exports.insert=function (table,{insert={},sql=`insert into ${table} set ?`}={},callback) {
   // console.log(sql);
   // console.log(insert);
    db.connect(function (conn) {
             conn.query(sql,insert,function (err,vals,fields) {
                 if (err) throw err;
                conn.release();
                 if (callback) callback(vals);
                //事件驱动回调
                });
    });
};
exports.update=function (table,{set={},where={},sql=``}={},callback) {
    let sname=[];
    let params=[];
    for ( index in set){
        sname.push(index+" = ?");
        params.push(set[index])
    }
    sname=sname.join(',');
    params.push(Object.values(where)[0]);
    sql=`UPDATE ${table} SET ${sname} where ${Object.keys(where)[0]}= ?`;
     //console.log(sql);
    // console.log(params);
    db.connect(function (conn) {
         conn.query(sql,params, function (err, vals, fields) {
             if (err) {
                   console.log('[UPDATE ERROR] '+ err.message)
             }
             conn.release();
             if (callback) callback(vals);

             //事件驱动回调
         });
     })


};
/*exports.update2=function ({sql="",params=[]}={},callback) {
        db.connect(function (conn) {

            conn.query(sql,params, function (err, vals, fields) {
             if (err) {
                   console.log('[UPDATE ERROR] '+ err.message)
             }
             conn.release();
             if (callback) callback(vals);

             //事件驱动回调
         });
     })
};*/


exports.delete=function (table,{where=0,sql=`delete from ${table} where ${where}`}={},callback) {
    //console.log(sql);
    db.connect(function (conn) {
            conn.query(sql,function (err,vals,fields) {
                if (err) throw err
                    conn.release();
                    if (callback) callback(vals);
                    //事件驱动回调
                });
    });
};


