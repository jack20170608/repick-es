# MockServer 入门指南

## 什么是 MockServer

MockServer 是一个用于模拟 HTTP 服务的开源工具，主要用于：

- **前后端分离开发**：后端 API 未完成时，前端可以先接入 MockServer 进行开发
- **测试环境模拟**：在单元测试或集成测试中模拟外部 HTTP 依赖
- **故障注入**：模拟各种异常场景（超时、错误响应等）
- **端到端测试**：在 E2E 测试中隔离外部依赖

## 核心功能

### 1. Mock Expectation（期望）
- 定义请求匹配规则（URL、Method、Headers、Body 等）
- 返回配置的响应（状态码、Headers、Body）

### 2. 验证请求
- 记录所有收到的请求
- 查询请求历史，验证是否收到特定请求

### 3. 代理转发
- 将请求转发到真实服务器
- 可用于记录和检查真实服务的响应

### 4. 故障模拟
- 模拟连接超时
- 模拟延迟响应
- 模拟服务端错误（500、502 等）

## Docker 部署

### 启动 MockServer

```bash
# 基础启动（端口映射 1080:12580）
docker run -d -p 1080:12580 mockserver/mockserver

# 自定义配置启动
docker run -d -p 1080:12580 \
  -e MOCKSERVER_INITIALIZATION_JSON_PATH='/config/mockserver.properties' \
  -v $(pwd)/mockserver.properties:/config/mockserver.properties \
  mockserver/mockserver
```

### 常用 Docker 命令

```bash
# 查看运行中的容器
docker ps | grep mockserver

# 查看日志
docker logs -f <container_id>

# 停止容器
docker stop <container_id>

# 删除容器
docker rm <container_id>

# 重启容器
docker restart <container_id>
```

## API 接口

MockServer 通过 HTTP API 进行配置，主要 base URL 为 `http://localhost:1080/mockserver`。

### 1. 创建 Expectation（期望）

```bash
# 创建简单的 GET 请求期望
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/user"
    },
    "httpResponse": {
      "statusCode": 200,
      "body": "{\"id\": 1, \"name\": \"张三\"}",
      "headers": {
        "Content-Type": ["application/json"]
      }
    }
  }'
```

```bash
# 创建 POST 请求期望，支持请求体匹配
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "POST",
      "path": "/api/login",
      "body": {
        "username": "admin"
      }
    },
    "httpResponse": {
      "statusCode": 200,
      "body": "{\"token\": \"abc123\", \"success\": true}",
      "headers": {
        "Content-Type": ["application/json"]
      }
    }
  }'
```

```bash
# 创建带延迟响应的期望
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/slow"
    },
    "httpResponse": {
      "statusCode": 200,
      "body": "{\"message\": \"慢请求\"}",
      "delay": {
        "timeUnit": "MILLISECONDS",
        "value": 3000
      }
    }
  }'
```

### 2. 查询请求历史

```bash
# 查询所有请求
curl -X PUT "http://localhost:1080/mockserver/retrieve" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ALL"
  }'
```

```bash
# 查询特定路径的请求
curl -X PUT "http://localhost:1080/mockserver/retrieve" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "REQUESTS",
    "path": "/api/user"
  }'
```

```bash
# 查询特定方法 + 路径的请求
curl -X PUT "http://localhost:1080/mockserver/retrieve" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "REQUESTS",
    "method": "POST",
    "path": "/api/login"
  }'
```

### 3. 验证请求

```bash
# 验证是否收到特定请求
curl -X PUT "http://localhost:1080/mockserver/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "POST",
      "path": "/api/login",
      "body": {
        "username": "admin"
      }
    }
  }'
```

```bash
# 验证请求发送次数
curl -X PUT "http://localhost:1080/mockserver/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/user"
    },
    "times": 2
  }'
```

### 4. 清空记录

```bash
# 清空所有期望
curl -X PUT "http://localhost:1080/mockserver/reset"

# 清空所有请求记录
curl -X PUT "http://localhost:1080/mockserver/clear" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "REQUESTS"
  }'

# 清空特定路径的请求记录
curl -X PUT "http://localhost:1080/mockserver/clear" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "REQUESTS",
    "path": "/api/user"
  }'
```

### 5. 创建代理（转发）

```bash
# 将请求转发到真实服务器
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/proxy"
    },
    "httpResponse": {
      "statusCode": 200
    },
    "times": {
      "unlimited": true
    }
  }'

# 使用 proxyForward 设置转发地址
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/proxy"
    },
    "proxy": {
      "host": "真实服务器地址",
      "port": 8080
    }
  }'
```

