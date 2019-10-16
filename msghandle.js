const formatMsg=require('./fmtwxmsg');

function help(){
    return '你好，这是一个测试号，目前回原样返回用户输入的消息，暂不支持视频类型'
}
function userMsg(wxmsg,retmsg){
    //关键字自动回复
    if(wxmsg.MsgType == 'text'){
        switch(wxmsg.Content){
            case '帮助':
            case 'help':
            case '?':
                retmsg.msg=help();
                retmsg.msgtype='text';
                return formatMsg(retmsg);
            case 'about':
                retmsg.msgtype='text';
                retmsg.msg='我是这个测试号的开发者。';
                return formatMsg(retmsg);
            case 'who':
                retmsg.msgtype='text';
                retmsg.msg="学生姓名 ：薛宝祥 "+'\n'+"学生学号 ：2017011916 ";
                return formatMsg(retmsg);
            default:
                retmsg.msgtype='text';
                retmsg.msg=wxmsg.Content;
                return formatMsg(retmsg);
        }
    }

    //处理其他类型的信息
    switch(wxmsg.MsgType){
        case 'image':
        case 'voice':
            retmsg.msgtype=wxmsg.MsgType;
            retmsg.msg=wxmsg.MediaId;
            return formatMsg(retmsg);
        default:
            return formatMsg(retmsg);
    }
}

exports.help=help;
exports.userMsg=userMsg;

function eventMsg(wxmsg, retmsg){
    //把返回消息的类型设置为text
    retmsg.msgtype='text';

    switch(wxmsg.Event){
        case 'subscribe':
            retmsg.msg='你好，这是一个测试号';
            return formatMsg(retmsg);
        
        case 'unsubscribe':
            console.log(wxmsg.FromUserName,'取消关注');
            break;

        case 'CLICK':
            retmsg.msg=wxmsg.EventKey;
            return formatMsg(retmsg);

        case 'VIEW':
            console.log('用户浏览',wxmsg.EventKey);
            break;
        
        default:
            return '';
    }
    return '';
}

//后续还会加入事件信息支持
exports.msgDispatch = function msgDispatch(wxmsg, retmsg) {
    if(wxmsg.MsgType=='event'){
        return eventMsg(wxmsg,retmsg);
    }
    return userMsg(wxmsg, retmsg);
};