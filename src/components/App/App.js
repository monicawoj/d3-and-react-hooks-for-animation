import React, { useState } from "react";

import { getData } from "../../utils";
// import Header from "../Header";
// import ScatterPlot from "../ScatterPlot";
// import BarChartD3Control from "../BarChart/BarChartD3Control";
// import BarChartReactControl from "../BarChart/BarChartReactControl";
// import BarChartShareControl from "../BarChart/BarChartShareControl";
// import HookedScatterPlot from "../HookedScatterPlot";
import NotBoringKeyboard from "../NotBoringKeyboard";

import "./App.css";

const App = () => {
  // const [data, setData] = useState(getData());

  return (
    <div className="App">
      {/* <Header /> */}
      <div className="App-body">
        {/* <div className="fullHeight">
          <BarChartReactControl width={600} height={600} />
        </div>
        <div className="fullHeight">
          <BarChartD3Control width={600} height={600} />
        </div>
        <div className="fullHeight">
          <BarChartShareControl width={600} height={600} />
        </div>
        <div className="fullHeight">
          <button onClick={() => setData(getData())}>
            Click for new scatterplot data!
          </button>
          <ScatterPlot
            data={data}
            dimensions={{ width: 500, height: 500 }}
            margins={{ top: 10, bottom: 80, left: 30, right: 10 }}
          />
        </div> */}
        {/* <div className="fullHeight">
          <button onClick={() => setData(getData())}>
            Click for new scatterplot data!
          </button>
          <HookedScatterPlot
            dimensions={{ width: 500, height: 500 }}
            margins={{ top: 10, bottom: 80, left: 30, right: 10 }}
          />
        </div> */}
        <div className="fullHeight">
          <NotBoringKeyboard
            margins={{ top: 10, bottom: 80, left: 30, right: 10 }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
