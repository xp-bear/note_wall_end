//index 路由文件
const controller = require("../controller/dbServer"); //控制器
module.exports = function (app) {
  app.get("/", (req, res) => {
    res.send({
      code: 200,
      message: "后端服务启动成功~",
    });
  });
  // 新建留言墙路由
  app.post("/insertwall", (req, res) => {
    controller.insertWall(req, res);
  });
  // 新建反馈路由
  app.post("/insertfeedback", (req, res) => {
    controller.insertFeedBack(req, res);
  });
  // 新建评论路由
  app.post("/insertcomment", (req, res) => {
    controller.insertComment(req, res);
  });
  //删除墙留言，主表对应多条子表一起删除函数
  app.post("/deletewall", (req, res) => {
    controller.deleteWall(req, res);
  });
  //删除反馈
  app.post("/deletefeedfack", (req, res) => {
    controller.deleteFeedBack(req, res);
  });
  // 删除评论
  app.post("/deletecomment", (req, res) => {
    controller.deleteComment(req, res);
  });
  // 查询分页留言墙 type 0 留言 1 相片
  app.post("/findwallpage", (req, res) => {
    controller.findWallPage(req, res);
  });
  // 查询留言墙或照片墙的总条数。
  app.post("/findwallphotototal", (req, res) => {
    controller.findWallPhotoTotal(req, res);
  });
  //倒叙分页查墙的评论
  app.post("/findcommentpage", (req, res) => {
    controller.findCommentPage(req, res);
  });
  //用户进入进行ip登记
  app.get("/signip", (req, res) => {
    let ip = req.ip;
    res.send({
      code: 200,
      ip: ip,
    });
  });

  //查询用户是否点击爱心
  app.post("/likecount", (req, res) => {
    controller.likeCount(req, res);
  });

  // 删除相关图片或者视频资源。
  app.post("/deletephoto", (req, res) => {
    controller.deletePhoto(req, res);
  });
};
