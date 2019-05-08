// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Tray } = require('electron');
require('dotenv').config();
const fs = require('fs');
const express = require('express');
const expressApp = express();
const axios = require('axios');

ipcMain.on('user-clicked-auth-button', (event, arg) => {
  // do stuff
  startServer();
});

ipcMain.on('pending-reviews-update', (event, arg) => {
  tray.setTitle(arg);
});


// send access-token-retrieved

// send redirect-after-auth

// receive token-expired

// receive user-clicked-auth-button

// receive pending-reviews-update

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let trayWindow;
let tray;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // preload: "preload.js",
      backgroundThrottling: false
    },
    show: true
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
  })

  mainWindow.loadFile('./index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createTray();
  createTrayWindow();
  createWindow();

  const token = readToken();

  if(token){
    messageRendererProcesses('access-token-retrieved', accessToken);
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

function createTray() {
  // tray = new Tray(path.join(assetsDirectory, 'sunTemplate.png'))
  tray = new Tray('assets/trayicon.png')
  tray.setTitle('');
  tray.on('right-click', toggleTrayWindow)
  tray.on('double-click', toggleTrayWindow)
  tray.on('click', function (event) {
    toggleTrayWindow();
  })
}

function createTrayWindow() {
  trayWindow = new BrowserWindow({
    width: 480,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      // preload: "preload.js",
      backgroundThrottling: false
    }
  })
  trayWindow.loadFile('./index.html')
}

const getWindowPosition = () => {
  const windowBounds = trayWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

function toggleTrayWindow() {
  if (
    trayWindow.isVisible()) {
    trayWindow.hide()
  } else {
    showWindow()
  }
}

function showWindow() {
  const position = getWindowPosition()
  trayWindow.setPosition(position.x, position.y, false);
  trayWindow.show();
  trayWindow.focus();
}

function startServer() {
  expressApp.get('/pendingReviews', function (req, res) {
    const code = req.query.code;

    axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      accept: 'json',
    }).then(res => {
      const params = res.data.split('&');
      const accessToken = params[0].substr(13);

      saveToken(accessToken);
      messageRendererProcesses('access-token-retrieved', accessToken);
      expressApp.close();
    }).catch(error => {
      console.error("Request error");
    });
  });

  expressApp.listen(3000, function () {
    console.log("Server started");
    var githubUrl = `https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${process.env.CLIENT_ID}`;
    mainWindow.loadURL(githubUrl);
  });
}

function saveToken(token) {
  fs.writeFile("/tmp/data", token, (err) => {
    if (err) {
      return console.log(err);
    }
  });
}

function readToken() {
   fs.readFile("/tmp/data", "utf8", (err, content) => {
    if (!err) {
      console.log("Read file: ", content);
      return content;
    } else {
      return false;
    }
  });
}

function messageRendererProcesses(channel, message) {
  mainWindow.webContents.send(channel, message);
  trayWindow.webContents.send(channel, message);
}