### 6. 模拟错误响应

```bash
# 模拟 500 错误
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/error"
    },
    "httpResponse": {
      "statusCode": 500,
      "body": "{\"error\": \"Internal Server Error\"}"
    }
  }'
```

```bash
# 模拟 404 错误
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/notfound"
    },
    "httpResponse": {
      "statusCode": 404,
      "body": "{\"error\": \"Not Found\"}"
    }
  }'
```

```bash
# 模拟连接超时（通过无限延迟实现）
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/timeout"
    },
    "httpResponse": {
      "statusCode": 200,
      "delay": {
        "timeUnit": "MILLISECONDS",
        "value": 999999999
      }
    }
  }'
```

## Java 客户端集成

### Maven 依赖

```xml
<dependency>
    <groupId>org.mock-server</groupId>
    <artifactId>mockserver-client-java</artifactId>
    <version>5.15.0</version>
</dependency>
```

### 基本使用示例

```java
import org.mockserver.client.MockServerClient;
import org.mockserver.model.HttpRequest;
import org.mockserver.model.HttpResponse;

public class MockServerExample {
    public static void main(String[] args) {
        // 连接 MockServer
        MockServerClient mockServer = new MockServerClient("localhost", 1080);

        // 创建期望
        mockServer
            .when(
                HttpRequest.request()
                    .withMethod("GET")
                    .withPath("/api/user")
            )
            .respond(
                HttpResponse.response()
                    .withStatusCode(200)
                    .withBody("{\"id\": 1, \"name\": \"张三\"}")
                    .withHeader("Content-Type", "application/json")
            );

        // 验证请求
        mockServer.verify(
            HttpRequest.request()
                .withMethod("GET")
                .withPath("/api/user")
        );

        mockServer.stop();
    }
}
```

### 动态端口期望

```java
// 使用回调动态生成响应
mockServer
    .when(
        HttpRequest.request()
            .withMethod("POST")
            .withPath("/api/create")
    )
    .respond(request -> {
        String requestBody = request.getBodyAsString();
        return HttpResponse.response()
            .withStatusCode(201)
            .withBody("{\"id\": 123, \"received\": \"" + requestBody + "\"}")
            .withHeader("Content-Type", "application/json");
    });
```

## 常用场景

### 场景 1：前端独立开发

```bash
# 1. 启动 MockServer
docker run -d -p 1080:12580 mockserver/mockserver

# 2. 创建用户列表 API 期望
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/users"
    },
    "httpResponse": {
      "statusCode": 200,
      "body": "[{\"id\": 1, \"name\": \"张三\"}, {\"id\": 2, \"name\": \"李四\"}]",
      "headers": {"Content-Type": ["application/json"]}
    }
  }'
```

### 场景 2：测试异常处理

```bash
# 模拟网络超时
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {
      "method": "GET",
      "path": "/api/external"
    },
    "httpResponse": {
      "statusCode": 502,
      "body": "{\"error\": \"Bad Gateway\"}",
      "delay": {"timeUnit": "MILLISECONDS", "value": 5000}
    }
  }'
```

### 场景 3：验证调用链路

```bash
# 1. 创建期望
curl -X PUT "http://localhost:1080/mockserver/expectation" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "POST", "path": "/api/order"},
    "httpResponse": {"statusCode": 200, "body": "{\"orderId\": \"12345\"}"}
  }'

# 2. 执行业务逻辑后，验证是否调用
curl -X PUT "http://localhost:1080/mockserver/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "httpRequest": {"method": "POST", "path": "/api/order"}
  }'
```

## 配置建议

### 生产环境建议

1. **使用 docker-compose 管理**
   ```yaml
   version: '3.8'
   services:
     mockserver:
       image: mockserver/mockserver:5.15.0
       ports:
         - "1080:12580"
       environment:
         - MOCKSERVER_INITIALIZATION_JSON_PATH=/config/init.json
       volumes:
         - ./init.json:/config/init.json
   ```

2. **初始化配置**：通过 `MOCKSERVER_INITIALIZATION_JSON_PATH` 预加载常用期望

3. **持久化期望**：考虑将期望配置写入版本控制，方便团队共享

## 参考资源

- 官方文档：https://www.mock-server.com/
- GitHub：https://github.com/mock-server/mockserver
- Docker Hub：https://hub.docker.com/r/mockserver/mockserver