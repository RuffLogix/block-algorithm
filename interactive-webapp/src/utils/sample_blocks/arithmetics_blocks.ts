import { IBlock } from "@/interfaces/BlockInterfaces";

const ArithmeticsBlocks: IBlock[] = [
  {
    id: 0,
    x: 50,
    y: 100,
    name: "Constant Value (5)",
    description: "5 value",
    nInputs: 0,
    nOutputs: 1,
    inputNames: [],
    outputNames: ["Value"],
    fn: () => 5,
    style: "warning",
  },
  {
    id: 1,
    x: 50,
    y: 275,
    name: "Constant Value (7)",
    description: "7 value",
    nInputs: 0,
    nOutputs: 1,
    inputNames: [],
    outputNames: ["Value"],
    fn: () => 7,
    style: "warning",
  },
  {
    id: 2,
    x: 50,
    y: 420,
    name: "Addition Block",
    description: "Addition",
    nInputs: 2,
    nOutputs: 1,
    inputNames: ["A", "B"],
    outputNames: ["Output"],
    fn: ([a, b]: number[]) => a + b,
    style: "danger",
  },
  {
    id: 3,
    x: 325,
    y: 100,
    name: "Subtraction Block",
    description: "Subtraction",
    nInputs: 2,
    nOutputs: 1,
    inputNames: ["A", "B"],
    outputNames: ["Output"],
    fn: ([a, b]: number[]) => a - b,
    style: "danger",
  },
  {
    id: 4,
    x: 325,
    y: 275,
    name: "Multiplication Block",
    description: "Multiplication",
    nInputs: 2,
    nOutputs: 1,
    inputNames: ["A", "B"],
    outputNames: ["Output"],
    fn: ([a, b]: number[]) => a * b,
    style: "danger",
  },
  {
    id: 5,
    x: 325,
    y: 420,
    name: "Division Block",
    description: "Division",
    nInputs: 2,
    nOutputs: 1,
    inputNames: ["A", "B"],
    outputNames: ["Output"],
    fn: ([a, b]: number[]) => a / b,
    style: "danger",
  },
  {
    id: 6,
    x: 600,
    y: 100,
    name: "Display Block",
    description: "Display",
    nInputs: 1,
    nOutputs: 0,
    inputNames: ["Value"],
    outputNames: [],
    fn: ([a]: number[]) => console.log(a),
    style: "info",
  },
];

export default ArithmeticsBlocks;
