import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "d3-selection-multi";

const Marker = ({ d, fill, radius }) => {
  const [isSelected, setIsSelected] = useState(false);
  let markerRef = useRef(null);
  useEffect(() => updateMarker(), [isSelected]);

  const updateMarker = () => {
    if (!isSelected) {
      d3.select(markerRef.current)
        .transition()
        .duration(1000)
        .attrs({
          r: radius
        })
        .styles({
          fill: () => fill(d)
        });
    } else {
      d3.select(markerRef.current)
        .transition()
        .duration(1000)
        .attrs({
          r: 20
        })
        .styles({
          fill: "black"
        });
    }
  };

  return <circle ref={markerRef} onClick={() => setIsSelected(!isSelected)} />;
};

export default Marker;
