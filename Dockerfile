# 使用 Node.js 基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 暴露应用端口，这里使用 conf.yml 里的端口或默认 3000
EXPOSE 8030 3000

# 启动应用
CMD ["npm", "run", "start:prod"]
