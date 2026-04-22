export type Word = {
  word: string, x: number, y: number, width: number, height: number, isSentenceEnd: boolean, isParaEnd: boolean, pi: number
}

export type WordBoundary = {
  word: number[], sentence: number[], paragraph: number[], y: number
}

export type BoundaryKey = `word` | `sentence` | `paragraph`;
