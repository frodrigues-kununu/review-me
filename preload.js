const { ipcRenderer } = require('electron');

init();

function init() {
  window.accessToken = '';

  ipcRenderer.on('access-token-retrieved', (event, arg) => {

    window.accessToken = arg;

    // do stuff
    console.log("token :", arg);
    // this.token = arg;
  });
}

function handleUserClickedAuthButton () {
  ipcRenderer.send('user-clicked-auth-button');
}