import React from "react";
import * as d3 from "d3";

import { getData } from "../../utils";

class BarChartReactControl extends React.Component {
  state = {
    data: getData(5)
  };

  render() {
    //constants
    const { width, height } = this.props;
    const data = getData(5);
    const colors = ["#2176ae", "#57b8ff", "#b66d0d", "#fbb13c", "#fe6847"];

    //scales
    const xScale = d3
      .scaleBand()
      .domain(d3.range(0, data.length))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([-3, 3])
      .range([0, height]);

    //elements with attributes
    const bars = data.map((d, i) => (
      <rect
        key={d.name}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={height - yScale(d.y)}
        fill={colors[i]}
      />
    ));

    return (
      <div>
        <svg width={width} height={height}>
          {bars}
        </svg>
        <button onClick={() => this.setState({ data: getData(5) })}>
          get new data
        </button>
      </div>
    );
  }
}

export default BarChartReactControl;
