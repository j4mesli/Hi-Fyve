"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToHex = void 0;
const rgbToHex = (arr) => {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
};
exports.rgbToHex = rgbToHex;
const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};
