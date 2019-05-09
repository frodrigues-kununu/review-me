import { LitElement, html } from 'lit-element';
const { ipcRenderer } = require('electron');

import './login.js';
import './reviews.js';
import './loading';

class Main extends LitElement {

    static get properties() {
        return {
            accessToken: String,
            loaded: Boolean,
        };
    }

    constructor() {
        super();
        this.accessToken = '';
        this.loaded = false;
        ipcRenderer.on('access-token-retrieved', (event, arg) => {
            this.loaded = true;
            this.accessToken = arg;
        });

        ipcRenderer.on('access-token-expired', (event, arg) => {
          this.accessToken = '';
      });
    }

    connectedCallback(){
      super.connectedCallback();
      ipcRenderer.send('main-renderer-ready');
    }

    render() {
      if (!this.loaded) {
        return html`<loading-element></loading-element>`;
      }

      if (!this.accessToken) {
            return html`
                <login-element></login-element>
            `;
        }

        return html`
            <reviews-element accessToken=${this.accessToken}></reviews-element>
        `;
    }
}
customElements.define('main-element', Main);