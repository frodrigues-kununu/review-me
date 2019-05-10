import { LitElement, html, css } from 'lit-element';

class Loading extends LitElement {
  static get styles() {
    return css`
      .loading {
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
      }

      .loadingContainer {
        align-items: center;
        display: flex;
        height: 100%;
        justify-content: center;
      }

      .loading div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 51px;
        height: 51px;
        margin: 6px;
        border: 6px solid #bfbfbf;
        border-radius: 50%;
        animation: loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #bfbfbf transparent transparent transparent;
      }
      .loading div:nth-child(1) {
        animation-delay: -0.45s;
      }
      .loading div:nth-child(2) {
        animation-delay: -0.3s;
      }
      .loading div:nth-child(3) {
        animation-delay: -0.15s;
      }

      @keyframes loading {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;
  }

  render() {
    return html`
      <div class="loadingContainer">
        <div class="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `;
  }
}

customElements.define('loading-element', Loading);
