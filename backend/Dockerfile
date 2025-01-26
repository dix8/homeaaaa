# 使用 Node.js 16 作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads/avatars uploads/projects

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动命令
CMD npx prisma migrate deploy && npx prisma db seed && npm start 