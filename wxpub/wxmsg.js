const titbit = require('titbit');
const crypto = require('crypto');
const parsexml = require('xml2js').parseString;
const wxmsg = require('./msghandle');

var app = new titbit();

app.router.post('/as',async c => {
    console.log(c.body);
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