import Vue from 'vue';
import logger from 'kolibri.lib.logging';
import { lighten, darken } from 'kolibri.utils.colour';

import materialColors from './materialColors.js';
import brandColors from './brandColors.js';

const logging = logger.getLogger(__filename);

const initialState = {
  '$core-action-light': '#e2d1e0',
  '$core-action-dark': '#72486f',

  '$core-accent-color': '#996189',

  '$core-bg-canvas': '#f9f9f9',

  '$core-text-default': '#3a3a3a',

  '$core-bg-warning': '#fff3e1',

  '$core-text-error': '#b93329',
  '$core-bg-error': '#eeeeee',

  /* Status colors */
  '$core-status-progress': '#2196f3',
  '$core-status-mastered': '#ffc107',
  '$core-status-correct': '#4caf50',
  '$core-status-wrong': '#df4d4f',

  '$core-grey': '#e0e0e0',

  '$core-loading': '#03a9f4',
  modality: null,

  theme: {
    colors: {
      black: 'black',
      white: 'white',
      palette: materialColors,
      brand: brandColors,
    },
    tokenMapping: {
      // brand shortcuts
      primary: 'brand.primary.v_400',
      primaryLight: 'brand.primary.v_100',
      primaryDark: 'brand.primary.v_700',
      secondary: 'brand.secondary.v_400',
      secondaryLight: 'brand.secondary.v_100',
      secondaryDark: 'brand.secondary.v_700',

      // UI colors
      text: 'palette.grey.v_900',
      textDisabled: 'palette.grey.v_300',
      annotation: 'palette.grey.v_700',
      loading: 'brand.secondary.v_200',
      focusOutline: 'brand.secondary.v_500',

      // semantic colors
      error: 'palette.red.v_800',
      progress: 'palette.lightblue.v_500',
      mastered: 'palette.amber.v_500',
      correct: 'palette.green.v_500',
      incorrect: 'palette.red.v_800',
    },
  },
};

export const dynamicState = Vue.observable(initialState);

export function resetThemeValue(value) {
  dynamicState[value] = initialState[value];
}

function throwThemeError(tokenName, mapString) {
  throw `Theme issue: '${tokenName}' has invalid mapping '${mapString}'`;
}

const hexcolor = RegExp('#[0-9a-fA-F]{6}');

export default {
  $themeTokens() {
    const tokens = {};
    // look at each token map
    Object.keys(dynamicState.theme.tokenMapping).forEach(function(tokenName) {
      const mapString = dynamicState.theme.tokenMapping[tokenName];
      const refs = mapString.split('.');
      // try to use the dot notation to navigate down the color tree
      let obj = dynamicState.theme.colors;
      while (refs.length) {
        const key = refs.shift();
        if (!obj[key]) {
          throwThemeError(tokenName, mapString);
        }
        obj = obj[key];
      }
      if (typeof obj !== 'string') {
        throwThemeError(tokenName, mapString);
      }
      if (!hexcolor.test(obj)) {
        logging.warn(`Theme issue: Unexpected value '${obj}' for token '${tokenName}'`);
      }
      // if we end up at a valid string, use it
      tokens[tokenName] = obj;
    });
    return tokens;
  },
  $themeColors() {
    return dynamicState.theme.colors;
  },

  /*
    TODO - deprecate functions below
  */

  $coreTextError() {
    return dynamicState['$core-text-error'];
  },
  $coreBgError() {
    return dynamicState['$core-bg-error'];
  },
  /* Status colors */
  $coreStatusProgress() {
    return dynamicState['$core-status-progress'];
  },
  $coreStatusMastered() {
    return dynamicState['$core-status-mastered'];
  },
  $coreStatusCorrect() {
    return dynamicState['$core-status-correct'];
  },
  $coreStatusWrong() {
    return dynamicState['$core-status-wrong'];
  },
  $coreGrey() {
    return dynamicState['$core-grey'];
  },
  $coreGrey200() {
    return lighten(dynamicState['$core-grey'], 0.063);
  },
  $coreGrey300() {
    return dynamicState['$core-grey'];
  },
  $coreLoading() {
    return dynamicState['$core-loading'];
  },
  // Should only use these styles to outline stuff that will be focused
  // on keyboard-tab-focus
  $coreOutline() {
    if (dynamicState.modality !== 'keyboard') {
      return {
        outline: 'none',
      };
    }

    return {
      outlineColor: darken(dynamicState['$core-action-light'], 0.1),
      outlineStyle: 'solid',
      outlineWidth: '3px',
      outlineOffset: '4px',
    };
  },
  // Should use this when the outline needs to be applied regardless
  // of modality
  $coreOutlineAnyModality() {
    return {
      outlineColor: darken(dynamicState['$core-action-light'], 0.1),
      outlineStyle: 'solid',
      outlineWidth: '3px',
      outlineOffset: '4px',
    };
  },
};
