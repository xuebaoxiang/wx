const titbit = require('titbit');
const crypto  =require('crypto');
const xmlparse = require('xml2js').parseString;

var app = new titbit();

var {router} = app;

router.get('/as', async c => {
    let token = 'astalk';
    let urIargs = [
        c.query.nonce,
        c.query.timestamp,
        token
    ]
    urIargs.sort();
    let onestr = urIargs.join('');
    let hash = crypto.createHash('sha1');
    let sign = hash.update(onestr);
    if(sign.digest('hex') === c.query.signature){
        c.res.body = c.query.echostr;
    }
});
router.post('/as',async c =>{
    console.log(c.body);

    try{
        let data = await new Promise((rv,rj) => {
            xmlparse(c.body,{explicitArray : false},(err,result) => {
                if(err){
                    rj(err);
                }else{
                    rv(result.xml);
                }
            })
        })

        if(data.MsgType== 'text'){
            c.res.body = `<xml>
            <FromUserName>${data.ToUserName}</FromUserName>
            <ToUserName>${data.FromUserName}</ToUserName>
            <CreateTime>${parseInt(Date.now())}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${data.Content}]]></Content>
            </xml>`
        }
    }catch(err){
        console.log(err);
    }
});
app.run(8001,'localhost')
