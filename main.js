// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
require('dotenv').config();

const express = require('express');
const expressApp = express();
const axios = require('axios');

ipcMain.on('user-clicked-auth-button', (event, arg) => {
  // do stuff
  startServer();
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
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
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

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

      console.log("accessToken ", accessToken);

      mainWindow.webContents.send('access-token-retrieved', accessToken);
    }).catch(error => {
      console.error("Request error");
    });
  });

  expressApp.listen(3000, function () {
    console.log("Server started");
    var githubUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.CLIENT_ID}`;
    mainWindow.loadURL(githubUrl);
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.