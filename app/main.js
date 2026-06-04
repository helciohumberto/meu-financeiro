const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn, execFile } = require("child_process");
const path = require("path");

let backendProcess;

function killPort(callback) {
  execFile(
    "cmd.exe",
    ["/c", "app/kill-port-3001.cmd"],
    { cwd: path.join(__dirname, "..") },
    () => callback()
  );
}

function startBackend() {
  backendProcess = spawn("node", ["backend/src/server.js"], {
    cwd: path.join(__dirname, ".."),
    stdio: ["ignore", "pipe", "pipe"], // captura stdout e stderr
  });

  backendProcess.stdout.on("data", data => {
    console.log(`Backend: ${data.toString()}`);
  });

  backendProcess.stderr.on("data", data => {
    console.error(`Backend ERROR: ${data.toString()}`);
  });

  backendProcess.on("exit", code => {
    console.log(`Backend finalizado com código ${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadURL("http://localhost:5173");

  ipcMain.on("window:minimize", () => win.minimize());
  ipcMain.on("window:maximize", () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  ipcMain.on("window:close", () => win.close());
}

app.whenReady().then(() => {
  killPort(() => {
    startBackend();
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill("SIGTERM");
  }
  app.quit();
});
