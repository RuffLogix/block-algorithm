import BasedBlock from "./basedBlock";

export default class BlockEditor<T> {
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
