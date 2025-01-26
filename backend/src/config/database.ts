import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量中获取数据库配置
const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '123456',
  DB_NAME = 'personal_website'
} = process.env;

// 构建数据库URL
export const DATABASE_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// 导出数据库配置
export const dbConfig = {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
}; 