import { html, fixture, expect } from '@open-wc/testing';

import '../src/PionResizer.js';

const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

describe('PionResizer', () => {
  let element: HTMLElement;
  let container: HTMLDivElement;
  let leftPanel: HTMLDivElement;
  let rightPanel: HTMLDivElement;
  let divider: HTMLDivElement;

  beforeEach(async () => {
    element = await fixture(
      html`<pion-resizer style="width: 1000px; height: 500px;"></pion-resizer>`
    );
    container = element.shadowRoot!.querySelector('#container')!;
    leftPanel = element.shadowRoot!.querySelector('#left-panel')!;
    rightPanel = element.shadowRoot!.querySelector('#right-panel')!;
    divider = element.shadowRoot!.querySelector('#divider')!;
  });

  it('renders the container, panels, and divider', () => {
    expect(container).to.exist;
    expect(leftPanel).to.exist;
    expect(rightPanel).to.exist;
    expect(divider).to.exist;
  });

  it('is accessible', async () => {
    await expect(element).to.be.accessible();
  });

  it('starts resizing on mousedown on the divider', async () => {
    expect(element.hasAttribute('is-resizing')).to.be.false;

    const rect = divider.getBoundingClientRect();
    divider.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        composed: true,
        clientX: rect.left,
      })
    );

    await nextFrame();

    expect(element.hasAttribute('is-resizing')).to.be.true;
  });

  it('resizes the left panel on mousemove', async () => {
    divider.dispatchEvent(new MouseEvent('mousedown', { clientX: 500 }));
    await nextFrame();

    const initialWidth = leftPanel.getBoundingClientRect().width;
    expect(initialWidth).to.be.closeTo(500, 1);

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 400 }));
    await nextFrame();

    const newWidth = leftPanel.getBoundingClientRect().width;
    expect(newWidth).to.be.closeTo(400, 1);
  });

  it('stops resizing on mouseup', async () => {
    divider.dispatchEvent(new MouseEvent('mousedown', { clientX: 500 }));
    await nextFrame();
    expect(element.hasAttribute('is-resizing')).to.be.true;

    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextFrame();
    expect(element.hasAttribute('is-resizing')).to.be.false;
  });

  it('respects the min-width of the right panel', async () => {
    divider.dispatchEvent(new MouseEvent('mousedown', { clientX: 500 }));
    await nextFrame();

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 900 }));
    await nextFrame();

    const newWidth = leftPanel.getBoundingClientRect().width;
    // The divider width is 8px.
    // 1000 (container) - 200 (right min-width) - 8 (divider) = 792
    expect(newWidth).to.equal(1000 - 200 - 8);
  });
});
