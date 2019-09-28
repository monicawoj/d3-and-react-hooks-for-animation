import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "d3-selection-multi";
import { getData, getDimensionObject } from "../../utils";
import { getCustomD3Scales } from "../../utils/chartProperties";
import Axis from "../Axis";
import Marker from "./Marker";
// import { default as useBoundingClientRect } from "@rooks/use-boundingclientrect";

const ScatterPlot = ({ margins }) => {
  let containerRef = useRef(null);
  let chartRef = useRef(null);

  const [data, setData] = useState(getData());

  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const { width, height } = dimensions;
  const { xScale, yScale, colorScale } = getCustomD3Scales({
    data,
    dimensions
  });

  //hook to change data at given interval
  useEffect(() => {
    const interval = setInterval(() => {
      setData(getData());
    }, 5000);
    return () => clearInterval(interval);
  }, [setData]);

  // hook to change something else in our application that affects our visual (like say, the chart type... here we are not affecting the data or size, just the internal contents, but it is triggered from 'outside' d3!)

  //hook to add event listener for window resize so we can watch the dimensions
  useEffect(() => {
    const resizeListener = window.addEventListener("resize", () => {
      const dimensions = getDimensionObject(containerRef.current);
      setDimensions(dimensions);
    });

    return () => window.removeEventListener(resizeListener);
  }, []);

  //hook to redraw chart when data or dimensions change
  useEffect(() => updateChart(data), [data, dimensions]);

  // and thats really everything we need to deal with 'from outside'
  // the next piece, now that we have the whole picture, is dealing with the 'inside' (animation/transitions for each data point)

  // so we have 4 types of 'events' that we need to address:
  // 1. change from outside that affects our picture as a whole (data, dimensions)
  // 2. change from outside that affects our picture's elements (like say a dropdown for chart type)
  // 3. change from element that affects that given element (like clicking on a given element and having it do something)
  // 4. change from element that affects the bigger picture! (like clicking on an element, but that deletes all other elements, or has them change shape)

  // oh, I have an idea. a super cool bar chart.
  // 1. change in data or dimensions
  // 2. changing the type of chart we want to visualize
  // 3. changing a bar into a flower when it is clicked
  // 4. changing all other bars to grass when that one element is clicked?

  // we need to know how to approach each one of these!

  const initialStyles = {
    fill: d => colorScale(d.y)
  };
  const initialAttrs = {
    cx: d => xScale(d.x),
    cy: d => yScale(d.y),
    r: 5
  };

  const updateChart = data => {
    d3.select(chartRef.current)
      .selectAll("circle")
      .data(data)
      .transition()
      .duration(1000)
      .attrs(initialAttrs)
      .styles(initialStyles);
  };

  const circles = data.map(d => (
    <Marker
      d={d}
      key={d.name}
      fill={initialStyles.fill}
      radius={initialAttrs.r}
    />
  ));

  return (
    <div ref={containerRef} style={{ width: "90%", height: "90vh" }}>
      <svg width={width} height={height} ref={chartRef}>
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
