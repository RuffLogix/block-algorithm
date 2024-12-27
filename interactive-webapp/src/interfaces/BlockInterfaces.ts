export enum BlockStyle {
  DANGER = "danger",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  NORMAL = "white",
}

export interface IPinPosition {
  blockIndex: number;
  pinIndex: number;
}

export interface IBlock {
  id: number;
  x: number;
  y: number;
  name: string;
  description: string;
  nInputs: number;
  nOutputs: number;
  inputNames: string[];
  outputNames: string[];
  fn: Function;
  style: string;
}
