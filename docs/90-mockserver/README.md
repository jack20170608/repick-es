# MockServer

本地 Mock HTTP 服务的 Docker 工具，用于模拟 API、测试驱动开发和故障注入。

## 快速开始

### 启动服务

```bash
docker run -d -p 12580:1080 mockserver/mockserver
```

访问地址：`http://localhost:12580`

### Docker Desktop 管理

在 Docker Desktop 界面中可以：
- 查看容器状态
- 查看日志：点击容器 → Logs
- 停止/重启：点击容器 → Stop / Start
- 进入容器：点击容器 → CLI

## 常用命令

### 基础操作

```bash
# 创建 GET 请求期望
curl -X PUT "http://localhost:12580/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "GET", "path": "/api/user"},
    "httpResponse": {
      "statusCode": 200,
      "body": "{\"id\": 1, \"name\": \"张三\"}",
      "headers": {"Content-Type": ["application/json"]}
    }
  }'
```

```bash
# 创建 POST 请求期望
curl -X PUT "http://localhost:12580/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "POST", "path": "/api/login", "body": {"username": "admin"}},
    "httpResponse": {
      "statusCode": 200,
      "body": "{\"token\": \"abc123\"}",
      "headers": {"Content-Type": ["application/json"]}
    }
  }'
```

```bash
# 查询请求历史
curl -X PUT "http://localhost:12580/mockserver/retrieve" \
  -H "Content-Type: application/json" \
  -d '{"type": "ALL"}'
```

```bash
# 验证请求是否发送
curl -X PUT "http://localhost:12580/mockserver/verify" \
  -H "Content-Type: application/json" \
  -d '{"httpRequest": {"method": "GET", "path": "/api/user"}}'
```

```bash
# 清空所有期望和记录
curl -X PUT "http://localhost:12580/mockserver/reset"
```

### 模拟各种场景

```bash
# 模拟延迟响应（3秒）
curl -X PUT "http://localhost:12580/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "GET", "path": "/api/slow"},
    "httpResponse": {"statusCode": 200, "body": "{\"message\": \"ok\"}", "delay": {"timeUnit": "MILLISECONDS", "value": 3000}}
  }'
```

```bash
# 模拟 500 错误
curl -X PUT "http://localhost:12580/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "GET", "path": "/api/error"},
    "httpResponse": {"statusCode": 500, "body": "{\"error\": \"Internal Error\"}"}
  }'
```

```bash
# 模拟 404
curl -X PUT "http://localhost:12580/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "GET", "path": "/api/notfound"},
    "httpResponse": {"statusCode": 404, "body": "{\"error\": \"Not Found\"}"}
  }'
```

## Port

| 服务 | 端口 |
|------|------|
| MockServer HTTP API | 12580 |

## 详细文档

- [详细介绍](01-introduction.md) - 完整功能说明和使用示例