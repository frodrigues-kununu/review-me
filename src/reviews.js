import { LitElement, html, css } from 'lit-element';
const { shell, ipcRenderer } = require('electron');

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
        cursor: pointer;
      }

      .reviewLine:last-child {
        border-bottom: none;
      }
      
      .reviewLine:hover {
        box-shadow: rgb(145, 145, 145) 0px 0px 6px 0px;
      }

      .date {
        color: #bfbfbf;
      }
    `;
  };

  static get properties() {
    return {
      reviews: [],
      accessToken: String
    };
  }

  constructor() {
    super();
    this.reviews = [];
  }

  render() {
    return html`
      <div class="titleContainer">
        <h1>
          <span>${this.reviews.length}</span>
          Pending Reviews
        </h1>
      </div>
      <ul>
      ${this.reviews.map((item, index) =>
        item.state !== 'close' && html`
          <li class="reviewLine" @click=${() => this.navigateViaBrowser(item.html_url)}>
            <a>${item.title}</a>
            <span class="date">${new Date(item.created_at).toLocaleDateString()}</span>
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
      .catch(error => {
        console.error("Error:", error);
        this.navigateToLogin();
      });
  }

  fetchReviews() {
    fetch(
      `https://api.github.com/search/issues?q=review-requested:${this.login}&access_token=${this.accessToken}`,
    )
      .then(res => res.json())
      .then(response => {
        console.log('sucesso:')
        console.log(response.items);
        this.reviews = response.items;
        ipcRenderer.send('pending-reviews-update', this.reviews.length + '');
      })
      .catch(error => {
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