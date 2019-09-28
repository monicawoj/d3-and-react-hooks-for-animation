import * as d3 from "d3";

export const getCustomD3Scales = ({ data, dimensions }) => {
  return {
    xScale: d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, dimensions.width]),
    yScale: d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([0, dimensions.height]),
    colorScale: d3
      .scaleSequential(d3.interpolateSpectral)
      .domain(d3.extent(data, d => d.y))
  };
};
