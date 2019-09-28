import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import Axis from "../Axis";

const ScatterPlot = ({ data, dimensions, margins }) => {
  const { width, height } = dimensions;
  let chartRef = useRef(null);

  useEffect(() => updateChart(data), [data]);

  //scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([0, height]);
  const colorScale = d3
    .scaleSequential(d3.interpolateSpectral)
    .domain(d3.extent(data, d => d.y));

  const updateChart = data => {
    d3.select(chartRef.current)
      .selectAll("circle")
      .data(data)
      .transition()
      .duration(1000)
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .style("fill", d => colorScale(d.y));
  };

  const circles = data.map(d => <circle key={d.name} />);

  return (
    <div>
      <svg
        width={width + margins.left + margins.right}
        height={height + margins.top + margins.bottom}
        ref={chartRef}
      >
        <Axis
          orientation="Bottom"
          scale={xScale}
          transform={`translate(${margins.left}, ${height + margins.top})`}
        />
        <Axis
          orientation="Left"
          scale={yScale}
          transform={`translate(${margins.left}, ${margins.top})`}
        />
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          {circles}
        </g>
      </svg>
    </div>
  );
};

export default ScatterPlot;
