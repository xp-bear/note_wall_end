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

// 创建数据库
let wall_sql = `create database if not exists wall default charset utf8 collate utf8_general_ci;`;

let createDatabase = (sql) => {
  return bdbs(sql, []);
};

// 创建数据表
// 留言/照片sql
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

//留言反馈sql
let feedbacks_sql = `create table if not exists feedbacks(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言墙id',
  userId VARCHAR(1000) COMMENT '反馈者id',
  type INT NOT NULL COMMENT '反馈类型 0喜欢 1举报 2撤销',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY KEY(id)
)`;

// 留言评论sql
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

// 开始创建表
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

