import { LitElement, html } from 'lit-element';
import './login.js';
import './reviews.js';

class Main extends LitElement {

    render() {
        if (false) {
            return html`
                <login-element></login-element>
            `;
        }
        return html`
            <reviews-element></reviews-element>
        `;
    }
}
customElements.define('main-element', Main);