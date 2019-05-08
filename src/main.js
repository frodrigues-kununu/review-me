import { LitElement, html } from 'lit-element';
import './login.js';

class Main extends LitElement {

    render() {
        return html`
            <login-element></login-element>
            <p>today</p>
        `;
    }
}
customElements.define('main-element', Main);