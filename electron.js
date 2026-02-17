import { app, BrowserWindow } from "electron";
import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  mainWindow.loadURL("http://localhost:3001");

  mainWindow.on("closed", () => {
    if (backendProcess) backendProcess.kill();
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const serverPath = path.join(__dirname, "server.js");

  backendProcess = fork(serverPath);

  setTimeout(createWindow, 2000);
});