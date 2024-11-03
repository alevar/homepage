import * as d3 from "d3";

import { Dimensions, BedData, Transcriptome } from '../../types/api';

interface BarPlotData {
    dimensions: Dimensions;
    transcriptome: Transcriptome;
    bedData: BedData;
    color: string;
}

export class BarPlot {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private dimensions: Dimensions;
    private bedData: BedData;
    private transcriptome: Transcriptome;
    private yScale: d3.ScaleLinear<number, number>;
    private color: string;

    constructor(
        svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
        data: BarPlotData) {
        this.svg = svg;
        this.dimensions = data.dimensions;
        this.bedData = data.bedData;
        this.transcriptome = data.transcriptome;
        this.color = data.color;

        this.yScale = d3.scaleLinear();
    }

    public get_yScale(): d3.ScaleLinear<number, number> {
        return this.yScale;
    }

    public plot(): void {

        // Create the x-axis scale
        const xScale = d3.scaleLinear()
            .domain([0, this.transcriptome.getEnd()])
            .range([0, this.dimensions.width]);

        // Create the y-axis scale
        this.yScale = d3.scaleLinear()
            .domain([0, this.bedData.maxScore()])
            .range([0,this.dimensions.height]);

        // Add a background rectangle for the grid
        this.svg.append("rect")
            .attr("class", "grid-background")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.height)
            .attr("fill", "#f7f7f7")
            .attr("fill-opacity", 0.75);

        // Add horizontal grid lines
        this.svg.append("g")
            .attr("class", "grid")
            .attr("stroke", "rgba(0, 0, 0, 0.1)")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.3)
            .call(d3.axisLeft(this.yScale)
                .ticks(2)
                .tickSize(-this.dimensions.width)
                .tickFormat(null));

        const minBarWidth = 5;
        this.svg.selectAll(".bar")
            .data(this.bedData.getData())
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.start)) // Position the bar based on start
            .attr("y", d => this.yScale(d.score)) // Position the top of the bar based on score
            .attr("width", d => Math.min(xScale(d.end) - xScale(d.start), minBarWidth)) // Width is based on start to end
            .attr("height", d => this.dimensions.y + this.dimensions.height - this.yScale(d.score)) // Height based on score
            .attr("fill", this.color);
    }
}