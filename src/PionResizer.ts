import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class PionResizer extends LitElement {
  static styles = css`
    body {
      margin: 0;
      overflow: hidden;
      color: #111827;
    }

    body.is-resizing {
      cursor: col-resize;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    #container {
      display: flex;
      width: 100vw;
      height: 100vh;
      background-color: #f9fafb;
    }

    .panel {
      padding: 24px;
      box-sizing: border-box;
      overflow: auto;
      position: relative;
    }

    #left-panel {
      width: 50%;
      min-width: 200px;
      background-color: #ffffff;
      border-right: 1px solid #e5e7eb;
    }

    #right-panel {
      flex-grow: 1;
      min-width: 200px;
      background-color: #f9fafb;
    }

    #divider {
      width: 8px;
      background-color: #e5e7eb;
      cursor: col-resize;
      transition: background-color 0.2s ease-in-out, width 0.2s ease-in-out;
      flex-shrink: 0;
    }

    #divider:hover {
      width: 12px;
      background-color: #3b82f6;
    }

    h2 {
      margin-top: 0;
      color: #111827;
      font-size: 1.5rem;
      font-weight: 600;
    }

    p {
      line-height: 1.6;
      color: #4b5563;
    }
  `;

  @property({ type: String }) header = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <div id="container">
        <div id="left-panel" class="panel">
            <h2>Left Component</h2>
            <p>This is the left panel. You can resize it by dragging the divider on the right.</p>
            <p>Its minimum width is set to 200px. If the content overflows, a scrollbar will appear.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>

        <div id="divider"></div>

        <div id="right-panel" class="panel">
            <h2>Right Component</h2>
            <p>This is the right panel. It will automatically adjust its size as you drag the divider.</p>
            <p>Its minimum width is also set to 200px.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        </div>
      </div>
    `;
  }
}
