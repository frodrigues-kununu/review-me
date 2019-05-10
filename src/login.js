import { LitElement, html, css } from 'lit-element';

const { ipcRenderer } = require('electron');

class Login extends LitElement {
  static get styles() {
    return css`
      :host {
        align-items: center;
        display: flex;
        flex-direction: column;
        height:100%;
        justify-content: center;
        padding:0 40px;
      }

      .logo {
        height: 300px;
        width: 300px;
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
      }
    `;
  };

  render() {
    return html`
      <img class="logo" src="./assets/icon.png" alt="icon.png" />
      <p class="loginDescription">Please sign in with your Github account to get started.</p>
      <button class="signInButton" @click=${this.requestUserAuth}>Sign in with Github</button>
      `;
  }
  requestUserAuth() {
    ipcRenderer.send('user-clicked-auth-button');
  }
}
customElements.define('login-element', Login);