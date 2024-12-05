export class BasedBlock<T> {
  private _outputs: T[] = [];
  private _inputs: IPinPosition[] = [];
  private _fn: Function;
  private _name: string;
  private _description: string;
  private _outputNames: string[] = [];
  private _inputNames: string[] = [];

  constructor(
    private _nInputs: number,
    private _nOutputs: number,
    fn: Function,
    name: string,
    description: string,
    inputNames: string[] = [],
    outputNames: string[] = [],
  ) {
    this._fn = fn;
    this._name = name;
    this._description = description;
    this._inputNames = inputNames.length
      ? inputNames
      : Array.from({ length: _nInputs }, (_, i) => `Input ${i + 1}`);
    this._outputNames = outputNames.length
      ? outputNames
      : Array.from({ length: _nOutputs }, (_, i) => `Output ${i + 1}`);
  }

  get outputNames(): string[] {
    return this._outputNames;
  }
  get inputNames(): string[] {
    return this._inputNames;
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

  setInputs(inputs: IPinPosition[]): this {
    if (inputs.length > this._nInputs) {
      throw new Error(
        `Cannot set more inputs (${inputs.length}) than block supports (${this._nInputs})`,
      );
    }
    this._inputs = inputs;
    return this;
  }

  run(blocks: BasedBlock<T>[] = []): this {
    if (this._nInputs === 0) {
      this._outputs = Array.isArray(this._fn()) ? this._fn() : [this._fn()];
      return this;
    }

    const internalInputs = this._inputs.map(
      (input) => blocks[input.blockIndex].outputs[input.pinIndex],
    );

    this._outputs = Array.isArray(this._fn(internalInputs))
      ? this._fn(internalInputs)
      : [this._fn(internalInputs)];

    return this;
  }
}

export class BlockEditor<T> {
  private blocks: BasedBlock<any>[] = [];
  private vertices: Set<number> = new Set();
  private edges: { from: number; to: number }[] = [];

  addBlocks(blocks: BasedBlock<any>[]): void {
    this.blocks = blocks;
    this.extractGraph();
  }

  private extractGraph(): void {
    this.vertices.clear();
    this.edges = [];
    this.blocks.forEach((_, index) => this.vertices.add(index));
    this.blocks.forEach((block, targetIndex) => {
      block.inputs.forEach((input) => {
        const sourceIndex = input.blockIndex;
        this.edges.push({ from: sourceIndex, to: targetIndex });
      });
    });
  }

  runTopological(): void {
    const inDegree = new Map<number, number>();
    const graph = new Map<number, number[]>();

    // Initialize in-degree and adjacency list
    this.vertices.forEach((v) => {
      inDegree.set(v, 0);
      graph.set(v, []);
    });

    // Compute in-degrees and build adjacency list
    this.edges.forEach((edge) => {
      const currentInDegree = inDegree.get(edge.to) ?? 0;
      inDegree.set(edge.to, currentInDegree + 1);

      const adjacentVertices = graph.get(edge.from) ?? [];
      adjacentVertices.push(edge.to);
      graph.set(edge.from, adjacentVertices);
    });

    // Detect cycles using depth-first search
    const detectCycle = (): boolean => {
      const visited = new Set<number>();
      const recursionStack = new Set<number>();

      const dfs = (vertex: number): boolean => {
        if (recursionStack.has(vertex)) {
          return true; // Cycle detected
        }

        if (visited.has(vertex)) {
          return false; // Already fully explored
        }

        visited.add(vertex);
        recursionStack.add(vertex);

        const neighbors = graph.get(vertex) ?? [];
        for (const neighbor of neighbors) {
          if (dfs(neighbor)) {
            return true; // Cycle found in subtree
          }
        }

        recursionStack.delete(vertex);
        return false;
      };

      for (const vertex of this.vertices) {
        if (dfs(vertex)) {
          return true; // Cycle found
        }
      }

      return false;
    };

    // Check for cycles before sorting
    if (detectCycle()) {
      throw new Error("Cyclic dependency detected in block graph");
    }

    // Kahn's algorithm for topological sorting
    const queue = Array.from(this.vertices).filter(
      (v) => (inDegree.get(v) ?? 0) === 0,
    );
    const order: number[] = [];
    const processedVertices = new Set<number>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      order.push(current);
      processedVertices.add(current);

      this.edges
        .filter((edge) => edge.from === current)
        .forEach((edge) => {
          const newInDegree = (inDegree.get(edge.to) ?? 0) - 1;
          inDegree.set(edge.to, newInDegree);

          if (newInDegree === 0) {
            queue.push(edge.to);
          }
        });
    }

    // Check if all vertices were processed
    if (processedVertices.size !== this.vertices.size) {
      throw new Error("Not all blocks could be sorted due to dependencies");
    }

    // Execute blocks in topological order
    order.forEach((index) => {
      this.blocks[index].run(this.blocks);
    });
  }
}
