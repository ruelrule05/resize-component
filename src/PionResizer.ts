import { html, css, LitElement } from 'lit';
import { query, property } from 'lit/decorators.js';

export class PionResizer extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      color: #111827;
    }

    :host(.is-resizing) {
      cursor: col-resize;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    #container {
      display: flex;
      width: 100%;
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
      width: var(--left-panel-width, 50%);
      min-width: 200px;
      background-color: #ffffff;
      border-right: 1px solid #e5e7eb;
    }

    #right-panel {
      flex-grow: 1;
      width: var(--right-panel-width);
      min-width: 200px;
      background-color: #f9fafb;
    }

    #divider {
      width: 8px;
      background-color: #e5e7eb;
      cursor: col-resize;
      transition:
        background-color 0.2s ease-in-out,
        width 0.2s ease-in-out;
      flex-shrink: 0;
    }

    #divider:hover {
      width: 12px;
      background-color: #3b82f6;
    }
  `;

  @query('#container') private _container!: HTMLDivElement;

  @query('#left-panel') private _leftPanel!: HTMLDivElement;

  @query('#right-panel') private _rightPanel!: HTMLDivElement;

  @query('#divider') private _divider!: HTMLDivElement;

  @property({ type: Boolean, reflect: true, attribute: 'is-resizing' })
  private _isResizing = false;

  private _containerOffsetLeft = 0;


  private _startX = 0;

  private _startWidth = 0;

  connectedCallback() {
    super.connectedCallback();

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
  }

  firstUpdated() {
    this._divider.addEventListener('mousedown', this._onMouseDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._divider.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  private _onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    this._startX = e.clientX;
    this._startWidth = this._leftPanel.getBoundingClientRect().width;
    this._isResizing = true;

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
  }

  private _onMouseMove = (e: MouseEvent) => {
    if (!this._isResizing) return;

    let newLeftWidth = e.clientX - this._containerOffsetLeft;

    const leftMinWidth = parseInt(getComputedStyle(this._leftPanel).minWidth, 10);
    const rightMinWidth = parseInt(getComputedStyle(this._rightPanel).minWidth, 10);

    if (newLeftWidth < leftMinWidth) {
      newLeftWidth = leftMinWidth;
    }

    const containerWidth = this._container.getBoundingClientRect().width;
    const dividerWidth = this._divider.offsetWidth;
    if(containerWidth - newLeftWidth - dividerWidth < rightMinWidth) {
      newLeftWidth = containerWidth - rightMinWidth - dividerWidth;
    }

    const newRightWidth = containerWidth - newLeftWidth + dividerWidth;

    this._leftPanel.style.setProperty('--left-panel-width', `${newLeftWidth}px`);
    this._rightPanel.style.setProperty('--right-panel-width', `${newRightWidth}px`);
  }

  private _onMouseUp = () => {
    this._isResizing = false;
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  render() {
    return html`
      <div id="container">
        <div id="left-panel" class="panel">
          <h2>Left Component</h2>
          <p>
            This is the left panel. You can resize it by dragging the divider on
            the right.
          </p>
          <p>
            Its minimum width is set to 200px. If the content overflows, a
            scrollbar will appear.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div id="divider"></div>

        <div id="right-panel" class="panel">
          <h2>Right Component</h2>
          <p>
            This is the right panel. It will automatically adjust its size as
            you drag the divider.
          </p>
          <p>Its minimum width is also set to 200px.</p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
      </div>
    `;
  }
}
