import { TranscriptPlot } from './TranscriptPlot';
import { Transcriptome, Dimensions, D3Grid, GridConfig } from '../../types/api';

// builds a panel of all transcripts to be plotted

interface TranscriptomePlotData {
    transcriptome: Transcriptome;
    dimensions: Dimensions;
}

export class TranscriptomePlot {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private dimensions: Dimensions;
    private transcriptome: Transcriptome;

    private transcript_height: number = 0;

    private genes: any = []; // gene groups mapping gene name to upper and lower y coordinates in the plot

    private gridConfig: GridConfig = {
        columns: 1,
        columnRatios: [1],
        rowRatiosPerColumn: [
            [],
        ],
    };
    private grid: D3Grid;

    constructor(svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
        data: TranscriptomePlotData) {
        this.svg = svgElement;
        this.dimensions = data.dimensions;
        this.transcriptome = data.transcriptome;
        this.transcript_height = this.dimensions.height / this.transcriptome.numTranscripts();
        this.genes = [];

        console.log("transcriptome plot", this.dimensions, this.transcriptome.getEnd());

        // construct grid
        const transcript_ratio = 1 / this.transcriptome.numTranscripts();
        for (const _ of this.transcriptome) {
            // add row for each transcript
            this.gridConfig.rowRatiosPerColumn[0].push(transcript_ratio);
        }

        this.grid = new D3Grid(this.svg, this.dimensions.height, this.dimensions.width, this.gridConfig);
    }

    public plot(): [] {
        let tx_idx = 0;
        for (const [gene_id, transcripts] of this.transcriptome.genes()) {
            for (const transcript of transcripts) {
                const txPlotSvg = this.grid.getCellSvg(0, tx_idx);
                tx_idx += 1;

                if (txPlotSvg) {
                    const svg_dimensions = this.grid.getCellDimensions(0, tx_idx);
                    const svg_coordinates = this.grid.getCellCoordinates(0, tx_idx);

                    const y_pos = svg_coordinates?.y || 0;
                    this.genes.push({ "name": gene_id, "y": [y_pos, y_pos + this.transcript_height] });

                    const txPlotDimensions = {
                        width: svg_dimensions?.width || 0,
                        height: svg_dimensions?.height || 0,
                        x: svg_coordinates?.x || 0,
                        y: svg_coordinates?.y || 0,
                        fontSize: this.dimensions.fontSize,
                    };

                    const txPlot = new TranscriptPlot(txPlotSvg, {
                        dimensions: txPlotDimensions,
                        genome_length: this.transcriptome.getEnd(),
                        transcript: transcript
                    });
                    txPlot.plot();
                }
            }
        }
        return this.genes;
    }
}