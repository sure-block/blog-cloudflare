# 部署手册（Cloudflare 纯托管）

本项目仅使用 Cloudflare 一个平台：Workers 运行时 + D1（SQLite）+ R2（文件）+ KV（缓存）+ Queues + Workflows + Durable Objects。不依赖 Vercel/Netlify/外部数据库。

## 一、准备

1. 注册 Cloudflare 账号：https://dash.cloudflare.com/signup
2. 安装 Node.js 20+ 和 bun
3. 克隆仓库：
   ```bash
   git clone https://github.com/sure-block/blog-cloudflare.git
   cd blog-cloudflare
   bun install
   ```
4. 登录 wrangler：
   ```bash
   bunx wrangler login
   ```

## 二、创建 Cloudflare 资源

逐项执行，把输出的 ID 记下来，后面填进 `wrangler.jsonc`。

### 1. D1 数据库
```bash
bunx wrangler d1 create sure-blog-db
```
输出里的 `database_id` 填到 `wrangler.jsonc` 的 `d1_databases[0].database_id`。

### 2. R2 Bucket（图片/附件/EPUB/音频）
```bash
bunx wrangler r2 bucket create sure-blog-media
```
bucket 名 `sure-blog-media` 填到 `wrangler.jsonc` 的 `r2_buckets[0].bucket_name`。

### 3. KV Namespace（两个）
```bash
bunx wrangler kv namespace create KV
bunx wrangler kv namespace create OAUTH_KV
```
两个 `id` 分别填到 `wrangler.jsonc` 的 `kv_namespaces[0].id` 和 `kv_namespaces[1].id`。

### 4. Queue
```bash
bunx wrangler queues create blog-queue
```

## 三、修改 wrangler.jsonc

打开 `wrangler.jsonc`，替换以下占位符：

| 占位符 | 替换为 |
|---|---|
| `D1_DATABASE_ID` | 第二步 1 的 database_id |
| `bucket-name-placeholder` | `sure-blog-media` |
| `KV_NAMESPACE_ID`（两处） | 第二步 3 的两个 KV id |
| `DOMAIN_PLACEHOLDER` | 你的域名，比如 `blog.example.com`（用 workers.dev 默认域名可先留空 routes 整段） |

## 四、跑数据库迁移

```bash
bunx wrangler d1 migrations apply sure-blog-db --remote
```
会执行 `migrations/` 下所有 SQL，包括我们新加的 `0011_petite_whizzer.sql`（17 张新表 + 11 个 ALTER）。

## 五、设置 Secrets

```bash
bunx wrangler secret put AUTH_SECRET
# 粘贴一串随机长字符串（可用 `openssl rand -hex 32` 生成）

# 可选：Resend 邮件 API（如需邮件验证/通知）
bunx wrangler secret put RESEND_API_KEY
```

## 六、本地预览

```bash
bun run dev
```
（需要 Cloudflare 登录态。）

## 七、生产部署

```bash
bun run build
bunx wrangler deploy
```

部署成功后会输出一个 `*.workers.dev` 域名。

## 八、初始化管理员

打开部署后的域名，访问 `/register` 注册第一个账号。代码里已配置：**第一个注册的用户自动成为 admin**。之后访问 `/admin` 进入后台。

## 九、后续配置

- **站点标题/描述/社交链接**：后台 → 系统设置
- **导航菜单**：后台 → 系统设置 → 导航
- **音乐**：后台 → 音乐管理，添加网易云链接或本地 R2 URL
- **相册**：后台 → 相册管理，上传照片到 R2
- **域名**：Cloudflare Dashboard → Workers & Pages → 你的 Worker → Settings → Domains & Routes，绑定自定义域名（需要域名已托管在 Cloudflare）

## 十、常见问题

- **构建 OOM**：`NODE_OPTIONS="--max-old-space-size=4096" bun run build`
- **本地跑不起来**：`wrangler dev` 需要登录 Cloudflare 账号，或者用 `bun run build && wrangler deploy` 直接部署到线上看效果
- **工具箱/星港 404**：这些是懒加载 chunk，首次打开稍慢，等几秒
- **第三方 API 跨域**：一言/毒鸡汤/热榜/天气等 API 都是浏览器直连，已开 CORS，无需代理

## 回滚

```bash
bunx wrangler rollback
```
