import * as d3 from 'd3';

import { Transcriptome, BedFile, D3Grid, GridConfig } from '../../../../types/api';
import { PathogenPlot, TranscriptomePlot } from '../../../../utils/plots';

interface SplicePlotData {
    transcriptome: Transcriptome;
    bedFiles: BedFile[];
    width: number;
    height: number;
    fontSize: number;
}

export class SplicePlot {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private width: number;
    private height: number;
    private fontSize: number;
    private transcriptome: Transcriptome = new Transcriptome();
    private bedFiles: BedFile[] = [];

    private gridConfig: GridConfig = {
        columns: 3,
        columnRatios: [0.8, 0.1, 0.1], // plot, labels, legend
        rowRatiosPerColumn: [
            [0.1, 0.45, 0.025, 0.2, 0.025, 0.2], // pathogen, transcriptome, spacer, donor expression, spacer, acceptor expression
            [0.1, 0.45, 0.025, 0.2, 0.025, 0.2], // pathogen, transcriptome, spacer, donor expression, spacer, acceptor expression
            [1], // 1 row: legend
        ],
    };
    private grid: D3Grid;

    constructor(svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
        data: SplicePlotData) {

        this.width = data.width;
        this.height = data.height;
        this.fontSize = data.fontSize;

        this.transcriptome = data.transcriptome;
        this.bedFiles = data.bedFiles;
        console.log(this.bedFiles);

        this.svg = svgElement;

        this.grid = new D3Grid(this.svg, this.height, this.width, this.gridConfig);
    }

    public plot(): void { 
        const pathogenPlotSvg = this.grid.getCellSvg(0, 0);
        if (pathogenPlotSvg) {
            const dimensions = this.grid.getCellDimensions(0, 0);
            const coordinates = this.grid.getCellCoordinates(0, 0);

            const pathogenPlotDimensions = {
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
                x: coordinates?.x || 0,
                y: coordinates?.y || 0,
                fontSize: this.fontSize,
            };

            const pathogenPlot = new PathogenPlot(pathogenPlotSvg, {
                dimensions: pathogenPlotDimensions, 
                transcriptome: this.transcriptome
            });
            this.grid.setCellData(0, 0, pathogenPlot);
            pathogenPlot.plot();
        }

        const transcriptomePlotSvg = this.grid.getCellSvg(0, 1);
        if (transcriptomePlotSvg) {
            const dimensions = this.grid.getCellDimensions(0, 1);
            const coordinates = this.grid.getCellCoordinates(0, 1);

            const transcriptomePlotDimensions = {
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
                x: coordinates?.x || 0,
                y: coordinates?.y || 0,
                fontSize: this.fontSize,
            };

            const transcriptomePlot = new TranscriptomePlot(transcriptomePlotSvg, {
                dimensions: transcriptomePlotDimensions, 
                transcriptome: this.transcriptome
            });
            this.grid.setCellData(0, 1, transcriptomePlot);
            transcriptomePlot.plot();
        }

        this.grid.promote(0, 0);
        this.grid.promote(0, 3);
    }
}
