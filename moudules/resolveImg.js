var fs=require("fs");
var multiparty=require('multiparty');
var BaseUrl=require("./cfg").ImgBaseUrl;
//var Url=BaseUrl+"bg/";
var url=require("url");
exports.resove=function (req,res,callback) {
    var form=new multiparty.Form();
    form.uploadDir='upload';
    form.parse(req,function (err,fields,files) {
        if (err) throw err;
        var data={
            pic:""
        };
        if (files.file[0].originalFilename) {
             data.pic=files.file[0].path;
            data.pic=data.pic.replace(/\\/,"\/");
            data.pic=data.pic.substr(data.pic.indexOf("\/"));
            //console.log(data.pic);
            res.send({code:200,data:{url:BaseUrl+data.pic},msg:"ok"})
        }
        else {
            fs.unlink(files.pic[0].path,function (err) {
                if (err) throw err;
            });
            res.send({code:204,data:{},msg:"上传失败"})
        }
    });
    if (callback) callback();
};
exports.delete=function (req,res,callback) {
    let params=url.parse(req.url,true).query;
    let aim =params.path.substr(params.path.lastIndexOf("\/"));
    //console.log(aim);
    //aim==aim.replace("\/","/")
    if (aim.length>0) {
            fs.unlink('upload'+aim,function (err) {
                if (err) throw err;
                res.send({code:200,data:{},msg:"删除成功"})
            });
    }
    if (callback) callback()

};
