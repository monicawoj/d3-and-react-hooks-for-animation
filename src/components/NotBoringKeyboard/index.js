import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "d3-selection-multi";

import {
  alphabet,
  alphabetQwerty,
  getQwertyX,
  getQwertyY,
  updateAxis
} from "./utils";

import "./style.css";

const NotBoringKeyboard = ({ xAxisType, yAxisType, userInput }) => {
  // create refs for each thing that will need selection/transition
  let chartRef = useRef(null);
  let axisLeftRef = useRef(null);
  let axisBottomRef = useRef(null);

  // set initial state
  const [cleanedData, setCleanedData] = useState([]);
  const [pointsData, setPointsData] = useState([]);

  // set visualization margins and dimensions
  const margins = { top: 10, bottom: 80, left: 40, right: 120 };
  const width = 800 - margins.left - margins.right;
  const height = 500 - margins.top - margins.bottom;

  // define scales
  const scales = {
    point: {
      x: d3
        .scalePoint()
        .padding(0.5)
        .domain(xAxisType === "QWERTY" ? [...alphabetQwerty] : [...alphabet])
        .range([0, width - margins.right - margins.left]),
      y: d3
        .scaleLinear()
        .domain(
          yAxisType === "CONDENSED"
            ? [1, d3.max(pointsData, d => d.withinLetterIndex)]
            : [0, pointsData.length]
        )
        .range([height / 2, 0])
    },
    bar: {
      x: d3
        .scaleBand()
        .domain(xAxisType === "QWERTY" ? [...alphabetQwerty] : [...alphabet])
        .range([0, width - margins.right - margins.left]),
      y: d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, height / 2])
    },
    color: d3
      .scaleLinear()
      .domain([0, 25])
      .range(["blue", "orange"])
      .interpolate(d3.interpolateRgb)
  };

  // set static constants and functions necessary for our other code
  const barData = [...alphabetQwerty].map((d, i) => ({
    value: d,
    color: d3.color(scales.color(i)),
    qwertyX: getQwertyX(d),
    qwertyY: getQwertyY(d)
  }));

  // DEFINE HOOKS
  // hook to clean data whenever user input changes
  useEffect(() => {
    const cleanedData = userInput.replace(/[^a-zA-Z]/g, "").toLowerCase();
    setCleanedData(cleanedData);
  }, [userInput]);

  // hook to set points data when cleaned data changes
  useEffect(() => {
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

  // hook to update charts when points data changes
  useEffect(() => {
    if (pointsData.length) {
      updateScatterplot({
        transition: {
          type: "keypress",
          value: pointsData[pointsData.length - 1].value
        },
        scales
      });
      updateBarChart({
        transition: {
          type: "keypress",
          value: pointsData[pointsData.length - 1].value
        },
        scales
      });
    }
  }, [pointsData]);

  // hook to toggle x scale (alphabetic/qwerty) on button click
  useEffect(() => {
    updateScatterplot({ transition: { type: "xaxis" }, scales });
    updateBarChart({ transition: { type: "xaxis" }, scales });
  }, [xAxisType]);

  // hook to toggle y scale (cumulative/index view) on button click
  useEffect(() => {
    updateScatterplot({ transition: { type: "yaxis" }, scales });
  }, [yAxisType]);

  // define 'draw' functions (we have one for each chart, with a switch statement that listens for transition type, similar to a reducer)
  const updateBarChart = ({
    scales: {
      bar: { x: xScale, y: yScale }
    },
    transition: { type: transitionType, value: transitionValue }
  }) => {
    switch (transitionType) {
      case "xaxis": {
        return d3
          .select(chartRef.current)
          .selectAll("rect")
          .data(barData)
          .transition()
          .duration(1000)
          .attr("x", d => xScale(d.value));
      }

      case "keypress": {
        return d3
          .select(chartRef.current)
          .selectAll("rect")
          .data(barData)
          .attr("x", d => xScale(d.value))
          .attr("width", xScale.bandwidth())
          .transition()
          .duration(100)
          .attr("y", yScale(1))
          .attr("height", d =>
            d.value === transitionValue ? height / 2 - yScale(0.5) : yScale(0)
          )
          .style("fill", d => (d.value === transitionValue ? d.color : "white"))
          .transition()
          .duration(1000)
          .attr("y", yScale(1))
          .attr("height", yScale(0))
          .style("fill", "white");
      }
      default:
        break;
    }
  };

  const updateScatterplot = ({
    scales: {
      point: { x: xScale, y: yScale }
    },
    transition: { type: transitionType, value: transitionValue }
  }) => {
    updateAxis({ ref: axisLeftRef, orientation: "Bottom", scale: xScale });
    updateAxis({
      ref: axisLeftRef,
      orientation: "Left",
      scale: yScale,
      ticks: 8
    });

    switch (transitionType) {
      case "xaxis": {
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

      case "yaxis": {
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

      case "keypress": {
        return d3
          .select(chartRef.current)
          .selectAll("circle")
          .data(pointsData)
          .attrs({
            cx: d => xScale(d.value),
            r: 5
          })
          .styles({
            fill: d => barData.find(letter => d.value === letter.value).color,
            opacity: d => (d.value === transitionValue ? 1 : 0.3)
          })
          .transition()
          .duration(500)
          .attrs({
            r: (_, i) => (i === pointsData.length ? 10 : 5),
            fill: "yellow",
            cy: (d, i) =>
              yAxisType === "CONDENSED"
                ? yScale(d.withinLetterIndex)
                : yScale(i)
          })
          .transition()
          .duration(1000)
          .style("opacity", 0.5);
      }

      default:
        break;
    }
  };

  // create our visualization HTML/SVG elements (circles and rectangles)
  const bars = barData.map(d => <rect key={d.value} />);
  const points = pointsData.length
    ? pointsData.map(d => <circle key={`${d.value}${d.withinLetterIndex}`} />)
    : null;

  return (
    <div className="svgContainer">
      <svg
        className="svgContent"
        ref={chartRef}
        preserveAspectRatio="xMinYMin meet"
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margins.left}, ${margins.top})`}>{bars}</g>
        <g transform={`translate(${margins.left}, ${margins.top})`}>{points}</g>
        <g
          className="axis"
          transform={`translate(${margins.left}, ${margins.top + height / 2})`}
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
    </div>
  );
};

export default NotBoringKeyboard;
