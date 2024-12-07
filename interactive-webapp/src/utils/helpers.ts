import { IBlock } from "@/interfaces/BlockInterfaces";

export const calculateConnectionPath = (
  sourceNode: IBlock,
  targetNode: IBlock,
  sourcePinIndex: number,
  targetPinIndex: number,
) => {
  const startX = sourceNode.x + 250;
  const startY = sourceNode.y + 100 + sourcePinIndex * 20;
  const endX = targetNode.x;
  const endY = targetNode.y + 100 + targetPinIndex * 25;

  // Calculate control points for the 90-degree turns
  const midX = (startX + endX) / 2;

  return `
    M ${startX},${startY}
    H ${midX}
    V ${endY}
    H ${endX}
  `;
};
