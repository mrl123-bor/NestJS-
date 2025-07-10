# ----------- Builder stage ------------
# 使用 Node.js 18 版本的 bullseye 镜像作为构建的基础镜像
FROM node:18-bullseye AS builder

# 设置工作目录为 /app
WORKDIR /app

# 将 package.json 和 package-lock.json 文件复制到容器中
COPY package*.json ./

# 更新包列表并安装必要的系统依赖
# 这些依赖是编译某些 npm 包（如 sqlite3）所必需的
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    # 安装项目的所有依赖
    npm install --verbose && \
    # 重新构建 sqlite3 包以确保从源码编译
    npm rebuild sqlite3 --build-from-source --verbose && \
    # 移除不再需要的系统依赖以减小镜像大小
    apt-get remove -y python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 将整个项目的代码复制到容器中
COPY . .

# ----------- Production stage ------------
# 再次使用 Node.js 18 版本的 bullseye 镜像作为生产环境的基础镜像
FROM node:18-bullseye

# 设置工作目录为 /app
WORKDIR /app

# 从构建阶段复制所需的文件和目录到生产镜像中
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/conf.yml ./conf.yml
COPY --from=builder /app/Vue ./Vue

# 复制 package.json 和 package-lock.json 文件
COPY package*.json ./

# 暴露应用程序运行的端口 8030
EXPOSE 8030

# 使用 npm run start:prod 启动应用程序
CMD ["npm", "run", "start:prod"]
