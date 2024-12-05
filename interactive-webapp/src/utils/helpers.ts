import { IBlock } from "@/interfaces/BlockInterfaces";

export const calculateConnectionPath = (
  sourceNode: IBlock,
  targetNode: IBlock,
  sourcePinIndex: number,
  targetPinIndex: number,
) => {
  const startX = sourceNode.x + 250;
  const startY = sourceNode.y + 100 + sourcePinIndex * 20;
  const endX = targetNode.x; // Adjusted for input position
  const endY = targetNode.y + 105 + targetPinIndex * 25;

  return `M${startX},${startY} L${endX},${endY}`;
};
