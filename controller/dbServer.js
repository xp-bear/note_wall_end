//操作数据库
const dbModel = require("../lib/db");

// 新建walls函数
exports.insertWall = async (req, res) => {
  let { type, message, name, userId, moment, label, color, imgUrl } = req.body; //解构赋值
  await dbModel.insertWall([type, message, name, userId, moment, label, color, imgUrl]).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
// 新建反馈函数
exports.insertFeedBack = async (req, res) => {
  let { wallId, userId, type, moment } = req.body; //解构赋值
  await dbModel.insertFeedBack([wallId, userId, type, moment]).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
// 新建评论函数
exports.insertComment = async (req, res) => {
  let { wallId, userId, imgUrl, comment, name, moment } = req.body; //解构赋值
  await dbModel.insertComment([wallId, userId, imgUrl, comment, name, moment]).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
//删除墙留言，主表对应多条子表一起删除函数
exports.deleteWall = async (req, res) => {
  let data = req.body;
  if (data.imgUrl) {
    // 如果图片地址存在
  }
  await dbModel.deleteWall(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
//删除反馈
exports.deleteFeedBack = async (req, res) => {
  let data = req.body;
  await dbModel.deleteFeedBack(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
// 删除评论
exports.deleteComment = async (req, res) => {
  let data = req.body;
  await dbModel.deleteComment(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
// 查询分页留言墙 type 0 留言 1 相片
exports.findWallPage = async (req, res) => {
  let { page, pageSize, type, label, userID } = req.body;
  await dbModel.findWallPage(page, pageSize, type, label, userID).then(async (result) => {
    for (let i = 0; i < result.length; i++) {
      //查找相应wall的赞、举报、撤销数据
      //喜欢
      result[i].like = await dbModel.feedbackCount(result[i].id, 0);
      //举报
      result[i].report = await dbModel.feedbackCount(result[i].id, 1);
      //要求撤诉
      result[i].revoke = await dbModel.feedbackCount(result[i].id, 2);
      //是否点赞
      result[i].islike = await dbModel.likeCount(result[i].id, result[i].userID);
      //评论数
      result[i].comcount = await dbModel.commentCount(result[i].id);
    }
    res.send({
      code: 200,
      message: result,
    });
  });
};
// 查询留言墙或照片墙的总条数。
exports.findWallPhotoTotal = async (req, res) => {
  let { type, label } = req.body;
  await dbModel.findWallPhotoTotal(type, label).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//倒叙分页查墙的评论
exports.findCommentPage = async (req, res) => {
  let { page, pageSize, id } = req.body;
  await dbModel.findCommentPage(page, pageSize, id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

// 查询用户是否点击爱心
exports.likeCount = async (req, res) => {
  let { wid, uid } = req.body;
  await dbModel.likeCount(wid, uid).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
// 删除相关图片或者视频资源。
exports.deletePhoto = (req, res) => {
  let { urlpath } = req.body; //"http://localhost:8989/photo/file-1672218723917.mp4"
  dbModel.deletePhoto(urlpath).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
