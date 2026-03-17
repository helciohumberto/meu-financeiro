const { app, BrowserWindow } = require("electron");
const { spawn, execFile } = require("child_process");
let backendProcess;

function killPort(callback) {
  execFile("cmd.exe", ["/c", "app/kill-port-3001.cmd"], { cwd: __dirname + "/.." }, () => {
    callback();
  });
}

function startBackend() {
  backendProcess = spawn("node", ["backend/src/server.js"], {
    cwd: __dirname + "/..",
    shell: true
  });

  backendProcess.stdout.on("data", data => {
    console.log(`Backend: ${data}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: __dirname + "/preload.js"
    }
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  killPort(() => {
    startBackend();
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  app.quit();
});