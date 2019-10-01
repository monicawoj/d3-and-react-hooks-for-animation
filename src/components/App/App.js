import React, { useState } from "react";
import Button from "@material/react-button";
import TextField, { HelperText, Input } from "@material/react-text-field";
import { Overline, Headline2 } from "@material/react-typography";
import MaterialIcon from "@material/react-material-icon";

import NotBoringKeyboard from "../NotBoringKeyboard";

import "@material/react-text-field/dist/text-field.css";
import "@material/react-button/dist/button.min.css";
import "@material/react-material-icon/dist/material-icon.css";
import "@material/react-typography/dist/typography.css";
import "./App.css";

// import BarChartD3Control from "../BarChart/BarChartD3Control";
// import BarChartReactControl from "../BarChart/BarChartReactControl";
// import BarChartShareControl from "../BarChart/BarChartShareControl";

//TODO: reset should animate transition out
//TODO: yaxis starts with ugly 0
//TODO: refactor code, can i move any of it to a seperate file?
//TODO: test responsiveness when i want to add one to the side (to see how languages compare)
//TODO: make presentation! using mdx-deck

const App = () => {
  const [xAxisType, setXAxisType] = useState("QWERTY");
  const [yAxisType, setYAxisType] = useState("SCATTERED");
  const [userInput, setUserInput] = useState("");

  const resetData = () => {
    setUserInput("");
  };

  return (
    <div className="App-body">
      <Overline>
        Nordic.JS 2019 - Monica Wojciechowska - "Hooked on D3"
      </Overline>
      <Headline2>The Not-Boring KeyBoard</Headline2>
      <div className="container">
        <TextField
          textarea
          fullWidth
          onTrailingIconSelect={resetData}
          helperText={
            <HelperText>
              Add some letters, see some pretty animation!
            </HelperText>
          }
          trailingIcon={<MaterialIcon role="button" icon="delete" />}
        >
          <Input
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
          />
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
              setYAxisType(
                yAxisType === "SCATTERED" ? "CONDENSED" : "SCATTERED"
              )
            }
          >
            Change y-axis to{" "}
            {yAxisType === "SCATTERED" ? "CONDENSED" : "SCATTERED"}?
          </Button>
        </div>
        <NotBoringKeyboard
          xAxisType={xAxisType}
          yAxisType={yAxisType}
          userInput={userInput}
        />
      </div>
    </div>
  );
};

export default App;
