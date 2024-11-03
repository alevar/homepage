import * as d3 from 'd3';

import { Dimensions, BedData, D3Grid, GridConfig, Interval } from '../../types/api';
import { adjustIntervals } from '../utils';

interface DataPlotArrayData {
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    dimensions: Dimensions;
    elements: number[];
    elementWidth: number;
    coordinateLength: number,
    maxValue: number;
}

// sets up a grid for displaying multiple data plots
// keeps consistent scale across all plots
// provides a mapping of coordinates to x-axis positions on the global grid
// provides interface for insertind data plots into the grid
export class DataPlotArray {
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private dimensions: Dimensions;
    private elements: number[];
    private elementWidth: number;
    private coordinateLength: number;
    private maxValue: number;

    private yScale: d3.ScaleLinear<number, number>;

    private raw_xs: Interval[]; // positions of the elements before spreading
    private spread_elements: Interval[]; // positions of the elements on the transformed grid
    private element_indices: number[]; // indices of the elements in the grid

    private gridConfig: GridConfig = {
        columns: 1,
        columnRatios: [1],
        rowRatiosPerColumn: [
            [1],
        ],
    };
    private grid: D3Grid;

    constructor(
        data: DataPlotArrayData) {
        this.svg = data.svg;
        this.dimensions = data.dimensions;
        this.elements = data.elements;
        this.elementWidth = data.elementWidth;
        this.coordinateLength = data.coordinateLength;
        this.maxValue = data.maxValue;

        this.yScale = d3.scaleLinear();

        // compute mapping of x-axis positions to the grid
        this.raw_xs = [];
        this.spread_elements = [];
        this.build_xs();
        
        // setup the grid based on the coordinates
        this.element_indices = [];
        this.grid = this.build_grid();
    }

    private build_xs(): void {
        let spread_xs: any = [];

        this.elements.forEach(elem => {
            const percent_position = (elem / this.coordinateLength) * this.dimensions["width"];
            const interval_start = percent_position - this.elementWidth / 2;
            const interval_end = percent_position + this.elementWidth / 2;
            this.raw_xs.push([interval_start, interval_end]);
            spread_xs.push([interval_start, interval_end]);
        });

        this.spread_elements = adjustIntervals(spread_xs, 1, this.dimensions["width"], 25);
    }

    private build_grid(): D3Grid {
        // create a grid config based on the spread elements assinging them to their own columns
        // keep spacers between each cell
        let config: GridConfig = {
            columns: this.spread_elements.length,
            columnRatios: [] as number[],
            rowRatiosPerColumn: [
            ],
        }
        let spacer_start = 0;
        let spacer_end = 0;
        let elem_idx = 0;
        this.spread_elements.forEach(interval => {
            // create spacer unless interval starts at 0
            spacer_end = interval[0];
            if (interval[0] !== 0) {
                const spacer_width = spacer_end - spacer_start;
                config.columnRatios.push(spacer_width / this.dimensions["width"]);
                config.rowRatiosPerColumn.push([1]);
                elem_idx += 1;
            }
            // create element
            const element_width = interval[1] - interval[0];
            config.columnRatios.push(element_width / this.dimensions["width"]);
            config.rowRatiosPerColumn.push([1]);
            this.element_indices.push(elem_idx);
            elem_idx += 1;
        });

        return new D3Grid(this.svg, this.dimensions.height, this.dimensions.width, config);
    }
    
}

