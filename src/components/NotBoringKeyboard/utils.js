export const alphabet = "abcdefghijklmnopqrstuvwxyz;,./";
const topRow = "qwertyuiop";
const middleRow = "asdfghjkl;";
const bottomRow = "zxcvbnm,./";
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
  if (i >= 20) {
    return [...bottomRow].findIndex(d => d === letter);
  }
  if (i >= 10) {
    return [...middleRow].findIndex(d => d === letter);
  }
  return [...topRow].findIndex(d => d === letter);
};

export let alphabetQwerty = [];
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i =>
  alphabetQwerty.push(topRow[i], middleRow[i], bottomRow[i])
);

export const getQwertyX = letter =>
  getLetterXPosition(letter, alphabetQwertyByRow.findIndex(d => d === letter));
export const getQwertyY = letter =>
  getLetterYPosition(alphabetQwertyByRow.findIndex(d => d === letter));
