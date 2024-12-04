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

    // Add all blocks as vertices
    this.blocks.forEach((_, index) => this.vertices.add(index));

    // Extract edges from block inputs
    this.blocks.forEach((block, targetIndex) => {
      block.inputs.forEach((input) => {
        const sourceIndex = input.blockIndex;
        this.edges.push({ from: sourceIndex, to: targetIndex });
      });
    });
  }

  runTopological(): void {
    // Perform topological sort and run
    const inDegree = new Map<number, number>();
    this.vertices.forEach((v) => inDegree.set(v, 0));

    // Count in-degrees
    this.edges.forEach((edge) => {
      const currentInDegree = inDegree.get(edge.to) ?? 0;
      inDegree.set(edge.to, currentInDegree + 1);
    });

    // Find nodes with zero in-degree (sources)
    const queue = Array.from(this.vertices).filter(
      (v) => (inDegree.get(v) ?? 0) === 0,
    );

    const order: number[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      order.push(current);

      // Reduce in-degree for adjacent nodes
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

    // Run blocks in topological order
    order.forEach((index) => {
      this.blocks[index].run(this.blocks);
    });
  }

  // Debug methods
  getVertices(): number[] {
    return Array.from(this.vertices);
  }

  getEdges(): { from: number; to: number }[] {
    return this.edges;
  }
}
