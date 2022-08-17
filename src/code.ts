figma.showUI(__html__, { themeColors: false, height: 608, width: 506 });

figma.ui.onmessage = (msg) => {
  console.log(msg);

  if (msg.type === "insert_icon") {
    const nodes = [];
    console.log(msg);

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


};
