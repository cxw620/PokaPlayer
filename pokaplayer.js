const pokaLog = require("./log"); // 可愛控制台輸出
// start PokaPlayer
const jsonfile = require('jsonfile')

let config
try {
    config = jsonfile.readFileSync("./config.json")
} catch (e) {
    pokaLog.logErr('CONFIG', `config.json 讀取失敗`)
}
if (config) {
    const { pokaStart } = require('./index')
    pokaStart()
} else {
    const express = require("express");
    const app = express(); // Node.js Web 架構
    pokaLog.log('INSTALL', `The configuration file has not yet been created`)
    pokaLog.log('INSTALL', `Fill out the configuration file according to config-simple.json from the repo`)
    pokaLog.log('INSTALL', `config.json 設定教學: https://git.io/PokaConfigChinese`)
    app.use(express.static("install"))
    const server = require("http").createServer(app)
    server.listen(3000, () => {
        pokaLog.log('INFO', 'http://localhost:3000/')
    });
}