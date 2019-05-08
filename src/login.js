import { LitElement, html, css } from 'lit-element';
const { ipcRenderer } = require('electron');

ipcRenderer.on('access-token-retrieved', (event, arg) => {
  // do stuff
  console.log("token :", arg);
  // this.token = arg;
});


class Login extends LitElement {
  static get styles() {
    return css`
    .loginContainer{
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
    }

    .loginDescription {
      margin-bottom: 40px;
    }

    .signInButton {
      background-color: #28a745;
      background-image: linear-gradient(-180deg,#34d058,#28a745 90%);
      background-position: -1px -1px;
      background-repeat: repeat-x;
      background-size: 110% 110%;
      border-radius: 1px;
      border: 1px solid rgba(27,31,35,.2);
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      padding: 6px 12px;
    }`;
  };

  render() {
    return html`
      <div class="loginContainer">
        <p class="loginDescription">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</p>
        <button class="signInButton" @click=${this.requestUserAuth}>Sign in with Github</button>
      </div>
    `;
  }
  requestUserAuth() {
    ipcRenderer.send('user-clicked-auth-button');
  }
}
customElements.define('login-element', Login);