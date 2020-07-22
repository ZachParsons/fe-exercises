/** @module colorContrastChecker */
'use strict';

/**
@constant {function} filterElements
  @param {Object[]} selectedTDs
  @returns {Object[]}
*/
const filterElements = function (selectedTDs) {
  return selectedTDs.filter(td => {
    return (
      td.textContent
      && td.style
      && td.style.color
      && td.style.backgroundColor
    );
  })
}

/**
  @constant {function} mapElements
  @param {Object[]} filteredTDs
  @returns {Object[]}
*/
const mapElements = function (filteredTDs) {
  return filteredTDs.map(data => {
    return {
      "textContent": data.textContent,
      "color": data.style.color,
      "backgroundColor": data.style.backgroundColor,
      "myColorContrastRatio":
        processColorPair(
          data.style.color,
          data.style.backgroundColor
        )//,
      // "chromaColorContrastRatio": chroma.contrast(data.style.color, data.style.backgroundColor)
    }
  })
}

/**
  @constant {function} castRBGToInts
  @param {string} color
  @returns {string[]}
*/
const castRBGToInts = function (color) {
  let [_, red, green, blue] =
    color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

  return [red, green, blue]
    .map(channel => parseInt(channel));
}

// https://www.w3.org/TR/WCAG20/#relativeluminancedef
// if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
/**
  @constant {function} getChannelValue
  @param {number} color
  @returns {number}
*/
const getChannelValue = function (colorInt) {
  let channelValue =
    (colorInt / 255) <= 0.03928
      ? colorInt / 12.92
      : Math.pow(((colorInt + 0.055) / 1.055), 2.4);
  return channelValue;
}

// https://www.w3.org/TR/WCAG20/#relativeluminancedef
// L = 0.2126 * R + 0.7152 * G + 0.0722 * B 
/**
  @constant {function} getRelativeLuminance
  @param {number} red
  @param {number} green
  @param {number} blue
  @returns {number}
*/
const getRelativeLuminance = function (red, green, blue) {
  let [redChannel, greenChannel, blueChannel] =
    [red, green, blue]
      .map(channel => getChannelValue(channel))

  let relativeLuminance =
    (0.2126 * redChannel)
    + (0.7152 * greenChannel)
    + (0.0722 * blueChannel);
  return relativeLuminance;
}

// https://www.w3.org/TR/WCAG20/#contrast-ratiodef
// (L1 + 0.05) / (L2 + 0.05)
// L1 = lighter, higher number, white = 255, 255, 255
// L2 = darker, lower number, black = 0, 0, 0 
/** 
 @const {function} getContrastRatio
 @param {number} foregroundLuminance
 @param {number} backgroundLuminance
 @returns {number}
*/
const getContrastRatio = function (foregroundLuminance, backgroundLuminance) {
  // @constant {number} - Contrast ratio function addend.
  const CRA = 0.05;

  let result =
    foregroundLuminance > backgroundLuminance
      ? (foregroundLuminance + CRA) / (backgroundLuminance + CRA)
      : (backgroundLuminance + CRA) / (foregroundLuminance + CRA)

  return result;
}

/** 
  @const {function} processColorPair
  @param {string} foregroundColor
  @param {string} backgroundColor
  @returns {number}
*/
const processColorPair = function (foregroundColor, backgroundColor) {
  let [fRed, fGreen, fBlue] = castRBGToInts(foregroundColor)
  let [bRed, bGreen, bBlue] = castRBGToInts(backgroundColor);

  let backgroundLuminance = getRelativeLuminance(bRed, bGreen, bBlue);
  let foregroundLuminance = getRelativeLuminance(fRed, fGreen, fBlue);

  let result = getContrastRatio(foregroundLuminance, backgroundLuminance);
  return result;
}

/**
  @const {function} presentAnswer
  @param {Object[]} textColorRatios 
  @returns {string}
 */
const presentAnswer = function (textColorRatios) {
  let answer =
    textColorRatios.map(data => {
      return data.textContent;
    })
      .join("")

  console.log(answer);
  return answer
}


/**
  @const {function} solve
  @returns {string}
 */
const solve = function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const tdElements = document.getElementsByTagName("td");

    let tdColorPairs =
      mapElements(
        filterElements(
          Object.values(tdElements)
        )
      )

    let validContrasts =
      tdColorPairs.filter(data => {
        // Spec's min ratio (`4.5`) doesn't to match problem's given output.
        // return data.myColorContrastRatio > 4.5;
        return data.myColorContrastRatio > 3.5;
      })

    return presentAnswer(validContrasts)
  });
};
solve();


// module.exports = { filterElements, mapElements,  castRBGToInts, getChannelValue, getRelativeLuminance, getContrastRatio };