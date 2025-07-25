import { html, TemplateResult } from 'lit';
import './PionResizer.js';

export default {
  title: 'PionResizer',
  component: 'pion-resizer',
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  storyName?: string;
}

interface ArgTypes {}

const Template: Story<ArgTypes> = () => html`
  <div style="height: 100vh;">
    <pion-resizer></pion-resizer>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};
