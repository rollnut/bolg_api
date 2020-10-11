var mysql=require("mysql");
var pool = mysql.createPool({
 host: 'localhost',
 user: 'root',
 password: '666666',
 port:'3306',
 database:'blog',
    bigNumberStrings:true,
});
var connect=function (callback) {
    pool.getConnection(function (err,conn) {
        if (err) throw err;
        else{
           callback(conn);//返回connection对象
        }
    })
};
exports.connect=connect;
