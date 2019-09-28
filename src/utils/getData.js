import { range as d3range } from "d3-array";
import { randomNormal as d3randomNormal } from "d3-random";

const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];
export default (totalPoints = 100) =>
  d3range(totalPoints).map((d, i) => {
    return { x: d, y: d3randomNormal()(), name: `${alphabet[d]}-${i}` };
  });
