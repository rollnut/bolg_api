var mysql=require("mysql");
var connection =mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'123456',
	port:'3306',
	database:'blog'
});
/**
 *Description:mysql数据库操作的封装 --已弃用
 *Author:邓洪
 *Date:2019/11/6
 **/

exports.find=function (table,{cls='*',where="1",sql=`select ${cls} from ${table} where ${where}`}={},callback) {
    console.log(sql);
    connection.connect();
    connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;

        }
      if (callback) callback(result);

});
};
exports.insert=function (table,{insert={},cls=[],clsparams=[]}={},callback) {
    let q=[];
    connection.connect();
    for (item in insert)
    {
        cls.push(item);
        q.push('?');
        clsparams.push(insert[item]);
    }
    cls=cls.join(',');
    sql=`insert into ${table}(${cls}) values(${q})`;
    console.log(sql);
    connection.query(sql,clsparams,function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        if (callback) callback(result);

    })
};
exports.delete=function (table,{where=0,sql=`delete from ${table} where ${where}`}={},callback) {
    connection.connect();
    connection.query(sql,function (err, result) {
        if(err){
          console.log('[DELETE ERROR] - ',err.message);
          return;
        }
       console.log('DELETE affectedRows',result.affectedRows);
      if (callback) callback(result);

});
};
exports.update=function (table,{set={},where=0,sql=``}={},callback) {
    let sname=[];
    let params=[];
    connection.connect();
    for ( index in set){
        sname.push(index+"=?");
        params.push(set[index])
    }
    sname=sname.join(',');
    sql=`update ${table} set ${sname} where ${where}`;
    console.log(sql);
    connection.query(sql,params,function (err,result) {
        if (err) throw err;
       if (callback) callback(result);

    });
};





