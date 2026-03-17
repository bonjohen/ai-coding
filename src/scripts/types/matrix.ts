export interface MatrixCell {
  levelId: string;
  summary: string;
  detail: string[];
}

export interface MatrixRow {
  dimensionId: string;
  cells: MatrixCell[];
}

export interface MatrixConfig {
  familyId: string;
  rows: MatrixRow[];
}
