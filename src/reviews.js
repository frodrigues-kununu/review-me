import { LitElement, html, css } from 'lit-element';

class Reviews extends LitElement {
  static get properties() {
    return { reviews: [] };
  }
  static get styles() {
    return css`
    `;
  };
  constructor() {
    super();
    this.accessToken = 'c8c8e3a9058ea175a66efda47ea20ab9389bf8bd';
    this.reviews = [];
  }

  render() {
    return html`
      <h1>List of reviews</h1>
      <ul>
      ${this.reviews.map((item, index) =>
        html`
          <li>
            <a href=${item.html_url} target="_blank">${item.title}</a>
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
      })
      .catch(error => console.error("Error:", error));
  }
}
customElements.define('reviews-element', Reviews);