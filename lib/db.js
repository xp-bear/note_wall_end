// 数据库操作
const mysql = require("mysql");
const config = require("../config/default");

// 链接mysql数据库,进行创建数据库的操作
const db = mysql.createConnection({
  host: config.database.HOST,
  user: config.database.USER,
  password: config.database.PASSWORD,
});

//链接指定数据库
const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USER,
  password: config.database.PASSWORD,
  database: config.database.DBS, //数据库链接
});

// 使用promise封装查询数据库的操作
let bdbs = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 使用promise封装查询数据库的操作
let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
          connection.release(); //释放该链接，把该链接放回池里供其他人使用
        });
      }
    });
  });
};

// 创建数据库 wall 数据库
let wall_sql = `create database if not exists wall default charset utf8 collate utf8_general_ci;`;
// 创建数据库
let createDatabase = (sql) => {
  return bdbs(sql, []);
};

// 创建数据表
// 留言/照片表
let walls_sql = `create table if not exists walls(
  id INT NOT NULL AUTO_INCREMENT,
  type INT NOT NULL COMMENT '类型 0留言 1相片',
  message VARCHAR(1000) COMMENT '留言',
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  userId VARCHAR(100) NOT NULL COMMENT '创建者id',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  label INT NOT NULL  COMMENT '标签',
  color INT COMMENT '颜色',
  imgUrl VARCHAR(100) COMMENT '图片路径',
  PRIMARY KEY(id)
)`;

//留言反馈表
let feedbacks_sql = `create table if not exists feedbacks(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言墙id',
  userId VARCHAR(1000) COMMENT '反馈者id',
  type INT NOT NULL COMMENT '反馈类型 0喜欢 1举报 2撤销',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY KEY(id)
)`;

// 留言评论表
let comments_sql = `create table if not exists comments(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言墙id',
  userId VARCHAR(1000) NOT NULL COMMENT '评论者id',
  imgUrl VARCHAR(100) COMMENT '头像路径',
  comment VARCHAR(1000)  COMMENT '评论内容',
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY KEY(id)
)`;

// 创建表
let createTable = (sql) => {
  return query(sql, []);
};

//先创建数据库再创建表
async function create() {
  await createDatabase(wall_sql);

  await createTable(walls_sql);
  await createTable(feedbacks_sql);
  await createTable(comments_sql);
}
create();

// 新建留言sql语句
exports.insertWall = (value) => {
  let _sql = `insert into walls set type=?,message=?,name=?,userId=?,moment=?,label=?,color=?,imgUrl=?;`;
  return query(_sql, value);
};

// 新建反馈sql语句
exports.insertFeedBack = (value) => {
  let _sql = `insert into feedbacks set wallId=?,userId=?,type=?,moment=?;`;
  return query(_sql, value);
};

// 新建评论sql语句
exports.insertComment = (value) => {
  let _sql = `insert into comments set wallId=?,userId=?,imgUrl=?,comment=?,name=?,moment=?;`;
  return query(_sql, value);
};

//删除墙留言，主表对应多条子表一起删除
exports.deleteWall = (id) => {
  let _sql = `delete a,b,c from walls a left join feedbacks b on a.id=b.wallId left join comments c on a.id=c.wallId where a.id="${id}";`;
  return query(_sql);
};
//删除反馈
exports.deleteFeedBack = (id) => {
  let _sql = `delete from feedbacks where id="${id}";`;
  return query(_sql);
};
// 删除评论
exports.deleteComment = (id) => {
  let _sql = `delete from comments where id="${id}";`;
  return query(_sql);
};

// 查询分页留言墙 type 0 留言 1 相片
exports.findWallPage = (page, pageSize, type, label) => {
  let _sql = null;
  if (label == -1) {
    _sql = `select * from walls where type="${type}" order by id desc limit ${(page - 1) * pageSize},${pageSize};`;
  } else {
    //当有标签时查阅标签
    _sql = `select * from walls where type="${type}" and label="${label}" order by id desc limit ${(page - 1) * pageSize},${pageSize};`;
  }
  return query(_sql);
};
//查询倒叙分页查墙的评论
exports.findCommentPage = (page, pageSize, id) => {
  let _sql = `select * from comments where wallId="${id}" order by id desc limit ${(page - 1) * pageSize},${pageSize};`;
  return query(_sql);
};
//查询各反馈总数据
exports.feedbackCount = (wid, type) => {
  let _sql = `select count(*) as count from feedbacks where wallId="${wid}" and type="${type}";`;
  return query(_sql);
};
//查询评论总数
exports.commentCount = (wid) => {
  let _sql = `select count(*) as count from comments where wallId="${wid}";`;
  return query(_sql);
};
// 查询用户是否点赞
exports.likeCount = (wid, uid) => {
  let _sql = `select count(*) as count from feedbacks where wallId="${wid}" and userId="${uid}" and type=0;`;
  return query(_sql);
};
