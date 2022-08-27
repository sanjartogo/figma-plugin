import { dropProps } from './components/Icon';
figma.showUI(__html__, { themeColors: false, height: 500, width: 340 });


figma.ui.onmessage = (msg) => {

  if (msg.type === "insert_icon") {
    const nodes = [];
    let node = figma.createNodeFromSvg(msg.data);
    node.name = msg.name.split("/").pop().split(".svg").join("")
    nodes.push(node);
    node.resize(24, 24);
    const firstItem = figma.currentPage.selection[0]
    if (firstItem) {
      node.x = firstItem.x + 10
      node.y = firstItem.y + 10
    }
    figma.currentPage.appendChild(node)
  }

  if (msg.type === "on_drag") {
    const { dropPosition, itemSize, offset, windowSize }: dropProps = msg.dropValues
    const viewport = figma.viewport;
    const zoom = viewport.zoom;
    const bounds = viewport.bounds;

    const boundsWidth = bounds.width * zoom;
    const boundsHeight = bounds.height * zoom;
    const windowWidth = windowSize.width;
    const windowHeight = windowSize.height;

    const leftDiff = windowWidth - boundsWidth;
    const topDiff = windowHeight - boundsHeight;

    const hasRightPanel = leftDiff >= 240;
    const leftCoords = bounds.x - (leftDiff - (hasRightPanel ? 240 : 0)) / zoom;
    const topCoords = bounds.y - topDiff / zoom;

    // Target coordinates
    let targetX = leftCoords + (dropPosition.clientX) / zoom;
    let targetY = topCoords + (dropPosition.clientY + 24) / zoom;

    let node = figma.createNodeFromSvg(msg.data);
    // node.x = Math.round(targetX);
    // node.y = Math.round(targetY + itemSize.height);
    node.x = Math.round(targetX - node.width / 2)
    node.y = Math.round(targetY - node.height / 3)
    node.resize(24, 24);
    node.name = msg.name
    figma.currentPage.selection = [node];
  }


};
