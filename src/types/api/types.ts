export interface BedLine {
    seqid: string;
    start: number;
    end: number;
    name: string;
    score: number;
    strand: string;
}

export class BedData {
    private data: BedLine[];

    constructor() {
        this.data = [];
    }

    public addLine(line: BedLine): void {
        this.data.push(line);
    }

    public get length(): number {
        return this.data.length;
    }

    public sort(): void {
        this.data.sort((a, b) => a.start - b.start);
    }

    public numEntries(): number {
        return this.data.length;
    }

    public maxScore(): number {
        return Math.max(...this.data.map(d => d.score));
    }

    public getData(): BedLine[] {
        return this.data;
    }

    public getPos(pos: number): BedLine[] {
        return this.data.filter(d => d.start <= pos && d.end >= pos);
    }
}

export interface BedFile {
    data: BedData;
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