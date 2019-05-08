import { LitElement, html, css } from 'lit-element';
const { shell, ipcRenderer } = require('electron');

class Reviews extends LitElement {
  static get properties() {
    return {
      reviews: [],
      accessToken: String
    };
  }
  static get styles() {
    return css`
    `;
  };
  constructor() {
    super();
    this.reviews = [];
  }

  render() {
    return html`
      <h1>List of reviews</h1>
      <ul>
      ${this.reviews.map((item, index) =>
        html`
          <li @click=${() => this.navigateViaBrowser(item.html_url)}>
            ${item.title}
          </li>
        `)}
      </ul>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchUser();
  }

  fetchUser() {
    fetch(
      `https://api.github.com/user?access_token=${this.accessToken}`,
    )
      .then(res => res.json())
      .then(response => {
        this.login = response.login;
        this.fetchReviews();
      })
      .catch(error => console.error("Error:", error));
  }

  fetchReviews() {
    fetch(
      `https://api.github.com/search/issues?q=review-requested:${this.login}&access_token=${this.accessToken}`,
    )
      .then(res => res.json())
      .then(response => {
        console.log('sucesso:')
        console.log(response);
        this.reviews = response.items;
        ipcRenderer.send('pending-reviews-update', this.reviews.length + '');
      })
      .catch(error => console.error("Error:", error));
  }

  navigateViaBrowser(url) {
    shell.openExternal(url);
  }

}
customElements.define('reviews-element', Reviews);