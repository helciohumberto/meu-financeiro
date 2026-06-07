const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn, execFile } = require("child_process");
const path = require("path");

const isDev = !app.isPackaged;

let backendProcess;

/* ============================================================
   DESENVOLVIMENTO
   Mata a porta 3001 e sobe o backend como processo separado,
   carregando o frontend a partir do dev server do Vite.
   ============================================================ */
function killPort(callback) {
  execFile(
    "cmd.exe",
    ["/c", "app/kill-port-3001.cmd"],
    { cwd: path.join(__dirname, "..") },
    () => callback()
  );
}

function startBackendDev() {
  backendProcess = spawn("node", ["backend/src/server.js"], {
    cwd: path.join(__dirname, ".."),
    stdio: ["ignore", "pipe", "pipe"],
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data.toString()}`);
  });
  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend ERROR: ${data.toString()}`);
  });
  backendProcess.on("exit", (code) => {
    console.log(`Backend finalizado com código ${code}`);
  });
}

function startBackendProd() {
  const serverPath = path.join(
    process.resourcesPath,
    "backend",
    "src",
    "server.js"
  );
  // eslint-disable-next-line import/no-dynamic-require, global-require
  require(serverPath).start();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(process.resourcesPath, "frontend", "index.html"));
  }

  ipcMain.on("window:minimize", () => win.minimize());
  ipcMain.on("window:maximize", () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  ipcMain.on("window:close", () => win.close());
}

app.whenReady().then(() => {
  if (isDev) {
    killPort(() => {
      startBackendDev();
      createWindow();
    });
  } else {
    startBackendProd();
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill("SIGTERM");
  }
  app.quit();
});
