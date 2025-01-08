import { IBlock } from "./BlockInterfaces"

export interface IDraggedNode {
    node: IBlock;
    offsetX: number;
    offsetY: number;
}

export interface IConnection {
    id: number;
    source: {
        nodeId: number;
        pinName: string;
        pinIndex: number;
    };
    target: {
        nodeId: number;
        pinName: string;
        pinIndex: number;
    };
}

export interface ISelectedPin {
    node: IBlock;
    pinType: string;
    pinName: string;
    pinIndex: number;
  }
