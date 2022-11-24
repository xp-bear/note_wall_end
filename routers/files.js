// 处理图片上传
const multer = require("multer");
const config = require("../config/default");
const storage = multer.diskStorage({
  //保存路径
  destination: function (req, file, cb) {
    cb(null, "./data/photo");
    //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
  },
  //保存在 destination 中的文件名
  filename: function (req, file, cb) {
    // 正则匹配后缀名称
    let suffix = file.originalname.replace(/.+\./, ".");
    cb(null, file.fieldname + "-" + Date.now() + suffix);
  },
});
const upload = multer({ storage: storage });

// 导出函数
module.exports = function (app) {
  app.post("/profile", upload.single("file"), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    let imgUrl = `${config.imgHost}/photo/${req.file.filename}`;
    res.send({
      code: 200,
      message: "上传成功!",
      imgUrl,
    });
  });
};
