import { LitElement, html } from 'lit-element';
const { ipcRenderer } = require('electron');

import './login.js';
import './reviews.js';

class Main extends LitElement {

    static get properties() {
        return {
            isUserAuthenticated: false,
            accessToken: '',
        };
    }

    constructor() {
        super();
        ipcRenderer.on('access-token-retrieved', (event, arg) => {
            this.isUserAuthenticated = true;
            this.accessToken = arg;
        });

    }

    render() {
        if (!this.isUserAuthenticated) {
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