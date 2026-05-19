# Flood for Transmission 中文版

![Flood logo](flood.png)

基于 [Flood for Transmission](https://github.com/johman10/flood-for-transmission) 独立维护的中文 Web 界面，用于 [Transmission](https://transmissionbt.com/)。纯前端部署，无需额外守护进程；通过设置 `TRANSMISSION_WEB_HOME` 即可替换 Transmission 自带界面。

界面设计溯源自 [Flood](https://github.com/Flood-UI/flood)（rTorrent）；Transmission 适配代码由上游从零实现，本仓库在其基础上完成中文化与 UI 优化。

**本仓库与上游 [johman10/flood-for-transmission](https://github.com/johman10/flood-for-transmission) 无同步关系，Issue 与 Release 以本仓库为准。**

## 与上游的差异

- 完整中文界面与文案
- Catppuccin Mocha 主题与统一控件样式
- 侧栏筛选、限速、种子详情、右键菜单等交互优化
- 开发环境内置 RPC 代理（`npm start`）

## 截图

参见 [screenshots](screenshots#readme)。

![主界面](screenshots/Main.png)

## 环境要求

1. 已安装并运行 [Transmission](https://transmissionbt.com/)（Linux 可使用 `transmission-daemon`）。
2. 建议使用 Chromium、Firefox、Edge 等现代浏览器。

## 安装

### 从 Release 安装（推荐）

1. 在本仓库 [Releases](https://github.com/Nanako718/flood-for-transmission/releases) 下载 `flood-for-transmission.zip` 或 `.tar.gz`。
2. 解压到目标目录，例如 `/opt/flood-for-transmission`。
3. 配置 Transmission 使用该目录为 Web 根目录：

**Linux（systemd）**

```ini
[Service]
Environment=TRANSMISSION_WEB_HOME=/path/to/flood-for-transmission
```

执行 `systemctl edit transmission-daemon.service` 写入上述内容后重启服务。

**Windows**

新建系统环境变量 `TRANSMISSION_WEB_HOME`，值为解压路径（例如 `C:\flood-for-transmission`）。

**macOS**

可将解压内容替换 `Transmission.app` 内 `Contents/Resources/public_html`（更新 Transmission 后可能需重新操作）。亦可查阅上游文档尝试环境变量方式。

4. 重启 Transmission，浏览器访问默认地址（一般为 `http://localhost:9091`）。

### 从源码构建

```bash
git clone https://github.com/Nanako718/flood-for-transmission.git
cd flood-for-transmission
npm install
npm run build
```

将 `public` 目录内容作为 `TRANSMISSION_WEB_HOME` 指向的路径（构建产物在 `public/` 内，含 `build/`）。

## 本地开发

```bash
npm install
cp .env.template .env   # 填写 Transmission RPC 地址与认证
npm start              # 默认 http://localhost:8080，并代理 RPC
```

若 Transmission 在其它机器且经 Nginx 反代，需在反代中配置 CORS，参见下文「Nginx CORS」。

## 配置

用户界面默认项可在 `public/config.json` 中覆盖，首次可复制：

```bash
cp public/config.json.defaults public/config.json
```

字段说明见 `config.json.defaults` 内注释。

## 更新

1. 备份现有 `config.json`（若有自定义）。
2. 删除旧目录，下载本仓库最新 Release 并解压，或重新 `git pull` 后 `npm run build`。
3. 恢复 `config.json`，重启 Transmission。

## 独立维护说明

若你是从上游 fork 而来，且**不希望**向原仓库推送或拉取同步，可移除 `upstream` 远程（仅需执行一次）：

```bash
git remote remove upstream
```

确认 `origin` 指向你自己的仓库：

```bash
git remote -v
# origin  https://github.com/<你的用户名>/flood-for-transmission.git
```

之后在 `origin` 上正常 push 即可，不会自动同步到 johman10 的仓库。

## Nginx CORS

跨机开发时，可在 Transmission 的 Nginx `location` 中加入（将来源改为你的开发地址）：

```nginx
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:8080';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Authorization,X-Transmission-Session-Id,DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Max-Age' 1728000;
    add_header 'Content-Type' 'text/plain; charset=utf-8';
    add_header 'Content-Length' 0;
    return 204;
}
if ($request_method = 'POST') {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:8080' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Authorization,X-Transmission-Session-Id,DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range,X-Transmission-Session-Id' always;
}
```

## 许可证

本项目遵循 [GNU GPL v3](LICENSE)。上游与 Flood 项目亦有其各自许可证，使用与再分发时请一并遵守。

## 致谢

- [Flood for Transmission](https://github.com/johman10/flood-for-transmission)（johman10）
- [Flood](https://github.com/Flood-UI/flood)（界面设计）
- [Transmission](https://transmissionbt.com/)
