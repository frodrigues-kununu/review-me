import { LitElement, html, css } from 'lit-element';
const { shell, ipcRenderer } = require('electron');

import './loading';

class Reviews extends LitElement {
  static get styles() {
    return css`
      .titleContainer {
        padding: 20px;
      }
      h1 {
        color: #bfbfbf;
        
        span {
          color: red;
          font-weight: 600;
        }
      }

      ul {
        background-color: #fff;
        list-style: none;
        padding: 0;
      }
      
      .reviewLine {
        border-bottom: 1px solid #cecece;
        display: flex;
        justify-content: space-between;
        padding: 20px 30px;
      }

      .reviewLine:last-child {
        border-bottom: none;
      }
      
      .reviewLine:hover {
        cursor: pointer;
        box-shadow: rgb(145, 145, 145) 0px 0px 6px 0px;
      }

      .reviewLine.noHover:hover {
        cursor: default;
        box-shadow: none;
      }

      .date {
        color: #bfbfbf;
      }
    `;
  };

  static get properties() {
    return {
      reviews: Array,
      accessToken: String,
      isFetching: Boolean,
      intervalRef: Number,
    };
  }

  constructor() {
    super();
    this.reviews = [];
    this.isFetching = true;
  }

  render() {
    if (this.isFetching) {
      return html`<loading-element></loading-element>`;
    }

    return html`
      <div class="titleContainer">
        <h1>
          <span>${this.reviews.length}</span>
          Pending Reviews
        </h1>
      </div>
      <ul>
      ${this.reviews.map((item, index) =>
        html`
          <li class="reviewLine" @click=${() => this.navigateViaBrowser(item.html_url)}>
            <a>${item.title}</a>
            <span class="date">${new Date(item.created_at).toLocaleDateString()}</span>
          </li>
        `)}

        ${this.reviews.length === 0 ? html`<li class="reviewLine noHover">Nothing to review. Lucky you!</li>` : null}
      </ul>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchUser();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.intervalRef);
  }

  fetchUser() {
    fetch(`https://api.github.com/user?access_token=${this.accessToken}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('error');
      }
      return res.json();
    })
    .then(response => {
      this.login = response.login;
      this.fetchReviews();
      this.intervalRef = setInterval(() => {
        this.fetchReviews();
      }, 30000);
    })
    .catch(() => {
      console.error("Error:", error);
      this.navigateToLogin();
    });
  }

  fetchReviews() {
    fetch(`https://api.github.com/search/issues?q=review-requested:${this.login}&access_token=${this.accessToken}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('error');
      }
      return res.json();
    })
    .then(response => {
      this.reviews = response.items.filter((item) => item.state !== 'closed');
      ipcRenderer.send('pending-reviews-update', this.reviews.length + '');
      this.isFetching = false;
    })
    .catch(() => {
      console.error("Error:", error);
      this.navigateToLogin();
    });
  }

  navigateViaBrowser(url) {
    shell.openExternal(url);
  }

  navigateToLogin() {
    ipcRenderer.send('access-token-expired');
  }

}
customElements.define('reviews-element', Reviews);