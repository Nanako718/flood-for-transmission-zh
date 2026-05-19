/**
 * 开发静态服务 + 将 /rpc、/transmission/rpc 代理到 .env 中的 Transmission。
 * 无需 Nginx；用于未把 RPC 地址打进 bundle 或希望同源请求时。
 */
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sirv from 'sirv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

dotenv.config({ path: path.join(root, '.env') });

const transmissionHost = process.env.TRANSMISSION_HOST || 'localhost';
const transmissionPort = process.env.TRANSMISSION_PORT || '9091';
const transmissionSsl = process.env.TRANSMISSION_SSL === 'true';
const transmissionPath =
  process.env.TRANSMISSION_PATH || '/transmission/rpc';

const upstreamRpcUrl = new URL(
  transmissionPath.startsWith('/')
    ? transmissionPath
    : `/${transmissionPath}`,
  `${transmissionSsl ? 'https' : 'http'}://${transmissionHost}:${transmissionPort}`
);

const proxyPaths = new Set([
  '/rpc',
  '/transmission/rpc',
  upstreamRpcUrl.pathname,
]);

const staticFiles = sirv(path.join(root, 'public'), { dev: true });
const listenPort = Number(process.env.DEV_PORT || 8080);

function proxyToTransmission(req, res) {
  const client = upstreamRpcUrl.protocol === 'https:' ? https : http;
  const headers = { ...req.headers, host: upstreamRpcUrl.host };

  const proxyReq = client.request(
    {
      protocol: upstreamRpcUrl.protocol,
      hostname: upstreamRpcUrl.hostname,
      port: upstreamRpcUrl.port,
      path: upstreamRpcUrl.pathname + upstreamRpcUrl.search,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (error) => {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(
      `无法连接 Transmission（${upstreamRpcUrl.origin}${upstreamRpcUrl.pathname}）：${error.message}`
    );
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://127.0.0.1:${listenPort}`).pathname;

  if (proxyPaths.has(pathname)) {
    proxyToTransmission(req, res);
    return;
  }

  if (pathname === '/config.json') {
    const originalUrl = req.url;
    req.url = '/config.json.defaults';
    staticFiles(req, res, () => {
      req.url = originalUrl;
      if (!res.writableEnded) {
        res.statusCode = 404;
        res.end('Not found');
      }
    });
    return;
  }

  staticFiles(req, res, () => {
    res.statusCode = 404;
    res.end('Not found');
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(
      `[dev] 端口 ${listenPort} 已被占用，开发服务可能已在运行：http://localhost:${listenPort}`
    );
    process.exit(0);
  }
  console.error('[dev] 开发服务启动失败:', error);
  process.exit(1);
});

server.listen(listenPort, () => {
  console.log(`[dev] 界面: http://localhost:${listenPort}`);
  console.log(
    `[dev] RPC 代理: http://localhost:${listenPort}{/rpc|${upstreamRpcUrl.pathname}} → ${upstreamRpcUrl.href}`
  );
});
