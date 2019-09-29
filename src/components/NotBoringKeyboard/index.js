import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "d3-selection-multi";
import { getDimensionObject } from "../../utils";
// import { getCustomD3Scales } from "../../utils/chartProperties";
import Axis from "../Axis";
// import Marker from "./Marker";
// import { default as useBoundingClientRect } from "@rooks/use-boundingclientrect";

const NotBoringKeyboard = ({ margins }) => {
  let containerRef = useRef(null);
  let barchartRef = useRef(null);
  // let scatterplotRef = useRef(null);
  const [log, setLog] = useState("Text: ");
  const [data, setData] = useState([
    { value: "a", count: 0, color: "#2176ae" },
    { value: "s", count: 0, color: "#57b8ff" },
    { value: "d", count: 0, color: "#b66d0d" },
    { value: "f", count: 0, color: "#fbb13c" }
  ]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 200 });
  const { width, height } = dimensions;
  // const { xScale, yScale } = getCustomD3Scales({
  //   data,
  //   dimensions
  // });

  //hook to add event listener for window resize so we can watch the dimensions
  useEffect(() => {
    const resizeListener = window.addEventListener("resize", () => {
      const dimensions = getDimensionObject(containerRef.current);
      setDimensions(dimensions);
    });

    return () => window.removeEventListener(resizeListener);
  }, []);

  //hook to redraw barchart when data or dimensions change
  useEffect(() => updateBarChart(), [setData, dimensions]);

  //hook to redraw scatterplot when data or dimensions change
  // useEffect(() => updateScatterplot(data), [data, dimensions]);

  // hook to update data whenever a key is pressed
  useEffect(() => {
    const keypressListener = document.addEventListener("keypress", e => {
      const update = data => data.filter(item => item.value === e.key)[0];
      const maintain = data => data.filter(item => item.value !== e.key);
      setData(data => [
        ...maintain(data),
        { ...update(data), count: update(data).count + 1 }
      ]);
      setLog(log => [...log, e.key].join(""));
      updateBarChart(e.key);
    });

    return () => document.removeEventListener(keypressListener);
  }, []);

  // hook to redraw barchart when data changes

  const updateBarChart = keyPressed => {
    const xBarScale = d3
      .scaleBand()
      .domain(["a", "s", "d", "f"])
      .range([0, width]);
    const yBarScale = d3
      .scaleLinear()
      .domain([0, 2])
      .range([0, height]);

    d3.select(barchartRef.current)
      .selectAll("rect")
      .data(data)
      .attr("x", d => xBarScale(d.value))
      .attr("width", xBarScale.bandwidth())
      .transition()
      .duration(100)
      .attr("y", d => yBarScale(1))
      .attr("height", d =>
        d.value === keyPressed ? height - yBarScale(1) : yBarScale(0.1)
      )
      .style("fill", d => (d.value === keyPressed ? d.color : "grey"))
      .transition()
      .duration(300)
      .attr("y", d => yBarScale(1))
      .attr("height", d => yBarScale(0.1))
      .style("fill", d => "grey");
  };

  const bars = data.map(d => <rect key={d.value} />);

  // const initialScatterAttrs = {
  //   cx: d => xScale(d.value),
  //   cy: d => yScale(d.count),
  //   r: 5
  // };

  // const updateScatterplot = data => {
  //   d3.select(scatterplotRef.current)
  //     .selectAll("circle")
  //     .data(data)
  //     .transition()
  //     .duration(1000)
  //     .attrs(initialAttrs);
  // };

  // const circles = data.map(d => (
  //   <Marker
  //     d={d}
  //     key={d.name}
  //     fill={initialStyles.fill}
  //     radius={initialAttrs.r}
  //   />
  // ));

  const reset = () => {
    const updatedData = data => data.map(letter => ({ ...letter, count: 0 }));
    setData(data => updatedData(data));
    setLog("Text: ");
  };

  return (
    <div ref={containerRef} style={{ width: 800, height: 500 }}>
      <div>{log}</div>
      <button onClick={reset}>Reset</button>
      {/* <svg
        width={width}
        height={height}
        ref={scatterplotRef}
        transform={`translate(${margins.left}, ${margins.top})`}
      >
        {points}
      </svg> */}
      <svg
        width={width}
        height={height}
        ref={barchartRef}
        transform={`translate(${margins.left}, ${height + margins.top})`}
      >
        {bars}
      </svg>
      {/* <svg width={width} height={height} ref={scatterplotRef}>
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
      </svg> */}
    </div>
  );
};

export default NotBoringKeyboard;
