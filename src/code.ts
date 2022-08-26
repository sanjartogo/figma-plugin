import { dropProps } from './components/Icon';
figma.showUI(__html__, { themeColors: false, height: 500, width: 340 });


figma.ui.onmessage = (msg) => {

  if (msg.type === "insert_icon") {
    const nodes = [];

    // for (let i = 0; i < msg.count; i++) {
    let node = figma.createNodeFromSvg(msg.data);
    // const rect = figma.createRectangle();
    // rect.x = i * 150;
    // rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
    // figma.currentPage.appendChild(rect);
    nodes.push(node);
    // }
    node.resize(24, 24);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "on_drag") {
    const { dropPosition, itemSize, offset, windowSize }: dropProps = msg.dropValues

    const bounds = figma.viewport.bounds;

    const zoom = figma.viewport.zoom;
    const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;

    const leftPaneWidth = windowSize.width - bounds.width * zoom - 340;

    const xFromCanvas = hasUI ? dropPosition.clientX - leftPaneWidth : dropPosition.clientX;
    const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY
    let node = figma.createNodeFromSvg(msg.data);
    node.x = bounds.x + xFromCanvas / zoom - offset.x;
    node.y = bounds.y + yFromCanvas / zoom - offset.y;
    node.resize(24, 24);
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);
  }


};
