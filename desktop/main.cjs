const { app, BrowserWindow, shell, dialog } = require('electron');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/delay-worklet.js', ['delay-worklet.js', 'text/javascript']]
]);
const externalURLs = new Set(['https://player.streamguys.com/ssc/whog/sgplayer/player.php']);
let server, window, origin;
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (window) { if (window.isMinimized()) window.restore(); window.show(); window.focus(); } });
  app.whenReady().then(async () => {
    server = http.createServer((req, res) => {
      // Only serve bundled files to this local app. Never proxy or expose the file system.
      if (req.headers.host !== new URL(origin).host) { res.writeHead(403).end(); return; }
      const asset = assets.get(req.url);
      if (!asset || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', asset[1]);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; worker-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; media-src https://ssc.streamguys1.com; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
      if (req.method === 'HEAD') res.end();
      else fs.createReadStream(path.join(__dirname, '..', 'dist', asset[0])).on('error', () => res.destroy()).pipe(res);
    });
    await new Promise((resolve, reject) => {
      const listen = port => {
        server.once('error', error => {
          if (error.code === 'EADDRINUSE' && port !== 0) listen(0); else reject(error);
        });
        server.listen(port, '127.0.0.1', () => { origin = `http://127.0.0.1:${server.address().port}`; resolve(); });
      };
      listen(47839);
    });
    window = new BrowserWindow({ width: 1100, height: 850, minWidth: 390, minHeight: 600, backgroundColor: '#091b20', autoHideMenuBar: true,
      webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, backgroundThrottling: false } });
    window.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    window.webContents.setWindowOpenHandler(({ url }) => { if (externalURLs.has(url)) shell.openExternal(url); return { action: 'deny' }; });
    window.webContents.on('will-navigate', (event, url) => { if (url !== `${origin}/`) event.preventDefault(); });
    await window.loadURL(`${origin}/`);
  }).catch(error => { dialog.showErrorBox('Jags Radio Sync could not start', error.message); app.quit(); });
  app.on('window-all-closed', () => app.quit());
  app.on('before-quit', () => server?.close());
}
