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
    templateNodes,
  } = NodeManager();
  const [selectedPin, setSelectedPin] = useState<ISelectedPin | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [blockEditor] = useState(new BlockEditor<number>());

  let currNodeID = 0;
  let currConnectionID = 0;

  const handleConnectPin = (
    node: IBlock,
    pinType: string,
    pinName: string,
    pinIndex: number
  ) => {
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
          conn.target.pinName === targetPin.pinName
      );

      if (!isDuplicateConnection) {
        const newConnection = {
          id:
            connections.length > 0
              ? Math.max(...connections.map((c) => c.id)) + 1
              : 0,
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
    const blocks = nodes.map(
      (node) =>
        new BasedBlock(
          node.nInputs,
          node.nOutputs,
          node.fn,
          node.name,
          node.description,
          node.inputNames,
          node.outputNames
        )
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
    currNodeID = Math.max(nodes.length, currNodeID + 1);
    block.id = currNodeID;
    setNodes([...nodes, block]);
  };

  const deleteNode = (id: number) => {
    return () => {
      setNodes(nodes.filter((node) => node.id !== id));
      setConnections(
        connections.filter(
          (conn) => conn.source.nodeId !== id && conn.target.nodeId !== id
        )
      );
    };
  };

  const deleteConnection = (id: number) => {
    return () => {
      setConnections(
        connections.filter((conn) => {
          return conn.id !== id;
        })
      );
    };
  };

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
        <select
          name="template-nodes"
          id="template-nodes"
          onChange={(e) =>
            setNodes(templateNodes[Number(e.target.value)].blocks)
          }
          className="text-primary-background bg-white p-2 rounded ml-2"
        >
          {templateNodes.map((template, index) => (
            <option key={index} value={index}>
              {template.name}
            </option>
          ))}
        </select>
        <CreateBlockModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onCreate={createNewBlock}
        />
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
            <div className="font-bold w-full flex justify-between">
              {node.name}{" "}
              <span
                className="text-danger hover:cursor-pointer font-medium"
                onClick={deleteNode(node.id)}
              >
                x
              </span>
            </div>
            <div className="text-sm text-gray-400">{node.description}</div>

            <div className="mt-2 flex">
              <div className="w-1/2">
                <strong>Inputs:</strong>
                {node.inputNames.map((inputName, index) => {
                  const pinConnections = connections.filter(
                    (conn) =>
                      conn.target.nodeId === node.id &&
                      conn.target.pinName === inputName
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
                      conn.source.pinName === outputName
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
              (node) => node.id === conn.source.nodeId
            );
            const targetNode = nodes.find(
              (node) => node.id === conn.target.nodeId
            );

            if (!sourceNode || !targetNode) return null;

            const path = calculateConnectionPath(
              sourceNode,
              targetNode,
              conn.source.pinIndex,
              conn.target.pinIndex
            );

            return (
              <path
                key={index}
                onClick={deleteConnection(conn.id)}
                pointerEvents="all"
                cursor="pointer"
                d={path}
                stroke="white"
                fill="transparent"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="stroke-white hover:stroke-red-500 hover:z-10 transition-colors duration-200"
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
