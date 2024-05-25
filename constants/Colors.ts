const white = "#FCFAFD";
const secondaryWhite = "#E2EDF3";
const primarySkyBlue = "#BED8E7"; //for inputfield: background
const secondarySkyBlue = "#DFECF4";
const lightGrey = "#5E7899"; // for inputfield: innerShadow
const darkGrey = "#4D6E9B";
const mediumGrey = "#BCD6E5";
const lightPink = "#FF7795";
const darkPink = "#F9466E";
const darkBlue = "#15295C";
const mediumBlue = "#132D9E";
const mediumPurple = "#AC70F6";
const cardDropShadow = "#546C8E";
const gold = "#FFD700";
const darkGold = "#DAA520";
export default {
  white: white,
  secondaryWhite: secondaryWhite,
  darkGrey: darkGrey,
  lightGrey: lightGrey,
  darkBlue: darkBlue,
  mediumBlue: mediumBlue,
  mediumPurple: mediumPurple,
  gold: gold,
  darkGold: darkGold,
  primarySkyBlue: primarySkyBlue,

  light: {
    text: darkBlue,
    background: [white, secondarySkyBlue],
    navHeader: [darkBlue, mediumBlue, mediumPurple],
    components: {
      button: {
        pink: {
          dropShadow: darkPink,
          innerShadow: lightPink,
          background: [darkPink, lightPink],
          text: white,
          border: lightPink,
        },
        purple: {
          dropShadow: darkBlue,
          innerShadow: mediumPurple,
          background: [darkBlue, mediumBlue, mediumPurple],
          text: white,
          border: darkBlue,
        },
        white: {
          dropShadow: darkGrey,
          innerShadow: mediumGrey,
          background: [white, primarySkyBlue],
          text: darkBlue,
          cancelText: darkGrey,
          border: primarySkyBlue,
        },
        gold: {
          dropShadow: darkGold,
          innerShadow: darkGold,
          background: [darkGold, gold],
          text: darkBlue,
          border: darkGold,
        },
      },
      recipeCard: {
        background: [white, secondaryWhite],
        dropShadow: cardDropShadow,
      },
      inputField: {
        background: white,
        innerShadow: lightGrey,
      },
    },
  },
  dark: {
    text: white,
    background: [darkBlue, mediumBlue, mediumPurple],
    navHeader: [darkBlue, mediumBlue, mediumPurple],
    components: {
      button: {
        pink: {
          dropShadow: darkPink,
          innerShadow: lightPink,
          background: [darkPink, darkPink],
          text: white,
          border: lightPink,
        },
        purple: {
          dropShadow: darkBlue,
          innerShadow: mediumPurple,
          background: [darkBlue, mediumBlue, mediumPurple],
          text: white,
          border: mediumPurple,
        },
        white: {
          dropShadow: lightGrey,
          innerShadow: lightGrey,
          background: [white, primarySkyBlue],
          text: darkBlue,
          border: primarySkyBlue,
        },
      },
      recipeCard: {
        background: [darkBlue, mediumBlue],
        dropShadow: cardDropShadow,
      },
      inputField: {
        background: darkBlue,
        innerShadow: lightGrey,
      },
    },
  },
};
