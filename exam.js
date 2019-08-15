const crypto = require('crypto');
const axios = require('axios');
const url = "https://dm.aliyuncs.com/";
// 动态配置 必要参数
const requireParam = [
    "accessKeyID",
    "accessKeySecret",
    "accountName",
    "single--toAddress",
    "batch--templateName",
    "batch--receiversName"
];
const exam = (config, cb) => {
    if (!config || JSON.stringify(config) === "{}"){
        return cb("config required");
    }
    const nonce = Date.now();
    const date = new Date();
    const errorMsg = [];
    // 缺少参数 处理
    if(!config.action){
        cb("error action");
    }else{
        requireParam.forEach((item) => {
            if (item.indexOf("--") === -1) {
                if (!config[item]){
                    errorMsg.push(`${item} required`);
                }
            } else {
                let paramArr = item.split("--");
                if (config.action === paramArr[0] && !config[paramArr[1]]){
                    errorMsg.push(`${paramArr[1]} required`);
                }
            }
        })
        if (errorMsg.length) {
            return cb(errorMsg.join(","));
        }
    }
    // 初始化参数
    let param = {
        AccessKeyId: config.accessKeyID,
        Format: "JSON",
        Action: config.action,
        AccountName: config.accountName,
        ReplyToAddress: !!config.replyToAddress,
        AddressType: typeof config.addressType === "undefined" ? 0 : config.addressType,
        ToAddress: config.toAddress,
        TemplateName: config.templateName,
        ReceiversName: config.receiversName,
        SignatureMethod: "HMAC-SHA1",
        SignatureNonce: nonce,
        SignatureVersion: "1.0",
        TemplateCode: config.templateCode,
        Timestamp: date.toISOString(),
        Version: "2015-11-23"
    };
    if (config.action === "single"){
        if (config.fromAlias) {
            param.FromAlias = config.fromAlias;
        }
        if (config.subject) {
            param.Subject = config.subject;
        }
        if (config.htmlBody) {
            param.HtmlBody = config.htmlBody;
        }
        if (config.textBody) {
            param.TextBody = config.textBody;
        }
    }
    if (config.action === "batch" && config.tagName) {
        param.TagName = config.tagName;
    }

    axios({
        method: "post",
        url: url,
        data: param,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        transformRequest: data => {
            // 参数 处理
            let signStr = [];
            let reqBody = [];
            Object.keys(data).forEach(i => {
                signStr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
                reqBody.push(i + "=" + data[i]);
            })
            signStr = "POST&%2F&" + encodeURIComponent(signStr.sort().join("&"));
            const sign = crypto.createHmac("sha1", config.accessKeySecret + "&").update(signStr).digest("base64");
            const signature = encodeURIComponent(sign);
            reqBody.unshift("Signature=" + signature);
            return reqBody.join("&");
        }
    }).then(res => {
        cb(res.data);
    }).catch(err => {
        cb(err.data, err.config);
    })
}
module.exports = exam