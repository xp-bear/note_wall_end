//index 路由文件
const controller = require("../controller/dbServer");
module.exports = function (app) {
  app.get("/", (req, res) => {
    res.send({
      code: 200,
      message: "后端服务启动成功~",
    });
  });
};
