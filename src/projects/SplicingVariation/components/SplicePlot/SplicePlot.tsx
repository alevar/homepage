import * as d3 from 'd3';

import { 
    Transcriptome, 
    BedFile, 
    BedData, 
    D3Grid, 
    GridConfig
} from '../../../../types/api';
import { 
    ORFPlot, 
    TranscriptomePlot, 
    TranscriptomePlotLabels, 
    BarPlot,
    LinePlot,
    DataPlotArray
 } from '../../../../utils/plots';

interface SplicePlotData {
    transcriptome: Transcriptome;
    bedFiles: { donors: BedFile, acceptors: BedFile };
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
    private bedFiles: { donors: BedFile; acceptors: BedFile } = {
        donors: {
            data: new BedData(),
            fileName: "",
            status: 0,
        },
        acceptors: {
            data: new BedData(),
            fileName: "",
            status: 0,
        }
    };

    private gridConfig: GridConfig = {
        columns: 3,
        columnRatios: [0.8, 0.1, 0.1], // plot, labels, legend
        rowRatiosPerColumn: [
            [0.1, 0.45, 0.025, 0.05, 0.025, 0.15, 0.025, 0.05, 0.025, 0.15], // pathogen, transcriptome, spacer, donor fullgenome barplot, spacer, donor expression, spacer, acceptor expression, spacer, acceptor expression
            [0.1, 0.45, 0.025, 0.05, 0.025, 0.15, 0.025, 0.05, 0.025, 0.15], // pathogen, transcriptome, spacer, donor fullgenome barplot, spacer, donor expression, spacer, acceptor expression, spacer, acceptor expression
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

        this.svg = svgElement;

        this.grid = new D3Grid(this.svg, this.height, this.width, this.gridConfig);
    }

    public plot(): void {
        const pathogenPlotSvg = this.grid.getCellSvg(0, 0);
        if (pathogenPlotSvg) {
            const dimensions = this.grid.getCellDimensions(0, 0);
            const coordinates = this.grid.getCellCoordinates(0, 0);

            const ORFPlotDimensions = {
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
                x: coordinates?.x || 0,
                y: coordinates?.y || 0,
                fontSize: this.fontSize,
            };

            const orfPlot = new ORFPlot(pathogenPlotSvg, {
                dimensions: ORFPlotDimensions,
                transcriptome: this.transcriptome
            });
            this.grid.setCellData(0, 0, orfPlot);
            orfPlot.plot();
        }

        const transcriptomePlotSvg = this.grid.getCellSvg(0, 1);
        let gene_coords: any[] = [];
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
            gene_coords = transcriptomePlot.plot();
        }

        const geneLabelPlotSvg = this.grid.getCellSvg(1, 1);
        if (geneLabelPlotSvg) {
            const dimensions = this.grid.getCellDimensions(1, 1);
            const coordinates = this.grid.getCellCoordinates(1, 1);

            const geneLabelPlotDimensions = {
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
                x: coordinates?.x || 0,
                y: coordinates?.y || 0,
                fontSize: this.fontSize,
            };

            const geneLabelPlot = new TranscriptomePlotLabels(geneLabelPlotSvg, {
                dimensions: geneLabelPlotDimensions,
                genes: gene_coords
            });
            this.grid.setCellData(1, 1, geneLabelPlot);
            geneLabelPlot.plot();
        }

        // draw donors on overlay
        const donor_dashedLine_overlaySvg = this.grid.createOverlaySvg(0, [0, 1, 2]);
        if ( donor_dashedLine_overlaySvg ) {
            const dimensions = this.grid.getCellDimensions(0, 1);

            for (const donor of this.transcriptome.donors()) {
                const donor_x = donor / this.transcriptome.getEnd() * (dimensions?.width || 0);
                donor_dashedLine_overlaySvg.append("line")
                    .attr("x1", donor_x)
                    .attr("y1", 0)
                    .attr("x2", donor_x)
                    .attr("y2", this.height)
                    .attr("stroke", "#F78154")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "5,5");
            }
        }

        // draw acceptors on overlay
        const acceptor_dashedLine_overlaySvg = this.grid.createOverlaySvg(0, [0, 1, 2, 3, 4, 5, 6]);
        if ( acceptor_dashedLine_overlaySvg ) {
            const dimensions = this.grid.getCellDimensions(0, 1);

            for (const acceptor of this.transcriptome.acceptors()) {
                const acceptor_x = acceptor / this.transcriptome.getEnd() * (dimensions?.width || 0);
                acceptor_dashedLine_overlaySvg.append("line")
                    .attr("x1", acceptor_x)
                    .attr("y1", 0)
                    .attr("x2", acceptor_x)
                    .attr("y2", this.height)
                    .attr("stroke", "#5FAD56")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "5,5");
            }
        }

        // plot donor full genome barplot
        const donorFullGenomePlotSvg = this.grid.getCellSvg(0, 3);
        if (donorFullGenomePlotSvg) {
            const dimensions = this.grid.getCellDimensions(0, 3);
            const coordinates = this.grid.getCellCoordinates(0, 3);

            const donorFullGenomePlotDimensions = {
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
                x: coordinates?.x || 0,
                y: coordinates?.y || 0,
                fontSize: this.fontSize,
            };

            const donorFullGenomePlot = new BarPlot(donorFullGenomePlotSvg, {
                dimensions: donorFullGenomePlotDimensions,
                bedData: this.bedFiles.donors.data,
                transcriptome: this.transcriptome,
                color: "#F78154"
            });
            this.grid.setCellData(0, 3, donorFullGenomePlot);
            donorFullGenomePlot.plot();
        }

        const dataPlotArraySvg = this.grid.getCellSvg(0, 5);
        if (dataPlotArraySvg) {
            const dimensions = this.grid.getCellDimensions(0, 5);
            const coordinates = this.grid.getCellCoordinates(0, 5);

            const dataPlotArrayDimensions = {
                width: dimensions?.width || 0,
                height: dimensions?.height || 0,
                x: coordinates?.x || 0,
                y: coordinates?.y || 0,
                fontSize: this.fontSize,
            };

            
            let donor_positions: number[] = []; // gather list of donor positions
            let maxExpression = 0; // find max expression value
            for (const donor of this.transcriptome.donors()) {
                donor_positions.push(donor);
                this.bedFiles.donors.data.getPos(donor).forEach((d) => {
                    if (d.score > maxExpression) {
                        maxExpression = d.score;
                    }
                });
            }
            const dataPlotArray = new DataPlotArray({
                svg: dataPlotArraySvg,
                dimensions: dataPlotArrayDimensions,
                coordinateLength: this.transcriptome.getEnd(),
                elements: donor_positions,
                elementWidth: 100,
                maxValue: maxExpression,
            });
            this.grid.setCellData(0, 5, dataPlotArray);
        }

        this.grid.promote(0, 0);
        this.grid.promote(0, 3);
        this.grid.promote(0, 5);
    }
}
