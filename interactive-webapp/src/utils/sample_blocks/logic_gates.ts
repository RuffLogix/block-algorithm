import { IBlock } from "@/interfaces/BlockInterfaces";

const LogicGates: IBlock[] = [
  {
    id: 1,
    x: 100,
    y: 100,
    name: "Constant Value (True)",
    description: "True value",
    nInputs: 0,
    nOutputs: 1,
    inputNames: [],
    outputNames: ["Value"],
    fn: () => true,
    style: "warning",
  },
  {
    id: 2,
    x: 100,
    y: 275,
    name: "Constant Value (False)",
    description: "False value",
    nInputs: 0,
    nOutputs: 1,
    inputNames: [],
    outputNames: ["Value"],
    fn: () => false,
    style: "warning",
  },
  {
    id: 3,
    x: 100,
    y: 420,
    name: "And Gate Block",
    description: "Logical AND gate",
    nInputs: 2,
    nOutputs: 1,
    inputNames: ["A", "B"],
    outputNames: ["Output"],
    fn: ([a, b]) => a && b,
    style: "danger",
  },
  {
    id: 4,
    x: 400,
    y: 100,
    name: "OR Gate Block",
    description: "Logical OR gate",
    nInputs: 2,
    nOutputs: 1,
    inputNames: ["A", "B"],
    outputNames: ["Output"],
    fn: ([a, b]) => a || b,
    style: "danger",
  },
  {
    id: 5,
    x: 400,
    y: 275,
    name: "Not Gate Block",
    description: "Logical Not gate",
    nInputs: 1,
    nOutputs: 1,
    inputNames: ["A"],
    outputNames: ["Output"],
    fn: ([a]) => !a,
    style: "danger",
  },
  {
    id: 6,
    x: 400,
    y: 420,
    name: "Display Block",
    description: "True value",
    nInputs: 1,
    nOutputs: 0,
    inputNames: ["Value"],
    outputNames: [],
    fn: (value) => console.log(value),
    style: "info",
  },
];

export default LogicGates;