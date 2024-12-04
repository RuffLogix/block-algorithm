export interface IPinPosition {
  blockIndex: number;
  pinIndex: number;
}

export default class BasedBlock<T> {
  private _outputs: T[] = [];
  private _inputs: IPinPosition[] = [];
  private _fn: Function;
  private _name: string;
  private _description: string;

  constructor(
    private _nInputs: number,
    private _nOutputs: number,
    fn: Function,
    name: string,
    description: string,
  ) {
    this._fn = fn;
    this._name = name;
    this._description = description;
  }

  get outputs(): T[] {
    return this._outputs;
  }

  get inputs(): IPinPosition[] {
    return this._inputs;
  }

  get nInputs(): number {
    return this._nInputs;
  }

  get nOutputs(): number {
    return this._nOutputs;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  setFunction(fn: Function): this {
    this._fn = fn;
    return this;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  setDescription(description: string): this {
    this._description = description;
    return this;
  }

  setInputs(inputs: IPinPosition[]): this {
    if (inputs.length !== this._nInputs) {
      throw new Error(
        `Expected ${this._nInputs} inputs, but got ${inputs.length}`,
      );
    }
    this._inputs = inputs;
    return this;
  }

  run(blocks: BasedBlock<T>[]): this {
    const internalInputs = this._inputs.map(
      (input) => blocks[input.blockIndex].outputs[input.pinIndex],
    );

    this._outputs = Array.isArray(this._fn(internalInputs))
      ? this._fn(internalInputs)
      : [this._fn(internalInputs)];

    return this;
  }
}
