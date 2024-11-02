export interface BedLine {
    seqid: string;
    start: number;
    end: number;
    name: string;
    score: number;
    strand: string;
}

export interface BedFile {
    data: BedLine[];
    fileName: string;
    status: 1 | 0 | -1; // valid | parsing | error
}

export type Interval = [number, number];

export interface Dimensions {
    width: number;
    height: number;
    x: number;
    y: number;
    fontSize: number;
}