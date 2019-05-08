import { LitElement, html, css } from 'lit-element';

class Reviews extends LitElement {
  static get styles() {
    return css`
    `;
  };

  render() {
    return html`
      <h1>List of reviews</h1>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    this.fetchReviews();
  }
  fetchReviews() {
    fetch(
      'https://api.github.com/search/issues?q=review-requested:jacintorodrigues',
      // {
      //   headers: {
      //     'Authorization': 'token a7a3dea16fcf920a8594badad9faabb35c913474'
      //   },
      // }
    )
      .then(res => res.json())
      .then(response => {
        console.log('sucesso:')
        console.log(response);
      })
      .catch(error => console.error("Error:", error));
  }
}
customElements.define('reviews-element', Reviews);