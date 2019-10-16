const titbit = require('titbit');
const fs = require('fs');
const funcs = require('./functions');
const marked = require('marked');
const mdb = require('./initdb');
const crypto = require('crypto');
const parsexml = require('xml2js').parseString;
const wxmsg = require('./msghandle.js');

var app = new titbit({
  debug: true, //开启调式模式，会输出错误信息
  showLoadInfo: false,
});

var {router} = app; //相当于 var router = app.router;

var _dbpath = './mddata';

//填写自己的域名:
mdb.domain = 'b.qazwsxedcrfv.club';
mdb.loadData(_dbpath);


router.get('/search', async c => {
  let kwd = '';
  if (c.query.q !== undefined) {
    kwd = c.query.q.trim();
  }

  try {
    c.res.body = {
      status: 0,
      list : mdb.search(kwd)
    };
  } catch (err) {
    console.log(err);
    c.res.status(404);
  }

});

router.get('/images/:name', async c => {
  let imgfile = `${_dbpath}/images/${decodeURIComponent(c.param.name)}`;
  try {
    let content_type = '';
    let extname = c.helper.extName(imgfile);

    switch (extname.toLowerCase()) {
      case '.png':
        content_type = 'image/png'; break;
      case '.jpg':
      case '.jpeg':
        content_type = 'image/jpeg'; break;
      case '.gif':
        content_type = 'image/gif'; break;
      default:;
    }
    c.res.setHeader('content-type', content_type);

    let data = await funcs.readFile(imgfile, 'binary');

    c.res.setHeader('content-length', data.length);

    c.res.encoding = 'binary';
    c.res.body = data;
  } catch (err) {
    c.res.status(404);
  }
});
router.get('/a',async c => {
  c.res.body = c.query;
});


//用于验证过程，在公众号验证通过后则不会再使用。
router.get('/as', async c => {
  var token = 'astalk';
  var urlargs = [
      c.query.nonce,
      c.query.timestamp,
      token
  ];

  urlargs.sort();  //字典排序

  var onestr = urlargs.join(''); //拼接成字符串
  
//生成sha1签名字符串
  var hash = crypto.createHash('sha1');
  var sign = hash.update(onestr);
  
  if (c.query.signature === sign.digest('hex')) {
      c.res.body = c.query.echostr;
  }
});
//公众号开发者配置验证并启用后，会通过POST请求转发用户消息。
router.post('/as', async c => {
  try {
      var xmlmsg = await new Promise((rv, rj) => {
          parsexml(c.body, {explicitArray : false}, (err, result) => {
              if (err) {
                  rj(err);
              } else {
                  rv(result.xml);
              }
          });
      });
      var data = {
          touser      : xmlmsg.FromUserName,
          fromuser    : xmlmsg.ToUserName,
          msg         : xmlmsg.Content,
          msgtime     : parseInt(Date.now() / 1000),
          msgtype     : ''
      };

      c.res.body = wxmsg.msgDispatch(xmlmsg, data);
  } catch (err) {
      console.log(err);
  }

});

app.run(8001, 'localhost');
