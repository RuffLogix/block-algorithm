"use client";

import React, { useState, useEffect } from "react";
import { calculateConnectionPath } from "@/utils/helpers";
import { IBlock } from "@/interfaces/BlockInterfaces";
import { NodeManager } from "./NodeManager";
import { BasedBlock, BlockEditor } from "@/core/blocks";
import { ISelectedPin } from "@/interfaces/NodeManagerInterfaces";
import CreateBlockModal from "./CreateBlockModal";

export default function BlockTemplate() {
  const {
    nodes,
    setNodes,
    connections,
    setConnections,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    draggedNode,
  } = NodeManager();
  const [selectedPin, setSelectedPin] = useState<ISelectedPin | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [blockEditor] = useState(new BlockEditor<number>());

  const handleConnectPin = (node: IBlock, pinType: string, pinName: string, pinIndex: number) => {
    if (!selectedPin) {
      setSelectedPin({ node, pinType, pinName, pinIndex });
      return;
    }

    if (selectedPin.pinType !== pinType) {
      const sourcePin =
        selectedPin.pinType === "output"
          ? { ...selectedPin, nodeId: selectedPin.node.id }
          : { ...node, nodeId: node.id, pinName, pinIndex };
      const targetPin =
        selectedPin.pinType === "input"
          ? { ...selectedPin, nodeId: selectedPin.node.id }
          : { ...node, nodeId: node.id, pinName, pinIndex };

      // Prevent duplicate and invalid connections
      const isDuplicateConnection = connections.some(
        (conn) =>
          conn.source.nodeId === sourcePin.nodeId &&
          conn.source.pinName === sourcePin.pinName &&
          conn.target.nodeId === targetPin.nodeId &&
          conn.target.pinName === targetPin.pinName,
      );

      if (!isDuplicateConnection) {
        const newConnection = {
          source: {
            nodeId: sourcePin.nodeId,
            pinName: sourcePin.pinName,
            pinIndex: sourcePin.pinIndex,
          },
          target: {
            nodeId: targetPin.nodeId,
            pinName: targetPin.pinName,
            pinIndex: targetPin.pinIndex,
          },
        };

        setConnections([...connections, newConnection]);
      }

      setSelectedPin(null);
    } else {
      setSelectedPin(null);
    }
  };

  const runTopologicalSort = () => {
    console.log(nodes)
    const blocks = nodes.map(
      (node) =>
        new BasedBlock(
          node.nInputs,
          node.nOutputs,
          node.fn,
          node.name,
          node.description,
          node.inputNames,
          node.outputNames,
        ),
    );

    blocks.forEach((block, blockIndex) => {
      const blockConnections = connections
        .filter((conn) => conn.target.nodeId === nodes[blockIndex].id)
        .map((conn) => ({
          blockIndex: nodes.findIndex((n) => n.id === conn.source.nodeId),
          pinIndex: conn.source.pinIndex,
        }));

      if (blockConnections.length > 0) {
        block.setInputs(blockConnections);
      }
    });

    blockEditor.addBlocks(blocks);
    blockEditor.runTopological();
  };

  const createNewBlock = (block: IBlock) => {
    block.id = nodes.length;
    setNodes([...nodes, block]);
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={runTopologicalSort}
          className="bg-green-500 text-white p-2 rounded"
        >
          Run Topological Sort
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-2 rounded ml-2"
        >
          Create Button
        </button>
        <CreateBlockModal isOpen={isOpen} onClose={() => setIsOpen(false)} onCreate={createNewBlock} />
      </div>
      <div
        className="relative h-[600px] border-2 border-gray-200"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`p-2 shadow-md absolute w-64 cursor-move z-10 border-2 border-${node.style} bg-secondary-background text-white`}
            style={{
              left: node.x,
              top: node.y,
            }}
            onMouseDown={(e) => handleMouseDown(e, node)}
          >
            <div className="font-bold">{node.name}</div>
            <div className="text-sm text-gray-400">{node.description}</div>

            <div className="mt-2 flex">
              <div className="w-1/2">
                <strong>Inputs:</strong>
                {node.inputNames.map((inputName, index) => {
                  const pinConnections = connections.filter(
                    (conn) =>
                      conn.target.nodeId === node.id &&
                      conn.target.pinName === inputName,
                  );
                  return (
                    <div
                      key={inputName}
                      className="cursor-pointer hover:bg-white p-1 flex justify-between hover:text-secondary-background"
                      onClick={() =>
                        handleConnectPin(node, "input", inputName, index)
                      }
                    >
                      <span>{inputName}</span>
                      <span className="text-xs text-gray-500">
                        {pinConnections.length > 0
                          ? `(${pinConnections.length})`
                          : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="w-1/2">
                <strong>Outputs:</strong>
                {node.outputNames.map((outputName, index) => {
                  const pinConnections = connections.filter(
                    (conn) =>
                      conn.source.nodeId === node.id &&
                      conn.source.pinName === outputName,
                  );
                  return (
                    <div
                      key={outputName}
                      className="cursor-pointer hover:bg-white p-1 flex justify-between hover:text-secondary-background"
                      onClick={() =>
                        handleConnectPin(node, "output", outputName, index)
                      }
                    >
                      <span>{outputName}</span>
                      <span className="text-xs text-gray-500">
                        {pinConnections.length > 0
                          ? `(${pinConnections.length})`
                          : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        >
          {connections.map((conn, index) => {
            const sourceNode = nodes.find(
              (node) => node.id === conn.source.nodeId,
            );
            const targetNode = nodes.find(
              (node) => node.id === conn.target.nodeId,
            );

            if (!sourceNode || !targetNode) return null;

            // Calculate connection path using source and target node positions
            const startX = sourceNode.x + 250; // Adjusted for output position
            const startY = sourceNode.y + 105 + conn.source.pinIndex * 20; // Offset per pin index for vertical spacing
            const endX = targetNode.x; // Adjusted for input position
            const endY = targetNode.y + 105 + conn.target.pinIndex * 20; // Offset per pin index for vertical spacing

            const midX = (startX + endX) / 2;
            const controlPointY = (startY + endY) / 2 - 50;

            // // const path = `M${startX},${startY} Q${midX},${controlPointY} ${endX},${endY}`;
            // const path = `M${startX},${startY} L${endX},${endY}`;
            const path = calculateConnectionPath(
              sourceNode,
              targetNode,
              conn.source.pinIndex,
              conn.target.pinIndex,
            );

            return (
              <path
                key={index}
                d={path}
                stroke="white"
                fill="transparent"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
              fill="white"
            >
              <polygon points="0 0, 10 3.5, 0 7" />
            </marker>
          </defs>
        </svg>

        {selectedPin && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 pointer-events-none">
            <div className="text-white bg-blue-500 p-2 rounded absolute top-4 left-4">
              Select {selectedPin.pinType === "output" ? "input" : "output"} pin
              to connect
            </div>
          </div>
        )}
      </div>
      <h1 className="text-white pt-4">
        *In this version, the result from the display block can be observed by
        pressing F12 and then clicking the Console tab.
      </h1>
    </div>
  );
}
