import { LitElement, html } from 'lit-element';
import './login.js';

class Main extends LitElement {

    render() {
        return html`
            <login-element></login-element>
        `;
    }
}
customElements.define('main-element', Main);