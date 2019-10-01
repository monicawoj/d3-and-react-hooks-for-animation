import * as d3 from "d3";

export const alphabet = "abcdefghijklmnopqrstuvwxyz";
const topRow = "qwertyuiop";
const middleRow = "asdfghjkl";
const bottomRow = "zxcvbnm";
const alphabetQwertyByRow = [...topRow, ...middleRow, ...bottomRow];
const getLetterYPosition = i => {
  if (i >= 20) {
    return 2;
  }
  if (i >= 10) {
    return 1;
  }
  return 0;
};
const getLetterXPosition = (letter, i) => {
  if (i >= 19) {
    return [...bottomRow].findIndex(d => d === letter);
  }
  if (i >= 10) {
    return [...middleRow].findIndex(d => d === letter);
  }
  return [...topRow].findIndex(d => d === letter);
};

export let qwertyKeyboard = [];
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i =>
  qwertyKeyboard.push(
    topRow[i],
    middleRow[i] ? middleRow[i] : null,
    bottomRow[i] ? bottomRow[i] : null
  )
);
export const alphabetQwerty = qwertyKeyboard.filter(d => !!d);

export const getQwertyX = letter =>
  getLetterXPosition(letter, alphabetQwertyByRow.findIndex(d => d === letter));
export const getQwertyY = letter =>
  getLetterYPosition(alphabetQwertyByRow.findIndex(d => d === letter));

export const updateAxis = ({ ref, orientation, scale }) => {
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
