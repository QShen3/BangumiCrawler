var qiniu = require("qiniu");
const urllib_sync = require('urllib-sync');

qiniu.conf.ACCESS_KEY = 'edSupw4Gu12UCRdF5tdzZZpjNX6CsrXdhl9Hkx3r';
qiniu.conf.SECRET_KEY = 'gWTJur-_Krw8Afa7IHNrcg3BvPauHEanlOXqnhj3';

bucket = 'qvideo';

key = 'test/test2/test2.png';

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

token = uptoken(bucket, key);

var res = urllib_sync.request('http://lain.bgm.tv/pic/cover/c/2b/85/158316_gz1mM.jpg');
filePath = res.data;

function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.put(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        console.log(ret.hash, ret.key, ret.persistentId);       
      } else {
        console.log(err);
      }
  });
}

uploadFile(token, key, filePath);
