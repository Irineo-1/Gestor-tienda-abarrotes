export interface DecodedCode {
    code: number;
    start: number;
    end: number;
    error?: number;
}

export interface CodeResult {
    code: string;
    format: string;
    start: number;
    end: number;
    codeset: number;
    startInfo: DecodedCode;
    decodedCodes: DecodedCode[];
    endInfo: DecodedCode;
    direction: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface ScanResult {
    codeResult: CodeResult;
    line: Point[];
    angle: number;
    pattern: number[];
    box: [number, number][];
    boxes: [number, number][][];
}
  