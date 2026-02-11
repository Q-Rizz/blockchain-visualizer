import SHA256 from "crypto-js/sha256";

export interface BlockData {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  miningTime?: number;
}

export function calculateHash(
  index: number,
  previousHash: string,
  timestamp: number,
  data: string,
  nonce: number
): string {
  return SHA256(
    index.toString() + previousHash + timestamp.toString() + data + nonce.toString()
  ).toString();
}

export function createGenesisBlock(): BlockData {
  const timestamp = 0;
  const hash = calculateHash(0, "0", timestamp, "Genesis Block", 0);
  return {
    index: 0,
    timestamp,
    data: "Genesis Block",
    previousHash: "0",
    nonce: 0,
    hash,
  };
}

export function mineBlock(
  index: number,
  data: string,
  previousHash: string,
  difficulty: number
): BlockData {
  const timestamp = Date.now();
  const target = "0".repeat(difficulty);
  let nonce = 0;
  let hash = calculateHash(index, previousHash, timestamp, data, nonce);
  const startTime = performance.now();

  while (hash.substring(0, difficulty) !== target) {
    nonce++;
    hash = calculateHash(index, previousHash, timestamp, data, nonce);
  }

  const miningTime = Math.round(performance.now() - startTime);

  return {
    index,
    timestamp,
    data,
    previousHash,
    nonce,
    hash,
    miningTime,
  };
}

export function isChainValid(chain: BlockData[]): boolean {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    const recalculatedHash = calculateHash(
      currentBlock.index,
      currentBlock.previousHash,
      currentBlock.timestamp,
      currentBlock.data,
      currentBlock.nonce
    );

    if (currentBlock.hash !== recalculatedHash) {
      return false;
    }

    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }
  }
  return true;
}

export function getInvalidBlockIndices(chain: BlockData[]): Set<number> {
  const invalid = new Set<number>();

  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    const recalculatedHash = calculateHash(
      currentBlock.index,
      currentBlock.previousHash,
      currentBlock.timestamp,
      currentBlock.data,
      currentBlock.nonce
    );

    if (currentBlock.hash !== recalculatedHash) {
      invalid.add(i);
    }

    if (currentBlock.previousHash !== previousBlock.hash) {
      invalid.add(i);
    }
  }

  return invalid;
}
