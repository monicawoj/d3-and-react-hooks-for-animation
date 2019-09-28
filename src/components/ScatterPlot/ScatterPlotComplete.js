import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import Axis from "../Axis/AxisComplete";

//0. accept data and dimensions from outside
const ScatterPlot = ({ data, dimensions, margins }) => {
  const { width, height } = dimensions;

  //2. create a ref for our SVG, so D3 has access to it later
  let chartRef = useRef(null);

  //6. redraw our chart whenever our data changes
  useEffect(() => updateChart(data), [data]);

  //4. define our scales
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

  //5. draw our shapes
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

  //3. map our data to elements
  const circles = data.map(d => <circle key={d.name} />);
  console.log(data);

  //1. start with an svg so we can draw something
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

//0. we're going to make this a little more interesting - this time our element is going to accept data and dimensions from outside
//1. let's start with our svg - because we know we'll need this eventually (props width, height)
//2. now since we're sharing rendering power, we'll need to give this a guy a ref (we can use a hook for that!)
//3. now since we have a place to draw, let's add our other elements (circles)
//4. let's define our scales so we can put those circles where we want them (xScale and yScale)
//5. let's create the draw / update function so we can style and position based on those scales
//6. let's add transition to udpate function
//7. ok now hmm, some color! we add colorScale for this and .attr('fill')
//8. and now, how about some axes so we can read what this data means (create new Axis file - with scale, orientation, transform function)
//9. Ta da, all done!
