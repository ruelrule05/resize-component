import { html, css, useCallback, useEffect, useRef, useState} from '@pionjs/pion';
import { ref } from 'lit-html/directives/ref.js';

const styles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #111827;
  }

  :host([is-resizing]) {
    cursor: col-resize;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  #container {
    display: flex;
    width: 100%;
    /* Use 100% to fill the host, not vh, for better encapsulation */
    height: 100%;
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
    flex-shrink: 0;
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

interface PionResizerProps {
  host: HTMLElement;
}

export const PionResizer = ({ host }: PionResizerProps) => {
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const [container, setContainer] = useState<Element>()
  const [leftPanel, setLeftPanel] = useState<Element>()
  const [rightPanel, setRightPanel] = useState<Element>()
  const [divider, setDivider] = useState<Element>()

  // const containerRef = useRef<HTMLDivElement>();
  // const leftPanelRef = useRef<HTMLDivElement>();
  // const rightPanelRef = useRef<HTMLDivElement>();

  const containerOffsetLeft = useRef(0);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!container || !leftPanel || !rightPanel || !divider) return;
    // if (
    //   !leftPanelRef.current ||
    //   !rightPanelRef.current ||
    //   !containerRef.current ||
    //   !dividerRef.current
    // )
    //   return;

    let newLeftWidth = e.clientX - containerOffsetLeft.current;

    const leftMinWidth = parseInt(
      // getComputedStyle(leftPanelRef.current).minWidth,
      getComputedStyle(leftPanel).minWidth,
      10
    );
    const rightMinWidth = parseInt(
      // getComputedStyle(rightPanelRef.current).minWidth,
      getComputedStyle(rightPanel).minWidth,
      10
    );
    // const containerWidth = containerRef.current.getBoundingClientRect().width;
    // const dividerWidth = dividerRef.current.offsetWidth;

    const containerWidth = container.getBoundingClientRect().width;
    // @ts-ignore
    const dividerWidth = divider.offsetWidth;

    if (newLeftWidth < leftMinWidth) {
      newLeftWidth = leftMinWidth;
    }

    if (containerWidth - newLeftWidth - dividerWidth < rightMinWidth) {
      newLeftWidth = containerWidth - rightMinWidth - dividerWidth;
    }

    // leftPanelRef.current.style.setProperty(
    //   '--left-panel-width',
    //   `${newLeftWidth}px`
    // );

    leftPanel.style.setProperty('--left-panel-width', `${newLeftWidth}px`)
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    // if (!containerRef.current) return;

    if (!container) return;

    containerOffsetLeft.current = container.getBoundingClientRect().left;
      // containerRef.current.getBoundingClientRect().left;
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const div = divider;

    if (div) {
      div.addEventListener('mousedown', handleMouseDown);
      return () => div.removeEventListener('mousedown', handleMouseDown);
    }
    return undefined;
  }, [handleMouseDown]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (host) {
      host.toggleAttribute('is-resizing', isResizing);
    }
  }, [isResizing, host]);

  return html`
    <style>
      ${styles}
    </style>
    <div id="container" ${ref(setContainer)}>
      <div id="left-panel" class="panel" ${ref(setLeftPanel)}>
        <h2>Left Component</h2>
        <p>
          This is the left panel. You can resize it by dragging the divider on
          the right.
        </p>
      </div>

      <div id="divider"  ${ref(setDivider)}></div>

      <div id="right-panel" class="panel" ${ref(setRightPanel)}>
        <h2>Right Component</h2>
        <p>
          This is the right panel. It will automatically adjust its size as you
          drag the divider.
        </p>
      </div>
    </div>
  `;
};

