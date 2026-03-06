// ── Types ─────────────────────────────────────────────────────────────────────

export type HashTableType = "chaining" | "linear" | "quadratic" | "double";

export type SlotState =
  | "idle"
  | "occupied"
  | "deleted"
  | "probing"
  | "found"
  | "notFound"
  | "inserted"
  | "rehashing"
  | "hashed";

export interface HashSlot {
  index: number;
  key: number | null;
  state: SlotState;
  /** Which probe attempt placed this key (shown as superscript) */
  probeCount?: number;
}

export interface ChainNode {
  key: number;
  state: SlotState;
}

export interface HashBucket {
  index: number;
  chain: ChainNode[];
  state: SlotState;
}

export interface HashStep {
  tableType: HashTableType;
  /** Open addressing — flat slot array */
  slots?: HashSlot[];
  /** Chaining — bucket array */
  buckets?: HashBucket[];
  tableSize: number;
  count: number;
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;
  /** Index the hash function resolves to (for arrow highlighting) */
  hashIndex?: number;
}

// ── Primes ────────────────────────────────────────────────────────────────────

const PRIMES = [
  7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83,
  89, 97,
];

export function nextPrime(n: number): number {
  return PRIMES.find((p) => p > n) ?? n * 2 + 1;
}

// ── Hash functions ────────────────────────────────────────────────────────────

