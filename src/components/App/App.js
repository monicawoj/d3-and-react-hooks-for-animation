import React from "react";

// import BarChartD3Control from "../BarChart/BarChartD3Control";
// import BarChartReactControl from "../BarChart/BarChartReactControl";
// import BarChartShareControl from "../BarChart/BarChartShareControl";
import { Overline, Headline2 } from "@material/react-typography";
import "@material/react-typography/dist/typography.css";
import NotBoringKeyboard from "../NotBoringKeyboard";

import "./App.css";

//TODO: reset should animate transition out
//TODO: yaxis starts with ugly 0
//TODO: refactor code, can i move any of it to a seperate file?
//TODO: test responsiveness when i want to add one to the side (to see how languages compare)
//TODO: make presentation! using mdx-deck

const App = () => (
  <div className="App-body">
    <Overline>Nordic.JS 2019 - Monica Wojciechowska - "Hooked on D3"</Overline>
    <Headline2>The Not-Boring KeyBoard</Headline2>
    <NotBoringKeyboard
      margins={{ top: 10, bottom: 80, left: 40, right: 120 }}
    />
  </div>
);

export default App;
