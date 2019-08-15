const exam = require("./exam");

const callback = (msg, data) => {
    console.log(msg);
}

test("exam config = {}", () => {
    expect(exam({}, callback)).toBe(callback("config required"));
})


const param = {
    accessKeyID : "accessKeyID",
    accessKeySecret: "accessKeySecret",
    accountName: "accountName",
    toAddress: "single--toAddress",
    templateName: "batch--templateName",
    receiversName: "batch--receiversName"
}
test("exam config without action", () => {
    expect(exam(param, callback)).toBe(callback("error action"));
})

const param1 = {
    accessKeySecret: "accessKeySecret",
    accountName: "accountName",
    toAddress: "single--toAddress",
    templateName: "batch--templateName",
    receiversName: "batch--receiversName",
    action: "batch"
}
test("exam config without action", () => {
    expect(exam(param1, callback)).toBe(callback("accessKeyID required"));
})