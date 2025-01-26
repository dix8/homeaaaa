# 开发指南

## 项目概述
个人作品集网站，分为三个主要部分：
1. 前端展示页面
2. 后端API服务
3. 管理后台

## 快速开始开发

### 前端开发 (localhost:3000)
```bash
cd frontend
npm run dev
```

关键文件：
- `pages/index.tsx`: 主页面，包含所有展示组件
- `components/`: 所有可复用组件
- `types/index.ts`: 所有类型定义

### 后端开发 (localhost:3001)
```bash
cd backend
npm run dev
```

关键文件：
- `src/index.ts`: 服务入口
- `prisma/schema.prisma`: 数据库模型

## 数据流向

1. 前端数据流：
```
页面请求 -> API调用 -> 展示组件 -> 页面渲染
```

2. 后端数据流：
```
API请求 -> 路由 -> 控制器 -> Prisma查询 -> MySQL
```

## 开发备忘

### 前端组件
1. ProfileSection
   - 展示个人基本信息
   - 临时数据在组件内
   - TODO: 连接后端API

2. SkillsSection
   - 按类别展示技能
   - 使用进度条显示熟练度
   - TODO: 添加动画效果

3. Header
   - 固定在顶部的导航栏
   - TODO: 添加响应式菜单

### 数据库表结构

1. Profile表
```sql
- id: 主键
- name: 姓名
- title: 职位
- bio: 简介
- avatar: 头像URL
```

2. Skills表
```sql
- id: 主键
- name: 技能名称
- category: 分类
- proficiency: 熟练度
```

### API接口

1. 个人信息
```
GET /api/profile
返回: Profile对象
```

2. 技能列表
```
GET /api/skills
返回: Skill[]
```

## 常见问题解决

1. 前端热更新失效
```bash
rm -rf .next
npm run dev
```

2. Prisma同步问题
```bash
npx prisma generate
npx prisma db push
```

## 下一步开发计划

1. 前端
- [ ] 添加项目展示组件
- [ ] 实现响应式设计
- [ ] 添加动画效果

2. 后端
- [ ] 实现文件上传
- [ ] 添加缓存层
- [ ] 完善错误处理

3. 管理后台
- [ ] 设计界面
- [ ] 实现认证
- [ ] 添加内容编辑功能

## 部署检查清单

- [ ] 环境变量配置
- [ ] 数据库迁移
- [ ] SSL证书
- [ ] 性能优化
- [ ] 安全检查

## 代码片段

### 前端API调用
```typescript
// utils/api.ts
const fetchProfile = async () => {
  const res = await fetch('/api/profile');
  return res.json();
};
```

### 后端中间件
```typescript
// middleware/auth.ts
const authMiddleware = (req, res, next) => {
  // TODO: 实现认证逻辑
};
```

## 注意事项

1. 本地开发
- 保持 Node.js 版本一致
- 使用 .env.local 存储敏感信息
- 提交前运行 lint 检查

2. 数据库
- 定期备份数据
- 添加新字段时更新类型定义
- 大型更改先在开发环境测试

3. 部署
- 使用 PM2 管理进程
- 配置 Nginx 反向代理
- 设置监控告警 