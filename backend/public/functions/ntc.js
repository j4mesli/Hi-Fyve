"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorName = exports.flushCachedColors = exports.initColors = exports.NOT_A_COLOR = exports.colors = exports.cachedColors = void 0;
exports.cachedColors = {};
exports.colors = [['000000', 'Black']];
exports.NOT_A_COLOR = 'not-a-color';
function getRGB(color, divider = 1) {
    return [
        parseInt(`0x${color.substring(1, 3)}`, 16) / divider,
        parseInt(`0x${color.substring(3, 5)}`, 16) / divider,
        parseInt(`0x${color.substring(5, 7)}`, 16) / divider
    ];
}
function getHSL(color) {
    const rgb = getRGB(color, 255);
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const min = Math.min(r, Math.min(g, b));
    const max = Math.max(r, Math.max(g, b));
    const delta = max - min;
    let h = 0;
    let s = 0;
    const l = (min + max) / 2;
    if (l > 0 && l < 1) {
        s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
    }
    if (delta > 0) {
        if (max === r && max !== g)
            h += (g - b) / delta;
        if (max === g && max !== b)
            h += (2 + (b - r) / delta);
        if (max === b && max !== r)
            h += (4 + (r - g) / delta);
        h /= 6;
    }
    return [Math.round(h * 255), Math.round(s * 255), Math.round(l * 255)];
}
function formatColor(rgb, colorName, exactMatch = false) {
    return {
        exactMatch,
        name: colorName,
        rgb
    };
}
function initColors(_colors) {
    exports.colors = [..._colors];
    flushCachedColors();
}
exports.initColors = initColors;
function flushCachedColors() {
    exports.cachedColors = Object.assign({});
}
exports.flushCachedColors = flushCachedColors;
function getColorName(color) {
    if (typeof color === 'undefined' || color === null) {
        return formatColor(null, exports.NOT_A_COLOR, false);
    }
    color = color.toUpperCase();
    // Not a valid color
    if (color.length < 3 || color.length > 7) {
        return formatColor(null, exports.NOT_A_COLOR, false);
    }
    // Missing #
    if (color.length % 3 === 0) {
        color = `#${color}`;
    }
    if (color.length === 4) {
        color = `#${color.substr(1, 1)}${color.substr(1, 1)}${color.substr(2, 1)}${color.substr(2, 1)}${color.substr(3, 1)}${color.substr(3, 1)}`;
    }
    // See if color has been found yet
    if (typeof exports.cachedColors[color] !== 'undefined') {
        return exports.cachedColors[color];
    }
    const rgb = getRGB(color);
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const hsl = getHSL(color);
    const h = hsl[0];
    const s = hsl[1];
    const l = hsl[2];
    let ndf1 = 0;
    let ndf2 = 0;
    let ndf = 0;
    let cl = -1;
    let df = -1;
    // Find in names
    for (let i = 0; i < exports.colors.length; i++) {
        let currentColor = exports.colors[i];
        const currentHexColor = `#${currentColor[0]}`;
        const currentNameColor = String(currentColor[1]);
        // Add RGB/HSL if missing
        if (typeof currentColor[2] === 'undefined') {
            const currentRgbColor = getRGB(currentHexColor);
            const currentHslColor = getHSL(currentHexColor);
            currentColor = currentColor.concat(currentRgbColor);
            currentColor = currentColor.concat(currentHslColor);
        }
        // Exact match
        if (color === currentHexColor) {
            // add to cached color
            exports.cachedColors[color] = formatColor(currentHexColor, currentNameColor, true);
            return exports.cachedColors[color];
        }
        const cR = parseInt(String(currentColor[2]), 10);
        const cG = parseInt(String(currentColor[3]), 10);
        const cB = parseInt(String(currentColor[4]), 10);
        const cH = parseInt(String(currentColor[5]), 10);
        const cS = parseInt(String(currentColor[6]), 10);
        const cL = parseInt(String(currentColor[7]), 10);
        ndf1 = Math.pow(r - cR, 2) + Math.pow(g - cG, 2) + Math.pow(b - cB, 2);
        ndf2 = Math.pow(h - cH, 2) + Math.pow(s - cS, 2) + Math.pow(l - cL, 2);
        ndf = ndf1 + ndf2 * 2;
        if (df < 0 || df > ndf) {
            df = ndf;
            cl = i;
        }
    }
    // Not found
    if (cl < 0) {
        return formatColor(color, color, false);
    }
    const currentColor = exports.colors[cl];
    const currentHexColor = `#${currentColor[0]}`;
    const currentNameColor = String(currentColor[1]);
    // add to cached color
    exports.cachedColors[color] = formatColor(currentHexColor, currentNameColor, false);
    return exports.cachedColors[color];
}
exports.getColorName = getColorName;
