// Simulates network latency so loading states in the UI behave the same
// way they will once real API calls replace these mock repositories.
export function mockDelay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let idCounter = 1000;
// Generates a locally-unique id for newly created mock records.
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
