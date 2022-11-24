// 启动文件
const express = require("express");
const path = require("path");
const cors = require("cors");
// 解析html
const ejs = require("ejs");
const config = require("./config/default");

const app = express();
app.use(cors()); //跨域处理
// 获取静态路由
app.use(express.static(__dirname + "/dist"));
app.use(express.static(__dirname + "/data")); //存放上传图片的文件夹

//解析html视图
app.engine("html", ejs.__express);
app.set("view engine", "html");

// 解析前端数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 引入路由
require("./routers/index")(app);
require("./routers/files")(app);

app.listen(config.port, () => {
  console.log(`服务启动成功! http://localhost:${config.port}`);
});
