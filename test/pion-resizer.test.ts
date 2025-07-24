import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { PionResizer } from '../src/PionResizer.js';
import '../src/pion-resizer.js';

describe('PionResizer', () => {
  it('has a default header "Hey there" and counter 5', async () => {
    const el = await fixture<PionResizer>(html`<pion-resizer></pion-resizer>`);

    expect(el.header).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<PionResizer>(html`<pion-resizer></pion-resizer>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the header via attribute', async () => {
    const el = await fixture<PionResizer>(html`<pion-resizer header="attribute header"></pion-resizer>`);

    expect(el.header).to.equal('attribute header');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<PionResizer>(html`<pion-resizer></pion-resizer>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
