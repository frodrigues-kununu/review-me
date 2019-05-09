import { LitElement, html } from 'lit-element';
const { ipcRenderer } = require('electron');

import './login.js';
import './reviews.js';

class Main extends LitElement {

    static get properties() {
        return {
            accessToken: '',
        };
    }

    constructor() {
        super();
        ipcRenderer.on('access-token-retrieved', (event, arg) => {
            this.accessToken = arg;

            console.log("in ", arg)
        });
    }

    connectedCallback(){
      super.connectedCallback();
      ipcRenderer.send('main-renderer-ready');
    }

    render() {
      console.log("render ", this.accessToken);
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