export class UnionFind {
  private parent: Record<string, string> = {};
  private rank: Record<string, number> = {};

  constructor(nodes: string[]) {
    for (const node of nodes) {
      this.parent[node] = node;
      this.rank[node] = 0;
    }
  }

  /**
   * Finds the root parent of a node with path compression.
   */
  find(x: string): string {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  /**
   * Unites two sets. Returns true if union was successful (i.e., different sets).
   */
  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false; // Already connected

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }

  /**
   * Checks whether two nodes are in the same set.
   */
  connected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }

  /**
   * Returns the internal state (for debugging or visualization).
   */
  getState(): { parent: Record<string, string>; rank: Record<string, number> } {
    return {
      parent: { ...this.parent },
      rank: { ...this.rank },
    };
  }
  /**
   * Returns a record of components, where each key is a root node and the value is an array of nodes in that component.
   */

  getComponents(): Record<string, string[]> {
    const components: Record<string, string[]> = {};
    for (const node in this.parent) {
      const root = this.find(node);
      if (!components[root]) components[root] = [];
      components[root].push(node);
    }
    return components;
  }
}
