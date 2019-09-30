import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "d3-selection-multi";
import { alphabet, alphabetQwerty, getQwertyX, getQwertyY } from "./utils";

import "./style.css";

const NotBoringKeyboard = ({ margins }) => {
  let containerRef = useRef(null);
  let chartRef = useRef(null);
  let axisLeftRef = useRef(null);
  let axisBottomRef = useRef(null);

  const [pointsData, setPointsData] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [xAxisType, setXAxisType] = useState("QWERTY");
  const [yAxisType, setYAxisType] = useState("SCATTERED");

  const colorScale = d3
    .scaleLinear()
    .domain([0, 5, 9])
    .range(["purple", "blue", "green"])
    .interpolate(d3.interpolateHcl);

  const initialData = [...alphabetQwerty].map((d, i) => ({
    value: d,
    count: 0,
    color: d3.color(colorScale(i)),
    id: `${d}${i}`,
    qwertyX: getQwertyX(d),
    qwertyY: getQwertyY(d)
  }));

  const [barData, setBarData] = useState(initialData);
  const width = 800 - margins.left - margins.right;
  const height = 500 - margins.top - margins.bottom;

  // hook to set data when our user input changes
  useEffect(() => {
    const cleanedData = userInput.replace(/[^a-zA-Z;,./]/g, "");
    setPointsData(
      [...cleanedData].map((d, i) => ({ value: d, id: `${d}${i}` }))
    );

    const totalOfGivenLetter = letter =>
      [...cleanedData].filter(d => d === letter).length;

    setBarData(
      [...alphabetQwerty].map((d, i) => ({
        value: d,
        count: totalOfGivenLetter(d),
        color: d3.color(colorScale(i)),
        id: `${d}${i}`,
        qwertyX: getQwertyX(d),
        qwertyY: getQwertyY(d)
      }))
    );
  }, [userInput]);

  // hook to add event listener for window resize so we can watch the dimensions
  // useEffect(() => {
  //   const resizeListener = window.addEventListener("resize", () => {
  //     const dimensions = getDimensionObject(containerRef.current);
  //     setDimensions(dimensions);
  //   });
  //   return () => window.removeEventListener(resizeListener);
  // }, []);

  // hook to update charts when our data changes
  useEffect(() => {
    if (pointsData.length) {
      updateScatterplot({
        transitionType: "keypress",
        transitionValue: pointsData[pointsData.length - 1].value
      });
      updateBarChart({
        transitionType: "keypress",
        transitionValue: pointsData[pointsData.length - 1].value
      });
    }
  }, [pointsData]);

  // hook to update x scale to alphabetic/qwerty on button click
  useEffect(() => {
    updateScatterplot({ transitionType: "xaxis" });
    updateBarChart({ transitionType: "xaxis" });
  }, [xAxisType]);

  // hook to update y scale to cumulative/index view on button click
  useEffect(() => {
    updateScatterplot({ transitionType: "yaxis" });
    updateBarChart({ transitionType: "yaxis" });
  }, [yAxisType]);

  const updateData = ({ target: { value } }) => {
    setUserInput(value);
  };

  const updateAxis = ({ ref, orientation, scale }) => {
    let axisFunction;
    switch (orientation) {
      case "Bottom":
        axisFunction = d3.axisBottom;
        break;
      case "Left":
        axisFunction = d3.axisLeft;
        break;
      case "Top":
        axisFunction = d3.axisTop;
        break;
      case "Right":
        axisFunction = d3.axisRight;
        break;
      default:
        break;
    }

    d3.select(ref.current).call(axisFunction(scale));
  };

  const updateBarChart = ({ transitionType = "", transitionValue = "" }) => {
    const xBarScale = d3
      .scaleBand()
      .domain(xAxisType === "QWERTY" ? [...alphabetQwerty] : [...alphabet])
      .range([0, width]);
    const yBarScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, height / 2]);

    if (transitionType === "xaxis") {
      d3.select(chartRef.current)
        .selectAll("rect")
        .data(barData)
        .transition()
        .duration(1000)
        .attr("x", d => xBarScale(d.value));
    }

    if (transitionType === "yaxis") {
      d3.select(chartRef.current)
        .selectAll("rect")
        .data(barData)
        .transition()
        .duration(1000)
        .attr("y", d => yBarScale(1));
    }

    if (transitionType === "keypress") {
      d3.select(chartRef.current)
        .selectAll("rect")
        .data(barData)
        .attr("x", d => xBarScale(d.value))
        .attr("width", xBarScale.bandwidth())
        .transition()
        .duration(100)
        .attr("y", d => yBarScale(1))
        .attr("height", d =>
          d.value === transitionValue ? height - yBarScale(1) : yBarScale(0.1)
        )
        .style("fill", d => (d.value === transitionValue ? d.color : "white"))
        .transition()
        .duration(1000)
        .attr("y", d => yBarScale(1))
        .attr("height", d => yBarScale(0.1))
        .style("fill", d => "white");
    }
  };

  const updateScatterplot = ({ transitionType = "", transitionValue = "" }) => {
    const xScale = d3
      .scalePoint()
      .padding(0.5)
      .domain(xAxisType === "QWERTY" ? [...alphabetQwerty] : [...alphabet])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, pointsData.length])
      .range([height / 2, 0]);

    if (transitionType === "xaxis") {
      d3.select(chartRef.current)
        .selectAll("circle")
        .data(pointsData)
        .transition()
        .duration(1000)
        .attr("cx", d => xScale(d.value));

      return updateAxis({
        ref: axisBottomRef,
        orientation: "Bottom",
        scale: xScale
      });
    }

    if (transitionType === "yaxis") {
      d3.select(chartRef.current)
        .selectAll("circle")
        .data(pointsData)
        .attr("r", 5)
        .attr("cx", d => xScale(d.value))
        .style("fill", "grey")
        .transition()
        .duration(1000)
        .attr("cy", (d, i) => yScale(i));

      return updateAxis({
        ref: axisLeftRef,
        orientation: "Left",
        scale: yScale
      });
    }

    if (transitionType === "keypress") {
      d3.select(chartRef.current)
        .selectAll("circle")
        .data(pointsData)
        .attr("cx", d => xScale(d.value))
        .attr("r", 5)
        .style(
          "fill",
          d => barData.find(letter => d.value === letter.value).color
        )
        .style("opacity", d => (d === transitionValue ? 1 : 0.5))
        .transition()
        .duration(500)
        .attr("cy", (d, i) => yScale(i))
        .transition()
        .duration(1000)
        .style("opacity", 0.5);
    }

    updateAxis({ ref: axisLeftRef, orientation: "Bottom", scale: xScale });
    updateAxis({ ref: axisLeftRef, orientation: "Left", scale: yScale });
  };

  const resetData = () => {
    const updatedData = data => data.map(letter => ({ ...letter, count: 0 }));
    setBarData(data => updatedData(data));
    setPointsData([]);
    setUserInput("");
  };

  const bars = barData.map(d => <rect key={d.value} />);
  const points = pointsData.length
    ? pointsData.map(d => (
        <circle
        // key={`${data.find(item => item.value === d).value}}`}
        />
      ))
    : null;

  return (
    <>
      <div>
        Text:
        <input type="text" value={userInput} onChange={updateData}></input>
      </div>
      <button onClick={resetData}>Reset</button>
      <button
        onClick={() => setXAxisType(xAxisType === "QWERTY" ? "A-Z" : "QWERTY")}
      >
        Change x-axis to {xAxisType === "QWERTY" ? "A-Z" : "QWERTY"}?
      </button>
      <button
        onClick={() =>
          setYAxisType(yAxisType === "SCATTERED" ? "CONDENSED" : "SCATTERED")
        }
      >
        Change y-axis to {yAxisType === "SCATTERED" ? "CONDENSED" : "SCATTERED"}
        ?
      </button>
      <div
        ref={containerRef}
        className="svgContainer"
        style={{
          border: "1px solid black"
        }}
      >
        <svg
          className="svgContent"
          ref={chartRef}
          preserveAspectRatio="xMinYMin meet"
          viewBox={`0 0 ${width} ${height}`}
          style={{ border: "1px solid green" }}
        >
          <g transform={`translate(${margins.left}, ${margins.top})`}>{bars}</g>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            {points}
          </g>
          <g
            className="bottomAxis"
            transform={`translate(${margins.left}, ${margins.top +
              height / 2})`}
            ref={axisBottomRef}
          />
          <g
            transform={`translate(${margins.left}, ${margins.top})`}
            ref={axisLeftRef}
          />
        </svg>
      </div>
    </>
  );
};

export default NotBoringKeyboard;
