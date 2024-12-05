export interface IPinPosition {
  blockIndex: number;
  pinIndex: number;
}

export interface IBlock {
  id: string | number;
  x: number;
  y: number;
  name: string;
  description: string;
  nInputs: number;
  nOutputs: number;
  inputNames: string[];
  outputNames: string[];
  fn: Function;
  style?: string;
}