export function h1(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/** For double hashing: must be non-zero and coprime with tableSize */
export function h2(key: number, size: number): number {
  return 1 + (((key % (size - 1)) + (size - 1)) % (size - 1));
}

export function probeIndex(
  key: number,
  i: number,
  size: number,
  type: HashTableType,
): number {
  const base = h1(key, size);
  switch (type) {
    case "linear":
      return (base + i) % size;
    case "quadratic":
      return (base + i * i) % size;
    case "double":
      return (base + i * h2(key, size)) % size;
    default:
      return base;
  }
}

// ── Empty step ────────────────────────────────────────────────────────────────

export function emptyOpenStep(size: number, type: HashTableType): HashStep {
  return {
    tableType: type,
    slots: Array.from({ length: size }, (_, i) => ({
      index: i,
      key: null,
      state: "idle",
    })),
    tableSize: size,
    count: 0,
    message: "Select an operation to begin",
    subMessage: `Hash function: h(k) = k mod ${size}`,
  };
}

export function emptyChainingStep(size: number): HashStep {
  return {
    tableType: "chaining",
    buckets: Array.from({ length: size }, (_, i) => ({
      index: i,
      chain: [],
      state: "idle",
    })),
    tableSize: size,
    count: 0,
    message: "Select an operation to begin",
    subMessage: `Hash function: h(k) = k mod ${size}`,
  };
}

// ── Internal table state ──────────────────────────────────────────────────────

/** Open addressing table (null = empty, undefined key = deleted marker) */
export type OpenTable = (number | null | "DELETED")[];

export type ChainingTable = number[][];

// ── Snapshot helpers ──────────────────────────────────────────────────────────

function openSnap(
  table: OpenTable,
  states: Record<number, SlotState>,
  type: HashTableType,
  message: string,
  opts?: { subMessage?: string; isMajorStep?: boolean; hashIndex?: number },
): HashStep {
  const slots: HashSlot[] = table.map((entry, i) => ({
    index: i,
    key: entry === "DELETED" ? null : entry,
    state:
      states[i] ??
      (entry === null ? "idle" : entry === "DELETED" ? "deleted" : "occupied"),
  }));
  return {
    tableType: type,
    slots,
    tableSize: table.length,
    count: table.filter((e) => e !== null && e !== "DELETED").length,
    message,
    ...(opts?.subMessage !== undefined && { subMessage: opts.subMessage }),
    ...(opts?.isMajorStep && { isMajorStep: true }),
    ...(opts?.hashIndex !== undefined && { hashIndex: opts.hashIndex }),
  };
}

function chainSnap(
  table: ChainingTable,
  bucketStates: Record<number, SlotState>,
  nodeStates: Record<string, SlotState>, // "bucketIdx-chainIdx"
  message: string,
  opts?: { subMessage?: string; isMajorStep?: boolean; hashIndex?: number },
): HashStep {
  const buckets: HashBucket[] = table.map((chain, i) => ({
    index: i,
    chain: chain.map((key, j) => ({
      key,
      state: nodeStates[`${i}-${j}`] ?? "occupied",
    })),
    state: bucketStates[i] ?? "idle",
  }));
  return {
    tableType: "chaining",
    buckets,
    tableSize: table.length,
    count: table.reduce((s, c) => s + c.length, 0),
    message,
    ...(opts?.subMessage !== undefined && { subMessage: opts.subMessage }),
    ...(opts?.isMajorStep && { isMajorStep: true }),
    ...(opts?.hashIndex !== undefined && { hashIndex: opts.hashIndex }),
  };
}

// ── Open addressing steps ─────────────────────────────────────────────────────

export class OpenSteps {
  static insert(
    table: OpenTable,
    key: number,
    type: HashTableType,
  ): HashStep[] {
    const steps: HashStep[] = [];
    const size = table.length;
    const base = h1(key, size);

    steps.push(
      openSnap(table, {}, type, `insert(${key})`, {
        subMessage: `h(${key}) = ${key} mod ${size} = ${base}`,
        isMajorStep: true,
        hashIndex: base,
      }),
    );

    // Check load factor
    const count = table.filter((e) => e !== null && e !== "DELETED").length;
    if ((count + 1) / size > 0.7) {
      steps.push(
        openSnap(
          table,
          {},
          type,
          `Load factor would exceed 0.7 — rehashing first`,
          { subMessage: "Growing table before insert", isMajorStep: true },
        ),
      );
      // Rehash steps then insert handled by hook
      return steps;
    }

    for (let i = 0; i < size; i++) {
      const idx = probeIndex(key, i, size, type);
      const probeDesc =
        i === 0
          ? `Initial slot: ${idx}`
          : type === "linear"
            ? `Linear probe ${i}: slot ${idx}`
            : type === "quadratic"
              ? `Quadratic probe ${i}: slot ${idx} (+${i}²=${i * i})`
              : `Double hash probe ${i}: slot ${idx} (+${i}×h₂(${key})=${i * h2(key, size)})`;

      const entry = table[idx];

      if (entry === null || entry === "DELETED") {
        // Found empty slot — insert
        const states: Record<number, SlotState> = {};
        for (let j = 0; j < i; j++)
          states[probeIndex(key, j, size, type)] = "probing";
        states[idx] = "inserted";
        steps.push(
          openSnap(table, states, type, `Inserting ${key} at slot ${idx}`, {
            subMessage:
              i === 0
                ? "Slot was empty"
                : `Found empty slot after ${i} probe(s)`,
            isMajorStep: true,
            hashIndex: base,
          }),
        );
        return steps;
      }

      if (entry === key) {
        // Duplicate
        const states: Record<number, SlotState> = {};
        for (let j = 0; j < i; j++)
          states[probeIndex(key, j, size, type)] = "probing";
        states[idx] = "found";
        steps.push(
          openSnap(
            table,
            states,
            type,
            `${key} already exists at slot ${idx} — no duplicate`,
            {
              isMajorStep: true,
              hashIndex: base,
            },
          ),
        );
        return steps;
      }

      // Collision — probe further
      const states: Record<number, SlotState> = {};
      for (let j = 0; j <= i; j++)
        states[probeIndex(key, j, size, type)] = "probing";
      steps.push(
        openSnap(
          table,
          states,
          type,
          `Collision at slot ${idx} (occupied by ${entry})`,
          { subMessage: probeDesc, hashIndex: base },
        ),
      );
    }

    steps.push(
      openSnap(table, {}, type, `Table is full — cannot insert ${key}`, {
        isMajorStep: true,
      }),
    );
    return steps;
  }

  static search(
    table: OpenTable,
    key: number,
    type: HashTableType,
  ): HashStep[] {
    const steps: HashStep[] = [];
    const size = table.length;
    const base = h1(key, size);

    steps.push(
      openSnap(table, {}, type, `search(${key})`, {
        subMessage: `h(${key}) = ${key} mod ${size} = ${base}`,
        isMajorStep: true,
        hashIndex: base,
      }),
    );

    for (let i = 0; i < size; i++) {
      const idx = probeIndex(key, i, size, type);
      const entry = table[idx];

      const states: Record<number, SlotState> = {};
      for (let j = 0; j <= i; j++)
        states[probeIndex(key, j, size, type)] = "probing";

      if (entry === null) {
        states[idx] = "notFound";
        steps.push(
          openSnap(
            table,
            states,
            type,
            `Empty slot at ${idx} — ${key} not found`,
            {
              isMajorStep: true,
              hashIndex: base,
            },
          ),
        );
        return steps;
      }

      if (entry === key) {
        states[idx] = "found";
        steps.push(
          openSnap(table, states, type, `Found ${key} at slot ${idx}!`, {
            isMajorStep: true,
            hashIndex: base,
          }),
        );
        return steps;
      }

      steps.push(
        openSnap(
          table,
          states,
          type,
          entry === "DELETED"
            ? `Slot ${idx} is deleted — continue probing`
            : `Slot ${idx} has ${entry} — not a match`,
          { subMessage: `Probe ${i + 1}`, hashIndex: base },
        ),
      );
    }

    steps.push(
      openSnap(table, {}, type, `${key} not found`, { isMajorStep: true }),
    );
    return steps;
  }

  static delete(
    table: OpenTable,
    key: number,
    type: HashTableType,
  ): HashStep[] {
    const steps: HashStep[] = [];
    const size = table.length;
    const base = h1(key, size);

    steps.push(
      openSnap(table, {}, type, `delete(${key})`, {
        subMessage: `Searching for ${key} to mark as DELETED`,
        isMajorStep: true,
        hashIndex: base,
      }),
    );

    for (let i = 0; i < size; i++) {
      const idx = probeIndex(key, i, size, type);
      const entry = table[idx];

      const states: Record<number, SlotState> = {};
      for (let j = 0; j <= i; j++)
        states[probeIndex(key, j, size, type)] = "probing";

      if (entry === null) {
        states[idx] = "notFound";
        steps.push(
          openSnap(
            table,
            states,
            type,
            `${key} not found — nothing to delete`,
            {
              isMajorStep: true,
              hashIndex: base,
            },
          ),
        );
        return steps;
      }

      if (entry === key) {
        states[idx] = "deleted";
        steps.push(
          openSnap(
            table,
            states,
            type,
            `Found ${key} at slot ${idx} — marking as DELETED`,
            {
              subMessage:
                "Tombstone preserves probe chains for future searches",
              isMajorStep: true,
              hashIndex: base,
            },
          ),
        );
        return steps;
      }

      steps.push(
        openSnap(
          table,
          states,
          type,
          entry === "DELETED"
            ? `Slot ${idx} is tombstone — continue`
            : `Slot ${idx} has ${entry} — not a match`,
          { subMessage: `Probe ${i + 1}`, hashIndex: base },
        ),
      );
    }

    steps.push(
      openSnap(table, {}, type, `${key} not found`, { isMajorStep: true }),
    );
    return steps;
  }

  static rehash(table: OpenTable, type: HashTableType): HashStep[] {
    const steps: HashStep[] = [];
    const oldSize = table.length;
    const newSize = nextPrime(oldSize * 2);
    const existing = table.filter(
      (e): e is number => e !== null && e !== "DELETED",
    );

    steps.push(
      openSnap(
        table,
        {},
        type,
        `Rehashing — growing from size ${oldSize} to ${newSize}`,
        {
          subMessage: `Load factor exceeded 0.7 — rebuilding into larger table`,
          isMajorStep: true,
        },
      ),
    );

    // Show all old entries as rehashing
    const oldStates: Record<number, SlotState> = {};
    table.forEach((e, i) => {
      if (e !== null && e !== "DELETED") oldStates[i] = "rehashing";
    });
    steps.push(
      openSnap(
        table,
        oldStates,
        type,
        `Collecting ${existing.length} existing keys`,
        {
          subMessage: "All keys will be reinserted into the new table",
        },
      ),
    );

    // Build new table step by step
    const newTable = new Array<number | "DELETED" | null>(newSize).fill(null);
    steps.push(
      openSnap(newTable, {}, type, `New empty table — size ${newSize}`, {
        subMessage: `New hash function: h(k) = k mod ${newSize}`,
      }),
    );

    for (const key of existing) {
      const base = h1(key, newSize);
      for (let i = 0; i < newSize; i++) {
        const idx = probeIndex(key, i, newSize, type);
        if (newTable[idx] === null) {
          newTable[idx] = key;
          const states: Record<number, SlotState> = {};
          newTable.forEach((e, j) => {
            if (e !== null) states[j] = "occupied";
          });
          states[idx] = "inserted";
          steps.push(
            openSnap(
              newTable,
              states,
              type,
              `Reinserted ${key} → slot ${idx}`,
              {
                subMessage: `h(${key}) = ${key} mod ${newSize} = ${base}`,
                hashIndex: base,
              },
            ),
          );
          break;
        }
      }
    }

    const finalStates: Record<number, SlotState> = {};
    newTable.forEach((e, i) => {
      if (e !== null) finalStates[i] = "occupied";
    });
    steps.push(
      openSnap(newTable, finalStates, type, `Rehash complete`, {
        subMessage: `${existing.length} keys in table of size ${newSize}`,
        isMajorStep: true,
      }),
    );

    return steps;
  }
}

// ── Chaining steps ────────────────────────────────────────────────────────────

export class ChainingSteps {
  static insert(table: ChainingTable, key: number): HashStep[] {
    const steps: HashStep[] = [];
    const size = table.length;
    const idx = h1(key, size);

    steps.push(
      chainSnap(table, {}, {}, `insert(${key})`, {
        subMessage: `h(${key}) = ${key} mod ${size} = ${idx}`,
        isMajorStep: true,
        hashIndex: idx,
      }),
    );

    // Check duplicate
    const chain = table[idx];
    const dupPos = chain.indexOf(key);
    if (dupPos !== -1) {
      steps.push(
        chainSnap(
          table,
          { [idx]: "found" },
          { [`${idx}-${dupPos}`]: "found" },
          `${key} already in bucket ${idx} — no duplicate`,
          {
            isMajorStep: true,
            hashIndex: idx,
          },
        ),
      );
      return steps;
    }

    if (chain.length > 0) {
      steps.push(
        chainSnap(
          table,
          { [idx]: "probing" },
          {},
          `Bucket ${idx} has ${chain.length} node(s) — appending`,
          {
            subMessage: "Chaining: insert at end of linked list",
            hashIndex: idx,
          },
        ),
      );
    }

    // Show after insert
    const newTable = table.map((c, i) => (i === idx ? [...c, key] : [...c]));
    const nodeStates: Record<string, SlotState> = {
      [`${idx}-${newTable[idx].length - 1}`]: "inserted",
    };
    steps.push(
      chainSnap(
        newTable,
        { [idx]: "inserted" },
        nodeStates,
        `Inserted ${key} at bucket ${idx}`,
        {
          subMessage:
            chain.length === 0
              ? "Bucket was empty"
              : `Chain length is now ${newTable[idx].length}`,
          isMajorStep: true,
          hashIndex: idx,
        },
      ),
    );

    return steps;
  }

  static search(table: ChainingTable, key: number): HashStep[] {
    const steps: HashStep[] = [];
    const size = table.length;
    const idx = h1(key, size);

    steps.push(
      chainSnap(table, {}, {}, `search(${key})`, {
        subMessage: `h(${key}) = ${key} mod ${size} = ${idx}`,
        isMajorStep: true,
        hashIndex: idx,
      }),
    );

    const chain = table[idx];
    steps.push(
      chainSnap(
        table,
        { [idx]: "probing" },
        {},
        `Scanning bucket ${idx} (${chain.length} node${chain.length !== 1 ? "s" : ""})`,
        {
          hashIndex: idx,
        },
      ),
    );

    for (let j = 0; j < chain.length; j++) {
      const nodeState: Record<string, SlotState> = {
        [`${idx}-${j}`]: chain[j] === key ? "found" : "probing",
      };
      steps.push(
        chainSnap(
          table,
          { [idx]: chain[j] === key ? "found" : "probing" },
          nodeState,
          chain[j] === key
            ? `Found ${key} at bucket ${idx}, node ${j}!`
            : `Node ${j}: ${chain[j]} ≠ ${key}`,
          {
            isMajorStep: chain[j] === key,
            hashIndex: idx,
          },
        ),
      );
      if (chain[j] === key) return steps;
    }

    steps.push(
      chainSnap(table, {}, {}, `${key} not found in bucket ${idx}`, {
        isMajorStep: true,
        hashIndex: idx,
      }),
    );
    return steps;
  }

  static delete(table: ChainingTable, key: number): HashStep[] {
    const steps: HashStep[] = [];
    const size = table.length;
    const idx = h1(key, size);

    steps.push(
      chainSnap(table, {}, {}, `delete(${key})`, {
        subMessage: `h(${key}) = ${key} mod ${size} = ${idx}`,
        isMajorStep: true,
        hashIndex: idx,
      }),
    );

    const chain = table[idx];
    const pos = chain.indexOf(key);

    if (pos === -1) {
      steps.push(
        chainSnap(
          table,
          { [idx]: "probing" },
          {},
          `${key} not found in bucket ${idx}`,
          {
            isMajorStep: true,
            hashIndex: idx,
          },
        ),
      );
      return steps;
    }

    // Scan to it
    for (let j = 0; j <= pos; j++) {
      const ns: Record<string, SlotState> = {
        [`${idx}-${j}`]: chain[j] === key ? "deleted" : "probing",
      };
      steps.push(
        chainSnap(
          table,
          { [idx]: chain[j] === key ? "deleted" : "probing" },
          ns,
          chain[j] === key
            ? `Found ${key} — removing from chain`
            : `Node ${j}: ${chain[j]} — keep scanning`,
          {
            hashIndex: idx,
          },
        ),
      );
    }

    const newTable = table.map((c, i) =>
      i === idx ? c.filter((k) => k !== key) : [...c],
    );
    steps.push(
      chainSnap(
        newTable,
        { [idx]: "idle" },
        {},
        `${key} deleted from bucket ${idx}`,
        {
          subMessage: `Chain length is now ${newTable[idx].length}`,
          isMajorStep: true,
          hashIndex: idx,
        },
      ),
    );

    return steps;
  }

  static rehash(table: ChainingTable): HashStep[] {
    const steps: HashStep[] = [];
    const oldSize = table.length;
    const newSize = nextPrime(oldSize * 2);
    const existing = table.flat();

    steps.push(
      chainSnap(
        table,
        {},
        {},
        `Rehashing — growing from size ${oldSize} to ${newSize}`,
        {
          subMessage: `Load factor exceeded 1.0 — rebuilding`,
          isMajorStep: true,
        },
      ),
    );

    const oldBucketStates: Record<number, SlotState> = {};
    table.forEach((c, i) => {
      if (c.length > 0) oldBucketStates[i] = "rehashing";
    });
    steps.push(
      chainSnap(
        table,
        oldBucketStates,
        {},
        `Collecting ${existing.length} keys from all buckets`,
      ),
    );

    const newTable: ChainingTable = Array.from({ length: newSize }, () => []);
    steps.push(
      chainSnap(newTable, {}, {}, `New empty table — size ${newSize}`, {
        subMessage: `New hash function: h(k) = k mod ${newSize}`,
      }),
    );

    for (const key of existing) {
      const newIdx = h1(key, newSize);
      newTable[newIdx].push(key);
      const ns: Record<string, SlotState> = {
        [`${newIdx}-${newTable[newIdx].length - 1}`]: "inserted",
      };
      steps.push(
        chainSnap(
          newTable,
          { [newIdx]: "inserted" },
          ns,
          `Reinserted ${key} → bucket ${newIdx}`,
          {
            subMessage: `h(${key}) = ${key} mod ${newSize} = ${newIdx}`,
            hashIndex: newIdx,
          },
        ),
      );
    }

    steps.push(
      chainSnap(newTable, {}, {}, `Rehash complete`, {
        subMessage: `${existing.length} keys across ${newSize} buckets`,
        isMajorStep: true,
      }),
    );

    return steps;
  }
}
