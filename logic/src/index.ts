import BasedBlock from "./basedBlock";
import BlockEditor from "./blockEditor";

const constantBlock = BasedBlock.createConstant(4);
const addBlock = new BasedBlock<number>(
  2,
  1,
  (inputs: number[]) => inputs[0] + inputs[1],
  "Adder",
  "Adds two numbers",
);
const multiplyBlock = new BasedBlock<number>(
  2,
  1,
  (inputs: number[]) => inputs[0] * inputs[1],
  "Multiplier",
  "Multiplies two numbers",
);
const powerBlock = new BasedBlock<number>(
  2,
  1,
  (inputs: number[]) => Math.pow(inputs[0], inputs[1]),
  "Power",
  "Raises first number to power of second",
);
const toStringBlock = new BasedBlock<number>(
  1,
  1,
  (inputs: number[]) => inputs[0].toString(),
  "ToString",
  "Converts number to string",
);

const blocks: BasedBlock<any>[] = [
  constantBlock,
  addBlock,
  multiplyBlock,
  powerBlock,
  toStringBlock,
];

// Manually set inputs
addBlock.setInputs([
  { blockIndex: 0, pinIndex: 0 },
  { blockIndex: 0, pinIndex: 0 },
]);
multiplyBlock.setInputs([
  { blockIndex: 1, pinIndex: 0 },
  { blockIndex: 1, pinIndex: 0 },
]);
powerBlock.setInputs([
  { blockIndex: 1, pinIndex: 0 },
  { blockIndex: 2, pinIndex: 0 },
]);
toStringBlock.setInputs([{ blockIndex: 3, pinIndex: 0 }]);

// Create and run editor
const editor = new BlockEditor<any>();
editor.addBlocks(blocks);
editor.runTopological();

// Print outputs
console.log(
  addBlock.outputs,
  multiplyBlock.outputs,
  powerBlock.outputs,
  toStringBlock.outputs,
);
