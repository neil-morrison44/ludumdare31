(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// TinyColor v1.1.0
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function() {

var trimLeft = /^[\s,#]+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    math = Math,
    mathRound = math.round,
    mathMin = math.min,
    mathMax = math.max,
    mathRandom = math.random;

var tinycolor = function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
};

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function() {
        return rgbaToHex(this._r, this._g, this._b, this._a);
    },
    toHex8String: function() {
        return '#' + this.toHex8();
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = s.toHex8String();
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
            color.s = convertToPercentage(color.s);
            color.v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, color.s, color.v);
            ok = true;
            format = "hsv";
        }
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
            color.s = convertToPercentage(color.s);
            color.l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, color.s, color.l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}
    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b and a are contained in the set [0, 255]
    // Returns an 8 character hex
    function rgbaToHex(r, g, b, a) {

        var hex = [
            pad2(convertDecimalToHex(a)),
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        return hex.join("");
    }

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};
tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (mathRound(hsl.h) + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;
    var w = p * 2 - 1;
    var a = rgb2.a - rgb1.a;

    var w1;

    if (w * a == -1) {
        w1 = w;
    } else {
        w1 = (w + a) / (1 + w * a);
    }

    w1 = (w1 + 1) / 2;

    var w2 = 1 - w1;

    var rgba = {
        r: rgb2.r * w1 + rgb1.r * w2,
        g: rgb2.g * w1 + rgb1.g * w2,
        b: rgb2.b * w1 + rgb1.b * w2,
        a: rgb2.a * p  + rgb1.a * (1 - p)
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/AERT#color-contrast>

// `readability`
// Analyze the 2 colors and returns an object with the following properties:
//    `brightness`: difference in brightness between the two colors
//    `color`: difference in color/hue between the two colors
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    var rgb1 = c1.toRgb();
    var rgb2 = c2.toRgb();
    var brightnessA = c1.getBrightness();
    var brightnessB = c2.getBrightness();
    var colorDiff = (
        Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
        Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
        Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
    );

    return {
        brightness: Math.abs(brightnessA - brightnessB),
        color: colorDiff
    };
};

// `readable`
// http://www.w3.org/TR/AERT#color-contrast
// Ensure that foreground and background color combinations provide sufficient contrast.
// *Example*
//    tinycolor.isReadable("#000", "#111") => false
tinycolor.isReadable = function(color1, color2) {
    var readability = tinycolor.readability(color1, color2);
    return readability.brightness > 125 && readability.color > 500;
};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// *Example*
//    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
tinycolor.mostReadable = function(baseColor, colorList) {
    var bestColor = null;
    var bestScore = 0;
    var bestIsReadable = false;
    for (var i=0; i < colorList.length; i++) {

        // We normalize both around the "acceptable" breaking point,
        // but rank brightness constrast higher than hue.

        var readability = tinycolor.readability(baseColor, colorList[i]);
        var readable = readability.brightness > 125 && readability.color > 500;
        var score = 3 * (readability.brightness / 125) + (readability.color / 500);

        if ((readable && ! bestIsReadable) ||
            (readable && bestIsReadable && score > bestScore) ||
            ((! readable) && (! bestIsReadable) && score > bestScore)) {
            bestIsReadable = readable;
            bestScore = score;
            bestColor = tinycolor(colorList[i]);
        }
    }
    return bestColor;
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            a: convertHexToDecimal(match[1]),
            r: parseIntFromHex(match[2]),
            g: parseIntFromHex(match[3]),
            b: parseIntFromHex(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})();

},{}],2:[function(require,module,exports){
module.exports=require(1)
},{}],3:[function(require,module,exports){
var ua = typeof window !== 'undefined' ? window.navigator.userAgent : ''
  , isOSX = /OS X/.test(ua)
  , isOpera = /Opera/.test(ua)
  , maybeFirefox = !/like Gecko/.test(ua) && !isOpera

var i, output = module.exports = {
  0:  isOSX ? '<menu>' : '<UNK>'
, 1:  '<mouse 1>'
, 2:  '<mouse 2>'
, 3:  '<break>'
, 4:  '<mouse 3>'
, 5:  '<mouse 4>'
, 6:  '<mouse 5>'
, 8:  '<backspace>'
, 9:  '<tab>'
, 12: '<clear>'
, 13: '<enter>'
, 16: '<shift>'
, 17: '<control>'
, 18: '<alt>'
, 19: '<pause>'
, 20: '<caps-lock>'
, 21: '<ime-hangul>'
, 23: '<ime-junja>'
, 24: '<ime-final>'
, 25: '<ime-kanji>'
, 27: '<escape>'
, 28: '<ime-convert>'
, 29: '<ime-nonconvert>'
, 30: '<ime-accept>'
, 31: '<ime-mode-change>'
, 27: '<escape>'
, 32: '<space>'
, 33: '<page-up>'
, 34: '<page-down>'
, 35: '<end>'
, 36: '<home>'
, 37: '<left>'
, 38: '<up>'
, 39: '<right>'
, 40: '<down>'
, 41: '<select>'
, 42: '<print>'
, 43: '<execute>'
, 44: '<snapshot>'
, 45: '<insert>'
, 46: '<delete>'
, 47: '<help>'
, 91: '<meta>'  // meta-left -- no one handles left and right properly, so we coerce into one.
, 92: '<meta>'  // meta-right
, 93: isOSX ? '<meta>' : '<menu>'      // chrome,opera,safari all report this for meta-right (osx mbp).
, 95: '<sleep>'
, 106: '<num-*>'
, 107: '<num-+>'
, 108: '<num-enter>'
, 109: '<num-->'
, 110: '<num-.>'
, 111: '<num-/>'
, 144: '<num-lock>'
, 145: '<scroll-lock>'
, 160: '<shift-left>'
, 161: '<shift-right>'
, 162: '<control-left>'
, 163: '<control-right>'
, 164: '<alt-left>'
, 165: '<alt-right>'
, 166: '<browser-back>'
, 167: '<browser-forward>'
, 168: '<browser-refresh>'
, 169: '<browser-stop>'
, 170: '<browser-search>'
, 171: '<browser-favorites>'
, 172: '<browser-home>'

  // ff/osx reports '<volume-mute>' for '-'
, 173: isOSX && maybeFirefox ? '-' : '<volume-mute>'
, 174: '<volume-down>'
, 175: '<volume-up>'
, 176: '<next-track>'
, 177: '<prev-track>'
, 178: '<stop>'
, 179: '<play-pause>'
, 180: '<launch-mail>'
, 181: '<launch-media-select>'
, 182: '<launch-app 1>'
, 183: '<launch-app 2>'
, 186: ';'
, 187: '='
, 188: ','
, 189: '-'
, 190: '.'
, 191: '/'
, 192: '`'
, 219: '['
, 220: '\\'
, 221: ']'
, 222: "'"
, 223: '<meta>'
, 224: '<meta>'       // firefox reports meta here.
, 226: '<alt-gr>'
, 229: '<ime-process>'
, 231: isOpera ? '`' : '<unicode>'
, 246: '<attention>'
, 247: '<crsel>'
, 248: '<exsel>'
, 249: '<erase-eof>'
, 250: '<play>'
, 251: '<zoom>'
, 252: '<no-name>'
, 253: '<pa-1>'
, 254: '<clear>'
}

for(i = 58; i < 65; ++i) {
  output[i] = String.fromCharCode(i)
}

// 0-9
for(i = 48; i < 58; ++i) {
  output[i] = (i - 48)+''
}

// A-Z
for(i = 65; i < 91; ++i) {
  output[i] = String.fromCharCode(i)
}

// num0-9
for(i = 96; i < 106; ++i) {
  output[i] = '<num-'+(i - 96)+'>'
}

// F1-F24
for(i = 112; i < 136; ++i) {
  output[i] = 'F'+(i-111)
}

},{}],4:[function(require,module,exports){
var Bullet, lineDistance;

lineDistance = function(point1, point2) {
  var xs, ys;
  xs = point2.x - point1.x;
  xs = xs * xs;
  ys = point2.y - point1.y;
  ys = ys * ys;
  return Math.sqrt(xs + ys);
};

module.exports = Bullet = (function() {
  function Bullet(options) {
    this.position = {};
    this.position.x = this.start.x = options.position.x;
    this.position.y = this.start.y = options.position.y;
    this.velocity = {};
    this.velocity.x = Math.cos(options.angle - Math.PI / 2);
    this.velocity.y = Math.sin(options.angle - Math.PI / 2);
  }

  Bullet.prototype.update = function() {
    this.position.x += this.speed * this.velocity.x;
    this.position.y += this.speed * this.velocity.y;
    if (lineDistance(this.position, this.start) > 300) {
      return this.status = "destroyed";
    }
  };

  Bullet.prototype.pathLineSegment = function(canvasContext) {
    var startX, startY;
    startX = this.position.x - (10 * this.velocity.x);
    startY = this.position.y - (10 * this.velocity.y);
    canvasContext.moveTo(startX, startY);
    return canvasContext.lineTo(this.position.x, this.position.y);
  };

  Bullet.prototype.position = {
    x: 0,
    y: 0
  };

  Bullet.prototype.velocity = {
    x: 0,
    y: 0
  };

  Bullet.prototype.start = {
    x: 0,
    y: 0
  };

  Bullet.prototype.destroy = function() {
    return this.status = "destroyed";
  };

  Bullet.prototype.speed = 15.5;

  Bullet.prototype.status = "fine";

  return Bullet;

})();


},{}],5:[function(require,module,exports){
var Bullet, BulletManager;

Bullet = require("./bullet");

module.exports = new (BulletManager = (function() {
  function BulletManager() {}

  BulletManager.prototype.bullets = [];

  BulletManager.prototype.create = function(options) {
    return this.bullets.push(new Bullet(options));
  };

  BulletManager.prototype.updateAll = function() {
    var bullet, _i, _len, _ref;
    _ref = this.bullets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bullet = _ref[_i];
      if (bullet.status === "fine") {
        bullet.update();
      }
    }
    return this.bullets = (function() {
      var _j, _len1, _ref1, _results;
      _ref1 = this.bullets;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        bullet = _ref1[_j];
        if (bullet.status !== "destroyed") {
          _results.push(bullet);
        }
      }
      return _results;
    }).call(this);
  };

  BulletManager.prototype.testAll = function() {};

  BulletManager.prototype.renderAll = function(canvasContext) {
    var bullet, _i, _len, _ref;
    canvasContext.save();
    canvasContext.strokeStyle = "rgb(200,0,245)";
    canvasContext.beginPath();
    canvasContext.lineWidth = 5;
    _ref = this.bullets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bullet = _ref[_i];
      bullet.pathLineSegment(canvasContext);
    }
    canvasContext.stroke();
    return canvasContext.restore();
  };

  BulletManager.prototype.positionsForBullets = function() {
    var bullet, _i, _len, _ref, _results;
    _ref = this.bullets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bullet = _ref[_i];
      _results.push(bullet.position);
    }
    return _results;
  };

  return BulletManager;

})());


},{"./bullet":4}],6:[function(require,module,exports){
var Button, tinycolor;

tinycolor = require("tinycolor2");

module.exports = Button = (function() {
  function Button(options) {
    this.position = {
      x: options.position.x,
      y: options.position.y
    };
    this.width = options.width;
    this.colour = options.colour;
    this.text = options.text;
    this.darkerColour = tinycolor(this.colour).darken().toString();
    this.slightlyDarkerColour = tinycolor(this.colour).darken(5).toString();
    this.lighterColour = tinycolor(this.colour).lighten().toString();
  }

  Button.prototype.render = function(canvasContext) {
    canvasContext.save();
    canvasContext.font = "40px sans-serif";
    canvasContext.fillStyle = this.colour;
    canvasContext.fillRect(this.position.x, this.position.y, this.width, 50);
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = this.slightlyDarkerColour;
    canvasContext.strokeRect(this.position.x, this.position.y, this.width, 50);
    canvasContext.beginPath();
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = this.clicked ? this.darkerColour : this.lighterColour;
    canvasContext.moveTo(this.position.x, this.position.y);
    canvasContext.lineTo(this.position.x + this.width, this.position.y);
    canvasContext.stroke();
    canvasContext.beginPath();
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = this.clicked ? this.lighterColour : this.darkerColour;
    canvasContext.moveTo(this.position.x, this.position.y + 50);
    canvasContext.lineTo(this.position.x + this.width, this.position.y + 50);
    canvasContext.stroke();
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "center";
    canvasContext.fillText(this.text, (this.width / 2) + this.position.x, 40 + this.position.y);
    canvasContext.restore();
    if (this.clickedFor > 5) {
      this.clicked = false;
      return this.clickedFor = 0;
    } else if (this.clicked) {
      return this.clickedFor++;
    }
  };

  Button.prototype.clicked = false;

  Button.prototype.clickedFor = 0;

  return Button;

})();


},{"tinycolor2":2}],7:[function(require,module,exports){
var Particle;

module.exports = Particle = (function() {
  function Particle(options) {
    var angle;
    this.colour = options.colour;
    this.position = {
      x: options.position.x + Math.random(),
      y: options.position.y + Math.random()
    };
    angle = (Math.PI * 2) * Math.random();
    this.velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
    this.speed = this.speed * Math.random();
  }

  Particle.prototype.update = function() {
    if (this.opacity <= 0) {
      this.status = "destroyed";
    }
    this.opacity -= Math.random() / 20;
    this.position.x += this.speed * this.velocity.x;
    return this.position.y += this.speed * this.velocity.y;
  };

  Particle.prototype.render = function(canvasContext) {
    canvasContext.save();
    canvasContext.globalAlpha = Math.max(0, this.opacity);
    canvasContext.fillStyle = this.colour;
    canvasContext.fillRect(this.position.x, this.position.y, 2, 2);
    return canvasContext.restore();
  };

  Particle.prototype.colour = null;

  Particle.prototype.opacity = 1;

  Particle.prototype.status = "fine";

  Particle.prototype.speed = 2;

  return Particle;

})();


},{}],8:[function(require,module,exports){
var Particle, ParticleManager;

Particle = require("./particle");

module.exports = new (ParticleManager = (function() {
  function ParticleManager() {}

  ParticleManager.prototype.particles = [];

  ParticleManager.prototype.createParticles = function(options) {
    var i, _i, _ref, _results;
    _results = [];
    for (i = _i = 0, _ref = options.count; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(this.create(options));
    }
    return _results;
  };

  ParticleManager.prototype.create = function(options) {
    options.midPoint = this.midPoint;
    return this.particles.push(new Particle(options));
  };

  ParticleManager.prototype.updateAll = function() {
    var particle, _i, _len, _ref;
    _ref = this.particles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      particle = _ref[_i];
      if (particle.status === "fine") {
        particle.update();
      }
    }
    return this.particles = (function() {
      var _j, _len1, _ref1, _results;
      _ref1 = this.particles;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        particle = _ref1[_j];
        if (particle.status !== "destroyed") {
          _results.push(particle);
        }
      }
      return _results;
    }).call(this);
  };

  ParticleManager.prototype.renderAll = function(canvasContext) {
    var particle, _i, _len, _ref;
    canvasContext.save();
    _ref = this.particles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      particle = _ref[_i];
      particle.render(canvasContext);
    }
    return canvasContext.restore();
  };

  return ParticleManager;

})());


},{"./particle":7}],9:[function(require,module,exports){
var Player, audioEffects, bulletManager, currentKeys;

currentKeys = require("../util/current_keys");

bulletManager = require("./bullet_manager");

audioEffects = require("../util/audio_effects");

module.exports = Player = (function() {
  function Player(options) {
    this.position.x = options.canvasContext.canvas.width / 2;
    this.position.y = options.canvasContext.canvas.height / 2;
  }

  Player.prototype.fire = function() {
    return this.lastShot = Date.now();
  };

  Player.prototype.render = function(canvasContext) {
    this.update();
    canvasContext.save();
    canvasContext.translate(canvasContext.canvas.width / 2, canvasContext.canvas.height / 2);
    canvasContext.translate(0, 0);
    canvasContext.rotate(this.angle);
    canvasContext.fillStyle = "rgb(200,200,200)";
    canvasContext.strokeStyle = "rgb(20,20,20)";
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    canvasContext.moveTo(0, -10);
    canvasContext.lineTo(10, 10);
    canvasContext.lineTo(-10, 10);
    canvasContext.closePath();
    canvasContext.stroke();
    canvasContext.fill();
    canvasContext.clip();
    canvasContext.fillStyle = canvasContext.strokeStyle;
    canvasContext.fillRect(-10, -10, 20, 6);
    return canvasContext.restore();
  };

  Player.prototype.speedUp = function() {
    if (this.speed < 0.095) {
      return this.speed += 0.0005;
    }
  };

  Player.prototype.speedDown = function() {
    if (this.speed > 0.02) {
      return this.speed -= 0.005;
    }
  };

  Player.prototype.update = function() {
    var now, somethingPressed;
    somethingPressed = false;
    if (currentKeys["A"] || currentKeys["<left>"]) {
      this.angle -= this.speed;
      this.speedUp();
      somethingPressed = true;
    }
    if (currentKeys["D"] || currentKeys["<right>"]) {
      this.angle += this.speed;
      this.speedUp();
      somethingPressed = true;
    }
    if (currentKeys["<space>"]) {
      now = Date.now();
      if ((this.lastShot + 200) < now) {
        audioEffects.playFire();
        this.lastShot = now;
        bulletManager.create({
          position: this.position,
          angle: this.angle
        });
      }
    }
    if (!somethingPressed) {
      return this.speedDown();
    }
  };

  Player.prototype.score = 0;

  Player.prototype.position = {
    x: 0,
    y: 0
  };

  Player.prototype.lastShot = 0;

  Player.prototype.angle = 0;

  Player.prototype.speed = 0.02;

  return Player;

})();


},{"../util/audio_effects":16,"../util/current_keys":17,"./bullet_manager":5}],10:[function(require,module,exports){
var Pointer, audioEffects, lineDistance, particleManager, scoreCounter, tinyColor;

tinyColor = require("tinyColor2");

scoreCounter = require("./score_counter");

audioEffects = require("../util/audio_effects");

particleManager = require("./particles_manager");

lineDistance = function(point1, point2) {
  var xs, ys;
  xs = point2.x - point1.x;
  xs = xs * xs;
  ys = point2.y - point1.y;
  ys = ys * ys;
  return Math.sqrt(xs + ys);
};

module.exports = Pointer = (function() {
  function Pointer(options) {
    var angle, offsetX, offsetY;
    this.targetButton = options.targetButton;
    angle = Math.random() * (Math.PI * 2);
    offsetX = (Math.sin(angle)) * 250;
    offsetY = (Math.cos(angle)) * 250;
    this.headingTowards = {
      x: this.targetButton.position.x + 15 + ((this.targetButton.width - 30) * Math.random()),
      y: this.targetButton.position.y + 15 + (20 * Math.random())
    };
    this.position = {
      x: options.midPoint.x + offsetX,
      y: options.midPoint.y + offsetY
    };
    this.velocity = {
      x: Math.random(),
      y: Math.random()
    };
    this.fillColour = tinyColor(this.targetButton.colour).lighten(25).desaturate(20).toString();
  }

  Pointer.prototype.update = function() {
    if (this.position.x > this.headingTowards.x) {
      this.position.x -= this.speed * Math.random();
    }
    if (this.position.x < this.headingTowards.x) {
      this.position.x += this.speed * Math.random();
    }
    if (this.position.y > this.headingTowards.y) {
      this.position.y -= this.speed * Math.random();
    }
    if (this.position.y < this.headingTowards.y) {
      this.position.y += this.speed * Math.random();
    }
    return this.testIfOverButton();
  };

  Pointer.prototype.testIfOverButton = function() {
    if (this.position.x > this.targetButton.position.x + 15 && this.position.x < ((this.targetButton.position.x - 15) + this.targetButton.width) && this.position.y > this.targetButton.position.y + 15 && this.position.y < this.targetButton.position.y + 35) {
      this.targetButton.clicked = true;
      this.status = "destroyed";
      if (this.targetButton.text === "Good") {
        scoreCounter.increase(1);
      }
      if (this.targetButton.text === "Slaughter") {
        scoreCounter.decrease(1);
      }
      return audioEffects.click.play();
    }
  };

  Pointer.prototype.render = function(canvasContext) {
    canvasContext.save();
    canvasContext.strokeStyle = "black";
    canvasContext.fillStyle = this.fillColour;
    canvasContext.beginPath();
    canvasContext.moveTo(this.position.x, this.position.y);
    canvasContext.lineTo(this.position.x + 14, this.position.y + 15);
    canvasContext.lineTo(this.position.x, this.position.y + 20);
    canvasContext.closePath();
    canvasContext.stroke();
    canvasContext.fill();
    return canvasContext.restore();
  };

  Pointer.prototype.testBullet = function(bullet) {
    var position;
    position = bullet.position;
    if ((lineDistance(this.position, position)) < 15) {
      this.status = "destroyed";
      if (this.targetButton.text === "Good") {
        scoreCounter.decrease(3);
      }
      if (this.targetButton.text === "Bad") {
        scoreCounter.increase(1);
      }
      if (this.targetButton.text === "Slaughter") {
        scoreCounter.increase(2);
      }
      audioEffects.playHit();
      bullet.status = "destroyed";
      return particleManager.createParticles({
        count: 100,
        colour: this.fillColour,
        position: {
          x: this.position.x + 10,
          y: this.position.y + 10
        }
      });
    }
  };

  Pointer.prototype.testAgainst = function(bullets) {
    var bullet, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = bullets.length; _i < _len; _i++) {
      bullet = bullets[_i];
      _results.push(this.testBullet(bullet));
    }
    return _results;
  };

  Pointer.prototype.position = {
    x: 0,
    y: 0
  };

  Pointer.prototype.velocity = {
    x: 0,
    y: 0
  };

  Pointer.prototype.targetButton = null;

  Pointer.prototype.fillColour = null;

  Pointer.prototype.status = "fine";

  Pointer.prototype.speed = 1;

  return Pointer;

})();


},{"../util/audio_effects":16,"./particles_manager":8,"./score_counter":12,"tinyColor2":1}],11:[function(require,module,exports){
var Pointer, PointerManager;

Pointer = require("./pointer");

module.exports = PointerManager = (function() {
  function PointerManager(options) {
    this.midPoint = options.midPoint;
    this.targetButtons = options.targets;
  }

  PointerManager.prototype.pointers = [];

  PointerManager.prototype.createNewPointerForTarget = function() {
    var button;
    button = this.targetButtons[Math.floor(Math.random() * this.targetButtons.length)];
    return this.create({
      targetButton: button
    });
  };

  PointerManager.prototype.create = function(options) {
    options.midPoint = this.midPoint;
    return this.pointers.push(new Pointer(options));
  };

  PointerManager.prototype.updateAll = function() {
    var pointer, _i, _len, _ref;
    _ref = this.pointers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pointer = _ref[_i];
      if (pointer.status === "fine") {
        pointer.update();
      }
    }
    return this.pointers = (function() {
      var _j, _len1, _ref1, _results;
      _ref1 = this.pointers;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        pointer = _ref1[_j];
        if (pointer.status !== "destroyed") {
          _results.push(pointer);
        }
      }
      return _results;
    }).call(this);
  };

  PointerManager.prototype.testAll = function(bulletManager) {
    var bullets, pointer, _i, _len, _ref, _results;
    bullets = bulletManager.bullets;
    _ref = this.pointers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pointer = _ref[_i];
      _results.push(pointer.testAgainst(bullets));
    }
    return _results;
  };

  PointerManager.prototype.renderAll = function(canvasContext) {
    var pointer, _i, _len, _ref;
    canvasContext.save();
    _ref = this.pointers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pointer = _ref[_i];
      pointer.render(canvasContext);
    }
    return canvasContext.restore();
  };

  return PointerManager;

})();


},{"./pointer":10}],12:[function(require,module,exports){
var ScoreCounter;

module.exports = new (ScoreCounter = (function() {
  function ScoreCounter() {}

  ScoreCounter.prototype.value = 0;

  ScoreCounter.prototype.increase = function(byValue) {
    if (byValue == null) {
      byValue = 1;
    }
    return this.value += byValue;
  };

  ScoreCounter.prototype.decrease = function(byValue) {
    if (byValue == null) {
      byValue = 1;
    }
    return this.value -= byValue;
  };

  return ScoreCounter;

})());


},{}],13:[function(require,module,exports){
var Background, Button, Frame, Player, Pointer, PointerManager, background, badButton, bulletManager, canvas, canvasContext, frame, goodButton, height, particleManager, paused, player, pointerManager, render, scoreCounter, slaughterButton, start, startAnimation, timer, width;

Player = require("./entities/player");

Pointer = require("./entities/pointer");

Frame = require("./ui/frame");

Background = require("./ui/background");

bulletManager = require("./entities/bullet_manager");

PointerManager = require("./entities/pointer_manager");

Button = require("./entities/button");

timer = require("./util/timer");

scoreCounter = require("./entities/score_counter");

particleManager = require("./entities/particles_manager");

canvas = document.getElementById("gameCanvas");

canvasContext = canvas.getContext("2d");

width = null;

height = null;

frame = new Frame;

background = new Background;

player = new Player({
  canvasContext: canvasContext
});

goodButton = new Button({
  text: "Good",
  width: 150,
  colour: "green",
  position: {
    x: 100,
    y: 250
  }
});

badButton = new Button({
  text: "Bad",
  width: 150,
  colour: "orange",
  position: {
    x: 350,
    y: 250
  }
});

slaughterButton = new Button({
  text: "Slaughter",
  width: 200,
  colour: "red",
  position: {
    x: 200,
    y: 310
  }
});

pointerManager = null;

paused = false;

startAnimation = function() {
  var controls, trueStory;
  trueStory = document.getElementById("trueStory");
  controls = document.getElementById("controls");
  trueStory.className = "fadeIn";
  window.setTimeout(function() {
    return controls.className = "fadeIn";
  }, 1000);
  return window.setTimeout(function() {
    var pregameCanvasCover;
    pregameCanvasCover = document.getElementById("pregame");
    pregameCanvasCover.style.display = "none";
    timer.start(60);
    timer.onFinish = function() {
      var postgameCanvasCover, score;
      paused = true;
      postgameCanvasCover = document.getElementById("postgame");
      postgameCanvasCover.className += " fadeIn";
      score = document.getElementById("score");
      return score.innerText = "" + scoreCounter.value;
    };
    return start();
  }, 5000);
};

start = function() {
  width = canvas.width;
  height = canvas.height;
  pointerManager = new PointerManager({
    midPoint: {
      x: width / 2,
      y: height / 2
    },
    targets: [slaughterButton, badButton, goodButton]
  });
  window.pointerManager = pointerManager;
  return render();
};

render = function() {
  if (Math.random() < 0.025) {
    pointerManager.createNewPointerForTarget();
  }
  if (!paused) {
    window.requestAnimationFrame(render);
  }
  canvasContext.clearRect(0, 0, width, height);
  frame.renderBack(canvasContext);
  background.render(canvasContext);
  goodButton.render(canvasContext);
  badButton.render(canvasContext);
  slaughterButton.render(canvasContext);
  bulletManager.updateAll();
  bulletManager.renderAll(canvasContext);
  pointerManager.testAll(bulletManager);
  particleManager.updateAll();
  particleManager.renderAll(canvasContext);
  pointerManager.updateAll();
  pointerManager.renderAll(canvasContext);
  player.render(canvasContext);
  return frame.renderFront(canvasContext);
};

startAnimation();


},{"./entities/bullet_manager":5,"./entities/button":6,"./entities/particles_manager":8,"./entities/player":9,"./entities/pointer":10,"./entities/pointer_manager":11,"./entities/score_counter":12,"./ui/background":14,"./ui/frame":15,"./util/timer":18}],14:[function(require,module,exports){
var Background;

module.exports = Background = (function() {
  function Background() {}

  Background.prototype.render = function(canvasContext) {
    var height, width;
    width = canvasContext.canvas.width;
    height = canvasContext.canvas.height;
    canvasContext.save();
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "brown";
    canvasContext.font = "30px sans-serif";
    canvasContext.fillText("LUDUMDARE 31", width / 2, 75);
    canvasContext.fillStyle = "red";
    canvasContext.font = "35px bold";
    canvasContext.fillText("THEME SLAUGHTER", width / 2, 110);
    canvasContext.font = "30px sans-serif";
    canvasContext.fillStyle = "black";
    canvasContext.fillText("\"Entire Game on One Screen\"", width / 2, 180);
    return canvasContext.restore();
  };

  return Background;

})();


},{}],15:[function(require,module,exports){
var Frame, scoreCounter, timer;

scoreCounter = require("../entities/score_counter");

timer = require("../util/timer");

module.exports = Frame = (function() {
  function Frame() {}

  Frame.prototype.renderScore = function(canvasContext) {
    canvasContext.save();
    canvasContext.fillStyle = "white";
    canvasContext.font = "30px bold";
    canvasContext.fillText("score: " + scoreCounter.value, 10, 30);
    return canvasContext.restore();
  };

  Frame.prototype.renderTimer = function(canvasContext) {
    canvasContext.save();
    canvasContext.fillStyle = "white";
    canvasContext.font = "30px bold";
    canvasContext.fillText("time: " + (Math.round(timer.checkTimeLeft())), 450, 30);
    return canvasContext.restore();
  };

  Frame.prototype.renderBack = function(canvasContext) {
    var height, width;
    canvasContext.save();
    width = canvasContext.canvas.width;
    height = canvasContext.canvas.height;
    canvasContext.fillStyle = "#8BC97B";
    canvasContext.fillRect(0, 0, width, height);
    this.renderScore(canvasContext);
    this.renderTimer(canvasContext);
    canvasContext.beginPath();
    canvasContext.arc(width / 2, height / 2, (height / 2) - 5, 0, 2 * Math.PI);
    canvasContext.clip();
    return canvasContext.clearRect(0, 0, width, height);
  };

  Frame.prototype.renderFront = function(canvasContext) {
    var height, width;
    width = canvasContext.canvas.width;
    height = canvasContext.canvas.height;
    canvasContext.strokeStyle = "rgba(125,125,125,0.2)";
    canvasContext.lineWidth = 10;
    canvasContext.beginPath();
    canvasContext.arc(width / 2, (height / 2) + 2, (height / 2) - 10, 0, 2 * Math.PI);
    canvasContext.stroke();
    canvasContext.restore();
    canvasContext.save();
    canvasContext.fillStyle = "#59804F";
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    canvasContext.arc(width / 2, height / 2, (height / 2) - 5, 0, 2 * Math.PI);
    canvasContext.stroke();
    return canvasContext.restore();
  };

  return Frame;

})();


},{"../entities/score_counter":12,"../util/timer":18}],16:[function(require,module,exports){
var AudioEffects;

module.exports = new (AudioEffects = (function() {
  function AudioEffects() {
    this.fires.push(jsfxlib.createWave(["noise", 0.0000, 0.4000, 0.0000, 0.0000, 0.0000, 0.2380, 2400.0000, 590.0000, 20.0000, 1.0000, 0.7120, 1.0000, 5.8648, -0.2428, -0.0420, 0.2060, 0.2450, 0.5000, -0.1600, 0.0000, 0.0560, 0.4260, 0.9950, -0.0040, 1.0000, 0.0000, 0.0000]));
    this.fires.push(jsfxlib.createWave(["noise", 0.0000, 0.4000, 0.0000, 0.0000, 0.0000, 0.2380, 2400.0000, 590.0000, 20.0000, 1.0000, 0.7120, 1.0000, 5.8648, -0.2428, -0.0420, 0.2060, 0.2450, 0.5000, -0.1600, 0.0000, 0.0560, 0.4260, 0.9950, -0.0040, 1.0000, 0.0000, 0.0000]));
    this.fires.push(jsfxlib.createWave(["noise", 0.0000, 0.4000, 0.0000, 0.0000, 0.0000, 0.2380, 2400.0000, 590.0000, 20.0000, 1.0000, 0.7120, 1.0000, 5.8648, -0.2428, -0.0420, 0.2060, 0.2450, 0.5000, -0.1600, 0.0000, 0.0560, 0.4260, 0.9950, -0.0040, 1.0000, 0.0000, 0.0000]));
    this.fires.push(jsfxlib.createWave(["noise", 0.0000, 0.4000, 0.0000, 0.0000, 0.0000, 0.2380, 2400.0000, 590.0000, 20.0000, 1.0000, 0.7120, 1.0000, 5.8648, -0.2428, -0.0420, 0.2060, 0.2450, 0.5000, -0.1600, 0.0000, 0.0560, 0.4260, 0.9950, -0.0040, 1.0000, 0.0000, 0.0000]));
    this.fires.push(jsfxlib.createWave(["noise", 0.0000, 0.4000, 0.0000, 0.0000, 0.0000, 0.2380, 2400.0000, 590.0000, 20.0000, 1.0000, 0.7120, 1.0000, 5.8648, -0.2428, -0.0420, 0.2060, 0.2450, 0.5000, -0.1600, 0.0000, 0.0560, 0.4260, 0.9950, -0.0040, 1.0000, 0.0000, 0.0000]));
    this.click = jsfxlib.createWave(["square", 0.0000, 1.0000, 0.0000, 0.0280, 3.0000, 0.0000, 2400.0000, 20.0000, 868.0000, 0.0000, 0.0000, 0.5900, 24.0050, 0.0003, 0.0000, -0.8200, 0.0000, 0.3120, 0.0000, 0.0000, 0.9220, 0.8080, 0.9890, 0.0000, 0.0000, 0.1000, 0.0000]);
    this.hitPointers.push(jsfxlib.createWave(["noise", 0.0000, 1.0000, 0.0000, 0.0460, 3.0000, 0.1240, 20.0000, 1306.0000, 2400.0000, -0.2420, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.5460, 0.8940, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]));
    this.hitPointers.push(jsfxlib.createWave(["noise", 0.0000, 1.0000, 0.0000, 0.0460, 3.0000, 0.1240, 20.0000, 1306.0000, 2400.0000, -0.2420, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.5460, 0.8940, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]));
    this.hitPointers.push(jsfxlib.createWave(["noise", 0.0000, 1.0000, 0.0000, 0.0460, 3.0000, 0.1240, 20.0000, 1306.0000, 2400.0000, -0.2420, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.5460, 0.8940, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]));
  }

  AudioEffects.prototype.fires = [];

  AudioEffects.prototype.click = null;

  AudioEffects.prototype.hitPointers = [];

  AudioEffects.prototype.playFire = function() {
    return this.fires[Math.floor(Math.random() * this.fires.length)].play();
  };

  AudioEffects.prototype.playHit = function() {
    return this.hitPointers[Math.floor(Math.random() * this.hitPointers.length)].play();
  };

  return AudioEffects;

})());


},{}],17:[function(require,module,exports){
var currentKeys, vkey;

vkey = require("vkey");

currentKeys = {};

window.addEventListener("keydown", function(event) {
  currentKeys[vkey[event.keyCode]] = true;
  return event.preventDefault();
});

window.addEventListener("keyup", function(event) {
  delete currentKeys[vkey[event.keyCode]];
  return event.preventDefault();
});

module.exports = currentKeys;


},{"vkey":3}],18:[function(require,module,exports){
var Timer;

module.exports = new (Timer = (function() {
  function Timer() {}

  Timer.prototype.duration = 0;

  Timer.prototype.startedAt = 0;

  Timer.prototype.onFinish = null;

  Timer.prototype.start = function(forDuration) {
    this.duration = forDuration * 1000;
    return this.startedAt = Date.now();
  };

  Timer.prototype.checkTimeLeft = function() {
    var now, timeDelta, timeLeft;
    now = Date.now();
    timeDelta = now - this.startedAt;
    timeLeft = (this.duration - timeDelta) / 1000;
    if (timeLeft <= 0) {
      if (typeof this.onFinish === "function") {
        this.onFinish();
      }
    }
    return timeLeft;
  };

  return Timer;

})());


},{}]},{},[13])