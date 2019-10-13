const formatMsg = require('./fmtwxmsg');
function help(){
    //字符串形式返回发送信息
    //还可以是以读取文件的形式来返回
    return '你好，这是一个测试号，目前会原样返回用户输入的信息，暂不支持视频类型';
}
function userMsg(wxmsg,retmsg){
    if(wxmsg.MsgType == 'text'){
        switch(wxmsg.Content){
            case '帮助':
            case 'help':
            case '?':
                retmsg.msgtype = 'text';
                retmsg.msg = help();
                return formatMsg(retmsg);
            case 'about' : 
                retmsg.msgtype = 'text';
                retmsg.msg = "我是这个公众号的开发者，如有问题请留言";
                return formatMsg(retmsg);
            case 'who' :
                retmsg.msgtype = 'text';
                retmsg.msg = "学生姓名 ：薛宝祥 ，学生学号 ：2017011916 ";
                return formatMsg(retmsg);
            default : 
                retmsg.msg = wxmsg.Content;
                retmsg.msgtype = 'text';
                return formatMsg(retmsg);
    }
}
else{
    switch(wxmsg.MsgType){
        case 'image' : 
        case 'voice' :
                retmsg.msgtype = wxmsg.MsgType;
                retmsg.msg = wxmsg.MediaID;
                break;
        default:
                retmsg.msg = "暂不支持的类型";   
    }
    return formatMsg(retmsg);
}
}
exports.help = help;
exports.userMsg = userMsg;

exports.msgDispatch = function(wxmsg,retmsg){
    return userMsg(wxmsg, retmsg);
}