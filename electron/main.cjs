const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "SEWAC Admin Dashboard",
    icon: path.join(__dirname, "../build/sewac-helper.ico"),
    autoHideMenuBar: true,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(
    path.join(__dirname, "../dist/index.html")
  );
}

app.whenReady().then(() => {
  createWindow();
});