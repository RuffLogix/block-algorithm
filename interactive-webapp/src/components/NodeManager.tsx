"use client";

import { IBlock } from "@/interfaces/BlockInterfaces";
import { useState } from "react";
import LogicGates from "@/utils/sample_blocks/logic_gates";

export const NodeManager = () => {
  const [nodes, setNodes] = useState<IBlock[]>(LogicGates);
  const [draggedNode, setDraggedNode] = useState(null);
  const [connections, setConnections] = useState([]);

  const handleMouseDown = (e, node) => {
    const offsetX = e.clientX - node.x;
    const offsetY = e.clientY - node.y;
    setDraggedNode({ node, offsetX, offsetY });
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const updatedNodes = nodes.map((n) =>
        n.id === draggedNode.node.id
          ? {
              ...n,
              x: e.clientX - draggedNode.offsetX,
              y: e.clientY - draggedNode.offsetY,
            }
          : n,
      );
      setNodes(updatedNodes);
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  return {
    nodes,
    setNodes,
    connections,
    setConnections,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    draggedNode,
    setDraggedNode,
  };
};
