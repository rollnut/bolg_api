var crypto=require("crypto-js");
var key="paswwordkey";
/**
 *Description:加密解密模块
 * 参数传入需要加密/解密的字符串
 *Author:邓洪
 *Date:2019/11/12
 **/
let encrypt=function (data) {//encrypt
    let piantext= crypto.AES.encrypt(data, key);
   // console.log("加密后："+piantext);
    return piantext.toString();
};
let decrypt=function (data) {// Decrypt
    let text= crypto.AES.decrypt(data.toString(),key).toString(crypto.enc.Utf8);
    //console.log("解密后："+text);
    return text;
};
exports.encrypt=encrypt;
exports.decrypt=decrypt;