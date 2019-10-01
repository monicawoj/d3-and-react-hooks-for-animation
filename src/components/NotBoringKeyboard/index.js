import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "d3-selection-multi";
import Button from "@material/react-button";
import TextField, { HelperText, Input } from "@material/react-text-field";

import MaterialIcon from "@material/react-material-icon";
import "@material/react-text-field/dist/text-field.css";
import "@material/react-button/dist/button.min.css";
import "@material/react-material-icon/dist/material-icon.css";

import { alphabet, alphabetQwerty, getQwertyX, getQwertyY } from "./utils";
import QwertyKeyboard from "./QwertyKeyboard";

import "./style.css";

const NotBoringKeyboard = () => {
  let containerRef = useRef(null);
  let chartRef = useRef(null);
  let axisLeftRef = useRef(null);
  let axisBottomRef = useRef(null);

  const [userInput, setUserInput] = useState("");
  const [pointsData, setPointsData] = useState([]);
  const [xAxisType, setXAxisType] = useState("QWERTY");
  const [yAxisType, setYAxisType] = useState("SCATTERED");

  const margins = { top: 10, bottom: 80, left: 40, right: 120 };

  const colorScale = d3
    .scaleLinear()
    .domain([0, 25])
    .range(["blue", "orange"])
    .interpolate(d3.interpolateRgb);

  const barData = [...alphabetQwerty].map((d, i) => ({
    value: d,
    color: d3.color(colorScale(i)),
    qwertyX: getQwertyX(d),
    qwertyY: getQwertyY(d)
  }));

  const width = 800 - margins.left - margins.right;
  const height = 500 - margins.top - margins.bottom;
  const cleanedData = userInput.replace(/[^a-zA-Z]/g, "").toLowerCase();

  // hook to set data when our user input changes
  useEffect(() => {
    // const cleanedData = userInput.replace(/[^a-zA-Z;,./]/g, "").toLowerCase();

    setPointsData(
      [...cleanedData].map((d, i) => {
        const history = [...cleanedData].slice(0, i);
        const countOfLetterInHistory = history.filter(
          dFromHistory => dFromHistory === d
        ).length;
        return {
          value: d,
          id: `${d}${i}`,
          withinLetterIndex: countOfLetterInHistory + 1
        };
      })
    );
  }, [cleanedData]);

  // hook to update charts when our data changes
  useEffect(() => {
    console.log(pointsData);
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

  const updateAxis = ({ ref, orientation, scale, ticks }) => {
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

    d3.select(ref.current).call(axisFunction(scale).ticks(ticks));
  };

  const updateBarChart = ({ transitionType = "", transitionValue = "" }) => {
    const xBarScale = d3
      .scaleBand()
      .domain(xAxisType === "QWERTY" ? [...alphabetQwerty] : [...alphabet])
      .range([0, width - margins.right - margins.left]);
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

    if (transitionType === "keypress") {
      d3.select(chartRef.current)
        .selectAll("rect")
        .data(barData)
        .attr("x", d => xBarScale(d.value))
        .attr("width", xBarScale.bandwidth())
        .transition()
        .duration(100)
        .attr("y", yBarScale(1))
        .attr("height", d =>
          d.value === transitionValue
            ? height / 2 - yBarScale(0.5)
            : yBarScale(0)
        )
        .style("fill", d => (d.value === transitionValue ? d.color : "white"))
        .transition()
        .duration(1000)
        .attr("y", yBarScale(1))
        .attr("height", yBarScale(0))
        .style("fill", "white");
    }
  };

  const updateScatterplot = ({ transitionType = "", transitionValue = "" }) => {
    const xScale = d3
      .scalePoint()
      .padding(0.5)
      .domain(xAxisType === "QWERTY" ? [...alphabetQwerty] : [...alphabet])
      .range([0, width - margins.right - margins.left]);
    const yScale = d3
      .scaleLinear()
      .domain(
        yAxisType === "CONDENSED"
          ? [1, d3.max(pointsData, d => d.withinLetterIndex)]
          : [0, pointsData.length]
      )
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
        .transition()
        .duration(1000)
        .attr("cy", (d, i) =>
          yAxisType === "CONDENSED" ? yScale(d.withinLetterIndex) : yScale(i)
        );

      return updateAxis({
        ref: axisLeftRef,
        orientation: "Left",
        scale: yScale,
        ticks: 8
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
        .style("opacity", d => (d.value === transitionValue ? 1 : 0.3))
        .transition()
        .duration(500)
        .attrs({
          r: (_, i) => (i === pointsData.length ? 10 : 5),
          fill: "yellow",
          cy: (d, i) =>
            yAxisType === "CONDENSED" ? yScale(d.withinLetterIndex) : yScale(i)
        })
        // .attr("cy",
        // )
        .transition()
        .duration(1000)
        .style("opacity", 0.5);
    }

    updateAxis({ ref: axisLeftRef, orientation: "Bottom", scale: xScale });
    updateAxis({
      ref: axisLeftRef,
      orientation: "Left",
      scale: yScale,
      ticks: 8
    });
  };

  const resetData = () => {
    // const updatedData = data => data.map(letter => ({ ...letter, count: 0 }));
    // setBarData(data => updatedData(data));
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
    <div className="container">
      <TextField
        textarea
        fullWidth
        onTrailingIconSelect={resetData}
        helperText={
          <HelperText>Add some letters, see some pretty animation!</HelperText>
        }
        trailingIcon={<MaterialIcon role="button" icon="delete" />}
      >
        <Input value={userInput} onChange={updateData} />
      </TextField>

      <div className="buttonContainer">
        <Button onClick={resetData} className="button">
          Reset
        </Button>
        {"|"}
        <Button
          className="button"
          onClick={() =>
            setXAxisType(xAxisType === "QWERTY" ? "A-Z" : "QWERTY")
          }
        >
          Change x-axis to {xAxisType === "QWERTY" ? "A-Z" : "QWERTY"}?
        </Button>
        {"|"}
        <Button
          className="button"
          onClick={() =>
            setYAxisType(yAxisType === "SCATTERED" ? "CONDENSED" : "SCATTERED")
          }
        >
          Change y-axis to{" "}
          {yAxisType === "SCATTERED" ? "CONDENSED" : "SCATTERED"}?
        </Button>
      </div>

      <div ref={containerRef} className="svgContainer">
        <svg
          className="svgContent"
          ref={chartRef}
          preserveAspectRatio="xMinYMin meet"
          viewBox={`0 0 ${width} ${height}`}
        >
          <g transform={`translate(${margins.left}, ${margins.top})`}>{bars}</g>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            {points}
          </g>
          <g
            className="axis"
            transform={`translate(${margins.left}, ${margins.top +
              height / 2})`}
            ref={axisBottomRef}
          >
            <text
              x={width - margins.right + 20}
              y={10}
              fontSize="12px"
              fontFamily="Roboto, sans-serif"
              fill="black"
            >
              {xAxisType === "QWERTY" ? "LETTER (QWERTY)" : "LETTER (A-Z)"}
            </text>
          </g>
          <g
            className="axis"
            transform={`translate(${margins.left}, ${margins.top})`}
            ref={axisLeftRef}
          >
            <text
              transform={`rotate(270)`}
              x={-height / 4}
              y="-30"
              fontSize="12px"
              fontFamily="Roboto, sans-serif"
              fill="black"
            >
              {yAxisType === "CONDENSED" ? "COUNT" : "INDEX"}
            </text>
          </g>
        </svg>
        {/* <QwertyKeyboard /> */}
      </div>
    </div>
  );
};

export default NotBoringKeyboard;

// hook to add event listener for window resize so we can watch the dimensions
// useEffect(() => {
//   const resizeListener = window.addEventListener("resize", () => {
//     const dimensions = getDimensionObject(containerRef.current);
//     setDimensions(dimensions);
//   });
//   return () => window.removeEventListener(resizeListener);
// }, []);
