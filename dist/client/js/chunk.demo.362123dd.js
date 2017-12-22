webpackJsonp([1],{

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseBoundCurves = exports.calculatePaddingBoxPath = exports.calculateBorderBoxPath = exports.parsePathForBorder = exports.parseDocumentSize = exports.calculateContentBox = exports.calculatePaddingBox = exports.parseBounds = exports.Bounds = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Vector = __webpack_require__(71);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _BezierCurve = __webpack_require__(319);
	
	var _BezierCurve2 = _interopRequireDefault(_BezierCurve);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TOP = 0;
	var RIGHT = 1;
	var BOTTOM = 2;
	var LEFT = 3;
	
	var H = 0;
	var V = 1;
	
	var Bounds = exports.Bounds = function () {
	    function Bounds(x, y, w, h) {
	        _classCallCheck(this, Bounds);
	
	        this.left = x;
	        this.top = y;
	        this.width = w;
	        this.height = h;
	    }
	
	    _createClass(Bounds, null, [{
	        key: 'fromClientRect',
	        value: function fromClientRect(clientRect, scrollX, scrollY) {
	            return new Bounds(clientRect.left + scrollX, clientRect.top + scrollY, clientRect.width, clientRect.height);
	        }
	    }]);
	
	    return Bounds;
	}();
	
	var parseBounds = exports.parseBounds = function parseBounds(node, scrollX, scrollY) {
	    return Bounds.fromClientRect(node.getBoundingClientRect(), scrollX, scrollY);
	};
	
	var calculatePaddingBox = exports.calculatePaddingBox = function calculatePaddingBox(bounds, borders) {
	    return new Bounds(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth, bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth), bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth));
	};
	
	var calculateContentBox = exports.calculateContentBox = function calculateContentBox(bounds, padding, borders) {
	    // TODO support percentage paddings
	    var paddingTop = padding[TOP].value;
	    var paddingRight = padding[RIGHT].value;
	    var paddingBottom = padding[BOTTOM].value;
	    var paddingLeft = padding[LEFT].value;
	
	    return new Bounds(bounds.left + paddingLeft + borders[LEFT].borderWidth, bounds.top + paddingTop + borders[TOP].borderWidth, bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth + paddingLeft + paddingRight), bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth + paddingTop + paddingBottom));
	};
	
	var parseDocumentSize = exports.parseDocumentSize = function parseDocumentSize(document) {
	    var body = document.body;
	    var documentElement = document.documentElement;
	
	    if (!body || !documentElement) {
	        throw new Error( false ? 'Unable to get document size' : '');
	    }
	    var width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));
	
	    var height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));
	
	    return new Bounds(0, 0, width, height);
	};
	
	var parsePathForBorder = exports.parsePathForBorder = function parsePathForBorder(curves, borderSide) {
	    switch (borderSide) {
	        case TOP:
	            return createPathFromCurves(curves.topLeftOuter, curves.topLeftInner, curves.topRightOuter, curves.topRightInner);
	        case RIGHT:
	            return createPathFromCurves(curves.topRightOuter, curves.topRightInner, curves.bottomRightOuter, curves.bottomRightInner);
	        case BOTTOM:
	            return createPathFromCurves(curves.bottomRightOuter, curves.bottomRightInner, curves.bottomLeftOuter, curves.bottomLeftInner);
	        case LEFT:
	        default:
	            return createPathFromCurves(curves.bottomLeftOuter, curves.bottomLeftInner, curves.topLeftOuter, curves.topLeftInner);
	    }
	};
	
	var createPathFromCurves = function createPathFromCurves(outer1, inner1, outer2, inner2) {
	    var path = [];
	    if (outer1 instanceof _BezierCurve2.default) {
	        path.push(outer1.subdivide(0.5, false));
	    } else {
	        path.push(outer1);
	    }
	
	    if (outer2 instanceof _BezierCurve2.default) {
	        path.push(outer2.subdivide(0.5, true));
	    } else {
	        path.push(outer2);
	    }
	
	    if (inner2 instanceof _BezierCurve2.default) {
	        path.push(inner2.subdivide(0.5, true).reverse());
	    } else {
	        path.push(inner2);
	    }
	
	    if (inner1 instanceof _BezierCurve2.default) {
	        path.push(inner1.subdivide(0.5, false).reverse());
	    } else {
	        path.push(inner1);
	    }
	
	    return path;
	};
	
	var calculateBorderBoxPath = exports.calculateBorderBoxPath = function calculateBorderBoxPath(curves) {
	    return [curves.topLeftOuter, curves.topRightOuter, curves.bottomRightOuter, curves.bottomLeftOuter];
	};
	
	var calculatePaddingBoxPath = exports.calculatePaddingBoxPath = function calculatePaddingBoxPath(curves) {
	    return [curves.topLeftInner, curves.topRightInner, curves.bottomRightInner, curves.bottomLeftInner];
	};
	
	var parseBoundCurves = exports.parseBoundCurves = function parseBoundCurves(bounds, borders, borderRadius) {
	    var HALF_WIDTH = bounds.width / 2;
	    var HALF_HEIGHT = bounds.height / 2;
	    var tlh = borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
	    var tlv = borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
	    var trh = borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
	    var trv = borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
	    var brh = borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
	    var brv = borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
	    var blh = borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
	    var blv = borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
	
	    var topWidth = bounds.width - trh;
	    var rightHeight = bounds.height - brv;
	    var bottomWidth = bounds.width - brh;
	    var leftHeight = bounds.height - blv;
	
	    return {
	        topLeftOuter: tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT) : new _Vector2.default(bounds.left, bounds.top),
	        topLeftInner: tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth, Math.max(0, tlh - borders[LEFT].borderWidth), Math.max(0, tlv - borders[TOP].borderWidth), CORNER.TOP_LEFT) : new _Vector2.default(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth),
	        topRightOuter: trh > 0 || trv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT) : new _Vector2.default(bounds.left + bounds.width, bounds.top),
	        topRightInner: trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borders[LEFT].borderWidth), bounds.top + borders[TOP].borderWidth, topWidth > bounds.width + borders[LEFT].borderWidth ? 0 : trh - borders[LEFT].borderWidth, trv - borders[TOP].borderWidth, CORNER.TOP_RIGHT) : new _Vector2.default(bounds.left + bounds.width - borders[RIGHT].borderWidth, bounds.top + borders[TOP].borderWidth),
	        bottomRightOuter: brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT) : new _Vector2.default(bounds.left + bounds.width, bounds.top + bounds.height),
	        bottomRightInner: brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borders[LEFT].borderWidth), bounds.top + Math.min(rightHeight, bounds.height + borders[TOP].borderWidth), Math.max(0, brh - borders[RIGHT].borderWidth), brv - borders[BOTTOM].borderWidth, CORNER.BOTTOM_RIGHT) : new _Vector2.default(bounds.left + bounds.width - borders[RIGHT].borderWidth, bounds.top + bounds.height - borders[BOTTOM].borderWidth),
	        bottomLeftOuter: blh > 0 || blv > 0 ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT) : new _Vector2.default(bounds.left, bounds.top + bounds.height),
	        bottomLeftInner: blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borders[LEFT].borderWidth, bounds.top + leftHeight, Math.max(0, blh - borders[LEFT].borderWidth), blv - borders[BOTTOM].borderWidth, CORNER.BOTTOM_LEFT) : new _Vector2.default(bounds.left + borders[LEFT].borderWidth, bounds.top + bounds.height - borders[BOTTOM].borderWidth)
	    };
	};
	
	var CORNER = {
	    TOP_LEFT: 0,
	    TOP_RIGHT: 1,
	    BOTTOM_RIGHT: 2,
	    BOTTOM_LEFT: 3
	};
	
	var getCurvePoints = function getCurvePoints(x, y, r1, r2, position) {
	    var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
	    var ox = r1 * kappa; // control point offset horizontal
	    var oy = r2 * kappa; // control point offset vertical
	    var xm = x + r1; // x-middle
	    var ym = y + r2; // y-middle
	
	    switch (position) {
	        case CORNER.TOP_LEFT:
	            return new _BezierCurve2.default(new _Vector2.default(x, ym), new _Vector2.default(x, ym - oy), new _Vector2.default(xm - ox, y), new _Vector2.default(xm, y));
	        case CORNER.TOP_RIGHT:
	            return new _BezierCurve2.default(new _Vector2.default(x, y), new _Vector2.default(x + ox, y), new _Vector2.default(xm, ym - oy), new _Vector2.default(xm, ym));
	        case CORNER.BOTTOM_RIGHT:
	            return new _BezierCurve2.default(new _Vector2.default(xm, y), new _Vector2.default(xm, y + oy), new _Vector2.default(x + ox, ym), new _Vector2.default(x, ym));
	        case CORNER.BOTTOM_LEFT:
	        default:
	            return new _BezierCurve2.default(new _Vector2.default(xm, ym), new _Vector2.default(xm - ox, ym), new _Vector2.default(x, y + oy), new _Vector2.default(x, y));
	    }
	};

/***/ }),

/***/ 25:
/***/ (function(module, exports) {

	'use strict';
	
	// http://dev.w3.org/csswg/css-color/
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HEX3 = /^#([a-f0-9]{3})$/i;
	var hex3 = function hex3(value) {
	    var match = value.match(HEX3);
	    if (match) {
	        return [parseInt(match[1][0] + match[1][0], 16), parseInt(match[1][1] + match[1][1], 16), parseInt(match[1][2] + match[1][2], 16), null];
	    }
	    return false;
	};
	
	var HEX6 = /^#([a-f0-9]{6})$/i;
	var hex6 = function hex6(value) {
	    var match = value.match(HEX6);
	    if (match) {
	        return [parseInt(match[1].substring(0, 2), 16), parseInt(match[1].substring(2, 4), 16), parseInt(match[1].substring(4, 6), 16), null];
	    }
	    return false;
	};
	
	var RGB = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
	var rgb = function rgb(value) {
	    var match = value.match(RGB);
	    if (match) {
	        return [Number(match[1]), Number(match[2]), Number(match[3]), null];
	    }
	    return false;
	};
	
	var RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
	var rgba = function rgba(value) {
	    var match = value.match(RGBA);
	    if (match && match.length > 4) {
	        return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
	    }
	    return false;
	};
	
	var fromArray = function fromArray(array) {
	    return [Math.min(array[0], 255), Math.min(array[1], 255), Math.min(array[2], 255), array.length > 3 ? array[3] : null];
	};
	
	var namedColor = function namedColor(name) {
	    var color = NAMED_COLORS[name.toLowerCase()];
	    return color ? color : false;
	};
	
	var Color = function () {
	    function Color(value) {
	        _classCallCheck(this, Color);
	
	        var _ref = Array.isArray(value) ? fromArray(value) : hex3(value) || rgb(value) || rgba(value) || namedColor(value) || hex6(value) || [0, 0, 0, null],
	            _ref2 = _slicedToArray(_ref, 4),
	            r = _ref2[0],
	            g = _ref2[1],
	            b = _ref2[2],
	            a = _ref2[3];
	
	        this.r = r;
	        this.g = g;
	        this.b = b;
	        this.a = a;
	    }
	
	    _createClass(Color, [{
	        key: 'isTransparent',
	        value: function isTransparent() {
	            return this.a === 0;
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return this.a !== null && this.a !== 1 ? 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')' : 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
	        }
	    }]);
	
	    return Color;
	}();
	
	exports.default = Color;
	
	
	var NAMED_COLORS = {
	    transparent: [0, 0, 0, 0],
	    aliceblue: [240, 248, 255, null],
	    antiquewhite: [250, 235, 215, null],
	    aqua: [0, 255, 255, null],
	    aquamarine: [127, 255, 212, null],
	    azure: [240, 255, 255, null],
	    beige: [245, 245, 220, null],
	    bisque: [255, 228, 196, null],
	    black: [0, 0, 0, null],
	    blanchedalmond: [255, 235, 205, null],
	    blue: [0, 0, 255, null],
	    blueviolet: [138, 43, 226, null],
	    brown: [165, 42, 42, null],
	    burlywood: [222, 184, 135, null],
	    cadetblue: [95, 158, 160, null],
	    chartreuse: [127, 255, 0, null],
	    chocolate: [210, 105, 30, null],
	    coral: [255, 127, 80, null],
	    cornflowerblue: [100, 149, 237, null],
	    cornsilk: [255, 248, 220, null],
	    crimson: [220, 20, 60, null],
	    cyan: [0, 255, 255, null],
	    darkblue: [0, 0, 139, null],
	    darkcyan: [0, 139, 139, null],
	    darkgoldenrod: [184, 134, 11, null],
	    darkgray: [169, 169, 169, null],
	    darkgreen: [0, 100, 0, null],
	    darkgrey: [169, 169, 169, null],
	    darkkhaki: [189, 183, 107, null],
	    darkmagenta: [139, 0, 139, null],
	    darkolivegreen: [85, 107, 47, null],
	    darkorange: [255, 140, 0, null],
	    darkorchid: [153, 50, 204, null],
	    darkred: [139, 0, 0, null],
	    darksalmon: [233, 150, 122, null],
	    darkseagreen: [143, 188, 143, null],
	    darkslateblue: [72, 61, 139, null],
	    darkslategray: [47, 79, 79, null],
	    darkslategrey: [47, 79, 79, null],
	    darkturquoise: [0, 206, 209, null],
	    darkviolet: [148, 0, 211, null],
	    deeppink: [255, 20, 147, null],
	    deepskyblue: [0, 191, 255, null],
	    dimgray: [105, 105, 105, null],
	    dimgrey: [105, 105, 105, null],
	    dodgerblue: [30, 144, 255, null],
	    firebrick: [178, 34, 34, null],
	    floralwhite: [255, 250, 240, null],
	    forestgreen: [34, 139, 34, null],
	    fuchsia: [255, 0, 255, null],
	    gainsboro: [220, 220, 220, null],
	    ghostwhite: [248, 248, 255, null],
	    gold: [255, 215, 0, null],
	    goldenrod: [218, 165, 32, null],
	    gray: [128, 128, 128, null],
	    green: [0, 128, 0, null],
	    greenyellow: [173, 255, 47, null],
	    grey: [128, 128, 128, null],
	    honeydew: [240, 255, 240, null],
	    hotpink: [255, 105, 180, null],
	    indianred: [205, 92, 92, null],
	    indigo: [75, 0, 130, null],
	    ivory: [255, 255, 240, null],
	    khaki: [240, 230, 140, null],
	    lavender: [230, 230, 250, null],
	    lavenderblush: [255, 240, 245, null],
	    lawngreen: [124, 252, 0, null],
	    lemonchiffon: [255, 250, 205, null],
	    lightblue: [173, 216, 230, null],
	    lightcoral: [240, 128, 128, null],
	    lightcyan: [224, 255, 255, null],
	    lightgoldenrodyellow: [250, 250, 210, null],
	    lightgray: [211, 211, 211, null],
	    lightgreen: [144, 238, 144, null],
	    lightgrey: [211, 211, 211, null],
	    lightpink: [255, 182, 193, null],
	    lightsalmon: [255, 160, 122, null],
	    lightseagreen: [32, 178, 170, null],
	    lightskyblue: [135, 206, 250, null],
	    lightslategray: [119, 136, 153, null],
	    lightslategrey: [119, 136, 153, null],
	    lightsteelblue: [176, 196, 222, null],
	    lightyellow: [255, 255, 224, null],
	    lime: [0, 255, 0, null],
	    limegreen: [50, 205, 50, null],
	    linen: [250, 240, 230, null],
	    magenta: [255, 0, 255, null],
	    maroon: [128, 0, 0, null],
	    mediumaquamarine: [102, 205, 170, null],
	    mediumblue: [0, 0, 205, null],
	    mediumorchid: [186, 85, 211, null],
	    mediumpurple: [147, 112, 219, null],
	    mediumseagreen: [60, 179, 113, null],
	    mediumslateblue: [123, 104, 238, null],
	    mediumspringgreen: [0, 250, 154, null],
	    mediumturquoise: [72, 209, 204, null],
	    mediumvioletred: [199, 21, 133, null],
	    midnightblue: [25, 25, 112, null],
	    mintcream: [245, 255, 250, null],
	    mistyrose: [255, 228, 225, null],
	    moccasin: [255, 228, 181, null],
	    navajowhite: [255, 222, 173, null],
	    navy: [0, 0, 128, null],
	    oldlace: [253, 245, 230, null],
	    olive: [128, 128, 0, null],
	    olivedrab: [107, 142, 35, null],
	    orange: [255, 165, 0, null],
	    orangered: [255, 69, 0, null],
	    orchid: [218, 112, 214, null],
	    palegoldenrod: [238, 232, 170, null],
	    palegreen: [152, 251, 152, null],
	    paleturquoise: [175, 238, 238, null],
	    palevioletred: [219, 112, 147, null],
	    papayawhip: [255, 239, 213, null],
	    peachpuff: [255, 218, 185, null],
	    peru: [205, 133, 63, null],
	    pink: [255, 192, 203, null],
	    plum: [221, 160, 221, null],
	    powderblue: [176, 224, 230, null],
	    purple: [128, 0, 128, null],
	    rebeccapurple: [102, 51, 153, null],
	    red: [255, 0, 0, null],
	    rosybrown: [188, 143, 143, null],
	    royalblue: [65, 105, 225, null],
	    saddlebrown: [139, 69, 19, null],
	    salmon: [250, 128, 114, null],
	    sandybrown: [244, 164, 96, null],
	    seagreen: [46, 139, 87, null],
	    seashell: [255, 245, 238, null],
	    sienna: [160, 82, 45, null],
	    silver: [192, 192, 192, null],
	    skyblue: [135, 206, 235, null],
	    slateblue: [106, 90, 205, null],
	    slategray: [112, 128, 144, null],
	    slategrey: [112, 128, 144, null],
	    snow: [255, 250, 250, null],
	    springgreen: [0, 255, 127, null],
	    steelblue: [70, 130, 180, null],
	    tan: [210, 180, 140, null],
	    teal: [0, 128, 128, null],
	    thistle: [216, 191, 216, null],
	    tomato: [255, 99, 71, null],
	    turquoise: [64, 224, 208, null],
	    violet: [238, 130, 238, null],
	    wheat: [245, 222, 179, null],
	    white: [255, 255, 255, null],
	    whitesmoke: [245, 245, 245, null],
	    yellow: [255, 255, 0, null],
	    yellowgreen: [154, 205, 50, null]
	};
	
	var TRANSPARENT = exports.TRANSPARENT = new Color([0, 0, 0, 0]);

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.calculateLengthFromValueWithUnit = exports.LENGTH_TYPE = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _NodeContainer = __webpack_require__(52);
	
	var _NodeContainer2 = _interopRequireDefault(_NodeContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LENGTH_WITH_UNIT = /([\d.]+)(px|r?em|%)/i;
	
	var LENGTH_TYPE = exports.LENGTH_TYPE = {
	    PX: 0,
	    PERCENTAGE: 1
	};
	
	var Length = function () {
	    function Length(value) {
	        _classCallCheck(this, Length);
	
	        this.type = value.substr(value.length - 1) === '%' ? LENGTH_TYPE.PERCENTAGE : LENGTH_TYPE.PX;
	        var parsedValue = parseFloat(value);
	        if (false) {
	            console.error('Invalid value given for Length: "' + value + '"');
	        }
	        this.value = isNaN(parsedValue) ? 0 : parsedValue;
	    }
	
	    _createClass(Length, [{
	        key: 'isPercentage',
	        value: function isPercentage() {
	            return this.type === LENGTH_TYPE.PERCENTAGE;
	        }
	    }, {
	        key: 'getAbsoluteValue',
	        value: function getAbsoluteValue(parentLength) {
	            return this.isPercentage() ? parentLength * (this.value / 100) : this.value;
	        }
	    }], [{
	        key: 'create',
	        value: function create(v) {
	            return new Length(v);
	        }
	    }]);
	
	    return Length;
	}();
	
	exports.default = Length;
	
	
	var getRootFontSize = function getRootFontSize(container) {
	    var parent = container.parent;
	    return parent ? getRootFontSize(parent) : parseFloat(container.style.font.fontSize);
	};
	
	var calculateLengthFromValueWithUnit = exports.calculateLengthFromValueWithUnit = function calculateLengthFromValueWithUnit(container, value, unit) {
	    switch (unit) {
	        case 'px':
	        case '%':
	            return new Length(value + unit);
	        case 'em':
	        case 'rem':
	            var length = new Length(value);
	            length.value *= unit === 'em' ? parseFloat(container.style.font.fontSize) : getRootFontSize(container);
	            return length;
	        default:
	            // TODO: handle correctly if unknown unit is used
	            return new Length('0');
	    }
	};

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var contains = exports.contains = function contains(bit, value) {
	    return (bit & value) !== 0;
	};
	
	var distance = exports.distance = function distance(a, b) {
	    return Math.sqrt(a * a + b * b);
	};
	
	var copyCSSStyles = exports.copyCSSStyles = function copyCSSStyles(style, target) {
	    // Edge does not provide value for cssText
	    for (var i = style.length - 1; i >= 0; i--) {
	        var property = style.item(i);
	        // Safari shows pseudoelements if content is set
	        if (property !== 'content') {
	            target.style.setProperty(property, style.getPropertyValue(property));
	        }
	    }
	    return target;
	};
	
	var SMALL_IMAGE = exports.SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	var _Util = __webpack_require__(41);
	
	var _background = __webpack_require__(53);
	
	var _border = __webpack_require__(100);
	
	var _borderRadius = __webpack_require__(323);
	
	var _display = __webpack_require__(324);
	
	var _float = __webpack_require__(325);
	
	var _font = __webpack_require__(326);
	
	var _letterSpacing = __webpack_require__(327);
	
	var _listStyle = __webpack_require__(159);
	
	var _margin = __webpack_require__(328);
	
	var _overflow = __webpack_require__(329);
	
	var _padding = __webpack_require__(160);
	
	var _position = __webpack_require__(161);
	
	var _textDecoration = __webpack_require__(101);
	
	var _textShadow = __webpack_require__(330);
	
	var _textTransform = __webpack_require__(162);
	
	var _transform = __webpack_require__(331);
	
	var _visibility = __webpack_require__(332);
	
	var _zIndex = __webpack_require__(333);
	
	var _Bounds = __webpack_require__(24);
	
	var _Input = __webpack_require__(154);
	
	var _ListItem = __webpack_require__(155);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
	
	var NodeContainer = function () {
	    function NodeContainer(node, parent, resourceLoader, index) {
	        var _this = this;
	
	        _classCallCheck(this, NodeContainer);
	
	        this.parent = parent;
	        this.tagName = node.tagName;
	        this.index = index;
	        this.childNodes = [];
	        this.listItems = [];
	        if (typeof node.start === 'number') {
	            this.listStart = node.start;
	        }
	        var defaultView = node.ownerDocument.defaultView;
	        var scrollX = defaultView.pageXOffset;
	        var scrollY = defaultView.pageYOffset;
	        var style = defaultView.getComputedStyle(node, null);
	        var display = (0, _display.parseDisplay)(style.display);
	
	        var IS_INPUT = node.type === 'radio' || node.type === 'checkbox';
	
	        var position = (0, _position.parsePosition)(style.position);
	
	        this.style = {
	            background: IS_INPUT ? _Input.INPUT_BACKGROUND : (0, _background.parseBackground)(style, resourceLoader),
	            border: IS_INPUT ? _Input.INPUT_BORDERS : (0, _border.parseBorder)(style),
	            borderRadius: (node instanceof defaultView.HTMLInputElement || node instanceof HTMLInputElement) && IS_INPUT ? (0, _Input.getInputBorderRadius)(node) : (0, _borderRadius.parseBorderRadius)(style),
	            color: IS_INPUT ? _Input.INPUT_COLOR : new _Color2.default(style.color),
	            display: display,
	            float: (0, _float.parseCSSFloat)(style.float),
	            font: (0, _font.parseFont)(style),
	            letterSpacing: (0, _letterSpacing.parseLetterSpacing)(style.letterSpacing),
	            listStyle: display === _display.DISPLAY.LIST_ITEM ? (0, _listStyle.parseListStyle)(style) : null,
	            margin: (0, _margin.parseMargin)(style),
	            opacity: parseFloat(style.opacity),
	            overflow: INPUT_TAGS.indexOf(node.tagName) === -1 ? (0, _overflow.parseOverflow)(style.overflow) : _overflow.OVERFLOW.HIDDEN,
	            padding: (0, _padding.parsePadding)(style),
	            position: position,
	            textDecoration: (0, _textDecoration.parseTextDecoration)(style),
	            textShadow: (0, _textShadow.parseTextShadow)(style.textShadow),
	            textTransform: (0, _textTransform.parseTextTransform)(style.textTransform),
	            transform: (0, _transform.parseTransform)(style),
	            visibility: (0, _visibility.parseVisibility)(style.visibility),
	            zIndex: (0, _zIndex.parseZIndex)(position !== _position.POSITION.STATIC ? style.zIndex : 'auto')
	        };
	
	        if (this.isTransformed()) {
	            // getBoundingClientRect provides values post-transform, we want them without the transformation
	            node.style.transform = 'matrix(1,0,0,1,0,0)';
	        }
	
	        if (display === _display.DISPLAY.LIST_ITEM) {
	            var listOwner = (0, _ListItem.getListOwner)(this);
	            if (listOwner) {
	                var listIndex = listOwner.listItems.length;
	                listOwner.listItems.push(this);
	                this.listIndex = node.hasAttribute('value') && typeof node.value === 'number' ? node.value : listIndex === 0 ? typeof listOwner.listStart === 'number' ? listOwner.listStart : 1 : listOwner.listItems[listIndex - 1].listIndex + 1;
	            }
	        }
	
	        // TODO move bound retrieval for all nodes to a later stage?
	        if (node.tagName === 'IMG') {
	            node.addEventListener('load', function () {
	                _this.bounds = (0, _Bounds.parseBounds)(node, scrollX, scrollY);
	                _this.curvedBounds = (0, _Bounds.parseBoundCurves)(_this.bounds, _this.style.border, _this.style.borderRadius);
	            });
	        }
	        this.image = getImage(node, resourceLoader);
	        this.bounds = IS_INPUT ? (0, _Input.reformatInputBounds)((0, _Bounds.parseBounds)(node, scrollX, scrollY)) : (0, _Bounds.parseBounds)(node, scrollX, scrollY);
	        this.curvedBounds = (0, _Bounds.parseBoundCurves)(this.bounds, this.style.border, this.style.borderRadius);
	
	        if (false) {
	            this.name = '' + node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + node.className.toString().split(' ').map(function (s) {
	                return s.length ? '.' + s : '';
	            }).join('');
	        }
	    }
	
	    _createClass(NodeContainer, [{
	        key: 'getClipPaths',
	        value: function getClipPaths() {
	            var parentClips = this.parent ? this.parent.getClipPaths() : [];
	            var isClipped = this.style.overflow !== _overflow.OVERFLOW.VISIBLE;
	
	            return isClipped ? parentClips.concat([(0, _Bounds.calculatePaddingBoxPath)(this.curvedBounds)]) : parentClips;
	        }
	    }, {
	        key: 'isInFlow',
	        value: function isInFlow() {
	            return this.isRootElement() && !this.isFloating() && !this.isAbsolutelyPositioned();
	        }
	    }, {
	        key: 'isVisible',
	        value: function isVisible() {
	            return !(0, _Util.contains)(this.style.display, _display.DISPLAY.NONE) && this.style.opacity > 0 && this.style.visibility === _visibility.VISIBILITY.VISIBLE;
	        }
	    }, {
	        key: 'isAbsolutelyPositioned',
	        value: function isAbsolutelyPositioned() {
	            return this.style.position !== _position.POSITION.STATIC && this.style.position !== _position.POSITION.RELATIVE;
	        }
	    }, {
	        key: 'isPositioned',
	        value: function isPositioned() {
	            return this.style.position !== _position.POSITION.STATIC;
	        }
	    }, {
	        key: 'isFloating',
	        value: function isFloating() {
	            return this.style.float !== _float.FLOAT.NONE;
	        }
	    }, {
	        key: 'isRootElement',
	        value: function isRootElement() {
	            return this.parent === null;
	        }
	    }, {
	        key: 'isTransformed',
	        value: function isTransformed() {
	            return this.style.transform !== null;
	        }
	    }, {
	        key: 'isPositionedWithZIndex',
	        value: function isPositionedWithZIndex() {
	            return this.isPositioned() && !this.style.zIndex.auto;
	        }
	    }, {
	        key: 'isInlineLevel',
	        value: function isInlineLevel() {
	            return (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE) || (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_BLOCK) || (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_FLEX) || (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_GRID) || (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_LIST_ITEM) || (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_TABLE);
	        }
	    }, {
	        key: 'isInlineBlockOrInlineTable',
	        value: function isInlineBlockOrInlineTable() {
	            return (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_BLOCK) || (0, _Util.contains)(this.style.display, _display.DISPLAY.INLINE_TABLE);
	        }
	    }]);
	
	    return NodeContainer;
	}();
	
	exports.default = NodeContainer;
	
	
	var getImage = function getImage(node, resourceLoader) {
	    if (node instanceof node.ownerDocument.defaultView.SVGSVGElement || node instanceof SVGSVGElement) {
	        var s = new XMLSerializer();
	        return resourceLoader.loadImage('data:image/svg+xml,' + encodeURIComponent(s.serializeToString(node)));
	    }
	    switch (node.tagName) {
	        case 'IMG':
	            // $FlowFixMe
	            var img = node;
	            return resourceLoader.loadImage(img.currentSrc || img.src);
	        case 'CANVAS':
	            // $FlowFixMe
	            var canvas = node;
	            return resourceLoader.loadCanvas(canvas);
	        case 'IFRAME':
	            var iframeKey = node.getAttribute('data-html2canvas-internal-iframe-key');
	            if (iframeKey) {
	                return iframeKey;
	            }
	            break;
	    }
	
	    return null;
	};

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseBackgroundImage = exports.parseBackground = exports.calculateBackgroundRepeatPath = exports.calculateBackgroundPosition = exports.calculateBackgroungPositioningArea = exports.calculateBackgroungPaintingArea = exports.calculateGradientBackgroundSize = exports.calculateBackgroundSize = exports.BACKGROUND_ORIGIN = exports.BACKGROUND_CLIP = exports.BACKGROUND_SIZE = exports.BACKGROUND_REPEAT = undefined;
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	var _Size = __webpack_require__(321);
	
	var _Size2 = _interopRequireDefault(_Size);
	
	var _Vector = __webpack_require__(71);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _Bounds = __webpack_require__(24);
	
	var _padding = __webpack_require__(160);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BACKGROUND_REPEAT = exports.BACKGROUND_REPEAT = {
	    REPEAT: 0,
	    NO_REPEAT: 1,
	    REPEAT_X: 2,
	    REPEAT_Y: 3
	};
	
	var BACKGROUND_SIZE = exports.BACKGROUND_SIZE = {
	    AUTO: 0,
	    CONTAIN: 1,
	    COVER: 2,
	    LENGTH: 3
	};
	
	var BACKGROUND_CLIP = exports.BACKGROUND_CLIP = {
	    BORDER_BOX: 0,
	    PADDING_BOX: 1,
	    CONTENT_BOX: 2
	};
	
	var BACKGROUND_ORIGIN = exports.BACKGROUND_ORIGIN = BACKGROUND_CLIP;
	
	var AUTO = 'auto';
	
	var BackgroundSize = function BackgroundSize(size) {
	    _classCallCheck(this, BackgroundSize);
	
	    switch (size) {
	        case 'contain':
	            this.size = BACKGROUND_SIZE.CONTAIN;
	            break;
	        case 'cover':
	            this.size = BACKGROUND_SIZE.COVER;
	            break;
	        case 'auto':
	            this.size = BACKGROUND_SIZE.AUTO;
	            break;
	        default:
	            this.value = new _Length2.default(size);
	    }
	};
	
	var calculateBackgroundSize = exports.calculateBackgroundSize = function calculateBackgroundSize(backgroundImage, image, bounds) {
	    var width = 0;
	    var height = 0;
	    var size = backgroundImage.size;
	    if (size[0].size === BACKGROUND_SIZE.CONTAIN || size[0].size === BACKGROUND_SIZE.COVER) {
	        var targetRatio = bounds.width / bounds.height;
	        var currentRatio = image.width / image.height;
	        return targetRatio < currentRatio !== (size[0].size === BACKGROUND_SIZE.COVER) ? new _Size2.default(bounds.width, bounds.width / currentRatio) : new _Size2.default(bounds.height * currentRatio, bounds.height);
	    }
	
	    if (size[0].value) {
	        width = size[0].value.getAbsoluteValue(bounds.width);
	    }
	
	    if (size[0].size === BACKGROUND_SIZE.AUTO && size[1].size === BACKGROUND_SIZE.AUTO) {
	        height = image.height;
	    } else if (size[1].size === BACKGROUND_SIZE.AUTO) {
	        height = width / image.width * image.height;
	    } else if (size[1].value) {
	        height = size[1].value.getAbsoluteValue(bounds.height);
	    }
	
	    if (size[0].size === BACKGROUND_SIZE.AUTO) {
	        width = height / image.height * image.width;
	    }
	
	    return new _Size2.default(width, height);
	};
	
	var calculateGradientBackgroundSize = exports.calculateGradientBackgroundSize = function calculateGradientBackgroundSize(backgroundImage, bounds) {
	    var size = backgroundImage.size;
	    var width = size[0].value ? size[0].value.getAbsoluteValue(bounds.width) : bounds.width;
	    var height = size[1].value ? size[1].value.getAbsoluteValue(bounds.height) : size[0].value ? width : bounds.height;
	
	    return new _Size2.default(width, height);
	};
	
	var AUTO_SIZE = new BackgroundSize(AUTO);
	
	var calculateBackgroungPaintingArea = exports.calculateBackgroungPaintingArea = function calculateBackgroungPaintingArea(curves, clip) {
	    switch (clip) {
	        case BACKGROUND_CLIP.BORDER_BOX:
	            return (0, _Bounds.calculateBorderBoxPath)(curves);
	        case BACKGROUND_CLIP.PADDING_BOX:
	        default:
	            return (0, _Bounds.calculatePaddingBoxPath)(curves);
	    }
	};
	
	var calculateBackgroungPositioningArea = exports.calculateBackgroungPositioningArea = function calculateBackgroungPositioningArea(backgroundOrigin, bounds, padding, border) {
	    var paddingBox = (0, _Bounds.calculatePaddingBox)(bounds, border);
	
	    switch (backgroundOrigin) {
	        case BACKGROUND_ORIGIN.BORDER_BOX:
	            return bounds;
	        case BACKGROUND_ORIGIN.CONTENT_BOX:
	            var paddingLeft = padding[_padding.PADDING_SIDES.LEFT].getAbsoluteValue(bounds.width);
	            var paddingRight = padding[_padding.PADDING_SIDES.RIGHT].getAbsoluteValue(bounds.width);
	            var paddingTop = padding[_padding.PADDING_SIDES.TOP].getAbsoluteValue(bounds.width);
	            var paddingBottom = padding[_padding.PADDING_SIDES.BOTTOM].getAbsoluteValue(bounds.width);
	            return new _Bounds.Bounds(paddingBox.left + paddingLeft, paddingBox.top + paddingTop, paddingBox.width - paddingLeft - paddingRight, paddingBox.height - paddingTop - paddingBottom);
	        case BACKGROUND_ORIGIN.PADDING_BOX:
	        default:
	            return paddingBox;
	    }
	};
	
	var calculateBackgroundPosition = exports.calculateBackgroundPosition = function calculateBackgroundPosition(position, size, bounds) {
	    return new _Vector2.default(position[0].getAbsoluteValue(bounds.width - size.width), position[1].getAbsoluteValue(bounds.height - size.height));
	};
	
	var calculateBackgroundRepeatPath = exports.calculateBackgroundRepeatPath = function calculateBackgroundRepeatPath(background, position, size, backgroundPositioningArea, bounds) {
	    var repeat = background.repeat;
	    switch (repeat) {
	        case BACKGROUND_REPEAT.REPEAT_X:
	            return [new _Vector2.default(Math.round(bounds.left), Math.round(backgroundPositioningArea.top + position.y)), new _Vector2.default(Math.round(bounds.left + bounds.width), Math.round(backgroundPositioningArea.top + position.y)), new _Vector2.default(Math.round(bounds.left + bounds.width), Math.round(size.height + backgroundPositioningArea.top + position.y)), new _Vector2.default(Math.round(bounds.left), Math.round(size.height + backgroundPositioningArea.top + position.y))];
	        case BACKGROUND_REPEAT.REPEAT_Y:
	            return [new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x), Math.round(bounds.top)), new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(bounds.top)), new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(bounds.height + bounds.top)), new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x), Math.round(bounds.height + bounds.top))];
	        case BACKGROUND_REPEAT.NO_REPEAT:
	            return [new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y)), new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(backgroundPositioningArea.top + position.y)), new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(backgroundPositioningArea.top + position.y + size.height)), new _Vector2.default(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y + size.height))];
	        default:
	            return [new _Vector2.default(Math.round(bounds.left), Math.round(bounds.top)), new _Vector2.default(Math.round(bounds.left + bounds.width), Math.round(bounds.top)), new _Vector2.default(Math.round(bounds.left + bounds.width), Math.round(bounds.height + bounds.top)), new _Vector2.default(Math.round(bounds.left), Math.round(bounds.height + bounds.top))];
	    }
	};
	
	var parseBackground = exports.parseBackground = function parseBackground(style, resourceLoader) {
	    return {
	        backgroundColor: new _Color2.default(style.backgroundColor),
	        backgroundImage: parseBackgroundImages(style, resourceLoader),
	        backgroundClip: parseBackgroundClip(style.backgroundClip),
	        backgroundOrigin: parseBackgroundOrigin(style.backgroundOrigin)
	    };
	};
	
	var parseBackgroundClip = function parseBackgroundClip(backgroundClip) {
	    switch (backgroundClip) {
	        case 'padding-box':
	            return BACKGROUND_CLIP.PADDING_BOX;
	        case 'content-box':
	            return BACKGROUND_CLIP.CONTENT_BOX;
	    }
	    return BACKGROUND_CLIP.BORDER_BOX;
	};
	
	var parseBackgroundOrigin = function parseBackgroundOrigin(backgroundOrigin) {
	    switch (backgroundOrigin) {
	        case 'padding-box':
	            return BACKGROUND_ORIGIN.PADDING_BOX;
	        case 'content-box':
	            return BACKGROUND_ORIGIN.CONTENT_BOX;
	    }
	    return BACKGROUND_ORIGIN.BORDER_BOX;
	};
	
	var parseBackgroundRepeat = function parseBackgroundRepeat(backgroundRepeat) {
	    switch (backgroundRepeat.trim()) {
	        case 'no-repeat':
	            return BACKGROUND_REPEAT.NO_REPEAT;
	        case 'repeat-x':
	        case 'repeat no-repeat':
	            return BACKGROUND_REPEAT.REPEAT_X;
	        case 'repeat-y':
	        case 'no-repeat repeat':
	            return BACKGROUND_REPEAT.REPEAT_Y;
	        case 'repeat':
	            return BACKGROUND_REPEAT.REPEAT;
	    }
	
	    if (false) {
	        console.error('Invalid background-repeat value "' + backgroundRepeat + '"');
	    }
	
	    return BACKGROUND_REPEAT.REPEAT;
	};
	
	var parseBackgroundImages = function parseBackgroundImages(style, resourceLoader) {
	    var sources = parseBackgroundImage(style.backgroundImage).map(function (backgroundImage) {
	        if (backgroundImage.method === 'url') {
	            var key = resourceLoader.loadImage(backgroundImage.args[0]);
	            backgroundImage.args = key ? [key] : [];
	        }
	        return backgroundImage;
	    });
	    var positions = style.backgroundPosition.split(',');
	    var repeats = style.backgroundRepeat.split(',');
	    var sizes = style.backgroundSize.split(',');
	
	    return sources.map(function (source, index) {
	        var size = (sizes[index] || AUTO).trim().split(' ').map(parseBackgroundSize);
	        var position = (positions[index] || AUTO).trim().split(' ').map(parseBackgoundPosition);
	
	        return {
	            source: source,
	            repeat: parseBackgroundRepeat(typeof repeats[index] === 'string' ? repeats[index] : repeats[0]),
	            size: size.length < 2 ? [size[0], AUTO_SIZE] : [size[0], size[1]],
	            position: position.length < 2 ? [position[0], position[0]] : [position[0], position[1]]
	        };
	    });
	};
	
	var parseBackgroundSize = function parseBackgroundSize(size) {
	    return size === 'auto' ? AUTO_SIZE : new BackgroundSize(size);
	};
	
	var parseBackgoundPosition = function parseBackgoundPosition(position) {
	    switch (position) {
	        case 'bottom':
	        case 'right':
	            return new _Length2.default('100%');
	        case 'left':
	        case 'top':
	            return new _Length2.default('0%');
	        case 'auto':
	            return new _Length2.default('0');
	    }
	    return new _Length2.default(position);
	};
	
	var parseBackgroundImage = exports.parseBackgroundImage = function parseBackgroundImage(image) {
	    var whitespace = /^\s$/;
	    var results = [];
	
	    var args = [];
	    var method = '';
	    var quote = null;
	    var definition = '';
	    var mode = 0;
	    var numParen = 0;
	
	    var appendResult = function appendResult() {
	        var prefix = '';
	        if (method) {
	            if (definition.substr(0, 1) === '"') {
	                definition = definition.substr(1, definition.length - 2);
	            }
	
	            if (definition) {
	                args.push(definition.trim());
	            }
	
	            var prefix_i = method.indexOf('-', 1) + 1;
	            if (method.substr(0, 1) === '-' && prefix_i > 0) {
	                prefix = method.substr(0, prefix_i).toLowerCase();
	                method = method.substr(prefix_i);
	            }
	            method = method.toLowerCase();
	            if (method !== 'none') {
	                results.push({
	                    prefix: prefix,
	                    method: method,
	                    args: args
	                });
	            }
	        }
	        args = [];
	        method = definition = '';
	    };
	
	    image.split('').forEach(function (c) {
	        if (mode === 0 && whitespace.test(c)) {
	            return;
	        }
	        switch (c) {
	            case '"':
	                if (!quote) {
	                    quote = c;
	                } else if (quote === c) {
	                    quote = null;
	                }
	                break;
	            case '(':
	                if (quote) {
	                    break;
	                } else if (mode === 0) {
	                    mode = 1;
	                    return;
	                } else {
	                    numParen++;
	                }
	                break;
	            case ')':
	                if (quote) {
	                    break;
	                } else if (mode === 1) {
	                    if (numParen === 0) {
	                        mode = 0;
	                        appendResult();
	                        return;
	                    } else {
	                        numParen--;
	                    }
	                }
	                break;
	
	            case ',':
	                if (quote) {
	                    break;
	                } else if (mode === 0) {
	                    appendResult();
	                    return;
	                } else if (mode === 1) {
	                    if (numParen === 0 && !method.match(/^url$/i)) {
	                        args.push(definition.trim());
	                        definition = '';
	                        return;
	                    }
	                }
	                break;
	        }
	
	        if (mode === 0) {
	            method += c;
	        } else {
	            definition += c;
	        }
	    });
	
	    appendResult();
	    return results;
	};

/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ForeignObjectRenderer = __webpack_require__(164);
	
	var testRangeBounds = function testRangeBounds(document) {
	    var TEST_HEIGHT = 123;
	
	    if (document.createRange) {
	        var range = document.createRange();
	        if (range.getBoundingClientRect) {
	            var testElement = document.createElement('boundtest');
	            testElement.style.height = TEST_HEIGHT + 'px';
	            testElement.style.display = 'block';
	            document.body.appendChild(testElement);
	
	            range.selectNode(testElement);
	            var rangeBounds = range.getBoundingClientRect();
	            var rangeHeight = Math.round(rangeBounds.height);
	            document.body.removeChild(testElement);
	            if (rangeHeight === TEST_HEIGHT) {
	                return true;
	            }
	        }
	    }
	
	    return false;
	};
	
	// iOS 10.3 taints canvas with base64 images unless crossOrigin = 'anonymous'
	var testBase64 = function testBase64(document, src) {
	    var img = new Image();
	    var canvas = document.createElement('canvas');
	    var ctx = canvas.getContext('2d');
	
	    return new Promise(function (resolve) {
	        // Single pixel base64 image renders fine on iOS 10.3???
	        img.src = src;
	
	        var onload = function onload() {
	            try {
	                ctx.drawImage(img, 0, 0);
	                canvas.toDataURL();
	            } catch (e) {
	                return resolve(false);
	            }
	
	            return resolve(true);
	        };
	
	        img.onload = onload;
	        img.onerror = function () {
	            return resolve(false);
	        };
	
	        if (img.complete === true) {
	            setTimeout(function () {
	                onload();
	            }, 500);
	        }
	    });
	};
	
	var testCORS = function testCORS() {
	    return typeof new Image().crossOrigin !== 'undefined';
	};
	
	var testResponseType = function testResponseType() {
	    return typeof new XMLHttpRequest().responseType === 'string';
	};
	
	var testSVG = function testSVG(document) {
	    var img = new Image();
	    var canvas = document.createElement('canvas');
	    var ctx = canvas.getContext('2d');
	    img.src = 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'></svg>';
	
	    try {
	        ctx.drawImage(img, 0, 0);
	        canvas.toDataURL();
	    } catch (e) {
	        return false;
	    }
	    return true;
	};
	
	var isGreenPixel = function isGreenPixel(data) {
	    return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
	};
	
	var testForeignObject = function testForeignObject(document) {
	    var canvas = document.createElement('canvas');
	    var size = 100;
	    canvas.width = size;
	    canvas.height = size;
	    var ctx = canvas.getContext('2d');
	    ctx.fillStyle = 'rgb(0, 255, 0)';
	    ctx.fillRect(0, 0, size, size);
	
	    var img = new Image();
	    var greenImageSrc = canvas.toDataURL();
	    img.src = greenImageSrc;
	    var svg = (0, _ForeignObjectRenderer.createForeignObjectSVG)(size, size, 0, 0, img);
	    ctx.fillStyle = 'red';
	    ctx.fillRect(0, 0, size, size);
	
	    return (0, _ForeignObjectRenderer.loadSerializedSVG)(svg).then(function (img) {
	        ctx.drawImage(img, 0, 0);
	        var data = ctx.getImageData(0, 0, size, size).data;
	        ctx.fillStyle = 'red';
	        ctx.fillRect(0, 0, size, size);
	
	        var node = document.createElement('div');
	        node.style.backgroundImage = 'url(' + greenImageSrc + ')';
	        node.style.height = size + 'px';
	        // Firefox 55 does not render inline <img /> tags
	        return isGreenPixel(data) ? (0, _ForeignObjectRenderer.loadSerializedSVG)((0, _ForeignObjectRenderer.createForeignObjectSVG)(size, size, 0, 0, node)) : Promise.reject(false);
	    }).then(function (img) {
	        ctx.drawImage(img, 0, 0);
	        // Edge does not render background-images
	        return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
	    }).catch(function (e) {
	        return false;
	    });
	};
	
	var FEATURES = {
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_RANGE_BOUNDS() {
	        'use strict';
	
	        var value = testRangeBounds(document);
	        Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', { value: value });
	        return value;
	    },
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_SVG_DRAWING() {
	        'use strict';
	
	        var value = testSVG(document);
	        Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', { value: value });
	        return value;
	    },
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_BASE64_DRAWING() {
	        'use strict';
	
	        return function (src) {
	            var _value = testBase64(document, src);
	            Object.defineProperty(FEATURES, 'SUPPORT_BASE64_DRAWING', { value: function value() {
	                    return _value;
	                } });
	            return _value;
	        };
	    },
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_FOREIGNOBJECT_DRAWING() {
	        'use strict';
	
	        var value = typeof Array.from === 'function' && typeof window.fetch === 'function' ? testForeignObject(document) : Promise.resolve(false);
	        Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', { value: value });
	        return value;
	    },
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_CORS_IMAGES() {
	        'use strict';
	
	        var value = testCORS();
	        Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', { value: value });
	        return value;
	    },
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_RESPONSE_TYPE() {
	        'use strict';
	
	        var value = testResponseType();
	        Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', { value: value });
	        return value;
	    },
	    // $FlowFixMe - get/set properties not yet supported
	    get SUPPORT_CORS_XHR() {
	        'use strict';
	
	        var value = 'withCredentials' in new XMLHttpRequest();
	        Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', { value: value });
	        return value;
	    }
	};
	
	exports.default = FEATURES;

/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _textTransform = __webpack_require__(162);
	
	var _TextBounds = __webpack_require__(158);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TextContainer = function () {
	    function TextContainer(text, parent, bounds) {
	        _classCallCheck(this, TextContainer);
	
	        this.text = text;
	        this.parent = parent;
	        this.bounds = bounds;
	    }
	
	    _createClass(TextContainer, null, [{
	        key: 'fromTextNode',
	        value: function fromTextNode(node, parent) {
	            var text = transform(node.data, parent.style.textTransform);
	            return new TextContainer(text, parent, (0, _TextBounds.parseTextBounds)(text, parent, node));
	        }
	    }]);
	
	    return TextContainer;
	}();
	
	exports.default = TextContainer;
	
	
	var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;
	
	var transform = function transform(text, _transform) {
	    switch (_transform) {
	        case _textTransform.TEXT_TRANSFORM.LOWERCASE:
	            return text.toLowerCase();
	        case _textTransform.TEXT_TRANSFORM.CAPITALIZE:
	            return text.replace(CAPITALIZE, capitalize);
	        case _textTransform.TEXT_TRANSFORM.UPPERCASE:
	            return text.toUpperCase();
	        default:
	            return text;
	    }
	};
	
	function capitalize(m, p1, p2) {
	    if (m.length > 0) {
	        return p1 + p2.toUpperCase();
	    }
	
	    return m;
	}

/***/ }),

/***/ 70:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var PATH = exports.PATH = {
	    VECTOR: 0,
	    BEZIER_CURVE: 1,
	    CIRCLE: 2
	};

/***/ }),

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Path = __webpack_require__(70);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Vector = function Vector(x, y) {
	    _classCallCheck(this, Vector);
	
	    this.type = _Path.PATH.VECTOR;
	    this.x = x;
	    this.y = y;
	    if (false) {
	        if (isNaN(x)) {
	            console.error('Invalid x value given for Vector');
	        }
	        if (isNaN(y)) {
	            console.error('Invalid y value given for Vector');
	        }
	    }
	};
	
	exports.default = Vector;

/***/ }),

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseBorder = exports.BORDER_SIDES = exports.BORDER_STYLE = undefined;
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BORDER_STYLE = exports.BORDER_STYLE = {
	    NONE: 0,
	    SOLID: 1
	};
	
	var BORDER_SIDES = exports.BORDER_SIDES = {
	    TOP: 0,
	    RIGHT: 1,
	    BOTTOM: 2,
	    LEFT: 3
	};
	
	var SIDES = Object.keys(BORDER_SIDES).map(function (s) {
	    return s.toLowerCase();
	});
	
	var parseBorderStyle = function parseBorderStyle(style) {
	    switch (style) {
	        case 'none':
	            return BORDER_STYLE.NONE;
	    }
	    return BORDER_STYLE.SOLID;
	};
	
	var parseBorder = exports.parseBorder = function parseBorder(style) {
	    return SIDES.map(function (side) {
	        var borderColor = new _Color2.default(style.getPropertyValue('border-' + side + '-color'));
	        var borderStyle = parseBorderStyle(style.getPropertyValue('border-' + side + '-style'));
	        var borderWidth = parseFloat(style.getPropertyValue('border-' + side + '-width'));
	        return {
	            borderColor: borderColor,
	            borderStyle: borderStyle,
	            borderWidth: isNaN(borderWidth) ? 0 : borderWidth
	        };
	    });
	};

/***/ }),

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseTextDecoration = exports.TEXT_DECORATION_LINE = exports.TEXT_DECORATION = exports.TEXT_DECORATION_STYLE = undefined;
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var TEXT_DECORATION_STYLE = exports.TEXT_DECORATION_STYLE = {
	    SOLID: 0,
	    DOUBLE: 1,
	    DOTTED: 2,
	    DASHED: 3,
	    WAVY: 4
	};
	
	var TEXT_DECORATION = exports.TEXT_DECORATION = {
	    NONE: null
	};
	
	var TEXT_DECORATION_LINE = exports.TEXT_DECORATION_LINE = {
	    UNDERLINE: 1,
	    OVERLINE: 2,
	    LINE_THROUGH: 3,
	    BLINK: 4
	};
	
	var parseLine = function parseLine(line) {
	    switch (line) {
	        case 'underline':
	            return TEXT_DECORATION_LINE.UNDERLINE;
	        case 'overline':
	            return TEXT_DECORATION_LINE.OVERLINE;
	        case 'line-through':
	            return TEXT_DECORATION_LINE.LINE_THROUGH;
	    }
	    return TEXT_DECORATION_LINE.BLINK;
	};
	
	var parseTextDecorationLine = function parseTextDecorationLine(line) {
	    if (line === 'none') {
	        return null;
	    }
	
	    return line.split(' ').map(parseLine);
	};
	
	var parseTextDecorationStyle = function parseTextDecorationStyle(style) {
	    switch (style) {
	        case 'double':
	            return TEXT_DECORATION_STYLE.DOUBLE;
	        case 'dotted':
	            return TEXT_DECORATION_STYLE.DOTTED;
	        case 'dashed':
	            return TEXT_DECORATION_STYLE.DASHED;
	        case 'wavy':
	            return TEXT_DECORATION_STYLE.WAVY;
	    }
	    return TEXT_DECORATION_STYLE.SOLID;
	};
	
	var parseTextDecoration = exports.parseTextDecoration = function parseTextDecoration(style) {
	    var textDecorationLine = parseTextDecorationLine(style.textDecorationLine ? style.textDecorationLine : style.textDecoration);
	    if (textDecorationLine === null) {
	        return TEXT_DECORATION.NONE;
	    }
	
	    var textDecorationColor = style.textDecorationColor ? new _Color2.default(style.textDecorationColor) : null;
	    var textDecorationStyle = parseTextDecorationStyle(style.textDecorationStyle);
	
	    return {
	        textDecorationLine: textDecorationLine,
	        textDecorationColor: textDecorationColor,
	        textDecorationStyle: textDecorationStyle
	    };
	};

/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FontMetrics = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Util = __webpack_require__(41);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SAMPLE_TEXT = 'Hidden Text';
	
	var FontMetrics = exports.FontMetrics = function () {
	    function FontMetrics(document) {
	        _classCallCheck(this, FontMetrics);
	
	        this._data = {};
	        this._document = document;
	    }
	
	    _createClass(FontMetrics, [{
	        key: '_parseMetrics',
	        value: function _parseMetrics(font) {
	            var container = this._document.createElement('div');
	            var img = this._document.createElement('img');
	            var span = this._document.createElement('span');
	
	            var body = this._document.body;
	            if (!body) {
	                throw new Error( false ? 'No document found for font metrics' : '');
	            }
	
	            container.style.visibility = 'hidden';
	            container.style.fontFamily = font.fontFamily;
	            container.style.fontSize = font.fontSize;
	            container.style.margin = '0';
	            container.style.padding = '0';
	
	            body.appendChild(container);
	
	            img.src = _Util.SMALL_IMAGE;
	            img.width = 1;
	            img.height = 1;
	
	            img.style.margin = '0';
	            img.style.padding = '0';
	            img.style.verticalAlign = 'baseline';
	
	            span.style.fontFamily = font.fontFamily;
	            span.style.fontSize = font.fontSize;
	            span.style.margin = '0';
	            span.style.padding = '0';
	
	            span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
	            container.appendChild(span);
	            container.appendChild(img);
	            var baseline = img.offsetTop - span.offsetTop + 2;
	
	            container.removeChild(span);
	            container.appendChild(this._document.createTextNode(SAMPLE_TEXT));
	
	            container.style.lineHeight = 'normal';
	            img.style.verticalAlign = 'super';
	
	            var middle = img.offsetTop - container.offsetTop + 2;
	
	            body.removeChild(container);
	
	            return { baseline: baseline, middle: middle };
	        }
	    }, {
	        key: 'getMetrics',
	        value: function getMetrics(font) {
	            var key = font.fontFamily + ' ' + font.fontSize;
	            if (this._data[key] === undefined) {
	                this._data[key] = this._parseMetrics(font);
	            }
	
	            return this._data[key];
	        }
	    }]);
	
	    return FontMetrics;
	}();

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.reformatInputBounds = exports.inlineSelectElement = exports.inlineTextAreaElement = exports.inlineInputElement = exports.getInputBorderRadius = exports.INPUT_BACKGROUND = exports.INPUT_BORDERS = exports.INPUT_COLOR = undefined;
	
	var _TextContainer = __webpack_require__(69);
	
	var _TextContainer2 = _interopRequireDefault(_TextContainer);
	
	var _background = __webpack_require__(53);
	
	var _border = __webpack_require__(100);
	
	var _Circle = __webpack_require__(320);
	
	var _Circle2 = _interopRequireDefault(_Circle);
	
	var _Vector = __webpack_require__(71);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	var _Bounds = __webpack_require__(24);
	
	var _TextBounds = __webpack_require__(158);
	
	var _Util = __webpack_require__(41);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INPUT_COLOR = exports.INPUT_COLOR = new _Color2.default([42, 42, 42]);
	var INPUT_BORDER_COLOR = new _Color2.default([165, 165, 165]);
	var INPUT_BACKGROUND_COLOR = new _Color2.default([222, 222, 222]);
	var INPUT_BORDER = {
	    borderWidth: 1,
	    borderColor: INPUT_BORDER_COLOR,
	    borderStyle: _border.BORDER_STYLE.SOLID
	};
	var INPUT_BORDERS = exports.INPUT_BORDERS = [INPUT_BORDER, INPUT_BORDER, INPUT_BORDER, INPUT_BORDER];
	var INPUT_BACKGROUND = exports.INPUT_BACKGROUND = {
	    backgroundColor: INPUT_BACKGROUND_COLOR,
	    backgroundImage: [],
	    backgroundClip: _background.BACKGROUND_CLIP.PADDING_BOX,
	    backgroundOrigin: _background.BACKGROUND_ORIGIN.PADDING_BOX
	};
	
	var RADIO_BORDER_RADIUS = new _Length2.default('50%');
	var RADIO_BORDER_RADIUS_TUPLE = [RADIO_BORDER_RADIUS, RADIO_BORDER_RADIUS];
	var INPUT_RADIO_BORDER_RADIUS = [RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE];
	
	var CHECKBOX_BORDER_RADIUS = new _Length2.default('3px');
	var CHECKBOX_BORDER_RADIUS_TUPLE = [CHECKBOX_BORDER_RADIUS, CHECKBOX_BORDER_RADIUS];
	var INPUT_CHECKBOX_BORDER_RADIUS = [CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE];
	
	var getInputBorderRadius = exports.getInputBorderRadius = function getInputBorderRadius(node) {
	    return node.type === 'radio' ? INPUT_RADIO_BORDER_RADIUS : INPUT_CHECKBOX_BORDER_RADIUS;
	};
	
	var inlineInputElement = exports.inlineInputElement = function inlineInputElement(node, container) {
	    if (node.type === 'radio' || node.type === 'checkbox') {
	        if (node.checked) {
	            var size = Math.min(container.bounds.width, container.bounds.height);
	            container.childNodes.push(node.type === 'checkbox' ? [new _Vector2.default(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79), new _Vector2.default(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549), new _Vector2.default(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071), new _Vector2.default(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649), new _Vector2.default(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23), new _Vector2.default(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085), new _Vector2.default(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)] : new _Circle2.default(container.bounds.left + size / 4, container.bounds.top + size / 4, size / 4));
	        }
	    } else {
	        inlineFormElement(getInputValue(node), node, container, false);
	    }
	};
	
	var inlineTextAreaElement = exports.inlineTextAreaElement = function inlineTextAreaElement(node, container) {
	    inlineFormElement(node.value, node, container, true);
	};
	
	var inlineSelectElement = exports.inlineSelectElement = function inlineSelectElement(node, container) {
	    var option = node.options[node.selectedIndex || 0];
	    inlineFormElement(option ? option.text || '' : '', node, container, false);
	};
	
	var reformatInputBounds = exports.reformatInputBounds = function reformatInputBounds(bounds) {
	    if (bounds.width > bounds.height) {
	        bounds.left += (bounds.width - bounds.height) / 2;
	        bounds.width = bounds.height;
	    } else if (bounds.width < bounds.height) {
	        bounds.top += (bounds.height - bounds.width) / 2;
	        bounds.height = bounds.width;
	    }
	    return bounds;
	};
	
	var inlineFormElement = function inlineFormElement(value, node, container, allowLinebreak) {
	    var body = node.ownerDocument.body;
	    if (value.length > 0 && body) {
	        var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
	        (0, _Util.copyCSSStyles)(node.ownerDocument.defaultView.getComputedStyle(node, null), wrapper);
	        wrapper.style.position = 'fixed';
	        wrapper.style.left = container.bounds.left + 'px';
	        wrapper.style.top = container.bounds.top + 'px';
	        if (!allowLinebreak) {
	            wrapper.style.whiteSpace = 'nowrap';
	        }
	        var text = node.ownerDocument.createTextNode(value);
	        wrapper.appendChild(text);
	        body.appendChild(wrapper);
	        container.childNodes.push(_TextContainer2.default.fromTextNode(text, container));
	        body.removeChild(wrapper);
	    }
	};
	
	var getInputValue = function getInputValue(node) {
	    var value = node.type === 'password' ? new Array(node.value.length + 1).join('\u2022') : node.value;
	
	    return value.length === 0 ? node.placeholder || '' : value;
	};

/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.inlineListItemElement = exports.getListOwner = undefined;
	
	var _Util = __webpack_require__(41);
	
	var _NodeContainer = __webpack_require__(52);
	
	var _NodeContainer2 = _interopRequireDefault(_NodeContainer);
	
	var _TextContainer = __webpack_require__(69);
	
	var _TextContainer2 = _interopRequireDefault(_TextContainer);
	
	var _listStyle = __webpack_require__(159);
	
	var _Unicode = __webpack_require__(317);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Margin between the enumeration and the list item content
	var MARGIN_RIGHT = 7;
	
	var ancestorTypes = ['OL', 'UL', 'MENU'];
	
	var getListOwner = exports.getListOwner = function getListOwner(container) {
	    var parent = container.parent;
	    if (!parent) {
	        return null;
	    }
	
	    do {
	        var isAncestor = ancestorTypes.indexOf(parent.tagName) !== -1;
	        if (isAncestor) {
	            return parent;
	        }
	        parent = parent.parent;
	    } while (parent);
	
	    return container.parent;
	};
	
	var inlineListItemElement = exports.inlineListItemElement = function inlineListItemElement(node, container, resourceLoader) {
	    var listStyle = container.style.listStyle;
	
	    if (!listStyle) {
	        return;
	    }
	
	    var style = node.ownerDocument.defaultView.getComputedStyle(node, null);
	    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
	    (0, _Util.copyCSSStyles)(style, wrapper);
	
	    wrapper.style.position = 'absolute';
	    wrapper.style.bottom = 'auto';
	    wrapper.style.display = 'block';
	    wrapper.style.letterSpacing = 'normal';
	
	    switch (listStyle.listStylePosition) {
	        case _listStyle.LIST_STYLE_POSITION.OUTSIDE:
	            wrapper.style.left = 'auto';
	            wrapper.style.right = node.ownerDocument.defaultView.innerWidth - container.bounds.left - container.style.margin[1].getAbsoluteValue(container.bounds.width) + MARGIN_RIGHT + 'px';
	            wrapper.style.textAlign = 'right';
	            break;
	        case _listStyle.LIST_STYLE_POSITION.INSIDE:
	            wrapper.style.left = container.bounds.left - container.style.margin[3].getAbsoluteValue(container.bounds.width) + 'px';
	            wrapper.style.right = 'auto';
	            wrapper.style.textAlign = 'left';
	            break;
	    }
	
	    var text = void 0;
	    var MARGIN_TOP = container.style.margin[0].getAbsoluteValue(container.bounds.width);
	    var styleImage = listStyle.listStyleImage;
	    if (styleImage) {
	        if (styleImage.method === 'url') {
	            var image = node.ownerDocument.createElement('img');
	            image.src = styleImage.args[0];
	            wrapper.style.top = container.bounds.top - MARGIN_TOP + 'px';
	            wrapper.style.width = 'auto';
	            wrapper.style.height = 'auto';
	            wrapper.appendChild(image);
	        } else {
	            var size = parseFloat(container.style.font.fontSize) * 0.5;
	            wrapper.style.top = container.bounds.top - MARGIN_TOP + container.bounds.height - 1.5 * size + 'px';
	            wrapper.style.width = size + 'px';
	            wrapper.style.height = size + 'px';
	            wrapper.style.backgroundImage = style.listStyleImage;
	        }
	    } else if (typeof container.listIndex === 'number') {
	        text = node.ownerDocument.createTextNode(createCounterText(container.listIndex, listStyle.listStyleType));
	        wrapper.appendChild(text);
	        wrapper.style.top = container.bounds.top - MARGIN_TOP + 'px';
	    }
	
	    // $FlowFixMe
	    var body = node.ownerDocument.body;
	    body.appendChild(wrapper);
	
	    if (text) {
	        container.childNodes.push(_TextContainer2.default.fromTextNode(text, container));
	        body.removeChild(wrapper);
	    } else {
	        // $FlowFixMe
	        container.childNodes.push(new _NodeContainer2.default(wrapper, container, resourceLoader, 0));
	    }
	};
	
	var ROMAN_UPPER = {
	    integers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
	    values: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
	};
	
	var ARMENIAN = {
	    integers: [9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
	    values: ['Ք', 'Փ', 'Ւ', 'Ց', 'Ր', 'Տ', 'Վ', 'Ս', 'Ռ', 'Ջ', 'Պ', 'Չ', 'Ո', 'Շ', 'Ն', 'Յ', 'Մ', 'Ճ', 'Ղ', 'Ձ', 'Հ', 'Կ', 'Ծ', 'Խ', 'Լ', 'Ի', 'Ժ', 'Թ', 'Ը', 'Է', 'Զ', 'Ե', 'Դ', 'Գ', 'Բ', 'Ա']
	};
	
	var HEBREW = {
	    integers: [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 19, 18, 17, 16, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
	    values: ['י׳', 'ט׳', 'ח׳', 'ז׳', 'ו׳', 'ה׳', 'ד׳', 'ג׳', 'ב׳', 'א׳', 'ת', 'ש', 'ר', 'ק', 'צ', 'פ', 'ע', 'ס', 'נ', 'מ', 'ל', 'כ', 'יט', 'יח', 'יז', 'טז', 'טו', 'י', 'ט', 'ח', 'ז', 'ו', 'ה', 'ד', 'ג', 'ב', 'א']
	};
	
	var GEORGIAN = {
	    integers: [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
	    values: ['ჵ', 'ჰ', 'ჯ', 'ჴ', 'ხ', 'ჭ', 'წ', 'ძ', 'ც', 'ჩ', 'შ', 'ყ', 'ღ', 'ქ', 'ფ', 'ჳ', 'ტ', 'ს', 'რ', 'ჟ', 'პ', 'ო', 'ჲ', 'ნ', 'მ', 'ლ', 'კ', 'ი', 'თ', 'ჱ', 'ზ', 'ვ', 'ე', 'დ', 'გ', 'ბ', 'ა']
	};
	
	var createAdditiveCounter = function createAdditiveCounter(value, min, max, symbols, fallback) {
	    var suffix = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '. ';
	
	    if (value < min || value > max) {
	        return createCounterText(value, fallback);
	    }
	
	    return symbols.integers.reduce(function (string, integer, index) {
	        while (value >= integer) {
	            value -= integer;
	            string += symbols.values[index];
	        }
	        return string;
	    }, '') + suffix;
	};
	
	var createCounterStyleWithSymbolResolver = function createCounterStyleWithSymbolResolver(value, codePointRangeLength, isNumeric, resolver) {
	    var string = '';
	
	    do {
	        if (!isNumeric) {
	            value--;
	        }
	        string = resolver(value) + string;
	        value /= codePointRangeLength;
	    } while (value * codePointRangeLength >= codePointRangeLength);
	
	    return string;
	};
	
	var createCounterStyleFromRange = function createCounterStyleFromRange(value, codePointRangeStart, codePointRangeEnd, isNumeric) {
	    var suffix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '. ';
	
	    var codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;
	
	    return (value < 0 ? '-' : '') + (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, isNumeric, function (codePoint) {
	        return (0, _Unicode.fromCodePoint)(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart);
	    }) + suffix);
	};
	
	var createCounterStyleFromSymbols = function createCounterStyleFromSymbols(value, symbols) {
	    var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '. ';
	
	    var codePointRangeLength = symbols.length;
	    return createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, false, function (codePoint) {
	        return symbols[Math.floor(codePoint % codePointRangeLength)];
	    }) + suffix;
	};
	
	var CJK_ZEROS = 1 << 0;
	var CJK_TEN_COEFFICIENTS = 1 << 1;
	var CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;
	var CJK_HUNDRED_COEFFICIENTS = 1 << 3;
	
	var createCJKCounter = function createCJKCounter(value, numbers, multipliers, negativeSign, suffix, flags) {
	    if (value < -9999 || value > 9999) {
	        return createCounterText(value, _listStyle.LIST_STYLE_TYPE.CJK_DECIMAL);
	    }
	    var tmp = Math.abs(value);
	    var string = suffix;
	
	    if (tmp === 0) {
	        return numbers[0] + string;
	    }
	
	    for (var digit = 0; tmp > 0 && digit <= 4; digit++) {
	        var coefficient = tmp % 10;
	
	        if (coefficient === 0 && (0, _Util.contains)(flags, CJK_ZEROS) && string !== '') {
	            string = numbers[coefficient] + string;
	        } else if (coefficient > 1 || coefficient === 1 && digit === 0 || coefficient === 1 && digit === 1 && (0, _Util.contains)(flags, CJK_TEN_COEFFICIENTS) || coefficient === 1 && digit === 1 && (0, _Util.contains)(flags, CJK_TEN_HIGH_COEFFICIENTS) && value > 100 || coefficient === 1 && digit > 1 && (0, _Util.contains)(flags, CJK_HUNDRED_COEFFICIENTS)) {
	            string = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : '') + string;
	        } else if (coefficient === 1 && digit > 0) {
	            string = multipliers[digit - 1] + string;
	        }
	        tmp = Math.floor(tmp / 10);
	    }
	
	    return (value < 0 ? negativeSign : '') + string;
	};
	
	var CHINESE_INFORMAL_MULTIPLIERS = '十百千萬';
	var CHINESE_FORMAL_MULTIPLIERS = '拾佰仟萬';
	var JAPANESE_NEGATIVE = 'マイナス';
	var KOREAN_NEGATIVE = '마이너스 ';
	
	var createCounterText = function createCounterText(value, type) {
	    switch (type) {
	        case _listStyle.LIST_STYLE_TYPE.DISC:
	            return '•';
	        case _listStyle.LIST_STYLE_TYPE.CIRCLE:
	            return '◦';
	        case _listStyle.LIST_STYLE_TYPE.SQUARE:
	            return '◾';
	        case _listStyle.LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO:
	            var string = createCounterStyleFromRange(value, 48, 57, true);
	            return string.length < 4 ? '0' + string : string;
	        case _listStyle.LIST_STYLE_TYPE.CJK_DECIMAL:
	            return createCounterStyleFromSymbols(value, '〇一二三四五六七八九', '、');
	        case _listStyle.LIST_STYLE_TYPE.LOWER_ROMAN:
	            return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, _listStyle.LIST_STYLE_TYPE.DECIMAL).toLowerCase();
	        case _listStyle.LIST_STYLE_TYPE.UPPER_ROMAN:
	            return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, _listStyle.LIST_STYLE_TYPE.DECIMAL);
	        case _listStyle.LIST_STYLE_TYPE.LOWER_GREEK:
	            return createCounterStyleFromRange(value, 945, 969, false);
	        case _listStyle.LIST_STYLE_TYPE.LOWER_ALPHA:
	            return createCounterStyleFromRange(value, 97, 122, false);
	        case _listStyle.LIST_STYLE_TYPE.UPPER_ALPHA:
	            return createCounterStyleFromRange(value, 65, 90, false);
	        case _listStyle.LIST_STYLE_TYPE.ARABIC_INDIC:
	            return createCounterStyleFromRange(value, 1632, 1641, true);
	        case _listStyle.LIST_STYLE_TYPE.ARMENIAN:
	        case _listStyle.LIST_STYLE_TYPE.UPPER_ARMENIAN:
	            return createAdditiveCounter(value, 1, 9999, ARMENIAN, _listStyle.LIST_STYLE_TYPE.DECIMAL);
	        case _listStyle.LIST_STYLE_TYPE.LOWER_ARMENIAN:
	            return createAdditiveCounter(value, 1, 9999, ARMENIAN, _listStyle.LIST_STYLE_TYPE.DECIMAL).toLowerCase();
	        case _listStyle.LIST_STYLE_TYPE.BENGALI:
	            return createCounterStyleFromRange(value, 2534, 2543, true);
	        case _listStyle.LIST_STYLE_TYPE.CAMBODIAN:
	        case _listStyle.LIST_STYLE_TYPE.KHMER:
	            return createCounterStyleFromRange(value, 6112, 6121, true);
	        case _listStyle.LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH:
	            return createCounterStyleFromSymbols(value, '子丑寅卯辰巳午未申酉戌亥', '、');
	        case _listStyle.LIST_STYLE_TYPE.CJK_HEAVENLY_STEM:
	            return createCounterStyleFromSymbols(value, '甲乙丙丁戊己庚辛壬癸', '、');
	        case _listStyle.LIST_STYLE_TYPE.CJK_IDEOGRAPHIC:
	        case _listStyle.LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL:
	            return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '負', '、', CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL:
	            return createCJKCounter(value, '零壹貳參肆伍陸柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '負', '、', CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL:
	            return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '负', '、', CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL:
	            return createCJKCounter(value, '零壹贰叁肆伍陆柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '负', '、', CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.JAPANESE_INFORMAL:
	            return createCJKCounter(value, '〇一二三四五六七八九', '十百千万', JAPANESE_NEGATIVE, '、', 0);
	        case _listStyle.LIST_STYLE_TYPE.JAPANESE_FORMAL:
	            return createCJKCounter(value, '零壱弐参四伍六七八九', '拾百千万', JAPANESE_NEGATIVE, '、', CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL:
	            return createCJKCounter(value, '영일이삼사오육칠팔구', '십백천만', KOREAN_NEGATIVE, ', ', CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL:
	            return createCJKCounter(value, '零一二三四五六七八九', '十百千萬', KOREAN_NEGATIVE, ', ', 0);
	        case _listStyle.LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL:
	            return createCJKCounter(value, '零壹貳參四五六七八九', '拾百千', KOREAN_NEGATIVE, ', ', CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
	        case _listStyle.LIST_STYLE_TYPE.DEVANAGARI:
	            return createCounterStyleFromRange(value, 0x966, 0x96f, true);
	        case _listStyle.LIST_STYLE_TYPE.GEORGIAN:
	            return createAdditiveCounter(value, 1, 19999, GEORGIAN, _listStyle.LIST_STYLE_TYPE.DECIMAL);
	        case _listStyle.LIST_STYLE_TYPE.GUJARATI:
	            return createCounterStyleFromRange(value, 0xae6, 0xaef, true);
	        case _listStyle.LIST_STYLE_TYPE.GURMUKHI:
	            return createCounterStyleFromRange(value, 0xa66, 0xa6f, true);
	        case _listStyle.LIST_STYLE_TYPE.HEBREW:
	            return createAdditiveCounter(value, 1, 10999, HEBREW, _listStyle.LIST_STYLE_TYPE.DECIMAL);
	        case _listStyle.LIST_STYLE_TYPE.HIRAGANA:
	            return createCounterStyleFromSymbols(value, 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん');
	        case _listStyle.LIST_STYLE_TYPE.HIRAGANA_IROHA:
	            return createCounterStyleFromSymbols(value, 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす');
	        case _listStyle.LIST_STYLE_TYPE.KANNADA:
	            return createCounterStyleFromRange(value, 0xce6, 0xcef, true);
	        case _listStyle.LIST_STYLE_TYPE.KATAKANA:
	            return createCounterStyleFromSymbols(value, 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン', '、');
	        case _listStyle.LIST_STYLE_TYPE.KATAKANA_IROHA:
	            return createCounterStyleFromSymbols(value, 'イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス', '、');
	        case _listStyle.LIST_STYLE_TYPE.LAO:
	            return createCounterStyleFromRange(value, 0xed0, 0xed9, true);
	        case _listStyle.LIST_STYLE_TYPE.MONGOLIAN:
	            return createCounterStyleFromRange(value, 0x1810, 0x1819, true);
	        case _listStyle.LIST_STYLE_TYPE.MYANMAR:
	            return createCounterStyleFromRange(value, 0x1040, 0x1049, true);
	        case _listStyle.LIST_STYLE_TYPE.ORIYA:
	            return createCounterStyleFromRange(value, 0xb66, 0xb6f, true);
	        case _listStyle.LIST_STYLE_TYPE.PERSIAN:
	            return createCounterStyleFromRange(value, 0x6f0, 0x6f9, true);
	        case _listStyle.LIST_STYLE_TYPE.TAMIL:
	            return createCounterStyleFromRange(value, 0xbe6, 0xbef, true);
	        case _listStyle.LIST_STYLE_TYPE.TELUGU:
	            return createCounterStyleFromRange(value, 0xc66, 0xc6f, true);
	        case _listStyle.LIST_STYLE_TYPE.THAI:
	            return createCounterStyleFromRange(value, 0xe50, 0xe59, true);
	        case _listStyle.LIST_STYLE_TYPE.TIBETAN:
	            return createCounterStyleFromRange(value, 0xf20, 0xf29, true);
	        case _listStyle.LIST_STYLE_TYPE.DECIMAL:
	        default:
	            return createCounterStyleFromRange(value, 48, 57, true);
	    }
	};

/***/ }),

/***/ 156:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Logger = function () {
	    function Logger(enabled, id, start) {
	        _classCallCheck(this, Logger);
	
	        this.enabled = enabled;
	        this.start = start ? start : Date.now();
	        this.id = id;
	    }
	
	    _createClass(Logger, [{
	        key: 'child',
	        value: function child(id) {
	            return new Logger(this.enabled, id, this.start);
	        }
	
	        // eslint-disable-next-line flowtype/no-weak-types
	
	    }, {
	        key: 'log',
	        value: function log() {
	            if (this.enabled && window.console && window.console.log) {
	                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                    args[_key] = arguments[_key];
	                }
	
	                Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? 'html2canvas (' + this.id + '):' : 'html2canvas:'].concat([].slice.call(args, 0)));
	            }
	        }
	
	        // eslint-disable-next-line flowtype/no-weak-types
	
	    }, {
	        key: 'error',
	        value: function error() {
	            if (this.enabled && window.console && window.console.error) {
	                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                    args[_key2] = arguments[_key2];
	                }
	
	                Function.prototype.bind.call(window.console.error, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? 'html2canvas (' + this.id + '):' : 'html2canvas:'].concat([].slice.call(args, 0)));
	            }
	        }
	    }]);
	
	    return Logger;
	}();
	
	exports.default = Logger;

/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Proxy = undefined;
	
	var _Feature = __webpack_require__(68);
	
	var _Feature2 = _interopRequireDefault(_Feature);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Proxy = exports.Proxy = function Proxy(src, options) {
	    if (!options.proxy) {
	        return Promise.reject( false ? 'No proxy defined' : null);
	    }
	    var proxy = options.proxy;
	
	    return new Promise(function (resolve, reject) {
	        var responseType = _Feature2.default.SUPPORT_CORS_XHR && _Feature2.default.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
	        var xhr = _Feature2.default.SUPPORT_CORS_XHR ? new XMLHttpRequest() : new XDomainRequest();
	        xhr.onload = function () {
	            if (xhr instanceof XMLHttpRequest) {
	                if (xhr.status === 200) {
	                    if (responseType === 'text') {
	                        resolve(xhr.response);
	                    } else {
	                        var reader = new FileReader();
	                        // $FlowFixMe
	                        reader.addEventListener('load', function () {
	                            return resolve(reader.result);
	                        }, false);
	                        // $FlowFixMe
	                        reader.addEventListener('error', function (e) {
	                            return reject(e);
	                        }, false);
	                        reader.readAsDataURL(xhr.response);
	                    }
	                } else {
	                    reject( false ? 'Failed to proxy resource ' + src.substring(0, 256) + ' with status code ' + xhr.status : '');
	                }
	            } else {
	                resolve(xhr.responseText);
	            }
	        };
	
	        xhr.onerror = reject;
	        xhr.open('GET', proxy + '?url=' + encodeURIComponent(src) + '&responseType=' + responseType);
	
	        if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
	            xhr.responseType = responseType;
	        }
	
	        if (options.imageTimeout) {
	            var timeout = options.imageTimeout;
	            xhr.timeout = timeout;
	            xhr.ontimeout = function () {
	                return reject( false ? 'Timed out (' + timeout + 'ms) proxying ' + src.substring(0, 256) : '');
	            };
	        }
	
	        xhr.send();
	    });
	};

/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseTextBounds = exports.TextBounds = undefined;
	
	var _punycode = __webpack_require__(334);
	
	var _Bounds = __webpack_require__(24);
	
	var _textDecoration = __webpack_require__(101);
	
	var _Feature = __webpack_require__(68);
	
	var _Feature2 = _interopRequireDefault(_Feature);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UNICODE = /[^\u0000-\u00ff]/;
	
	var hasUnicodeCharacters = function hasUnicodeCharacters(text) {
	    return UNICODE.test(text);
	};
	
	var encodeCodePoint = function encodeCodePoint(codePoint) {
	    return _punycode.ucs2.encode([codePoint]);
	};
	
	var TextBounds = exports.TextBounds = function TextBounds(text, bounds) {
	    _classCallCheck(this, TextBounds);
	
	    this.text = text;
	    this.bounds = bounds;
	};
	
	var parseTextBounds = exports.parseTextBounds = function parseTextBounds(value, parent, node) {
	    var codePoints = _punycode.ucs2.decode(value);
	    var letterRendering = parent.style.letterSpacing !== 0 || hasUnicodeCharacters(value);
	    var textList = letterRendering ? codePoints.map(encodeCodePoint) : splitWords(codePoints);
	    var length = textList.length;
	    var defaultView = node.parentNode ? node.parentNode.ownerDocument.defaultView : null;
	    var scrollX = defaultView ? defaultView.pageXOffset : 0;
	    var scrollY = defaultView ? defaultView.pageYOffset : 0;
	    var textBounds = [];
	    var offset = 0;
	    for (var i = 0; i < length; i++) {
	        var text = textList[i];
	        if (parent.style.textDecoration !== _textDecoration.TEXT_DECORATION.NONE || text.trim().length > 0) {
	            if (_Feature2.default.SUPPORT_RANGE_BOUNDS) {
	                textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length, scrollX, scrollY)));
	            } else {
	                var replacementNode = node.splitText(text.length);
	                textBounds.push(new TextBounds(text, getWrapperBounds(node, scrollX, scrollY)));
	                node = replacementNode;
	            }
	        } else if (!_Feature2.default.SUPPORT_RANGE_BOUNDS) {
	            node = node.splitText(text.length);
	        }
	        offset += text.length;
	    }
	    return textBounds;
	};
	
	var getWrapperBounds = function getWrapperBounds(node, scrollX, scrollY) {
	    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
	    wrapper.appendChild(node.cloneNode(true));
	    var parentNode = node.parentNode;
	    if (parentNode) {
	        parentNode.replaceChild(wrapper, node);
	        var bounds = (0, _Bounds.parseBounds)(wrapper, scrollX, scrollY);
	        if (wrapper.firstChild) {
	            parentNode.replaceChild(wrapper.firstChild, wrapper);
	        }
	        return bounds;
	    }
	    return new _Bounds.Bounds(0, 0, 0, 0);
	};
	
	var getRangeBounds = function getRangeBounds(node, offset, length, scrollX, scrollY) {
	    var range = node.ownerDocument.createRange();
	    range.setStart(node, offset);
	    range.setEnd(node, offset + length);
	    return _Bounds.Bounds.fromClientRect(range.getBoundingClientRect(), scrollX, scrollY);
	};
	
	var splitWords = function splitWords(codePoints) {
	    var words = [];
	    var i = 0;
	    var onWordBoundary = false;
	    var word = void 0;
	    while (codePoints.length) {
	        if (isWordBoundary(codePoints[i]) === onWordBoundary) {
	            word = codePoints.splice(0, i);
	            if (word.length) {
	                words.push(_punycode.ucs2.encode(word));
	            }
	            onWordBoundary = !onWordBoundary;
	            i = 0;
	        } else {
	            i++;
	        }
	
	        if (i >= codePoints.length) {
	            word = codePoints.splice(0, i);
	            if (word.length) {
	                words.push(_punycode.ucs2.encode(word));
	            }
	        }
	    }
	    return words;
	};
	
	var isWordBoundary = function isWordBoundary(characterCode) {
	    return [32, // <space>
	    13, // \r
	    10, // \n
	    9, // \t
	    45 // -
	    ].indexOf(characterCode) !== -1;
	};

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseListStyle = exports.LIST_STYLE_TYPE = exports.LIST_STYLE_POSITION = undefined;
	
	var _background = __webpack_require__(53);
	
	var LIST_STYLE_POSITION = exports.LIST_STYLE_POSITION = {
	    INSIDE: 0,
	    OUTSIDE: 1
	};
	
	var LIST_STYLE_TYPE = exports.LIST_STYLE_TYPE = {
	    NONE: -1,
	    DISC: 0,
	    CIRCLE: 1,
	    SQUARE: 2,
	    DECIMAL: 3,
	    CJK_DECIMAL: 4,
	    DECIMAL_LEADING_ZERO: 5,
	    LOWER_ROMAN: 6,
	    UPPER_ROMAN: 7,
	    LOWER_GREEK: 8,
	    LOWER_ALPHA: 9,
	    UPPER_ALPHA: 10,
	    ARABIC_INDIC: 11,
	    ARMENIAN: 12,
	    BENGALI: 13,
	    CAMBODIAN: 14,
	    CJK_EARTHLY_BRANCH: 15,
	    CJK_HEAVENLY_STEM: 16,
	    CJK_IDEOGRAPHIC: 17,
	    DEVANAGARI: 18,
	    ETHIOPIC_NUMERIC: 19,
	    GEORGIAN: 20,
	    GUJARATI: 21,
	    GURMUKHI: 22,
	    HEBREW: 22,
	    HIRAGANA: 23,
	    HIRAGANA_IROHA: 24,
	    JAPANESE_FORMAL: 25,
	    JAPANESE_INFORMAL: 26,
	    KANNADA: 27,
	    KATAKANA: 28,
	    KATAKANA_IROHA: 29,
	    KHMER: 30,
	    KOREAN_HANGUL_FORMAL: 31,
	    KOREAN_HANJA_FORMAL: 32,
	    KOREAN_HANJA_INFORMAL: 33,
	    LAO: 34,
	    LOWER_ARMENIAN: 35,
	    MALAYALAM: 36,
	    MONGOLIAN: 37,
	    MYANMAR: 38,
	    ORIYA: 39,
	    PERSIAN: 40,
	    SIMP_CHINESE_FORMAL: 41,
	    SIMP_CHINESE_INFORMAL: 42,
	    TAMIL: 43,
	    TELUGU: 44,
	    THAI: 45,
	    TIBETAN: 46,
	    TRAD_CHINESE_FORMAL: 47,
	    TRAD_CHINESE_INFORMAL: 48,
	    UPPER_ARMENIAN: 49,
	    DISCLOSURE_OPEN: 50,
	    DISCLOSURE_CLOSED: 51
	};
	
	var parseListStyleType = function parseListStyleType(type) {
	    switch (type) {
	        case 'disc':
	            return LIST_STYLE_TYPE.DISC;
	        case 'circle':
	            return LIST_STYLE_TYPE.CIRCLE;
	        case 'square':
	            return LIST_STYLE_TYPE.SQUARE;
	        case 'decimal':
	            return LIST_STYLE_TYPE.DECIMAL;
	        case 'cjk-decimal':
	            return LIST_STYLE_TYPE.CJK_DECIMAL;
	        case 'decimal-leading-zero':
	            return LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO;
	        case 'lower-roman':
	            return LIST_STYLE_TYPE.LOWER_ROMAN;
	        case 'upper-roman':
	            return LIST_STYLE_TYPE.UPPER_ROMAN;
	        case 'lower-greek':
	            return LIST_STYLE_TYPE.LOWER_GREEK;
	        case 'lower-alpha':
	            return LIST_STYLE_TYPE.LOWER_ALPHA;
	        case 'upper-alpha':
	            return LIST_STYLE_TYPE.UPPER_ALPHA;
	        case 'arabic-indic':
	            return LIST_STYLE_TYPE.ARABIC_INDIC;
	        case 'armenian':
	            return LIST_STYLE_TYPE.ARMENIAN;
	        case 'bengali':
	            return LIST_STYLE_TYPE.BENGALI;
	        case 'cambodian':
	            return LIST_STYLE_TYPE.CAMBODIAN;
	        case 'cjk-earthly-branch':
	            return LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH;
	        case 'cjk-heavenly-stem':
	            return LIST_STYLE_TYPE.CJK_HEAVENLY_STEM;
	        case 'cjk-ideographic':
	            return LIST_STYLE_TYPE.CJK_IDEOGRAPHIC;
	        case 'devanagari':
	            return LIST_STYLE_TYPE.DEVANAGARI;
	        case 'ethiopic-numeric':
	            return LIST_STYLE_TYPE.ETHIOPIC_NUMERIC;
	        case 'georgian':
	            return LIST_STYLE_TYPE.GEORGIAN;
	        case 'gujarati':
	            return LIST_STYLE_TYPE.GUJARATI;
	        case 'gurmukhi':
	            return LIST_STYLE_TYPE.GURMUKHI;
	        case 'hebrew':
	            return LIST_STYLE_TYPE.HEBREW;
	        case 'hiragana':
	            return LIST_STYLE_TYPE.HIRAGANA;
	        case 'hiragana-iroha':
	            return LIST_STYLE_TYPE.HIRAGANA_IROHA;
	        case 'japanese-formal':
	            return LIST_STYLE_TYPE.JAPANESE_FORMAL;
	        case 'japanese-informal':
	            return LIST_STYLE_TYPE.JAPANESE_INFORMAL;
	        case 'kannada':
	            return LIST_STYLE_TYPE.KANNADA;
	        case 'katakana':
	            return LIST_STYLE_TYPE.KATAKANA;
	        case 'katakana-iroha':
	            return LIST_STYLE_TYPE.KATAKANA_IROHA;
	        case 'khmer':
	            return LIST_STYLE_TYPE.KHMER;
	        case 'korean-hangul-formal':
	            return LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL;
	        case 'korean-hanja-formal':
	            return LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL;
	        case 'korean-hanja-informal':
	            return LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL;
	        case 'lao':
	            return LIST_STYLE_TYPE.LAO;
	        case 'lower-armenian':
	            return LIST_STYLE_TYPE.LOWER_ARMENIAN;
	        case 'malayalam':
	            return LIST_STYLE_TYPE.MALAYALAM;
	        case 'mongolian':
	            return LIST_STYLE_TYPE.MONGOLIAN;
	        case 'myanmar':
	            return LIST_STYLE_TYPE.MYANMAR;
	        case 'oriya':
	            return LIST_STYLE_TYPE.ORIYA;
	        case 'persian':
	            return LIST_STYLE_TYPE.PERSIAN;
	        case 'simp-chinese-formal':
	            return LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL;
	        case 'simp-chinese-informal':
	            return LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL;
	        case 'tamil':
	            return LIST_STYLE_TYPE.TAMIL;
	        case 'telugu':
	            return LIST_STYLE_TYPE.TELUGU;
	        case 'thai':
	            return LIST_STYLE_TYPE.THAI;
	        case 'tibetan':
	            return LIST_STYLE_TYPE.TIBETAN;
	        case 'trad-chinese-formal':
	            return LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL;
	        case 'trad-chinese-informal':
	            return LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL;
	        case 'upper-armenian':
	            return LIST_STYLE_TYPE.UPPER_ARMENIAN;
	        case 'disclosure-open':
	            return LIST_STYLE_TYPE.DISCLOSURE_OPEN;
	        case 'disclosure-closed':
	            return LIST_STYLE_TYPE.DISCLOSURE_CLOSED;
	        case 'none':
	        default:
	            return LIST_STYLE_TYPE.NONE;
	    }
	};
	
	var parseListStyle = exports.parseListStyle = function parseListStyle(style) {
	    var listStyleImage = (0, _background.parseBackgroundImage)(style.getPropertyValue('list-style-image'));
	    return {
	        listStyleType: parseListStyleType(style.getPropertyValue('list-style-type')),
	        listStyleImage: listStyleImage.length ? listStyleImage[0] : null,
	        listStylePosition: parseListStylePosition(style.getPropertyValue('list-style-position'))
	    };
	};
	
	var parseListStylePosition = function parseListStylePosition(position) {
	    switch (position) {
	        case 'inside':
	            return LIST_STYLE_POSITION.INSIDE;
	        case 'outside':
	        default:
	            return LIST_STYLE_POSITION.OUTSIDE;
	    }
	};

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parsePadding = exports.PADDING_SIDES = undefined;
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PADDING_SIDES = exports.PADDING_SIDES = {
	    TOP: 0,
	    RIGHT: 1,
	    BOTTOM: 2,
	    LEFT: 3
	};
	
	var SIDES = ['top', 'right', 'bottom', 'left'];
	
	var parsePadding = exports.parsePadding = function parsePadding(style) {
	    return SIDES.map(function (side) {
	        return new _Length2.default(style.getPropertyValue('padding-' + side));
	    });
	};

/***/ }),

/***/ 161:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var POSITION = exports.POSITION = {
	    STATIC: 0,
	    RELATIVE: 1,
	    ABSOLUTE: 2,
	    FIXED: 3,
	    STICKY: 4
	};
	
	var parsePosition = exports.parsePosition = function parsePosition(position) {
	    switch (position) {
	        case 'relative':
	            return POSITION.RELATIVE;
	        case 'absolute':
	            return POSITION.ABSOLUTE;
	        case 'fixed':
	            return POSITION.FIXED;
	        case 'sticky':
	            return POSITION.STICKY;
	    }
	
	    return POSITION.STATIC;
	};

/***/ }),

/***/ 162:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var TEXT_TRANSFORM = exports.TEXT_TRANSFORM = {
	    NONE: 0,
	    LOWERCASE: 1,
	    UPPERCASE: 2,
	    CAPITALIZE: 3
	};
	
	var parseTextTransform = exports.parseTextTransform = function parseTextTransform(textTransform) {
	    switch (textTransform) {
	        case 'uppercase':
	            return TEXT_TRANSFORM.UPPERCASE;
	        case 'lowercase':
	            return TEXT_TRANSFORM.LOWERCASE;
	        case 'capitalize':
	            return TEXT_TRANSFORM.CAPITALIZE;
	    }
	
	    return TEXT_TRANSFORM.NONE;
	};

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Path = __webpack_require__(70);
	
	var _textDecoration = __webpack_require__(101);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var addColorStops = function addColorStops(gradient, canvasGradient) {
	    var maxStop = Math.max.apply(null, gradient.colorStops.map(function (colorStop) {
	        return colorStop.stop;
	    }));
	    var f = 1 / Math.max(1, maxStop);
	    gradient.colorStops.forEach(function (colorStop) {
	        canvasGradient.addColorStop(f * colorStop.stop, colorStop.color.toString());
	    });
	};
	
	var CanvasRenderer = function () {
	    function CanvasRenderer(canvas) {
	        _classCallCheck(this, CanvasRenderer);
	
	        this.canvas = canvas ? canvas : document.createElement('canvas');
	    }
	
	    _createClass(CanvasRenderer, [{
	        key: 'render',
	        value: function render(options) {
	            this.ctx = this.canvas.getContext('2d');
	            this.options = options;
	            this.canvas.width = Math.floor(options.width * options.scale);
	            this.canvas.height = Math.floor(options.height * options.scale);
	            this.canvas.style.width = options.width + 'px';
	            this.canvas.style.height = options.height + 'px';
	
	            this.ctx.scale(this.options.scale, this.options.scale);
	            this.ctx.translate(-options.x, -options.y);
	            this.ctx.textBaseline = 'bottom';
	            options.logger.log('Canvas renderer initialized (' + options.width + 'x' + options.height + ' at ' + options.x + ',' + options.y + ') with scale ' + this.options.scale);
	        }
	    }, {
	        key: 'clip',
	        value: function clip(clipPaths, callback) {
	            var _this = this;
	
	            if (clipPaths.length) {
	                this.ctx.save();
	                clipPaths.forEach(function (path) {
	                    _this.path(path);
	                    _this.ctx.clip();
	                });
	            }
	
	            callback();
	
	            if (clipPaths.length) {
	                this.ctx.restore();
	            }
	        }
	    }, {
	        key: 'drawImage',
	        value: function drawImage(image, source, destination) {
	            this.ctx.drawImage(image, source.left, source.top, source.width, source.height, destination.left, destination.top, destination.width, destination.height);
	        }
	    }, {
	        key: 'drawShape',
	        value: function drawShape(path, color) {
	            this.path(path);
	            this.ctx.fillStyle = color.toString();
	            this.ctx.fill();
	        }
	    }, {
	        key: 'fill',
	        value: function fill(color) {
	            this.ctx.fillStyle = color.toString();
	            this.ctx.fill();
	        }
	    }, {
	        key: 'getTarget',
	        value: function getTarget() {
	            return Promise.resolve(this.canvas);
	        }
	    }, {
	        key: 'path',
	        value: function path(_path) {
	            var _this2 = this;
	
	            this.ctx.beginPath();
	            if (Array.isArray(_path)) {
	                _path.forEach(function (point, index) {
	                    var start = point.type === _Path.PATH.VECTOR ? point : point.start;
	                    if (index === 0) {
	                        _this2.ctx.moveTo(start.x, start.y);
	                    } else {
	                        _this2.ctx.lineTo(start.x, start.y);
	                    }
	
	                    if (point.type === _Path.PATH.BEZIER_CURVE) {
	                        _this2.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);
	                    }
	                });
	            } else {
	                this.ctx.arc(_path.x + _path.radius, _path.y + _path.radius, _path.radius, 0, Math.PI * 2, true);
	            }
	
	            this.ctx.closePath();
	        }
	    }, {
	        key: 'rectangle',
	        value: function rectangle(x, y, width, height, color) {
	            this.ctx.fillStyle = color.toString();
	            this.ctx.fillRect(x, y, width, height);
	        }
	    }, {
	        key: 'renderLinearGradient',
	        value: function renderLinearGradient(bounds, gradient) {
	            var linearGradient = this.ctx.createLinearGradient(bounds.left + gradient.direction.x1, bounds.top + gradient.direction.y1, bounds.left + gradient.direction.x0, bounds.top + gradient.direction.y0);
	
	            addColorStops(gradient, linearGradient);
	            this.ctx.fillStyle = linearGradient;
	            this.ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
	        }
	    }, {
	        key: 'renderRadialGradient',
	        value: function renderRadialGradient(bounds, gradient) {
	            var _this3 = this;
	
	            var x = bounds.left + gradient.center.x;
	            var y = bounds.top + gradient.center.y;
	
	            var radialGradient = this.ctx.createRadialGradient(x, y, 0, x, y, gradient.radius.x);
	            if (!radialGradient) {
	                return;
	            }
	
	            addColorStops(gradient, radialGradient);
	            this.ctx.fillStyle = radialGradient;
	
	            if (gradient.radius.x !== gradient.radius.y) {
	                // transforms for elliptical radial gradient
	                var midX = bounds.left + 0.5 * bounds.width;
	                var midY = bounds.top + 0.5 * bounds.height;
	                var f = gradient.radius.y / gradient.radius.x;
	                var invF = 1 / f;
	
	                this.transform(midX, midY, [1, 0, 0, f, 0, 0], function () {
	                    return _this3.ctx.fillRect(bounds.left, invF * (bounds.top - midY) + midY, bounds.width, bounds.height * invF);
	                });
	            } else {
	                this.ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
	            }
	        }
	    }, {
	        key: 'renderRepeat',
	        value: function renderRepeat(path, image, imageSize, offsetX, offsetY) {
	            this.path(path);
	            this.ctx.fillStyle = this.ctx.createPattern(this.resizeImage(image, imageSize), 'repeat');
	            this.ctx.translate(offsetX, offsetY);
	            this.ctx.fill();
	            this.ctx.translate(-offsetX, -offsetY);
	        }
	    }, {
	        key: 'renderTextNode',
	        value: function renderTextNode(textBounds, color, font, textDecoration, textShadows) {
	            var _this4 = this;
	
	            this.ctx.font = [font.fontStyle, font.fontVariant, font.fontWeight, font.fontSize, font.fontFamily].join(' ');
	
	            textBounds.forEach(function (text) {
	                _this4.ctx.fillStyle = color.toString();
	                if (textShadows && text.text.trim().length) {
	                    textShadows.slice(0).reverse().forEach(function (textShadow) {
	                        _this4.ctx.shadowColor = textShadow.color.toString();
	                        _this4.ctx.shadowOffsetX = textShadow.offsetX * _this4.options.scale;
	                        _this4.ctx.shadowOffsetY = textShadow.offsetY * _this4.options.scale;
	                        _this4.ctx.shadowBlur = textShadow.blur;
	
	                        _this4.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
	                    });
	                } else {
	                    _this4.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
	                }
	
	                if (textDecoration !== null) {
	                    var textDecorationColor = textDecoration.textDecorationColor || color;
	                    textDecoration.textDecorationLine.forEach(function (textDecorationLine) {
	                        switch (textDecorationLine) {
	                            case _textDecoration.TEXT_DECORATION_LINE.UNDERLINE:
	                                // Draws a line at the baseline of the font
	                                // TODO As some browsers display the line as more than 1px if the font-size is big,
	                                // need to take that into account both in position and size
	                                var _options$fontMetrics$ = _this4.options.fontMetrics.getMetrics(font),
	                                    baseline = _options$fontMetrics$.baseline;
	
	                                _this4.rectangle(text.bounds.left, Math.round(text.bounds.top + text.bounds.height - baseline), text.bounds.width, 1, textDecorationColor);
	                                break;
	                            case _textDecoration.TEXT_DECORATION_LINE.OVERLINE:
	                                _this4.rectangle(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1, textDecorationColor);
	                                break;
	                            case _textDecoration.TEXT_DECORATION_LINE.LINE_THROUGH:
	                                // TODO try and find exact position for line-through
	                                var _options$fontMetrics$2 = _this4.options.fontMetrics.getMetrics(font),
	                                    middle = _options$fontMetrics$2.middle;
	
	                                _this4.rectangle(text.bounds.left, Math.ceil(text.bounds.top + middle), text.bounds.width, 1, textDecorationColor);
	                                break;
	                        }
	                    });
	                }
	            });
	        }
	    }, {
	        key: 'resizeImage',
	        value: function resizeImage(image, size) {
	            if (image.width === size.width && image.height === size.height) {
	                return image;
	            }
	
	            var canvas = this.canvas.ownerDocument.createElement('canvas');
	            canvas.width = size.width;
	            canvas.height = size.height;
	            var ctx = canvas.getContext('2d');
	            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
	            return canvas;
	        }
	    }, {
	        key: 'setOpacity',
	        value: function setOpacity(opacity) {
	            this.ctx.globalAlpha = opacity;
	        }
	    }, {
	        key: 'transform',
	        value: function transform(offsetX, offsetY, matrix, callback) {
	            this.ctx.save();
	            this.ctx.translate(offsetX, offsetY);
	            this.ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
	            this.ctx.translate(-offsetX, -offsetY);
	
	            callback();
	
	            this.ctx.restore();
	        }
	    }]);
	
	    return CanvasRenderer;
	}();
	
	exports.default = CanvasRenderer;

/***/ }),

/***/ 164:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ForeignObjectRenderer = function () {
	    function ForeignObjectRenderer(element) {
	        _classCallCheck(this, ForeignObjectRenderer);
	
	        this.element = element;
	    }
	
	    _createClass(ForeignObjectRenderer, [{
	        key: 'render',
	        value: function render(options) {
	            var _this = this;
	
	            this.options = options;
	            this.canvas = document.createElement('canvas');
	            this.ctx = this.canvas.getContext('2d');
	            this.canvas.width = Math.floor(options.width) * options.scale;
	            this.canvas.height = Math.floor(options.height) * options.scale;
	            this.canvas.style.width = options.width + 'px';
	            this.canvas.style.height = options.height + 'px';
	
	            options.logger.log('ForeignObject renderer initialized (' + options.width + 'x' + options.height + ' at ' + options.x + ',' + options.y + ') with scale ' + options.scale);
	            var svg = createForeignObjectSVG(Math.max(options.windowWidth, options.width) * options.scale, Math.max(options.windowHeight, options.height) * options.scale, options.scrollX * options.scale, options.scrollY * options.scale, this.element);
	
	            return loadSerializedSVG(svg).then(function (img) {
	                if (options.backgroundColor) {
	                    _this.ctx.fillStyle = options.backgroundColor.toString();
	                    _this.ctx.fillRect(0, 0, options.width * options.scale, options.height * options.scale);
	                }
	
	                _this.ctx.drawImage(img, -options.x * options.scale, -options.y * options.scale);
	                return _this.canvas;
	            });
	        }
	    }]);
	
	    return ForeignObjectRenderer;
	}();
	
	exports.default = ForeignObjectRenderer;
	var createForeignObjectSVG = exports.createForeignObjectSVG = function createForeignObjectSVG(width, height, x, y, node) {
	    var xmlns = 'http://www.w3.org/2000/svg';
	    var svg = document.createElementNS(xmlns, 'svg');
	    var foreignObject = document.createElementNS(xmlns, 'foreignObject');
	    svg.setAttributeNS(null, 'width', width);
	    svg.setAttributeNS(null, 'height', height);
	
	    foreignObject.setAttributeNS(null, 'width', '100%');
	    foreignObject.setAttributeNS(null, 'height', '100%');
	    foreignObject.setAttributeNS(null, 'x', x);
	    foreignObject.setAttributeNS(null, 'y', y);
	    foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
	    svg.appendChild(foreignObject);
	
	    foreignObject.appendChild(node);
	
	    return svg;
	};
	
	var loadSerializedSVG = exports.loadSerializedSVG = function loadSerializedSVG(svg) {
	    return new Promise(function (resolve, reject) {
	        var img = new Image();
	        img.onload = function () {
	            return resolve(img);
	        };
	        img.onerror = reject;
	
	        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
	    });
	};

/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _getPrototypeOf = __webpack_require__(83);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(7);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(8);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(13);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(12);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _class;
	
	var _react = __webpack_require__(5);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _mobxReact = __webpack_require__(102);
	
	var _reactRouter = __webpack_require__(124);
	
	var _stores = __webpack_require__(82);
	
	__webpack_require__(296);
	
	var _svg = __webpack_require__(445);
	
	var _svg2 = _interopRequireDefault(_svg);
	
	var _html2canvas = __webpack_require__(322);
	
	var _html2canvas2 = _interopRequireDefault(_html2canvas);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Index = (0, _mobxReact.observer)(_class = function (_React$Component) {
	    (0, _inherits3.default)(Index, _React$Component);
	
	    function Index(props) {
	        (0, _classCallCheck3.default)(this, Index);
	
	        var _this = (0, _possibleConstructorReturn3.default)(this, (Index.__proto__ || (0, _getPrototypeOf2.default)(Index)).call(this, props));
	
	        _this.state = {
	            img: ''
	        };
	        return _this;
	    }
	
	    (0, _createClass3.default)(Index, [{
	        key: 'componentWillMount',
	        value: function componentWillMount() {}
	    }, {
	        key: 'focusTextInput',
	        value: function focusTextInput() {
	            this.textInput.focus();
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _this2 = this;
	
	            this.focusTextInput();
	
	            //SVG
	            var draw = (0, _svg2.default)(this.refs['svgDemo']);
	            draw.rect(100, 100).fill('#f06');
	
	            //html2canvas
	            (0, _html2canvas2.default)(this.refs['demo']).then(function (canvas) {
	                _this2.setState({
	                    img: canvas.toDataURL('image/png')
	                });
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this3 = this;
	
	            return _react2.default.createElement(
	                'div',
	                { className: 'demo', ref: 'demo' },
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    'Demo Page'
	                ),
	                _react2.default.createElement('div', { ref: 'svgDemo' }),
	                _react2.default.createElement('br', null),
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement('input', { ref: function ref(input) {
	                            return _this3.textInput = input;
	                        } }),
	                    _react2.default.createElement(
	                        'button',
	                        { onClick: function onClick() {
	                                _stores.demoState.setTxt();
	                            } },
	                        '\u70B9\u51FB'
	                    ),
	                    _react2.default.createElement(
	                        'h4',
	                        null,
	                        _stores.demoState.txt || _stores.indexState.container.ruleText
	                    )
	                ),
	                _react2.default.createElement('br', null),
	                _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: '/' },
	                    '\u8DF3\u56DE\u5230\u9996\u9875'
	                ),
	                _react2.default.createElement('br', null),
	                _react2.default.createElement('br', null),
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement(
	                        'button',
	                        { onClick: function onClick() {
	                                _stores.demoState.getJson();
	                            } },
	                        '\u8BF7\u6C42Api'
	                    ),
	                    _react2.default.createElement(
	                        'h3',
	                        null,
	                        _stores.demoState.apiJsonTxt
	                    )
	                ),
	                _react2.default.createElement('img', { src: this.state.img, style: { width: '100%', border: 'red solid 5px' } })
	            );
	        }
	    }]);
	    return Index;
	}(_react2.default.Component)) || _class;
	
	exports.default = Index;
	module.exports = exports['default'];

/***/ }),

/***/ 296:
295,

/***/ 310:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ANGLE = /([+-]?\d*\.?\d+)(deg|grad|rad|turn)/i;
	
	var parseAngle = exports.parseAngle = function parseAngle(angle) {
	    var match = angle.match(ANGLE);
	
	    if (match) {
	        var value = parseFloat(match[1]);
	        switch (match[2].toLowerCase()) {
	            case 'deg':
	                return Math.PI * value / 180;
	            case 'grad':
	                return Math.PI / 200 * value;
	            case 'rad':
	                return value;
	            case 'turn':
	                return Math.PI * 2 * value;
	        }
	    }
	
	    return null;
	};

/***/ }),

/***/ 311:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.cloneWindow = exports.DocumentCloner = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Bounds = __webpack_require__(24);
	
	var _Proxy = __webpack_require__(157);
	
	var _ResourceLoader = __webpack_require__(315);
	
	var _ResourceLoader2 = _interopRequireDefault(_ResourceLoader);
	
	var _Util = __webpack_require__(41);
	
	var _background = __webpack_require__(53);
	
	var _CanvasRenderer = __webpack_require__(163);
	
	var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';
	
	var DocumentCloner = exports.DocumentCloner = function () {
	    function DocumentCloner(element, options, logger, copyInline, renderer) {
	        _classCallCheck(this, DocumentCloner);
	
	        this.referenceElement = element;
	        this.scrolledElements = [];
	        this.copyStyles = copyInline;
	        this.inlineImages = copyInline;
	        this.logger = logger;
	        this.options = options;
	        this.renderer = renderer;
	        this.resourceLoader = new _ResourceLoader2.default(options, logger, window);
	        // $FlowFixMe
	        this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
	    }
	
	    _createClass(DocumentCloner, [{
	        key: 'inlineAllImages',
	        value: function inlineAllImages(node) {
	            var _this = this;
	
	            if (this.inlineImages && node) {
	                var style = node.style;
	                Promise.all((0, _background.parseBackgroundImage)(style.backgroundImage).map(function (backgroundImage) {
	                    if (backgroundImage.method === 'url') {
	                        return _this.resourceLoader.inlineImage(backgroundImage.args[0]).then(function (img) {
	                            return img && typeof img.src === 'string' ? 'url("' + img.src + '")' : 'none';
	                        }).catch(function (e) {
	                            if (false) {
	                                _this.logger.log('Unable to load image', e);
	                            }
	                        });
	                    }
	                    return Promise.resolve('' + backgroundImage.prefix + backgroundImage.method + '(' + backgroundImage.args.join(',') + ')');
	                })).then(function (backgroundImages) {
	                    if (backgroundImages.length > 1) {
	                        // TODO Multiple backgrounds somehow broken in Chrome
	                        style.backgroundColor = '';
	                    }
	                    style.backgroundImage = backgroundImages.join(',');
	                });
	
	                if (node instanceof HTMLImageElement) {
	                    this.resourceLoader.inlineImage(node.src).then(function (img) {
	                        if (img && node instanceof HTMLImageElement && node.parentNode) {
	                            var parentNode = node.parentNode;
	                            var clonedChild = (0, _Util.copyCSSStyles)(node.style, img.cloneNode(false));
	                            parentNode.replaceChild(clonedChild, node);
	                        }
	                    }).catch(function (e) {
	                        if (false) {
	                            _this.logger.log('Unable to load image', e);
	                        }
	                    });
	                }
	            }
	        }
	    }, {
	        key: 'inlineFonts',
	        value: function inlineFonts(document) {
	            var _this2 = this;
	
	            return Promise.all(Array.from(document.styleSheets).map(function (sheet) {
	                if (sheet.href) {
	                    return fetch(sheet.href).then(function (res) {
	                        return res.text();
	                    }).then(function (text) {
	                        return createStyleSheetFontsFromText(text, sheet.href);
	                    }).catch(function (e) {
	                        if (false) {
	                            _this2.logger.log('Unable to load stylesheet', e);
	                        }
	                        return [];
	                    });
	                }
	                return getSheetFonts(sheet, document);
	            })).then(function (fonts) {
	                return fonts.reduce(function (acc, font) {
	                    return acc.concat(font);
	                }, []);
	            }).then(function (fonts) {
	                return Promise.all(fonts.map(function (font) {
	                    return fetch(font.formats[0].src).then(function (response) {
	                        return response.blob();
	                    }).then(function (blob) {
	                        return new Promise(function (resolve, reject) {
	                            var reader = new FileReader();
	                            reader.onerror = reject;
	                            reader.onload = function () {
	                                // $FlowFixMe
	                                var result = reader.result;
	                                resolve(result);
	                            };
	                            reader.readAsDataURL(blob);
	                        });
	                    }).then(function (dataUri) {
	                        font.fontFace.setProperty('src', 'url("' + dataUri + '")');
	                        return '@font-face {' + font.fontFace.cssText + ' ';
	                    });
	                }));
	            }).then(function (fontCss) {
	                var style = document.createElement('style');
	                style.textContent = fontCss.join('\n');
	                _this2.documentElement.appendChild(style);
	            });
	        }
	    }, {
	        key: 'createElementClone',
	        value: function createElementClone(node) {
	            var _this3 = this;
	
	            if (this.copyStyles && node instanceof HTMLCanvasElement) {
	                var img = node.ownerDocument.createElement('img');
	                try {
	                    img.src = node.toDataURL();
	                    return img;
	                } catch (e) {
	                    if (false) {
	                        this.logger.log('Unable to clone canvas contents, canvas is tainted');
	                    }
	                }
	            }
	
	            if (node instanceof HTMLIFrameElement) {
	                var tempIframe = node.cloneNode(false);
	                var iframeKey = generateIframeKey();
	                tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);
	
	                var _parseBounds = (0, _Bounds.parseBounds)(node, 0, 0),
	                    width = _parseBounds.width,
	                    height = _parseBounds.height;
	
	                this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(node, this.options).then(function (documentElement) {
	                    return _this3.renderer(documentElement, {
	                        async: _this3.options.async,
	                        allowTaint: _this3.options.allowTaint,
	                        backgroundColor: '#ffffff',
	                        canvas: null,
	                        imageTimeout: _this3.options.imageTimeout,
	                        logging: _this3.options.logging,
	                        proxy: _this3.options.proxy,
	                        removeContainer: _this3.options.removeContainer,
	                        scale: _this3.options.scale,
	                        foreignObjectRendering: _this3.options.foreignObjectRendering,
	                        useCORS: _this3.options.useCORS,
	                        target: new _CanvasRenderer2.default(),
	                        width: width,
	                        height: height,
	                        x: 0,
	                        y: 0,
	                        windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
	                        windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
	                        scrollX: documentElement.ownerDocument.defaultView.pageXOffset,
	                        scrollY: documentElement.ownerDocument.defaultView.pageYOffset
	                    }, _this3.logger.child(iframeKey));
	                }).then(function (canvas) {
	                    return new Promise(function (resolve, reject) {
	                        var iframeCanvas = document.createElement('img');
	                        iframeCanvas.onload = function () {
	                            return resolve(canvas);
	                        };
	                        iframeCanvas.onerror = reject;
	                        iframeCanvas.src = canvas.toDataURL();
	                        if (tempIframe.parentNode) {
	                            tempIframe.parentNode.replaceChild((0, _Util.copyCSSStyles)(node.ownerDocument.defaultView.getComputedStyle(node), iframeCanvas), tempIframe);
	                        }
	                    });
	                });
	                return tempIframe;
	            }
	
	            return node.cloneNode(false);
	        }
	    }, {
	        key: 'cloneNode',
	        value: function cloneNode(node) {
	            var clone = node.nodeType === Node.TEXT_NODE ? document.createTextNode(node.nodeValue) : this.createElementClone(node);
	
	            var window = node.ownerDocument.defaultView;
	
	            if (this.referenceElement === node && clone instanceof window.HTMLElement) {
	                this.clonedReferenceElement = clone;
	            }
	
	            if (clone instanceof window.HTMLBodyElement) {
	                createPseudoHideStyles(clone);
	            }
	
	            for (var child = node.firstChild; child; child = child.nextSibling) {
	                if (child.nodeType !== Node.ELEMENT_NODE ||
	                // $FlowFixMe
	                child.nodeName !== 'SCRIPT' && !child.hasAttribute(IGNORE_ATTRIBUTE)) {
	                    if (!this.copyStyles || child.nodeName !== 'STYLE') {
	                        clone.appendChild(this.cloneNode(child));
	                    }
	                }
	            }
	            if (node instanceof window.HTMLElement && clone instanceof window.HTMLElement) {
	                this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_BEFORE));
	                this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_AFTER));
	                if (this.copyStyles && !(node instanceof HTMLIFrameElement)) {
	                    (0, _Util.copyCSSStyles)(node.ownerDocument.defaultView.getComputedStyle(node), clone);
	                }
	                this.inlineAllImages(clone);
	                if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
	                    this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
	                }
	                switch (node.nodeName) {
	                    case 'CANVAS':
	                        if (!this.copyStyles) {
	                            cloneCanvasContents(node, clone);
	                        }
	                        break;
	                    case 'TEXTAREA':
	                    case 'SELECT':
	                        clone.value = node.value;
	                        break;
	                }
	            }
	            return clone;
	        }
	    }]);
	
	    return DocumentCloner;
	}();
	
	var getSheetFonts = function getSheetFonts(sheet, document) {
	    // $FlowFixMe
	    return (sheet.cssRules ? Array.from(sheet.cssRules) : []).filter(function (rule) {
	        return rule.type === CSSRule.FONT_FACE_RULE;
	    }).map(function (rule) {
	        var src = (0, _background.parseBackgroundImage)(rule.style.getPropertyValue('src'));
	        var formats = [];
	        for (var i = 0; i < src.length; i++) {
	            if (src[i].method === 'url' && src[i + 1] && src[i + 1].method === 'format') {
	                var a = document.createElement('a');
	                a.href = src[i].args[0];
	                if (document.body) {
	                    document.body.appendChild(a);
	                }
	
	                var font = {
	                    src: a.href,
	                    format: src[i + 1].args[0]
	                };
	                formats.push(font);
	            }
	        }
	
	        return {
	            // TODO select correct format for browser),
	
	            formats: formats.filter(function (font) {
	                return (/^woff/i.test(font.format)
	                );
	            }),
	            fontFace: rule.style
	        };
	    }).filter(function (font) {
	        return font.formats.length;
	    });
	};
	
	var createStyleSheetFontsFromText = function createStyleSheetFontsFromText(text, baseHref) {
	    var doc = document.implementation.createHTMLDocument('');
	    var base = document.createElement('base');
	    // $FlowFixMe
	    base.href = baseHref;
	    var style = document.createElement('style');
	
	    style.textContent = text;
	    if (doc.head) {
	        doc.head.appendChild(base);
	    }
	    if (doc.body) {
	        doc.body.appendChild(style);
	    }
	
	    return style.sheet ? getSheetFonts(style.sheet, doc) : [];
	};
	
	var restoreOwnerScroll = function restoreOwnerScroll(ownerDocument, x, y) {
	    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
	        ownerDocument.defaultView.scrollTo(x, y);
	    }
	};
	
	var cloneCanvasContents = function cloneCanvasContents(canvas, clonedCanvas) {
	    try {
	        if (clonedCanvas) {
	            clonedCanvas.width = canvas.width;
	            clonedCanvas.height = canvas.height;
	            var ctx = canvas.getContext('2d');
	            var clonedCtx = clonedCanvas.getContext('2d');
	            if (ctx) {
	                clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
	            } else {
	                clonedCtx.drawImage(canvas, 0, 0);
	            }
	        }
	    } catch (e) {}
	};
	
	var inlinePseudoElement = function inlinePseudoElement(node, clone, pseudoElt) {
	    var style = node.ownerDocument.defaultView.getComputedStyle(node, pseudoElt);
	    if (!style || !style.content || style.content === 'none' || style.content === '-moz-alt-content' || style.display === 'none') {
	        return;
	    }
	
	    var content = stripQuotes(style.content);
	    var image = content.match(URL_REGEXP);
	    var anonymousReplacedElement = clone.ownerDocument.createElement(image ? 'img' : 'html2canvaspseudoelement');
	    if (image) {
	        // $FlowFixMe
	        anonymousReplacedElement.src = stripQuotes(image[1]);
	    } else {
	        anonymousReplacedElement.textContent = content;
	    }
	
	    (0, _Util.copyCSSStyles)(style, anonymousReplacedElement);
	
	    anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ' ' + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
	    clone.className += pseudoElt === PSEUDO_BEFORE ? ' ' + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE : ' ' + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
	    if (pseudoElt === PSEUDO_BEFORE) {
	        clone.insertBefore(anonymousReplacedElement, clone.firstChild);
	    } else {
	        clone.appendChild(anonymousReplacedElement);
	    }
	
	    return anonymousReplacedElement;
	};
	
	var stripQuotes = function stripQuotes(content) {
	    var first = content.substr(0, 1);
	    return first === content.substr(content.length - 1) && first.match(/['"]/) ? content.substr(1, content.length - 2) : content;
	};
	
	var URL_REGEXP = /^url\((.+)\)$/i;
	var PSEUDO_BEFORE = ':before';
	var PSEUDO_AFTER = ':after';
	var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
	var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';
	
	var PSEUDO_HIDE_ELEMENT_STYLE = '{\n    content: "" !important;\n    display: none !important;\n}';
	
	var createPseudoHideStyles = function createPseudoHideStyles(body) {
	    createStyles(body, '.' + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + '\n         .' + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);
	};
	
	var createStyles = function createStyles(body, styles) {
	    var style = body.ownerDocument.createElement('style');
	    style.innerHTML = styles;
	    body.appendChild(style);
	};
	
	var initNode = function initNode(_ref) {
	    var _ref2 = _slicedToArray(_ref, 3),
	        element = _ref2[0],
	        x = _ref2[1],
	        y = _ref2[2];
	
	    element.scrollLeft = x;
	    element.scrollTop = y;
	};
	
	var generateIframeKey = function generateIframeKey() {
	    return Math.ceil(Date.now() + Math.random() * 10000000).toString(16);
	};
	
	var DATA_URI_REGEXP = /^data:text\/(.+);(base64)?,(.*)$/i;
	
	var getIframeDocumentElement = function getIframeDocumentElement(node, options) {
	    try {
	        return Promise.resolve(node.contentWindow.document.documentElement);
	    } catch (e) {
	        return options.proxy ? (0, _Proxy.Proxy)(node.src, options).then(function (html) {
	            var match = html.match(DATA_URI_REGEXP);
	            if (!match) {
	                return Promise.reject();
	            }
	
	            return match[2] === 'base64' ? window.atob(decodeURIComponent(match[3])) : decodeURIComponent(match[3]);
	        }).then(function (html) {
	            return createIframeContainer(node.ownerDocument, (0, _Bounds.parseBounds)(node, 0, 0)).then(function (cloneIframeContainer) {
	                var cloneWindow = cloneIframeContainer.contentWindow;
	                var documentClone = cloneWindow.document;
	
	                documentClone.open();
	                documentClone.write(html);
	                var iframeLoad = iframeLoader(cloneIframeContainer).then(function () {
	                    return documentClone.documentElement;
	                });
	
	                documentClone.close();
	                return iframeLoad;
	            });
	        }) : Promise.reject();
	    }
	};
	
	var createIframeContainer = function createIframeContainer(ownerDocument, bounds) {
	    var cloneIframeContainer = ownerDocument.createElement('iframe');
	
	    cloneIframeContainer.className = 'html2canvas-container';
	    cloneIframeContainer.style.visibility = 'hidden';
	    cloneIframeContainer.style.position = 'fixed';
	    cloneIframeContainer.style.left = '-10000px';
	    cloneIframeContainer.style.top = '0px';
	    cloneIframeContainer.style.border = '0';
	    cloneIframeContainer.width = bounds.width.toString();
	    cloneIframeContainer.height = bounds.height.toString();
	    cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
	    cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, 'true');
	    if (!ownerDocument.body) {
	        return Promise.reject( false ? 'Body element not found in Document that is getting rendered' : '');
	    }
	
	    ownerDocument.body.appendChild(cloneIframeContainer);
	
	    return Promise.resolve(cloneIframeContainer);
	};
	
	var iframeLoader = function iframeLoader(cloneIframeContainer) {
	    var cloneWindow = cloneIframeContainer.contentWindow;
	    var documentClone = cloneWindow.document;
	
	    return new Promise(function (resolve, reject) {
	        cloneWindow.onload = cloneIframeContainer.onload = documentClone.onreadystatechange = function () {
	            var interval = setInterval(function () {
	                if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {
	                    clearInterval(interval);
	                    resolve(cloneIframeContainer);
	                }
	            }, 50);
	        };
	    });
	};
	
	var cloneWindow = exports.cloneWindow = function cloneWindow(ownerDocument, bounds, referenceElement, options, logger, renderer) {
	    var cloner = new DocumentCloner(referenceElement, options, logger, false, renderer);
	    var scrollX = ownerDocument.defaultView.pageXOffset;
	    var scrollY = ownerDocument.defaultView.pageYOffset;
	
	    return createIframeContainer(ownerDocument, bounds).then(function (cloneIframeContainer) {
	        var cloneWindow = cloneIframeContainer.contentWindow;
	        var documentClone = cloneWindow.document;
	
	        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
	             if window url is about:blank, we can assign the url to current by writing onto the document
	             */
	
	        var iframeLoad = iframeLoader(cloneIframeContainer).then(function () {
	            cloner.scrolledElements.forEach(initNode);
	            cloneWindow.scrollTo(bounds.left, bounds.top);
	            if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (cloneWindow.scrollY !== bounds.top || cloneWindow.scrollX !== bounds.left)) {
	                documentClone.documentElement.style.top = -bounds.top + 'px';
	                documentClone.documentElement.style.left = -bounds.left + 'px';
	                documentClone.documentElement.style.position = 'absolute';
	            }
	            return cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement || cloner.clonedReferenceElement instanceof ownerDocument.defaultView.HTMLElement || cloner.clonedReferenceElement instanceof HTMLElement ? Promise.resolve([cloneIframeContainer, cloner.clonedReferenceElement, cloner.resourceLoader]) : Promise.reject( false ? 'Error finding the ' + referenceElement.nodeName + ' in the cloned document' : '');
	        });
	
	        documentClone.open();
	        documentClone.write('<!DOCTYPE html><html></html>');
	        // Chrome scrolls the parent document for some reason after the write to the cloned window???
	        restoreOwnerScroll(referenceElement.ownerDocument, scrollX, scrollY);
	        documentClone.replaceChild(documentClone.adoptNode(cloner.documentElement), documentClone.documentElement);
	        documentClone.close();
	
	        return iframeLoad;
	    });
	};

/***/ }),

/***/ 312:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.transformWebkitRadialGradientArgs = exports.parseGradient = exports.RadialGradient = exports.LinearGradient = exports.RADIAL_GRADIENT_SHAPE = exports.GRADIENT_TYPE = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _NodeContainer = __webpack_require__(52);
	
	var _NodeContainer2 = _interopRequireDefault(_NodeContainer);
	
	var _Angle = __webpack_require__(310);
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	var _Util = __webpack_require__(41);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SIDE_OR_CORNER = /^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i;
	var PERCENTAGE_ANGLES = /^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i;
	var ENDS_WITH_LENGTH = /(px)|%|( 0)$/i;
	var FROM_TO_COLORSTOP = /^(from|to|color-stop)\((?:([\d.]+)(%)?,\s*)?(.+?)\)$/i;
	var RADIAL_SHAPE_DEFINITION = /^\s*(circle|ellipse)?\s*((?:([\d.]+)(px|r?em|%)\s*(?:([\d.]+)(px|r?em|%))?)|closest-side|closest-corner|farthest-side|farthest-corner)?\s*(?:at\s*(?:(left|center|right)|([\d.]+)(px|r?em|%))\s+(?:(top|center|bottom)|([\d.]+)(px|r?em|%)))?(?:\s|$)/i;
	
	var GRADIENT_TYPE = exports.GRADIENT_TYPE = {
	    LINEAR_GRADIENT: 0,
	    RADIAL_GRADIENT: 1
	};
	
	var RADIAL_GRADIENT_SHAPE = exports.RADIAL_GRADIENT_SHAPE = {
	    CIRCLE: 0,
	    ELLIPSE: 1
	};
	
	var LENGTH_FOR_POSITION = {
	    left: new _Length2.default('0%'),
	    top: new _Length2.default('0%'),
	    center: new _Length2.default('50%'),
	    right: new _Length2.default('100%'),
	    bottom: new _Length2.default('100%')
	};
	
	var LinearGradient = exports.LinearGradient = function LinearGradient(colorStops, direction) {
	    _classCallCheck(this, LinearGradient);
	
	    this.type = GRADIENT_TYPE.LINEAR_GRADIENT;
	    this.colorStops = colorStops;
	    this.direction = direction;
	};
	
	var RadialGradient = exports.RadialGradient = function RadialGradient(colorStops, shape, center, radius) {
	    _classCallCheck(this, RadialGradient);
	
	    this.type = GRADIENT_TYPE.RADIAL_GRADIENT;
	    this.colorStops = colorStops;
	    this.shape = shape;
	    this.center = center;
	    this.radius = radius;
	};
	
	var parseGradient = exports.parseGradient = function parseGradient(container, _ref, bounds) {
	    var args = _ref.args,
	        method = _ref.method,
	        prefix = _ref.prefix;
	
	    if (method === 'linear-gradient') {
	        return parseLinearGradient(args, bounds, !!prefix);
	    } else if (method === 'gradient' && args[0] === 'linear') {
	        // TODO handle correct angle
	        return parseLinearGradient(['to bottom'].concat(transformObsoleteColorStops(args.slice(3))), bounds, !!prefix);
	    } else if (method === 'radial-gradient') {
	        return parseRadialGradient(container, prefix === '-webkit-' ? transformWebkitRadialGradientArgs(args) : args, bounds);
	    } else if (method === 'gradient' && args[0] === 'radial') {
	        return parseRadialGradient(container, transformObsoleteColorStops(transformWebkitRadialGradientArgs(args.slice(1))), bounds);
	    }
	};
	
	var parseColorStops = function parseColorStops(args, firstColorStopIndex, lineLength) {
	    var colorStops = [];
	
	    for (var i = firstColorStopIndex; i < args.length; i++) {
	        var value = args[i];
	        var HAS_LENGTH = ENDS_WITH_LENGTH.test(value);
	        var lastSpaceIndex = value.lastIndexOf(' ');
	        var _color = new _Color2.default(HAS_LENGTH ? value.substring(0, lastSpaceIndex) : value);
	        var _stop = HAS_LENGTH ? new _Length2.default(value.substring(lastSpaceIndex + 1)) : i === firstColorStopIndex ? new _Length2.default('0%') : i === args.length - 1 ? new _Length2.default('100%') : null;
	        colorStops.push({ color: _color, stop: _stop });
	    }
	
	    var absoluteValuedColorStops = colorStops.map(function (_ref2) {
	        var color = _ref2.color,
	            stop = _ref2.stop;
	
	        var absoluteStop = lineLength === 0 ? 0 : stop ? stop.getAbsoluteValue(lineLength) / lineLength : null;
	
	        return {
	            color: color,
	            // $FlowFixMe
	            stop: absoluteStop
	        };
	    });
	
	    var previousColorStop = absoluteValuedColorStops[0].stop;
	    for (var _i = 0; _i < absoluteValuedColorStops.length; _i++) {
	        if (previousColorStop !== null) {
	            var _stop2 = absoluteValuedColorStops[_i].stop;
	            if (_stop2 === null) {
	                var n = _i;
	                while (absoluteValuedColorStops[n].stop === null) {
	                    n++;
	                }
	                var steps = n - _i + 1;
	                var nextColorStep = absoluteValuedColorStops[n].stop;
	                var stepSize = (nextColorStep - previousColorStop) / steps;
	                for (; _i < n; _i++) {
	                    previousColorStop = absoluteValuedColorStops[_i].stop = previousColorStop + stepSize;
	                }
	            } else {
	                previousColorStop = _stop2;
	            }
	        }
	    }
	
	    return absoluteValuedColorStops;
	};
	
	var parseLinearGradient = function parseLinearGradient(args, bounds, hasPrefix) {
	    var angle = (0, _Angle.parseAngle)(args[0]);
	    var HAS_SIDE_OR_CORNER = SIDE_OR_CORNER.test(args[0]);
	    var HAS_DIRECTION = HAS_SIDE_OR_CORNER || angle !== null || PERCENTAGE_ANGLES.test(args[0]);
	    var direction = HAS_DIRECTION ? angle !== null ? calculateGradientDirection(
	    // if there is a prefix, the 0° angle points due East (instead of North per W3C)
	    hasPrefix ? angle - Math.PI * 0.5 : angle, bounds) : HAS_SIDE_OR_CORNER ? parseSideOrCorner(args[0], bounds) : parsePercentageAngle(args[0], bounds) : calculateGradientDirection(Math.PI, bounds);
	    var firstColorStopIndex = HAS_DIRECTION ? 1 : 0;
	
	    // TODO: Fix some inaccuracy with color stops with px values
	    var lineLength = Math.min((0, _Util.distance)(Math.abs(direction.x0) + Math.abs(direction.x1), Math.abs(direction.y0) + Math.abs(direction.y1)), bounds.width * 2, bounds.height * 2);
	
	    return new LinearGradient(parseColorStops(args, firstColorStopIndex, lineLength), direction);
	};
	
	var parseRadialGradient = function parseRadialGradient(container, args, bounds) {
	    var m = args[0].match(RADIAL_SHAPE_DEFINITION);
	    var shape = m && (m[1] === 'circle' || // explicit shape specification
	    m[3] !== undefined && m[5] === undefined) // only one radius coordinate
	    ? RADIAL_GRADIENT_SHAPE.CIRCLE : RADIAL_GRADIENT_SHAPE.ELLIPSE;
	    var radius = {};
	    var center = {};
	
	    if (m) {
	        // Radius
	        if (m[3] !== undefined) {
	            radius.x = (0, _Length.calculateLengthFromValueWithUnit)(container, m[3], m[4]).getAbsoluteValue(bounds.width);
	        }
	
	        if (m[5] !== undefined) {
	            radius.y = (0, _Length.calculateLengthFromValueWithUnit)(container, m[5], m[6]).getAbsoluteValue(bounds.height);
	        }
	
	        // Position
	        if (m[7]) {
	            center.x = LENGTH_FOR_POSITION[m[7].toLowerCase()];
	        } else if (m[8] !== undefined) {
	            center.x = (0, _Length.calculateLengthFromValueWithUnit)(container, m[8], m[9]);
	        }
	
	        if (m[10]) {
	            center.y = LENGTH_FOR_POSITION[m[10].toLowerCase()];
	        } else if (m[11] !== undefined) {
	            center.y = (0, _Length.calculateLengthFromValueWithUnit)(container, m[11], m[12]);
	        }
	    }
	
	    var gradientCenter = {
	        x: center.x === undefined ? bounds.width / 2 : center.x.getAbsoluteValue(bounds.width),
	        y: center.y === undefined ? bounds.height / 2 : center.y.getAbsoluteValue(bounds.height)
	    };
	    var gradientRadius = calculateRadius(m && m[2] || 'farthest-corner', shape, gradientCenter, radius, bounds);
	
	    return new RadialGradient(parseColorStops(args, m ? 1 : 0, Math.min(gradientRadius.x, gradientRadius.y)), shape, gradientCenter, gradientRadius);
	};
	
	var calculateGradientDirection = function calculateGradientDirection(radian, bounds) {
	    var width = bounds.width;
	    var height = bounds.height;
	    var HALF_WIDTH = width * 0.5;
	    var HALF_HEIGHT = height * 0.5;
	    var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
	    var HALF_LINE_LENGTH = lineLength / 2;
	
	    var x0 = HALF_WIDTH + Math.sin(radian) * HALF_LINE_LENGTH;
	    var y0 = HALF_HEIGHT - Math.cos(radian) * HALF_LINE_LENGTH;
	    var x1 = width - x0;
	    var y1 = height - y0;
	
	    return { x0: x0, x1: x1, y0: y0, y1: y1 };
	};
	
	var parseTopRight = function parseTopRight(bounds) {
	    return Math.acos(bounds.width / 2 / ((0, _Util.distance)(bounds.width, bounds.height) / 2));
	};
	
	var parseSideOrCorner = function parseSideOrCorner(side, bounds) {
	    switch (side) {
	        case 'bottom':
	        case 'to top':
	            return calculateGradientDirection(0, bounds);
	        case 'left':
	        case 'to right':
	            return calculateGradientDirection(Math.PI / 2, bounds);
	        case 'right':
	        case 'to left':
	            return calculateGradientDirection(3 * Math.PI / 2, bounds);
	        case 'top right':
	        case 'right top':
	        case 'to bottom left':
	        case 'to left bottom':
	            return calculateGradientDirection(Math.PI + parseTopRight(bounds), bounds);
	        case 'top left':
	        case 'left top':
	        case 'to bottom right':
	        case 'to right bottom':
	            return calculateGradientDirection(Math.PI - parseTopRight(bounds), bounds);
	        case 'bottom left':
	        case 'left bottom':
	        case 'to top right':
	        case 'to right top':
	            return calculateGradientDirection(parseTopRight(bounds), bounds);
	        case 'bottom right':
	        case 'right bottom':
	        case 'to top left':
	        case 'to left top':
	            return calculateGradientDirection(2 * Math.PI - parseTopRight(bounds), bounds);
	        case 'top':
	        case 'to bottom':
	        default:
	            return calculateGradientDirection(Math.PI, bounds);
	    }
	};
	
	var parsePercentageAngle = function parsePercentageAngle(angle, bounds) {
	    var _angle$split$map = angle.split(' ').map(parseFloat),
	        _angle$split$map2 = _slicedToArray(_angle$split$map, 2),
	        left = _angle$split$map2[0],
	        top = _angle$split$map2[1];
	
	    var ratio = left / 100 * bounds.width / (top / 100 * bounds.height);
	
	    return calculateGradientDirection(Math.atan(isNaN(ratio) ? 1 : ratio) + Math.PI / 2, bounds);
	};
	
	var findCorner = function findCorner(bounds, x, y, closest) {
	    var corners = [{ x: 0, y: 0 }, { x: 0, y: bounds.height }, { x: bounds.width, y: 0 }, { x: bounds.width, y: bounds.height }];
	
	    // $FlowFixMe
	    return corners.reduce(function (stat, corner) {
	        var d = (0, _Util.distance)(x - corner.x, y - corner.y);
	        if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {
	            return {
	                optimumCorner: corner,
	                optimumDistance: d
	            };
	        }
	
	        return stat;
	    }, {
	        optimumDistance: closest ? Infinity : -Infinity,
	        optimumCorner: null
	    }).optimumCorner;
	};
	
	var calculateRadius = function calculateRadius(extent, shape, center, radius, bounds) {
	    var x = center.x;
	    var y = center.y;
	    var rx = 0;
	    var ry = 0;
	
	    switch (extent) {
	        case 'closest-side':
	            // The ending shape is sized so that that it exactly meets the side of the gradient box closest to the gradient’s center.
	            // If the shape is an ellipse, it exactly meets the closest side in each dimension.
	            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
	                rx = ry = Math.min(Math.abs(x), Math.abs(x - bounds.width), Math.abs(y), Math.abs(y - bounds.height));
	            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
	                rx = Math.min(Math.abs(x), Math.abs(x - bounds.width));
	                ry = Math.min(Math.abs(y), Math.abs(y - bounds.height));
	            }
	            break;
	
	        case 'closest-corner':
	            // The ending shape is sized so that that it passes through the corner of the gradient box closest to the gradient’s center.
	            // If the shape is an ellipse, the ending shape is given the same aspect-ratio it would have if closest-side were specified.
	            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
	                rx = ry = Math.min((0, _Util.distance)(x, y), (0, _Util.distance)(x, y - bounds.height), (0, _Util.distance)(x - bounds.width, y), (0, _Util.distance)(x - bounds.width, y - bounds.height));
	            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
	                // Compute the ratio ry/rx (which is to be the same as for "closest-side")
	                var c = Math.min(Math.abs(y), Math.abs(y - bounds.height)) / Math.min(Math.abs(x), Math.abs(x - bounds.width));
	                var corner = findCorner(bounds, x, y, true);
	                rx = (0, _Util.distance)(corner.x - x, (corner.y - y) / c);
	                ry = c * rx;
	            }
	            break;
	
	        case 'farthest-side':
	            // Same as closest-side, except the ending shape is sized based on the farthest side(s)
	            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
	                rx = ry = Math.max(Math.abs(x), Math.abs(x - bounds.width), Math.abs(y), Math.abs(y - bounds.height));
	            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
	                rx = Math.max(Math.abs(x), Math.abs(x - bounds.width));
	                ry = Math.max(Math.abs(y), Math.abs(y - bounds.height));
	            }
	            break;
	
	        case 'farthest-corner':
	            // Same as closest-corner, except the ending shape is sized based on the farthest corner.
	            // If the shape is an ellipse, the ending shape is given the same aspect ratio it would have if farthest-side were specified.
	            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
	                rx = ry = Math.max((0, _Util.distance)(x, y), (0, _Util.distance)(x, y - bounds.height), (0, _Util.distance)(x - bounds.width, y), (0, _Util.distance)(x - bounds.width, y - bounds.height));
	            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
	                // Compute the ratio ry/rx (which is to be the same as for "farthest-side")
	                var _c = Math.max(Math.abs(y), Math.abs(y - bounds.height)) / Math.max(Math.abs(x), Math.abs(x - bounds.width));
	                var _corner = findCorner(bounds, x, y, false);
	                rx = (0, _Util.distance)(_corner.x - x, (_corner.y - y) / _c);
	                ry = _c * rx;
	            }
	            break;
	
	        default:
	            // pixel or percentage values
	            rx = radius.x || 0;
	            ry = radius.y !== undefined ? radius.y : rx;
	            break;
	    }
	
	    return {
	        x: rx,
	        y: ry
	    };
	};
	
	var transformWebkitRadialGradientArgs = exports.transformWebkitRadialGradientArgs = function transformWebkitRadialGradientArgs(args) {
	    var shape = '';
	    var radius = '';
	    var extent = '';
	    var position = '';
	    var idx = 0;
	
	    var POSITION = /^(left|center|right|\d+(?:px|r?em|%)?)(?:\s+(top|center|bottom|\d+(?:px|r?em|%)?))?$/i;
	    var SHAPE_AND_EXTENT = /^(circle|ellipse)?\s*(closest-side|closest-corner|farthest-side|farthest-corner|contain|cover)?$/i;
	    var RADIUS = /^\d+(px|r?em|%)?(?:\s+\d+(px|r?em|%)?)?$/i;
	
	    var matchStartPosition = args[idx].match(POSITION);
	    if (matchStartPosition) {
	        idx++;
	    }
	
	    var matchShapeExtent = args[idx].match(SHAPE_AND_EXTENT);
	    if (matchShapeExtent) {
	        shape = matchShapeExtent[1] || '';
	        extent = matchShapeExtent[2] || '';
	        if (extent === 'contain') {
	            extent = 'closest-side';
	        } else if (extent === 'cover') {
	            extent = 'farthest-corner';
	        }
	        idx++;
	    }
	
	    var matchStartRadius = args[idx].match(RADIUS);
	    if (matchStartRadius) {
	        idx++;
	    }
	
	    var matchEndPosition = args[idx].match(POSITION);
	    if (matchEndPosition) {
	        idx++;
	    }
	
	    var matchEndRadius = args[idx].match(RADIUS);
	    if (matchEndRadius) {
	        idx++;
	    }
	
	    var matchPosition = matchEndPosition || matchStartPosition;
	    if (matchPosition && matchPosition[1]) {
	        position = matchPosition[1] + (/^\d+$/.test(matchPosition[1]) ? 'px' : '');
	        if (matchPosition[2]) {
	            position += ' ' + matchPosition[2] + (/^\d+$/.test(matchPosition[2]) ? 'px' : '');
	        }
	    }
	
	    var matchRadius = matchEndRadius || matchStartRadius;
	    if (matchRadius) {
	        radius = matchRadius[0];
	        if (!matchRadius[1]) {
	            radius += 'px';
	        }
	    }
	
	    if (position && !shape && !radius && !extent) {
	        radius = position;
	        position = '';
	    }
	
	    if (position) {
	        position = 'at ' + position;
	    }
	
	    return [[shape, extent, radius, position].filter(function (s) {
	        return !!s;
	    }).join(' ')].concat(args.slice(idx));
	};
	
	var transformObsoleteColorStops = function transformObsoleteColorStops(args) {
	    return args.map(function (color) {
	        return color.match(FROM_TO_COLORSTOP);
	    })
	    // $FlowFixMe
	    .map(function (v, index) {
	        if (!v) {
	            return args[index];
	        }
	
	        switch (v[1]) {
	            case 'from':
	                return v[4] + ' 0%';
	            case 'to':
	                return v[4] + ' 100%';
	            case 'color-stop':
	                if (v[3] === '%') {
	                    return v[4] + ' ' + v[2];
	                }
	                return v[4] + ' ' + parseFloat(v[2]) * 100 + '%';
	        }
	    });
	};

/***/ }),

/***/ 313:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NodeParser = undefined;
	
	var _StackingContext = __webpack_require__(316);
	
	var _StackingContext2 = _interopRequireDefault(_StackingContext);
	
	var _NodeContainer = __webpack_require__(52);
	
	var _NodeContainer2 = _interopRequireDefault(_NodeContainer);
	
	var _TextContainer = __webpack_require__(69);
	
	var _TextContainer2 = _interopRequireDefault(_TextContainer);
	
	var _Input = __webpack_require__(154);
	
	var _ListItem = __webpack_require__(155);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NodeParser = exports.NodeParser = function NodeParser(node, resourceLoader, logger) {
	    if (false) {
	        logger.log('Starting node parsing');
	    }
	
	    var index = 0;
	
	    var container = new _NodeContainer2.default(node, null, resourceLoader, index++);
	    var stack = new _StackingContext2.default(container, null, true);
	
	    parseNodeTree(node, container, stack, resourceLoader, index);
	
	    if (false) {
	        logger.log('Finished parsing node tree');
	    }
	
	    return stack;
	};
	
	var IGNORED_NODE_NAMES = ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'];
	
	var parseNodeTree = function parseNodeTree(node, parent, stack, resourceLoader, index) {
	    if (false) {
	        throw new Error('Recursion error while parsing node tree');
	    }
	
	    for (var childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
	        nextNode = childNode.nextSibling;
	        var defaultView = childNode.ownerDocument.defaultView;
	        if (childNode instanceof defaultView.Text || childNode instanceof Text || defaultView.parent && childNode instanceof defaultView.parent.Text) {
	            if (childNode.data.trim().length > 0) {
	                parent.childNodes.push(_TextContainer2.default.fromTextNode(childNode, parent));
	            }
	        } else if (childNode instanceof defaultView.HTMLElement || childNode instanceof HTMLElement || defaultView.parent && childNode instanceof defaultView.parent.HTMLElement) {
	            if (IGNORED_NODE_NAMES.indexOf(childNode.nodeName) === -1) {
	                var container = new _NodeContainer2.default(childNode, parent, resourceLoader, index++);
	                if (container.isVisible()) {
	                    if (childNode.tagName === 'INPUT') {
	                        // $FlowFixMe
	                        (0, _Input.inlineInputElement)(childNode, container);
	                    } else if (childNode.tagName === 'TEXTAREA') {
	                        // $FlowFixMe
	                        (0, _Input.inlineTextAreaElement)(childNode, container);
	                    } else if (childNode.tagName === 'SELECT') {
	                        // $FlowFixMe
	                        (0, _Input.inlineSelectElement)(childNode, container);
	                    } else if (container.style.listStyle && container.style.listStyle.listStyleType !== 'none') {
	                        (0, _ListItem.inlineListItemElement)(childNode, container, resourceLoader);
	                    }
	
	                    var SHOULD_TRAVERSE_CHILDREN = childNode.tagName !== 'TEXTAREA';
	                    var treatAsRealStackingContext = createsRealStackingContext(container, childNode);
	                    if (treatAsRealStackingContext || createsStackingContext(container)) {
	                        // for treatAsRealStackingContext:false, any positioned descendants and descendants
	                        // which actually create a new stacking context should be considered part of the parent stacking context
	                        var parentStack = treatAsRealStackingContext || container.isPositioned() ? stack.getRealParentStackingContext() : stack;
	                        var childStack = new _StackingContext2.default(container, parentStack, treatAsRealStackingContext);
	                        parentStack.contexts.push(childStack);
	                        if (SHOULD_TRAVERSE_CHILDREN) {
	                            parseNodeTree(childNode, container, childStack, resourceLoader, index);
	                        }
	                    } else {
	                        stack.children.push(container);
	                        if (SHOULD_TRAVERSE_CHILDREN) {
	                            parseNodeTree(childNode, container, stack, resourceLoader, index);
	                        }
	                    }
	                }
	            }
	        } else if (childNode instanceof defaultView.SVGSVGElement || childNode instanceof SVGSVGElement || defaultView.parent && childNode instanceof defaultView.parent.SVGSVGElement) {
	            var _container = new _NodeContainer2.default(childNode, parent, resourceLoader, index++);
	            var _treatAsRealStackingContext = createsRealStackingContext(_container, childNode);
	            if (_treatAsRealStackingContext || createsStackingContext(_container)) {
	                // for treatAsRealStackingContext:false, any positioned descendants and descendants
	                // which actually create a new stacking context should be considered part of the parent stacking context
	                var _parentStack = _treatAsRealStackingContext || _container.isPositioned() ? stack.getRealParentStackingContext() : stack;
	                var _childStack = new _StackingContext2.default(_container, _parentStack, _treatAsRealStackingContext);
	                _parentStack.contexts.push(_childStack);
	            } else {
	                stack.children.push(_container);
	            }
	        }
	    }
	};
	
	var createsRealStackingContext = function createsRealStackingContext(container, node) {
	    return container.isRootElement() || container.isPositionedWithZIndex() || container.style.opacity < 1 || container.isTransformed() || isBodyWithTransparentRoot(container, node);
	};
	
	var createsStackingContext = function createsStackingContext(container) {
	    return container.isPositioned() || container.isFloating();
	};
	
	var isBodyWithTransparentRoot = function isBodyWithTransparentRoot(container, node) {
	    return node.nodeName === 'BODY' && container.parent instanceof _NodeContainer2.default && container.parent.style.background.backgroundColor.isTransparent();
	};

/***/ }),

/***/ 314:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Bounds = __webpack_require__(24);
	
	var _Font = __webpack_require__(153);
	
	var _Gradient = __webpack_require__(312);
	
	var _TextContainer = __webpack_require__(69);
	
	var _TextContainer2 = _interopRequireDefault(_TextContainer);
	
	var _background = __webpack_require__(53);
	
	var _border = __webpack_require__(100);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Renderer = function () {
	    function Renderer(target, options) {
	        _classCallCheck(this, Renderer);
	
	        this.target = target;
	        this.options = options;
	        target.render(options);
	    }
	
	    _createClass(Renderer, [{
	        key: 'renderNode',
	        value: function renderNode(container) {
	            if (container.isVisible()) {
	                this.renderNodeBackgroundAndBorders(container);
	                this.renderNodeContent(container);
	            }
	        }
	    }, {
	        key: 'renderNodeContent',
	        value: function renderNodeContent(container) {
	            var _this = this;
	
	            var callback = function callback() {
	                if (container.childNodes.length) {
	                    container.childNodes.forEach(function (child) {
	                        if (child instanceof _TextContainer2.default) {
	                            var style = child.parent.style;
	                            _this.target.renderTextNode(child.bounds, style.color, style.font, style.textDecoration, style.textShadow);
	                        } else {
	                            _this.target.drawShape(child, container.style.color);
	                        }
	                    });
	                }
	
	                if (container.image) {
	                    var _image = _this.options.imageStore.get(container.image);
	                    if (_image) {
	                        var contentBox = (0, _Bounds.calculateContentBox)(container.bounds, container.style.padding, container.style.border);
	                        var _width = typeof _image.width === 'number' && _image.width > 0 ? _image.width : contentBox.width;
	                        var _height = typeof _image.height === 'number' && _image.height > 0 ? _image.height : contentBox.height;
	                        if (_width > 0 && _height > 0) {
	                            _this.target.clip([(0, _Bounds.calculatePaddingBoxPath)(container.curvedBounds)], function () {
	                                _this.target.drawImage(_image, new _Bounds.Bounds(0, 0, _width, _height), contentBox);
	                            });
	                        }
	                    }
	                }
	            };
	            var paths = container.getClipPaths();
	            if (paths.length) {
	                this.target.clip(paths, callback);
	            } else {
	                callback();
	            }
	        }
	    }, {
	        key: 'renderNodeBackgroundAndBorders',
	        value: function renderNodeBackgroundAndBorders(container) {
	            var _this2 = this;
	
	            var HAS_BACKGROUND = !container.style.background.backgroundColor.isTransparent() || container.style.background.backgroundImage.length;
	
	            var renderableBorders = container.style.border.filter(function (border) {
	                return border.borderStyle !== _border.BORDER_STYLE.NONE && !border.borderColor.isTransparent();
	            });
	
	            var callback = function callback() {
	                var backgroundPaintingArea = (0, _background.calculateBackgroungPaintingArea)(container.curvedBounds, container.style.background.backgroundClip);
	
	                if (HAS_BACKGROUND) {
	                    _this2.target.clip([backgroundPaintingArea], function () {
	                        if (!container.style.background.backgroundColor.isTransparent()) {
	                            _this2.target.fill(container.style.background.backgroundColor);
	                        }
	
	                        _this2.renderBackgroundImage(container);
	                    });
	                }
	
	                renderableBorders.forEach(function (border, side) {
	                    _this2.renderBorder(border, side, container.curvedBounds);
	                });
	            };
	
	            if (HAS_BACKGROUND || renderableBorders.length) {
	                var paths = container.parent ? container.parent.getClipPaths() : [];
	                if (paths.length) {
	                    this.target.clip(paths, callback);
	                } else {
	                    callback();
	                }
	            }
	        }
	    }, {
	        key: 'renderBackgroundImage',
	        value: function renderBackgroundImage(container) {
	            var _this3 = this;
	
	            container.style.background.backgroundImage.slice(0).reverse().forEach(function (backgroundImage) {
	                if (backgroundImage.source.method === 'url' && backgroundImage.source.args.length) {
	                    _this3.renderBackgroundRepeat(container, backgroundImage);
	                } else if (/gradient/i.test(backgroundImage.source.method)) {
	                    _this3.renderBackgroundGradient(container, backgroundImage);
	                }
	            });
	        }
	    }, {
	        key: 'renderBackgroundRepeat',
	        value: function renderBackgroundRepeat(container, background) {
	            var image = this.options.imageStore.get(background.source.args[0]);
	            if (image) {
	                var backgroundPositioningArea = (0, _background.calculateBackgroungPositioningArea)(container.style.background.backgroundOrigin, container.bounds, container.style.padding, container.style.border);
	                var backgroundImageSize = (0, _background.calculateBackgroundSize)(background, image, backgroundPositioningArea);
	                var position = (0, _background.calculateBackgroundPosition)(background.position, backgroundImageSize, backgroundPositioningArea);
	                var _path = (0, _background.calculateBackgroundRepeatPath)(background, position, backgroundImageSize, backgroundPositioningArea, container.bounds);
	
	                var _offsetX = Math.round(backgroundPositioningArea.left + position.x);
	                var _offsetY = Math.round(backgroundPositioningArea.top + position.y);
	                this.target.renderRepeat(_path, image, backgroundImageSize, _offsetX, _offsetY);
	            }
	        }
	    }, {
	        key: 'renderBackgroundGradient',
	        value: function renderBackgroundGradient(container, background) {
	            var backgroundPositioningArea = (0, _background.calculateBackgroungPositioningArea)(container.style.background.backgroundOrigin, container.bounds, container.style.padding, container.style.border);
	            var backgroundImageSize = (0, _background.calculateGradientBackgroundSize)(background, backgroundPositioningArea);
	            var position = (0, _background.calculateBackgroundPosition)(background.position, backgroundImageSize, backgroundPositioningArea);
	            var gradientBounds = new _Bounds.Bounds(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y), backgroundImageSize.width, backgroundImageSize.height);
	
	            var gradient = (0, _Gradient.parseGradient)(container, background.source, gradientBounds);
	            if (gradient) {
	                switch (gradient.type) {
	                    case _Gradient.GRADIENT_TYPE.LINEAR_GRADIENT:
	                        // $FlowFixMe
	                        this.target.renderLinearGradient(gradientBounds, gradient);
	                        break;
	                    case _Gradient.GRADIENT_TYPE.RADIAL_GRADIENT:
	                        // $FlowFixMe
	                        this.target.renderRadialGradient(gradientBounds, gradient);
	                        break;
	                }
	            }
	        }
	    }, {
	        key: 'renderBorder',
	        value: function renderBorder(border, side, curvePoints) {
	            this.target.drawShape((0, _Bounds.parsePathForBorder)(curvePoints, side), border.borderColor);
	        }
	    }, {
	        key: 'renderStack',
	        value: function renderStack(stack) {
	            var _this4 = this;
	
	            if (stack.container.isVisible()) {
	                var _opacity = stack.getOpacity();
	                if (_opacity !== this._opacity) {
	                    this.target.setOpacity(stack.getOpacity());
	                    this._opacity = _opacity;
	                }
	
	                var _transform = stack.container.style.transform;
	                if (_transform !== null) {
	                    this.target.transform(stack.container.bounds.left + _transform.transformOrigin[0].value, stack.container.bounds.top + _transform.transformOrigin[1].value, _transform.transform, function () {
	                        return _this4.renderStackContent(stack);
	                    });
	                } else {
	                    this.renderStackContent(stack);
	                }
	            }
	        }
	    }, {
	        key: 'renderStackContent',
	        value: function renderStackContent(stack) {
	            var _splitStackingContext = splitStackingContexts(stack),
	                _splitStackingContext2 = _slicedToArray(_splitStackingContext, 5),
	                negativeZIndex = _splitStackingContext2[0],
	                zeroOrAutoZIndexOrTransformedOrOpacity = _splitStackingContext2[1],
	                positiveZIndex = _splitStackingContext2[2],
	                nonPositionedFloats = _splitStackingContext2[3],
	                nonPositionedInlineLevel = _splitStackingContext2[4];
	
	            var _splitDescendants = splitDescendants(stack),
	                _splitDescendants2 = _slicedToArray(_splitDescendants, 2),
	                inlineLevel = _splitDescendants2[0],
	                nonInlineLevel = _splitDescendants2[1];
	
	            // https://www.w3.org/TR/css-position-3/#painting-order
	            // 1. the background and borders of the element forming the stacking context.
	
	
	            this.renderNodeBackgroundAndBorders(stack.container);
	            // 2. the child stacking contexts with negative stack levels (most negative first).
	            negativeZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
	            // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
	            this.renderNodeContent(stack.container);
	            nonInlineLevel.forEach(this.renderNode, this);
	            // 4. All non-positioned floating descendants, in tree order. For each one of these,
	            // treat the element as if it created a new stacking context, but any positioned descendants and descendants
	            // which actually create a new stacking context should be considered part of the parent stacking context,
	            // not this new one.
	            nonPositionedFloats.forEach(this.renderStack, this);
	            // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
	            nonPositionedInlineLevel.forEach(this.renderStack, this);
	            inlineLevel.forEach(this.renderNode, this);
	            // 6. All positioned, opacity or transform descendants, in tree order that fall into the following categories:
	            //  All positioned descendants with 'z-index: auto' or 'z-index: 0', in tree order.
	            //  For those with 'z-index: auto', treat the element as if it created a new stacking context,
	            //  but any positioned descendants and descendants which actually create a new stacking context should be
	            //  considered part of the parent stacking context, not this new one. For those with 'z-index: 0',
	            //  treat the stacking context generated atomically.
	            //
	            //  All opacity descendants with opacity less than 1
	            //
	            //  All transform descendants with transform other than none
	            zeroOrAutoZIndexOrTransformedOrOpacity.forEach(this.renderStack, this);
	            // 7. Stacking contexts formed by positioned descendants with z-indices greater than or equal to 1 in z-index
	            // order (smallest first) then tree order.
	            positiveZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
	        }
	    }, {
	        key: 'render',
	        value: function render(stack) {
	            var _this5 = this;
	
	            if (this.options.backgroundColor) {
	                this.target.rectangle(this.options.x, this.options.y, this.options.width, this.options.height, this.options.backgroundColor);
	            }
	            this.renderStack(stack);
	            var target = this.target.getTarget();
	            if (false) {
	                return target.then(function (output) {
	                    _this5.options.logger.log('Render completed');
	                    return output;
	                });
	            }
	            return target;
	        }
	    }]);
	
	    return Renderer;
	}();
	
	exports.default = Renderer;
	
	
	var splitDescendants = function splitDescendants(stack) {
	    var inlineLevel = [];
	    var nonInlineLevel = [];
	
	    var length = stack.children.length;
	    for (var i = 0; i < length; i++) {
	        var child = stack.children[i];
	        if (child.isInlineLevel()) {
	            inlineLevel.push(child);
	        } else {
	            nonInlineLevel.push(child);
	        }
	    }
	    return [inlineLevel, nonInlineLevel];
	};
	
	var splitStackingContexts = function splitStackingContexts(stack) {
	    var negativeZIndex = [];
	    var zeroOrAutoZIndexOrTransformedOrOpacity = [];
	    var positiveZIndex = [];
	    var nonPositionedFloats = [];
	    var nonPositionedInlineLevel = [];
	    var length = stack.contexts.length;
	    for (var i = 0; i < length; i++) {
	        var child = stack.contexts[i];
	        if (child.container.isPositioned() || child.container.style.opacity < 1 || child.container.isTransformed()) {
	            if (child.container.style.zIndex.order < 0) {
	                negativeZIndex.push(child);
	            } else if (child.container.style.zIndex.order > 0) {
	                positiveZIndex.push(child);
	            } else {
	                zeroOrAutoZIndexOrTransformedOrOpacity.push(child);
	            }
	        } else {
	            if (child.container.isFloating()) {
	                nonPositionedFloats.push(child);
	            } else {
	                nonPositionedInlineLevel.push(child);
	            }
	        }
	    }
	    return [negativeZIndex, zeroOrAutoZIndexOrTransformedOrOpacity, positiveZIndex, nonPositionedFloats, nonPositionedInlineLevel];
	};
	
	var sortByZIndex = function sortByZIndex(a, b) {
	    if (a.container.style.zIndex.order > b.container.style.zIndex.order) {
	        return 1;
	    } else if (a.container.style.zIndex.order < b.container.style.zIndex.order) {
	        return -1;
	    }
	
	    return a.container.index > b.container.index ? 1 : -1;
	};

/***/ }),

/***/ 315:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ResourceStore = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Feature = __webpack_require__(68);
	
	var _Feature2 = _interopRequireDefault(_Feature);
	
	var _Proxy = __webpack_require__(157);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ResourceLoader = function () {
	    function ResourceLoader(options, logger, window) {
	        _classCallCheck(this, ResourceLoader);
	
	        this.options = options;
	        this._window = window;
	        this.origin = this.getOrigin(window.location.href);
	        this.cache = {};
	        this.logger = logger;
	        this._index = 0;
	    }
	
	    _createClass(ResourceLoader, [{
	        key: 'loadImage',
	        value: function loadImage(src) {
	            var _this = this;
	
	            if (this.hasResourceInCache(src)) {
	                return src;
	            }
	
	            if (!isSVG(src) || _Feature2.default.SUPPORT_SVG_DRAWING) {
	                if (this.options.allowTaint === true || isInlineImage(src) || this.isSameOrigin(src)) {
	                    return this.addImage(src, src, false);
	                } else if (!this.isSameOrigin(src)) {
	                    if (typeof this.options.proxy === 'string') {
	                        this.cache[src] = (0, _Proxy.Proxy)(src, this.options).then(function (src) {
	                            return _loadImage(src, _this.options.imageTimeout || 0);
	                        });
	                        return src;
	                    } else if (this.options.useCORS === true && _Feature2.default.SUPPORT_CORS_IMAGES) {
	                        return this.addImage(src, src, true);
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'inlineImage',
	        value: function inlineImage(src) {
	            var _this2 = this;
	
	            if (isInlineImage(src)) {
	                return _loadImage(src, this.options.imageTimeout || 0);
	            }
	            if (this.hasResourceInCache(src)) {
	                return this.cache[src];
	            }
	            if (!this.isSameOrigin(src) && typeof this.options.proxy === 'string') {
	                return this.cache[src] = (0, _Proxy.Proxy)(src, this.options).then(function (src) {
	                    return _loadImage(src, _this2.options.imageTimeout || 0);
	                });
	            }
	
	            return this.xhrImage(src);
	        }
	    }, {
	        key: 'xhrImage',
	        value: function xhrImage(src) {
	            var _this3 = this;
	
	            this.cache[src] = new Promise(function (resolve, reject) {
	                var xhr = new XMLHttpRequest();
	                xhr.onreadystatechange = function () {
	                    if (xhr.readyState === 4) {
	                        if (xhr.status !== 200) {
	                            reject('Failed to fetch image ' + src.substring(0, 256) + ' with status code ' + xhr.status);
	                        } else {
	                            var reader = new FileReader();
	                            reader.addEventListener('load', function () {
	                                // $FlowFixMe
	                                var result = reader.result;
	                                resolve(result);
	                            }, false);
	                            reader.addEventListener('error', function (e) {
	                                return reject(e);
	                            }, false);
	                            reader.readAsDataURL(xhr.response);
	                        }
	                    }
	                };
	                xhr.responseType = 'blob';
	                if (_this3.options.imageTimeout) {
	                    var timeout = _this3.options.imageTimeout;
	                    xhr.timeout = timeout;
	                    xhr.ontimeout = function () {
	                        return reject( false ? 'Timed out (' + timeout + 'ms) fetching ' + src.substring(0, 256) : '');
	                    };
	                }
	                xhr.open('GET', src, true);
	                xhr.send();
	            }).then(function (src) {
	                return _loadImage(src, _this3.options.imageTimeout || 0);
	            });
	
	            return this.cache[src];
	        }
	    }, {
	        key: 'loadCanvas',
	        value: function loadCanvas(node) {
	            var key = String(this._index++);
	            this.cache[key] = Promise.resolve(node);
	            return key;
	        }
	    }, {
	        key: 'hasResourceInCache',
	        value: function hasResourceInCache(key) {
	            return typeof this.cache[key] !== 'undefined';
	        }
	    }, {
	        key: 'addImage',
	        value: function addImage(key, src, useCORS) {
	            var _this4 = this;
	
	            if (false) {
	                this.logger.log('Added image ' + key.substring(0, 256));
	            }
	
	            var imageLoadHandler = function imageLoadHandler(supportsDataImages) {
	                return new Promise(function (resolve, reject) {
	                    var img = new Image();
	                    img.onload = function () {
	                        return resolve(img);
	                    };
	                    //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
	                    if (!supportsDataImages || useCORS) {
	                        img.crossOrigin = 'anonymous';
	                    }
	
	                    img.onerror = reject;
	                    img.src = src;
	                    if (img.complete === true) {
	                        // Inline XML images may fail to parse, throwing an Error later on
	                        setTimeout(function () {
	                            resolve(img);
	                        }, 500);
	                    }
	                    if (_this4.options.imageTimeout) {
	                        var timeout = _this4.options.imageTimeout;
	                        setTimeout(function () {
	                            return reject( false ? 'Timed out (' + timeout + 'ms) fetching ' + src.substring(0, 256) : '');
	                        }, timeout);
	                    }
	                });
	            };
	
	            this.cache[key] = isInlineBase64Image(src) && !isSVG(src) ? // $FlowFixMe
	            _Feature2.default.SUPPORT_BASE64_DRAWING(src).then(imageLoadHandler) : imageLoadHandler(true);
	            return key;
	        }
	    }, {
	        key: 'isSameOrigin',
	        value: function isSameOrigin(url) {
	            return this.getOrigin(url) === this.origin;
	        }
	    }, {
	        key: 'getOrigin',
	        value: function getOrigin(url) {
	            var link = this._link || (this._link = this._window.document.createElement('a'));
	            link.href = url;
	            link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
	            return link.protocol + link.hostname + link.port;
	        }
	    }, {
	        key: 'ready',
	        value: function ready() {
	            var _this5 = this;
	
	            var keys = Object.keys(this.cache);
	            var values = keys.map(function (str) {
	                return _this5.cache[str].catch(function (e) {
	                    if (false) {
	                        _this5.logger.log('Unable to load image', e);
	                    }
	                    return null;
	                });
	            });
	            return Promise.all(values).then(function (images) {
	                if (false) {
	                    _this5.logger.log('Finished loading ' + images.length + ' images', images);
	                }
	                return new ResourceStore(keys, images);
	            });
	        }
	    }]);
	
	    return ResourceLoader;
	}();
	
	exports.default = ResourceLoader;
	
	var ResourceStore = exports.ResourceStore = function () {
	    function ResourceStore(keys, resources) {
	        _classCallCheck(this, ResourceStore);
	
	        this._keys = keys;
	        this._resources = resources;
	    }
	
	    _createClass(ResourceStore, [{
	        key: 'get',
	        value: function get(key) {
	            var index = this._keys.indexOf(key);
	            return index === -1 ? null : this._resources[index];
	        }
	    }]);
	
	    return ResourceStore;
	}();
	
	var INLINE_SVG = /^data:image\/svg\+xml/i;
	var INLINE_BASE64 = /^data:image\/.*;base64,/i;
	var INLINE_IMG = /^data:image\/.*/i;
	
	var isInlineImage = function isInlineImage(src) {
	    return INLINE_IMG.test(src);
	};
	var isInlineBase64Image = function isInlineBase64Image(src) {
	    return INLINE_BASE64.test(src);
	};
	
	var isSVG = function isSVG(src) {
	    return src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);
	};
	
	var _loadImage = function _loadImage(src, timeout) {
	    return new Promise(function (resolve, reject) {
	        var img = new Image();
	        img.onload = function () {
	            return resolve(img);
	        };
	        img.onerror = reject;
	        img.src = src;
	        if (img.complete === true) {
	            // Inline XML images may fail to parse, throwing an Error later on
	            setTimeout(function () {
	                resolve(img);
	            }, 500);
	        }
	        if (timeout) {
	            setTimeout(function () {
	                return reject( false ? 'Timed out (' + timeout + 'ms) loading image' : '');
	            }, timeout);
	        }
	    });
	};

/***/ }),

/***/ 316:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _NodeContainer = __webpack_require__(52);
	
	var _NodeContainer2 = _interopRequireDefault(_NodeContainer);
	
	var _position = __webpack_require__(161);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var StackingContext = function () {
	    function StackingContext(container, parent, treatAsRealStackingContext) {
	        _classCallCheck(this, StackingContext);
	
	        this.container = container;
	        this.parent = parent;
	        this.contexts = [];
	        this.children = [];
	        this.treatAsRealStackingContext = treatAsRealStackingContext;
	    }
	
	    _createClass(StackingContext, [{
	        key: 'getOpacity',
	        value: function getOpacity() {
	            return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity;
	        }
	    }, {
	        key: 'getRealParentStackingContext',
	        value: function getRealParentStackingContext() {
	            return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext();
	        }
	    }]);
	
	    return StackingContext;
	}();
	
	exports.default = StackingContext;

/***/ }),

/***/ 317:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var fromCodePoint = exports.fromCodePoint = function fromCodePoint() {
	    if (String.fromCodePoint) {
	        return String.fromCodePoint.apply(String, arguments);
	    }
	
	    var length = arguments.length;
	    if (!length) {
	        return '';
	    }
	
	    var codeUnits = [];
	
	    var index = -1;
	    var result = '';
	    while (++index < length) {
	        var codePoint = arguments.length <= index ? undefined : arguments[index];
	        if (codePoint <= 0xffff) {
	            codeUnits.push(codePoint);
	        } else {
	            codePoint -= 0x10000;
	            codeUnits.push((codePoint >> 10) + 0xd800, codePoint % 0x400 + 0xdc00);
	        }
	        if (index + 1 === length || codeUnits.length > 0x4000) {
	            result += String.fromCharCode.apply(String, codeUnits);
	            codeUnits.length = 0;
	        }
	    }
	    return result;
	};

/***/ }),

/***/ 318:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.renderElement = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _Logger = __webpack_require__(156);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	var _NodeParser = __webpack_require__(313);
	
	var _Renderer = __webpack_require__(314);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	var _ForeignObjectRenderer = __webpack_require__(164);
	
	var _ForeignObjectRenderer2 = _interopRequireDefault(_ForeignObjectRenderer);
	
	var _Feature = __webpack_require__(68);
	
	var _Feature2 = _interopRequireDefault(_Feature);
	
	var _Bounds = __webpack_require__(24);
	
	var _Clone = __webpack_require__(311);
	
	var _Font = __webpack_require__(153);
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var renderElement = exports.renderElement = function renderElement(element, options, logger) {
	    var ownerDocument = element.ownerDocument;
	
	    var windowBounds = new _Bounds.Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);
	
	    // http://www.w3.org/TR/css3-background/#special-backgrounds
	    var documentBackgroundColor = ownerDocument.documentElement ? new _Color2.default(getComputedStyle(ownerDocument.documentElement).backgroundColor) : _Color.TRANSPARENT;
	    var bodyBackgroundColor = ownerDocument.body ? new _Color2.default(getComputedStyle(ownerDocument.body).backgroundColor) : _Color.TRANSPARENT;
	
	    var backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new _Color2.default(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new _Color2.default(options.backgroundColor) : null;
	
	    return (options.foreignObjectRendering ? // $FlowFixMe
	    _Feature2.default.SUPPORT_FOREIGNOBJECT_DRAWING : Promise.resolve(false)).then(function (supportForeignObject) {
	        return supportForeignObject ? function (cloner) {
	            if (false) {
	                logger.log('Document cloned, using foreignObject rendering');
	            }
	
	            return cloner.inlineFonts(ownerDocument).then(function () {
	                return cloner.resourceLoader.ready();
	            }).then(function () {
	                var renderer = new _ForeignObjectRenderer2.default(cloner.documentElement);
	                return renderer.render({
	                    backgroundColor: backgroundColor,
	                    logger: logger,
	                    scale: options.scale,
	                    x: options.x,
	                    y: options.y,
	                    width: options.width,
	                    height: options.height,
	                    windowWidth: options.windowWidth,
	                    windowHeight: options.windowHeight,
	                    scrollX: options.scrollX,
	                    scrollY: options.scrollY
	                });
	            });
	        }(new _Clone.DocumentCloner(element, options, logger, true, renderElement)) : (0, _Clone.cloneWindow)(ownerDocument, windowBounds, element, options, logger, renderElement).then(function (_ref) {
	            var _ref2 = _slicedToArray(_ref, 3),
	                container = _ref2[0],
	                clonedElement = _ref2[1],
	                resourceLoader = _ref2[2];
	
	            if (false) {
	                logger.log('Document cloned, using computed rendering');
	            }
	
	            var stack = (0, _NodeParser.NodeParser)(clonedElement, resourceLoader, logger);
	            var clonedDocument = clonedElement.ownerDocument;
	
	            if (backgroundColor === stack.container.style.background.backgroundColor) {
	                stack.container.style.background.backgroundColor = _Color.TRANSPARENT;
	            }
	
	            return resourceLoader.ready().then(function (imageStore) {
	                var fontMetrics = new _Font.FontMetrics(clonedDocument);
	                if (false) {
	                    logger.log('Starting renderer');
	                }
	
	                var renderOptions = {
	                    backgroundColor: backgroundColor,
	                    fontMetrics: fontMetrics,
	                    imageStore: imageStore,
	                    logger: logger,
	                    scale: options.scale,
	                    x: options.x,
	                    y: options.y,
	                    width: options.width,
	                    height: options.height
	                };
	
	                if (Array.isArray(options.target)) {
	                    return Promise.all(options.target.map(function (target) {
	                        var renderer = new _Renderer2.default(target, renderOptions);
	                        return renderer.render(stack);
	                    }));
	                } else {
	                    var renderer = new _Renderer2.default(options.target, renderOptions);
	                    var canvas = renderer.render(stack);
	                    if (options.removeContainer === true) {
	                        if (container.parentNode) {
	                            container.parentNode.removeChild(container);
	                        } else if (false) {
	                            logger.log('Cannot detach cloned iframe as it is not in the DOM anymore');
	                        }
	                    }
	
	                    return canvas;
	                }
	            });
	        });
	    });
	};

/***/ }),

/***/ 319:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Path = __webpack_require__(70);
	
	var _Vector = __webpack_require__(71);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var lerp = function lerp(a, b, t) {
	    return new _Vector2.default(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
	};
	
	var BezierCurve = function () {
	    function BezierCurve(start, startControl, endControl, end) {
	        _classCallCheck(this, BezierCurve);
	
	        this.type = _Path.PATH.BEZIER_CURVE;
	        this.start = start;
	        this.startControl = startControl;
	        this.endControl = endControl;
	        this.end = end;
	    }
	
	    _createClass(BezierCurve, [{
	        key: 'subdivide',
	        value: function subdivide(t, firstHalf) {
	            var ab = lerp(this.start, this.startControl, t);
	            var bc = lerp(this.startControl, this.endControl, t);
	            var cd = lerp(this.endControl, this.end, t);
	            var abbc = lerp(ab, bc, t);
	            var bccd = lerp(bc, cd, t);
	            var dest = lerp(abbc, bccd, t);
	            return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
	        }
	    }, {
	        key: 'reverse',
	        value: function reverse() {
	            return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
	        }
	    }]);
	
	    return BezierCurve;
	}();
	
	exports.default = BezierCurve;

/***/ }),

/***/ 320:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Path = __webpack_require__(70);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Circle = function Circle(x, y, radius) {
	    _classCallCheck(this, Circle);
	
	    this.type = _Path.PATH.CIRCLE;
	    this.x = x;
	    this.y = y;
	    this.radius = radius;
	    if (false) {
	        if (isNaN(x)) {
	            console.error('Invalid x value given for Circle');
	        }
	        if (isNaN(y)) {
	            console.error('Invalid y value given for Circle');
	        }
	        if (isNaN(radius)) {
	            console.error('Invalid radius value given for Circle');
	        }
	    }
	};
	
	exports.default = Circle;

/***/ }),

/***/ 321:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Size = function Size(width, height) {
	    _classCallCheck(this, Size);
	
	    this.width = width;
	    this.height = height;
	};
	
	exports.default = Size;

/***/ }),

/***/ 322:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _CanvasRenderer = __webpack_require__(163);
	
	var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);
	
	var _Logger = __webpack_require__(156);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	var _Window = __webpack_require__(318);
	
	var _Bounds = __webpack_require__(24);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var html2canvas = function html2canvas(element, conf) {
	    // eslint-disable-next-line no-console
	    if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && typeof console.log === 'function') {
	        // eslint-disable-next-line no-console
	        console.log('html2canvas ' + "$npm_package_version");
	    }
	
	    var config = conf || {};
	    var logger = new _Logger2.default(typeof config.logging === 'boolean' ? config.logging : true);
	
	    if (false) {
	        logger.error('onrendered option is deprecated, html2canvas returns a Promise with the canvas as the value');
	    }
	
	    var ownerDocument = element.ownerDocument;
	    if (!ownerDocument) {
	        return Promise.reject('Provided element is not within a Document');
	    }
	    var defaultView = ownerDocument.defaultView;
	
	    var scrollX = defaultView.pageXOffset;
	    var scrollY = defaultView.pageYOffset;
	
	    var isDocument = element.tagName === 'HTML' || element.tagName === 'BODY';
	
	    var _ref = isDocument ? (0, _Bounds.parseDocumentSize)(ownerDocument) : (0, _Bounds.parseBounds)(element, scrollX, scrollY),
	        width = _ref.width,
	        height = _ref.height,
	        left = _ref.left,
	        top = _ref.top;
	
	    var defaultOptions = {
	        async: true,
	        allowTaint: false,
	        backgroundColor: '#ffffff',
	        imageTimeout: 15000,
	        logging: true,
	        proxy: null,
	        removeContainer: true,
	        foreignObjectRendering: false,
	        scale: defaultView.devicePixelRatio || 1,
	        target: new _CanvasRenderer2.default(config.canvas),
	        useCORS: false,
	        x: left,
	        y: top,
	        width: Math.ceil(width),
	        height: Math.ceil(height),
	        windowWidth: defaultView.innerWidth,
	        windowHeight: defaultView.innerHeight,
	        scrollX: defaultView.pageXOffset,
	        scrollY: defaultView.pageYOffset
	    };
	
	    var result = (0, _Window.renderElement)(element, _extends({}, defaultOptions, config), logger);
	
	    if (false) {
	        return result.catch(function (e) {
	            logger.error(e);
	            throw e;
	        });
	    }
	    return result;
	};
	
	html2canvas.CanvasRenderer = _CanvasRenderer2.default;
	
	module.exports = html2canvas;

/***/ }),

/***/ 323:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseBorderRadius = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SIDES = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
	
	var parseBorderRadius = exports.parseBorderRadius = function parseBorderRadius(style) {
	    return SIDES.map(function (side) {
	        var value = style.getPropertyValue('border-' + side + '-radius');
	
	        var _value$split$map = value.split(' ').map(_Length2.default.create),
	            _value$split$map2 = _slicedToArray(_value$split$map, 2),
	            horizontal = _value$split$map2[0],
	            vertical = _value$split$map2[1];
	
	        return typeof vertical === 'undefined' ? [horizontal, horizontal] : [horizontal, vertical];
	    });
	};

/***/ }),

/***/ 324:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var DISPLAY = exports.DISPLAY = {
	    NONE: 1 << 0,
	    BLOCK: 1 << 1,
	    INLINE: 1 << 2,
	    RUN_IN: 1 << 3,
	    FLOW: 1 << 4,
	    FLOW_ROOT: 1 << 5,
	    TABLE: 1 << 6,
	    FLEX: 1 << 7,
	    GRID: 1 << 8,
	    RUBY: 1 << 9,
	    SUBGRID: 1 << 10,
	    LIST_ITEM: 1 << 11,
	    TABLE_ROW_GROUP: 1 << 12,
	    TABLE_HEADER_GROUP: 1 << 13,
	    TABLE_FOOTER_GROUP: 1 << 14,
	    TABLE_ROW: 1 << 15,
	    TABLE_CELL: 1 << 16,
	    TABLE_COLUMN_GROUP: 1 << 17,
	    TABLE_COLUMN: 1 << 18,
	    TABLE_CAPTION: 1 << 19,
	    RUBY_BASE: 1 << 20,
	    RUBY_TEXT: 1 << 21,
	    RUBY_BASE_CONTAINER: 1 << 22,
	    RUBY_TEXT_CONTAINER: 1 << 23,
	    CONTENTS: 1 << 24,
	    INLINE_BLOCK: 1 << 25,
	    INLINE_LIST_ITEM: 1 << 26,
	    INLINE_TABLE: 1 << 27,
	    INLINE_FLEX: 1 << 28,
	    INLINE_GRID: 1 << 29
	};
	
	var parseDisplayValue = function parseDisplayValue(display) {
	    switch (display) {
	        case 'block':
	            return DISPLAY.BLOCK;
	        case 'inline':
	            return DISPLAY.INLINE;
	        case 'run-in':
	            return DISPLAY.RUN_IN;
	        case 'flow':
	            return DISPLAY.FLOW;
	        case 'flow-root':
	            return DISPLAY.FLOW_ROOT;
	        case 'table':
	            return DISPLAY.TABLE;
	        case 'flex':
	            return DISPLAY.FLEX;
	        case 'grid':
	            return DISPLAY.GRID;
	        case 'ruby':
	            return DISPLAY.RUBY;
	        case 'subgrid':
	            return DISPLAY.SUBGRID;
	        case 'list-item':
	            return DISPLAY.LIST_ITEM;
	        case 'table-row-group':
	            return DISPLAY.TABLE_ROW_GROUP;
	        case 'table-header-group':
	            return DISPLAY.TABLE_HEADER_GROUP;
	        case 'table-footer-group':
	            return DISPLAY.TABLE_FOOTER_GROUP;
	        case 'table-row':
	            return DISPLAY.TABLE_ROW;
	        case 'table-cell':
	            return DISPLAY.TABLE_CELL;
	        case 'table-column-group':
	            return DISPLAY.TABLE_COLUMN_GROUP;
	        case 'table-column':
	            return DISPLAY.TABLE_COLUMN;
	        case 'table-caption':
	            return DISPLAY.TABLE_CAPTION;
	        case 'ruby-base':
	            return DISPLAY.RUBY_BASE;
	        case 'ruby-text':
	            return DISPLAY.RUBY_TEXT;
	        case 'ruby-base-container':
	            return DISPLAY.RUBY_BASE_CONTAINER;
	        case 'ruby-text-container':
	            return DISPLAY.RUBY_TEXT_CONTAINER;
	        case 'contents':
	            return DISPLAY.CONTENTS;
	        case 'inline-block':
	            return DISPLAY.INLINE_BLOCK;
	        case 'inline-list-item':
	            return DISPLAY.INLINE_LIST_ITEM;
	        case 'inline-table':
	            return DISPLAY.INLINE_TABLE;
	        case 'inline-flex':
	            return DISPLAY.INLINE_FLEX;
	        case 'inline-grid':
	            return DISPLAY.INLINE_GRID;
	    }
	
	    return DISPLAY.NONE;
	};
	
	var setDisplayBit = function setDisplayBit(bit, display) {
	    return bit | parseDisplayValue(display);
	};
	
	var parseDisplay = exports.parseDisplay = function parseDisplay(display) {
	    return display.split(' ').reduce(setDisplayBit, 0);
	};

/***/ }),

/***/ 325:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var FLOAT = exports.FLOAT = {
	    NONE: 0,
	    LEFT: 1,
	    RIGHT: 2,
	    INLINE_START: 3,
	    INLINE_END: 4
	};
	
	var parseCSSFloat = exports.parseCSSFloat = function parseCSSFloat(float) {
	    switch (float) {
	        case 'left':
	            return FLOAT.LEFT;
	        case 'right':
	            return FLOAT.RIGHT;
	        case 'inline-start':
	            return FLOAT.INLINE_START;
	        case 'inline-end':
	            return FLOAT.INLINE_END;
	    }
	    return FLOAT.NONE;
	};

/***/ }),

/***/ 326:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	
	var parseFontWeight = function parseFontWeight(weight) {
	    switch (weight) {
	        case 'normal':
	            return 400;
	        case 'bold':
	            return 700;
	    }
	
	    var value = parseInt(weight, 10);
	    return isNaN(value) ? 400 : value;
	};
	
	var parseFont = exports.parseFont = function parseFont(style) {
	    var fontFamily = style.fontFamily;
	    var fontSize = style.fontSize;
	    var fontStyle = style.fontStyle;
	    var fontVariant = style.fontVariant;
	    var fontWeight = parseFontWeight(style.fontWeight);
	
	    return {
	        fontFamily: fontFamily,
	        fontSize: fontSize,
	        fontStyle: fontStyle,
	        fontVariant: fontVariant,
	        fontWeight: fontWeight
	    };
	};

/***/ }),

/***/ 327:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var parseLetterSpacing = exports.parseLetterSpacing = function parseLetterSpacing(letterSpacing) {
	    if (letterSpacing === 'normal') {
	        return 0;
	    }
	    var value = parseFloat(letterSpacing);
	    return isNaN(value) ? 0 : value;
	};

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseMargin = undefined;
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SIDES = ['top', 'right', 'bottom', 'left'];
	
	var parseMargin = exports.parseMargin = function parseMargin(style) {
	    return SIDES.map(function (side) {
	        return new _Length2.default(style.getPropertyValue('margin-' + side));
	    });
	};

/***/ }),

/***/ 329:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var OVERFLOW = exports.OVERFLOW = {
	    VISIBLE: 0,
	    HIDDEN: 1,
	    SCROLL: 2,
	    AUTO: 3
	};
	
	var parseOverflow = exports.parseOverflow = function parseOverflow(overflow) {
	    switch (overflow) {
	        case 'hidden':
	            return OVERFLOW.HIDDEN;
	        case 'scroll':
	            return OVERFLOW.SCROLL;
	        case 'auto':
	            return OVERFLOW.AUTO;
	        case 'visible':
	        default:
	            return OVERFLOW.VISIBLE;
	    }
	};

/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseTextShadow = undefined;
	
	var _Color = __webpack_require__(25);
	
	var _Color2 = _interopRequireDefault(_Color);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NUMBER = /^([+-]|\d|\.)$/i;
	
	var parseTextShadow = exports.parseTextShadow = function parseTextShadow(textShadow) {
	    if (textShadow === 'none' || typeof textShadow !== 'string') {
	        return null;
	    }
	
	    var currentValue = '';
	    var isLength = false;
	    var values = [];
	    var shadows = [];
	    var numParens = 0;
	    var color = null;
	
	    var appendValue = function appendValue() {
	        if (currentValue.length) {
	            if (isLength) {
	                values.push(parseFloat(currentValue));
	            } else {
	                color = new _Color2.default(currentValue);
	            }
	        }
	        isLength = false;
	        currentValue = '';
	    };
	
	    var appendShadow = function appendShadow() {
	        if (values.length && color !== null) {
	            shadows.push({
	                color: color,
	                offsetX: values[0] || 0,
	                offsetY: values[1] || 0,
	                blur: values[2] || 0
	            });
	        }
	        values.splice(0, values.length);
	        color = null;
	    };
	
	    for (var i = 0; i < textShadow.length; i++) {
	        var c = textShadow[i];
	        switch (c) {
	            case '(':
	                currentValue += c;
	                numParens++;
	                break;
	            case ')':
	                currentValue += c;
	                numParens--;
	                break;
	            case ',':
	                if (numParens === 0) {
	                    appendValue();
	                    appendShadow();
	                } else {
	                    currentValue += c;
	                }
	                break;
	            case ' ':
	                if (numParens === 0) {
	                    appendValue();
	                } else {
	                    currentValue += c;
	                }
	                break;
	            default:
	                if (currentValue.length === 0 && NUMBER.test(c)) {
	                    isLength = true;
	                }
	                currentValue += c;
	        }
	    }
	
	    appendValue();
	    appendShadow();
	
	    if (shadows.length === 0) {
	        return null;
	    }
	
	    return shadows;
	};

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseTransform = undefined;
	
	var _Length = __webpack_require__(35);
	
	var _Length2 = _interopRequireDefault(_Length);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var toFloat = function toFloat(s) {
	    return parseFloat(s.trim());
	};
	
	var MATRIX = /(matrix|matrix3d)\((.+)\)/;
	
	var parseTransform = exports.parseTransform = function parseTransform(style) {
	    var transform = parseTransformMatrix(style.transform || style.webkitTransform || style.mozTransform ||
	    // $FlowFixMe
	    style.msTransform ||
	    // $FlowFixMe
	    style.oTransform);
	    if (transform === null) {
	        return null;
	    }
	
	    return {
	        transform: transform,
	        transformOrigin: parseTransformOrigin(style.transformOrigin || style.webkitTransformOrigin || style.mozTransformOrigin ||
	        // $FlowFixMe
	        style.msTransformOrigin ||
	        // $FlowFixMe
	        style.oTransformOrigin)
	    };
	};
	
	// $FlowFixMe
	var parseTransformOrigin = function parseTransformOrigin(origin) {
	    if (typeof origin !== 'string') {
	        var v = new _Length2.default('0');
	        return [v, v];
	    }
	    var values = origin.split(' ').map(_Length2.default.create);
	    return [values[0], values[1]];
	};
	
	// $FlowFixMe
	var parseTransformMatrix = function parseTransformMatrix(transform) {
	    if (transform === 'none' || typeof transform !== 'string') {
	        return null;
	    }
	
	    var match = transform.match(MATRIX);
	    if (match) {
	        if (match[1] === 'matrix') {
	            var matrix = match[2].split(',').map(toFloat);
	            return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
	        } else {
	            var matrix3d = match[2].split(',').map(toFloat);
	            return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
	        }
	    }
	    return null;
	};

/***/ }),

/***/ 332:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var VISIBILITY = exports.VISIBILITY = {
	    VISIBLE: 0,
	    HIDDEN: 1,
	    COLLAPSE: 2
	};
	
	var parseVisibility = exports.parseVisibility = function parseVisibility(visibility) {
	    switch (visibility) {
	        case 'hidden':
	            return VISIBILITY.HIDDEN;
	        case 'collapse':
	            return VISIBILITY.COLLAPSE;
	        case 'visible':
	        default:
	            return VISIBILITY.VISIBLE;
	    }
	};

/***/ }),

/***/ 333:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var parseZIndex = exports.parseZIndex = function parseZIndex(zIndex) {
	    var auto = zIndex === 'auto';
	    return {
	        auto: auto,
	        order: auto ? 0 : parseInt(zIndex, 10)
	    };
	};

/***/ }),

/***/ 334:
/***/ (function(module, exports) {

	'use strict';
	
	/** Highest positive signed 32-bit float value */
	const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	
	/** Bootstring parameters */
	const base = 36;
	const tMin = 1;
	const tMax = 26;
	const skew = 38;
	const damp = 700;
	const initialBias = 72;
	const initialN = 128; // 0x80
	const delimiter = '-'; // '\x2D'
	
	/** Regular expressions */
	const regexPunycode = /^xn--/;
	const regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
	const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	
	/** Error messages */
	const errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	};
	
	/** Convenience shortcuts */
	const baseMinusTMin = base - tMin;
	const floor = Math.floor;
	const stringFromCharCode = String.fromCharCode;
	
	/*--------------------------------------------------------------------------*/
	
	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}
	
	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		const result = [];
		let length = array.length;
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}
	
	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		const parts = string.split('@');
		let result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		const labels = string.split('.');
		const encoded = map(labels, fn).join('.');
		return result + encoded;
	}
	
	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		const output = [];
		let counter = 0;
		const length = string.length;
		while (counter < length) {
			const value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// It's a high surrogate, and there is a next character.
				const extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// It's an unmatched surrogate; only append this code unit, in case the
					// next code unit is the high surrogate of a surrogate pair.
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}
	
	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	const ucs2encode = array => String.fromCodePoint(...array);
	
	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	const basicToDigit = function(codePoint) {
		if (codePoint - 0x30 < 0x0A) {
			return codePoint - 0x16;
		}
		if (codePoint - 0x41 < 0x1A) {
			return codePoint - 0x41;
		}
		if (codePoint - 0x61 < 0x1A) {
			return codePoint - 0x61;
		}
		return base;
	};
	
	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	const digitToBasic = function(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	};
	
	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	const adapt = function(delta, numPoints, firstTime) {
		let k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};
	
	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	const decode = function(input) {
		// Don't use UCS-2.
		const output = [];
		const inputLength = input.length;
		let i = 0;
		let n = initialN;
		let bias = initialBias;
	
		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.
	
		let basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}
	
		for (let j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}
	
		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.
	
		for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
	
			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			let oldi = i;
			for (let w = 1, k = base; /* no condition */; k += base) {
	
				if (index >= inputLength) {
					error('invalid-input');
				}
	
				const digit = basicToDigit(input.charCodeAt(index++));
	
				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}
	
				i += digit * w;
				const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	
				if (digit < t) {
					break;
				}
	
				const baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}
	
				w *= baseMinusT;
	
			}
	
			const out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);
	
			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}
	
			n += floor(i / out);
			i %= out;
	
			// Insert `n` at position `i` of the output.
			output.splice(i++, 0, n);
	
		}
	
		return String.fromCodePoint(...output);
	};
	
	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	const encode = function(input) {
		const output = [];
	
		// Convert the input in UCS-2 to an array of Unicode code points.
		input = ucs2decode(input);
	
		// Cache the length.
		let inputLength = input.length;
	
		// Initialize the state.
		let n = initialN;
		let delta = 0;
		let bias = initialBias;
	
		// Handle the basic code points.
		for (const currentValue of input) {
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}
	
		let basicLength = output.length;
		let handledCPCount = basicLength;
	
		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.
	
		// Finish the basic string with a delimiter unless it's empty.
		if (basicLength) {
			output.push(delimiter);
		}
	
		// Main encoding loop:
		while (handledCPCount < inputLength) {
	
			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			let m = maxInt;
			for (const currentValue of input) {
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}
	
			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow.
			const handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}
	
			delta += (m - n) * handledCPCountPlusOne;
			n = m;
	
			for (const currentValue of input) {
				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}
				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer.
					let q = delta;
					for (let k = base; /* no condition */; k += base) {
						const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						const qMinusT = q - t;
						const baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}
	
					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
	
			++delta;
			++n;
	
		}
		return output.join('');
	};
	
	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	const toUnicode = function(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	};
	
	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	const toASCII = function(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	};
	
	/*--------------------------------------------------------------------------*/
	
	/** Define the public API */
	const punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '2.1.0',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};
	
	module.exports = punycode;


/***/ }),

/***/ 445:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	* svg.js - A lightweight library for manipulating and animating SVG.
	* @version 2.6.3
	* https://svgdotjs.github.io/
	*
	* @copyright Wout Fierens <wout@mick-wout.com>
	* @license MIT
	*
	* BUILT: Fri Jul 21 2017 14:50:37 GMT+0200 (Mitteleuropäische Sommerzeit)
	*/;
	(function(root, factory) {
	  /* istanbul ignore next */
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	      return factory(root, root.document)
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  } else if (typeof exports === 'object') {
	    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
	  } else {
	    root.SVG = factory(root, root.document)
	  }
	}(typeof window !== "undefined" ? window : this, function(window, document) {
	
	// The main wrapping element
	var SVG = this.SVG = function(element) {
	  if (SVG.supported) {
	    element = new SVG.Doc(element)
	
	    if(!SVG.parser.draw)
	      SVG.prepare()
	
	    return element
	  }
	}
	
	// Default namespaces
	SVG.ns    = 'http://www.w3.org/2000/svg'
	SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
	SVG.xlink = 'http://www.w3.org/1999/xlink'
	SVG.svgjs = 'http://svgjs.com/svgjs'
	
	// Svg support test
	SVG.supported = (function() {
	  return !! document.createElementNS &&
	         !! document.createElementNS(SVG.ns,'svg').createSVGRect
	})()
	
	// Don't bother to continue if SVG is not supported
	if (!SVG.supported) return false
	
	// Element id sequence
	SVG.did  = 1000
	
	// Get next named element id
	SVG.eid = function(name) {
	  return 'Svgjs' + capitalize(name) + (SVG.did++)
	}
	
	// Method for element creation
	SVG.create = function(name) {
	  // create element
	  var element = document.createElementNS(this.ns, name)
	
	  // apply unique id
	  element.setAttribute('id', this.eid(name))
	
	  return element
	}
	
	// Method for extending objects
	SVG.extend = function() {
	  var modules, methods, key, i
	
	  // Get list of modules
	  modules = [].slice.call(arguments)
	
	  // Get object with extensions
	  methods = modules.pop()
	
	  for (i = modules.length - 1; i >= 0; i--)
	    if (modules[i])
	      for (key in methods)
	        modules[i].prototype[key] = methods[key]
	
	  // Make sure SVG.Set inherits any newly added methods
	  if (SVG.Set && SVG.Set.inherit)
	    SVG.Set.inherit()
	}
	
	// Invent new element
	SVG.invent = function(config) {
	  // Create element initializer
	  var initializer = typeof config.create == 'function' ?
	    config.create :
	    function() {
	      this.constructor.call(this, SVG.create(config.create))
	    }
	
	  // Inherit prototype
	  if (config.inherit)
	    initializer.prototype = new config.inherit
	
	  // Extend with methods
	  if (config.extend)
	    SVG.extend(initializer, config.extend)
	
	  // Attach construct method to parent
	  if (config.construct)
	    SVG.extend(config.parent || SVG.Container, config.construct)
	
	  return initializer
	}
	
	// Adopt existing svg elements
	SVG.adopt = function(node) {
	  // check for presence of node
	  if (!node) return null
	
	  // make sure a node isn't already adopted
	  if (node.instance) return node.instance
	
	  // initialize variables
	  var element
	
	  // adopt with element-specific settings
	  if (node.nodeName == 'svg')
	    element = node.parentNode instanceof window.SVGElement ? new SVG.Nested : new SVG.Doc
	  else if (node.nodeName == 'linearGradient')
	    element = new SVG.Gradient('linear')
	  else if (node.nodeName == 'radialGradient')
	    element = new SVG.Gradient('radial')
	  else if (SVG[capitalize(node.nodeName)])
	    element = new SVG[capitalize(node.nodeName)]
	  else
	    element = new SVG.Element(node)
	
	  // ensure references
	  element.type  = node.nodeName
	  element.node  = node
	  node.instance = element
	
	  // SVG.Class specific preparations
	  if (element instanceof SVG.Doc)
	    element.namespace().defs()
	
	  // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
	  element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})
	
	  return element
	}
	
	// Initialize parsing element
	SVG.prepare = function() {
	  // Select document body and create invisible svg element
	  var body = document.getElementsByTagName('body')[0]
	    , draw = (body ? new SVG.Doc(body) : SVG.adopt(document.documentElement).nested()).size(2, 0)
	
	  // Create parser object
	  SVG.parser = {
	    body: body || document.documentElement
	  , draw: draw.style('opacity:0;position:absolute;left:-100%;top:-100%;overflow:hidden').node
	  , poly: draw.polyline().node
	  , path: draw.path().node
	  , native: SVG.create('svg')
	  }
	}
	
	SVG.parser = {
	  native: SVG.create('svg')
	}
	
	document.addEventListener('DOMContentLoaded', function() {
	  if(!SVG.parser.draw)
	    SVG.prepare()
	}, false)
	
	// Storage for regular expressions
	SVG.regex = {
	  // Parse unit value
	  numberAndUnit:    /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i
	
	  // Parse hex value
	, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
	
	  // Parse rgb value
	, rgb:              /rgb\((\d+),(\d+),(\d+)\)/
	
	  // Parse reference id
	, reference:        /#([a-z0-9\-_]+)/i
	
	  // splits a transformation chain
	, transforms:       /\)\s*,?\s*/
	
	  // Whitespace
	, whitespace:       /\s/g
	
	  // Test hex value
	, isHex:            /^#[a-f0-9]{3,6}$/i
	
	  // Test rgb value
	, isRgb:            /^rgb\(/
	
	  // Test css declaration
	, isCss:            /[^:]+:[^;]+;?/
	
	  // Test for blank string
	, isBlank:          /^(\s+)?$/
	
	  // Test for numeric string
	, isNumber:         /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i
	
	  // Test for percent value
	, isPercent:        /^-?[\d\.]+%$/
	
	  // Test for image url
	, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i
	
	  // split at whitespace and comma
	, delimiter:        /[\s,]+/
	
	  // The following regex are used to parse the d attribute of a path
	
	  // Matches all hyphens which are not after an exponent
	, hyphen:           /([^e])\-/gi
	
	  // Replaces and tests for all path letters
	, pathLetters:      /[MLHVCSQTAZ]/gi
	
	  // yes we need this one, too
	, isPathLetter:     /[MLHVCSQTAZ]/i
	
	  // matches 0.154.23.45
	, numbersWithDots:  /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi
	
	  // matches .
	, dots:             /\./g
	}
	
	SVG.utils = {
	  // Map function
	  map: function(array, block) {
	    var i
	      , il = array.length
	      , result = []
	
	    for (i = 0; i < il; i++)
	      result.push(block(array[i]))
	
	    return result
	  }
	
	  // Filter function
	, filter: function(array, block) {
	    var i
	      , il = array.length
	      , result = []
	
	    for (i = 0; i < il; i++)
	      if (block(array[i]))
	        result.push(array[i])
	
	    return result
	  }
	
	  // Degrees to radians
	, radians: function(d) {
	    return d % 360 * Math.PI / 180
	  }
	
	  // Radians to degrees
	, degrees: function(r) {
	    return r * 180 / Math.PI % 360
	  }
	
	, filterSVGElements: function(nodes) {
	    return this.filter( nodes, function(el) { return el instanceof window.SVGElement })
	  }
	
	}
	
	SVG.defaults = {
	  // Default attribute values
	  attrs: {
	    // fill and stroke
	    'fill-opacity':     1
	  , 'stroke-opacity':   1
	  , 'stroke-width':     0
	  , 'stroke-linejoin':  'miter'
	  , 'stroke-linecap':   'butt'
	  , fill:               '#000000'
	  , stroke:             '#000000'
	  , opacity:            1
	    // position
	  , x:                  0
	  , y:                  0
	  , cx:                 0
	  , cy:                 0
	    // size
	  , width:              0
	  , height:             0
	    // radius
	  , r:                  0
	  , rx:                 0
	  , ry:                 0
	    // gradient
	  , offset:             0
	  , 'stop-opacity':     1
	  , 'stop-color':       '#000000'
	    // text
	  , 'font-size':        16
	  , 'font-family':      'Helvetica, Arial, sans-serif'
	  , 'text-anchor':      'start'
	  }
	
	}
	// Module for color convertions
	SVG.Color = function(color) {
	  var match
	
	  // initialize defaults
	  this.r = 0
	  this.g = 0
	  this.b = 0
	
	  if(!color) return
	
	  // parse color
	  if (typeof color === 'string') {
	    if (SVG.regex.isRgb.test(color)) {
	      // get rgb values
	      match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace,''))
	
	      // parse numeric values
	      this.r = parseInt(match[1])
	      this.g = parseInt(match[2])
	      this.b = parseInt(match[3])
	
	    } else if (SVG.regex.isHex.test(color)) {
	      // get hex values
	      match = SVG.regex.hex.exec(fullHex(color))
	
	      // parse numeric values
	      this.r = parseInt(match[1], 16)
	      this.g = parseInt(match[2], 16)
	      this.b = parseInt(match[3], 16)
	
	    }
	
	  } else if (typeof color === 'object') {
	    this.r = color.r
	    this.g = color.g
	    this.b = color.b
	
	  }
	
	}
	
	SVG.extend(SVG.Color, {
	  // Default to hex conversion
	  toString: function() {
	    return this.toHex()
	  }
	  // Build hex value
	, toHex: function() {
	    return '#'
	      + compToHex(this.r)
	      + compToHex(this.g)
	      + compToHex(this.b)
	  }
	  // Build rgb value
	, toRgb: function() {
	    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
	  }
	  // Calculate true brightness
	, brightness: function() {
	    return (this.r / 255 * 0.30)
	         + (this.g / 255 * 0.59)
	         + (this.b / 255 * 0.11)
	  }
	  // Make color morphable
	, morph: function(color) {
	    this.destination = new SVG.Color(color)
	
	    return this
	  }
	  // Get morphed color at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this
	
	    // normalise pos
	    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
	
	    // generate morphed color
	    return new SVG.Color({
	      r: ~~(this.r + (this.destination.r - this.r) * pos)
	    , g: ~~(this.g + (this.destination.g - this.g) * pos)
	    , b: ~~(this.b + (this.destination.b - this.b) * pos)
	    })
	  }
	
	})
	
	// Testers
	
	// Test if given value is a color string
	SVG.Color.test = function(color) {
	  color += ''
	  return SVG.regex.isHex.test(color)
	      || SVG.regex.isRgb.test(color)
	}
	
	// Test if given value is a rgb object
	SVG.Color.isRgb = function(color) {
	  return color && typeof color.r == 'number'
	               && typeof color.g == 'number'
	               && typeof color.b == 'number'
	}
	
	// Test if given value is a color
	SVG.Color.isColor = function(color) {
	  return SVG.Color.isRgb(color) || SVG.Color.test(color)
	}
	// Module for array conversion
	SVG.Array = function(array, fallback) {
	  array = (array || []).valueOf()
	
	  // if array is empty and fallback is provided, use fallback
	  if (array.length == 0 && fallback)
	    array = fallback.valueOf()
	
	  // parse array
	  this.value = this.parse(array)
	}
	
	SVG.extend(SVG.Array, {
	  // Make array morphable
	  morph: function(array) {
	    this.destination = this.parse(array)
	
	    // normalize length of arrays
	    if (this.value.length != this.destination.length) {
	      var lastValue       = this.value[this.value.length - 1]
	        , lastDestination = this.destination[this.destination.length - 1]
	
	      while(this.value.length > this.destination.length)
	        this.destination.push(lastDestination)
	      while(this.value.length < this.destination.length)
	        this.value.push(lastValue)
	    }
	
	    return this
	  }
	  // Clean up any duplicate points
	, settle: function() {
	    // find all unique values
	    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
	      if (seen.indexOf(this.value[i]) == -1)
	        seen.push(this.value[i])
	
	    // set new value
	    return this.value = seen
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this
	
	    // generate morphed array
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)
	
	    return new SVG.Array(array)
	  }
	  // Convert array to string
	, toString: function() {
	    return this.value.join(' ')
	  }
	  // Real value
	, valueOf: function() {
	    return this.value
	  }
	  // Parse whitespace separated string
	, parse: function(array) {
	    array = array.valueOf()
	
	    // if already is an array, no need to parse it
	    if (Array.isArray(array)) return array
	
	    return this.split(array)
	  }
	  // Strip unnecessary whitespace
	, split: function(string) {
	    return string.trim().split(SVG.regex.delimiter).map(parseFloat)
	  }
	  // Reverse array
	, reverse: function() {
	    this.value.reverse()
	
	    return this
	  }
	, clone: function() {
	    var clone = new this.constructor()
	    clone.value = array_clone(this.value)
	    return clone
	  }
	})
	// Poly points array
	SVG.PointArray = function(array, fallback) {
	  SVG.Array.call(this, array, fallback || [[0,0]])
	}
	
	// Inherit from SVG.Array
	SVG.PointArray.prototype = new SVG.Array
	SVG.PointArray.prototype.constructor = SVG.PointArray
	
	SVG.extend(SVG.PointArray, {
	  // Convert array to string
	  toString: function() {
	    // convert to a poly point string
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push(this.value[i].join(','))
	
	    return array.join(' ')
	  }
	  // Convert array to line object
	, toLine: function() {
	    return {
	      x1: this.value[0][0]
	    , y1: this.value[0][1]
	    , x2: this.value[1][0]
	    , y2: this.value[1][1]
	    }
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this
	
	    // generate morphed point string
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push([
	        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
	      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
	      ])
	
	    return new SVG.PointArray(array)
	  }
	  // Parse point string and flat array
	, parse: function(array) {
	    var points = []
	
	    array = array.valueOf()
	
	    // if it is an array
	    if (Array.isArray(array)) {
	      // and it is not flat, there is no need to parse it
	      if(Array.isArray(array[0])) {
	        return array
	      }
	    } else { // Else, it is considered as a string
	      // parse points
	      array = array.trim().split(SVG.regex.delimiter).map(parseFloat)
	    }
	
	    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
	    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
	    if (array.length % 2 !== 0) array.pop()
	
	    // wrap points in two-tuples and parse points as floats
	    for(var i = 0, len = array.length; i < len; i = i + 2)
	      points.push([ array[i], array[i+1] ])
	
	    return points
	  }
	  // Move point string
	, move: function(x, y) {
	    var box = this.bbox()
	
	    // get relative offset
	    x -= box.x
	    y -= box.y
	
	    // move every point
	    if (!isNaN(x) && !isNaN(y))
	      for (var i = this.value.length - 1; i >= 0; i--)
	        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]
	
	    return this
	  }
	  // Resize poly string
	, size: function(width, height) {
	    var i, box = this.bbox()
	
	    // recalculate position of all points according to new size
	    for (i = this.value.length - 1; i >= 0; i--) {
	      if(box.width) this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
	      if(box.height) this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
	    }
	
	    return this
	  }
	  // Get bounding box of points
	, bbox: function() {
	    SVG.parser.poly.setAttribute('points', this.toString())
	
	    return SVG.parser.poly.getBBox()
	  }
	})
	
	var pathHandlers = {
	  M: function(c, p, p0) {
	    p.x = p0.x = c[0]
	    p.y = p0.y = c[1]
	
	    return ['M', p.x, p.y]
	  },
	  L: function(c, p) {
	    p.x = c[0]
	    p.y = c[1]
	    return ['L', c[0], c[1]]
	  },
	  H: function(c, p) {
	    p.x = c[0]
	    return ['H', c[0]]
	  },
	  V: function(c, p) {
	    p.y = c[0]
	    return ['V', c[0]]
	  },
	  C: function(c, p) {
	    p.x = c[4]
	    p.y = c[5]
	    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
	  },
	  S: function(c, p) {
	    p.x = c[2]
	    p.y = c[3]
	    return ['S', c[0], c[1], c[2], c[3]]
	  },
	  Q: function(c, p) {
	    p.x = c[2]
	    p.y = c[3]
	    return ['Q', c[0], c[1], c[2], c[3]]
	  },
	  T: function(c, p) {
	    p.x = c[0]
	    p.y = c[1]
	    return ['T', c[0], c[1]]
	  },
	  Z: function(c, p, p0) {
	    p.x = p0.x
	    p.y = p0.y
	    return ['Z']
	  },
	  A: function(c, p) {
	    p.x = c[5]
	    p.y = c[6]
	    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
	  }
	}
	
	var mlhvqtcsa = 'mlhvqtcsaz'.split('')
	
	for(var i = 0, il = mlhvqtcsa.length; i < il; ++i){
	  pathHandlers[mlhvqtcsa[i]] = (function(i){
	    return function(c, p, p0) {
	      if(i == 'H') c[0] = c[0] + p.x
	      else if(i == 'V') c[0] = c[0] + p.y
	      else if(i == 'A'){
	        c[5] = c[5] + p.x,
	        c[6] = c[6] + p.y
	      }
	      else
	        for(var j = 0, jl = c.length; j < jl; ++j) {
	          c[j] = c[j] + (j%2 ? p.y : p.x)
	        }
	
	      return pathHandlers[i](c, p, p0)
	    }
	  })(mlhvqtcsa[i].toUpperCase())
	}
	
	// Path points array
	SVG.PathArray = function(array, fallback) {
	  SVG.Array.call(this, array, fallback || [['M', 0, 0]])
	}
	
	// Inherit from SVG.Array
	SVG.PathArray.prototype = new SVG.Array
	SVG.PathArray.prototype.constructor = SVG.PathArray
	
	SVG.extend(SVG.PathArray, {
	  // Convert array to string
	  toString: function() {
	    return arrayToString(this.value)
	  }
	  // Move path string
	, move: function(x, y) {
	    // get bounding box of current situation
	    var box = this.bbox()
	
	    // get relative offset
	    x -= box.x
	    y -= box.y
	
	    if (!isNaN(x) && !isNaN(y)) {
	      // move every point
	      for (var l, i = this.value.length - 1; i >= 0; i--) {
	        l = this.value[i][0]
	
	        if (l == 'M' || l == 'L' || l == 'T')  {
	          this.value[i][1] += x
	          this.value[i][2] += y
	
	        } else if (l == 'H')  {
	          this.value[i][1] += x
	
	        } else if (l == 'V')  {
	          this.value[i][1] += y
	
	        } else if (l == 'C' || l == 'S' || l == 'Q')  {
	          this.value[i][1] += x
	          this.value[i][2] += y
	          this.value[i][3] += x
	          this.value[i][4] += y
	
	          if (l == 'C')  {
	            this.value[i][5] += x
	            this.value[i][6] += y
	          }
	
	        } else if (l == 'A')  {
	          this.value[i][6] += x
	          this.value[i][7] += y
	        }
	
	      }
	    }
	
	    return this
	  }
	  // Resize path string
	, size: function(width, height) {
	    // get bounding box of current situation
	    var i, l, box = this.bbox()
	
	    // recalculate position of all points according to new size
	    for (i = this.value.length - 1; i >= 0; i--) {
	      l = this.value[i][0]
	
	      if (l == 'M' || l == 'L' || l == 'T')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
	
	      } else if (l == 'H')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	
	      } else if (l == 'V')  {
	        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
	
	      } else if (l == 'C' || l == 'S' || l == 'Q')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
	        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
	        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y
	
	        if (l == 'C')  {
	          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
	          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
	        }
	
	      } else if (l == 'A')  {
	        // resize radii
	        this.value[i][1] = (this.value[i][1] * width)  / box.width
	        this.value[i][2] = (this.value[i][2] * height) / box.height
	
	        // move position values
	        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
	        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
	      }
	
	    }
	
	    return this
	  }
	  // Test if the passed path array use the same path data commands as this path array
	, equalCommands: function(pathArray) {
	    var i, il, equalCommands
	
	    pathArray = new SVG.PathArray(pathArray)
	
	    equalCommands = this.value.length === pathArray.value.length
	    for(i = 0, il = this.value.length; equalCommands && i < il; i++) {
	      equalCommands = this.value[i][0] === pathArray.value[i][0]
	    }
	
	    return equalCommands
	  }
	  // Make path array morphable
	, morph: function(pathArray) {
	    pathArray = new SVG.PathArray(pathArray)
	
	    if(this.equalCommands(pathArray)) {
	      this.destination = pathArray
	    } else {
	      this.destination = null
	    }
	
	    return this
	  }
	  // Get morphed path array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this
	
	    var sourceArray = this.value
	      , destinationArray = this.destination.value
	      , array = [], pathArray = new SVG.PathArray()
	      , i, il, j, jl
	
	    // Animate has specified in the SVG spec
	    // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
	    for (i = 0, il = sourceArray.length; i < il; i++) {
	      array[i] = [sourceArray[i][0]]
	      for(j = 1, jl = sourceArray[i].length; j < jl; j++) {
	        array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos
	      }
	      // For the two flags of the elliptical arc command, the SVG spec say:
	      // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
	      // Elliptical arc command as an array followed by corresponding indexes:
	      // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
	      //   0    1   2        3                 4             5      6  7
	      if(array[i][0] === 'A') {
	        array[i][4] = +(array[i][4] != 0)
	        array[i][5] = +(array[i][5] != 0)
	      }
	    }
	
	    // Directly modify the value of a path array, this is done this way for performance
	    pathArray.value = array
	    return pathArray
	  }
	  // Absolutize and parse path to array
	, parse: function(array) {
	    // if it's already a patharray, no need to parse it
	    if (array instanceof SVG.PathArray) return array.valueOf()
	
	    // prepare for parsing
	    var i, x0, y0, s, seg, arr
	      , x = 0
	      , y = 0
	      , paramCnt = { 'M':2, 'L':2, 'H':1, 'V':1, 'C':6, 'S':4, 'Q':4, 'T':2, 'A':7, 'Z':0 }
	
	    if(typeof array == 'string'){
	
	      array = array
	        .replace(SVG.regex.numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
	        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
	        .replace(SVG.regex.hyphen, '$1 -')      // add space before hyphen
	        .trim()                                 // trim
	        .split(SVG.regex.delimiter)   // split into array
	
	    }else{
	      array = array.reduce(function(prev, curr){
	        return [].concat.call(prev, curr)
	      }, [])
	    }
	
	    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
	    var arr = []
	      , p = new SVG.Point()
	      , p0 = new SVG.Point()
	      , index = 0
	      , len = array.length
	
	    do{
	      // Test if we have a path letter
	      if(SVG.regex.isPathLetter.test(array[index])){
	        s = array[index]
	        ++index
	      // If last letter was a move command and we got no new, it defaults to [L]ine
	      }else if(s == 'M'){
	        s = 'L'
	      }else if(s == 'm'){
	        s = 'l'
	      }
	
	      arr.push(pathHandlers[s].call(null,
	          array.slice(index, (index = index + paramCnt[s.toUpperCase()])).map(parseFloat),
	          p, p0
	        )
	      )
	
	    }while(len > index)
	
	    return arr
	
	  }
	  // Get bounding box of path
	, bbox: function() {
	    SVG.parser.path.setAttribute('d', this.toString())
	
	    return SVG.parser.path.getBBox()
	  }
	
	})
	
	// Module for unit convertions
	SVG.Number = SVG.invent({
	  // Initialize
	  create: function(value, unit) {
	    // initialize defaults
	    this.value = 0
	    this.unit  = unit || ''
	
	    // parse value
	    if (typeof value === 'number') {
	      // ensure a valid numeric value
	      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value
	
	    } else if (typeof value === 'string') {
	      unit = value.match(SVG.regex.numberAndUnit)
	
	      if (unit) {
	        // make value numeric
	        this.value = parseFloat(unit[1])
	
	        // normalize
	        if (unit[5] == '%')
	          this.value /= 100
	        else if (unit[5] == 's')
	          this.value *= 1000
	
	        // store unit
	        this.unit = unit[5]
	      }
	
	    } else {
	      if (value instanceof SVG.Number) {
	        this.value = value.valueOf()
	        this.unit  = value.unit
	      }
	    }
	
	  }
	  // Add methods
	, extend: {
	    // Stringalize
	    toString: function() {
	      return (
	        this.unit == '%' ?
	          ~~(this.value * 1e8) / 1e6:
	        this.unit == 's' ?
	          this.value / 1e3 :
	          this.value
	      ) + this.unit
	    }
	  , toJSON: function() {
	      return this.toString()
	    }
	  , // Convert to primitive
	    valueOf: function() {
	      return this.value
	    }
	    // Add number
	  , plus: function(number) {
	      number = new SVG.Number(number)
	      return new SVG.Number(this + number, this.unit || number.unit)
	    }
	    // Subtract number
	  , minus: function(number) {
	      number = new SVG.Number(number)
	      return new SVG.Number(this - number, this.unit || number.unit)
	    }
	    // Multiply number
	  , times: function(number) {
	      number = new SVG.Number(number)
	      return new SVG.Number(this * number, this.unit || number.unit)
	    }
	    // Divide number
	  , divide: function(number) {
	      number = new SVG.Number(number)
	      return new SVG.Number(this / number, this.unit || number.unit)
	    }
	    // Convert to different unit
	  , to: function(unit) {
	      var number = new SVG.Number(this)
	
	      if (typeof unit === 'string')
	        number.unit = unit
	
	      return number
	    }
	    // Make number morphable
	  , morph: function(number) {
	      this.destination = new SVG.Number(number)
	
	      if(number.relative) {
	        this.destination.value += this.value
	      }
	
	      return this
	    }
	    // Get morphed number at given position
	  , at: function(pos) {
	      // Make sure a destination is defined
	      if (!this.destination) return this
	
	      // Generate new morphed number
	      return new SVG.Number(this.destination)
	          .minus(this)
	          .times(pos)
	          .plus(this)
	    }
	
	  }
	})
	
	
	SVG.Element = SVG.invent({
	  // Initialize node
	  create: function(node) {
	    // make stroke value accessible dynamically
	    this._stroke = SVG.defaults.attrs.stroke
	    this._event = null
	
	    // initialize data object
	    this.dom = {}
	
	    // create circular reference
	    if (this.node = node) {
	      this.type = node.nodeName
	      this.node.instance = this
	
	      // store current attribute value
	      this._stroke = node.getAttribute('stroke') || this._stroke
	    }
	  }
	
	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      return this.attr('x', x)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return this.attr('y', y)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
	    }
	    // Move element to given x and y values
	  , move: function(x, y) {
	      return this.x(x).y(y)
	    }
	    // Move element by its center
	  , center: function(x, y) {
	      return this.cx(x).cy(y)
	    }
	    // Set width of element
	  , width: function(width) {
	      return this.attr('width', width)
	    }
	    // Set height of element
	  , height: function(height) {
	      return this.attr('height', height)
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)
	
	      return this
	        .width(new SVG.Number(p.width))
	        .height(new SVG.Number(p.height))
	    }
	    // Clone element
	  , clone: function(parent, withData) {
	      // write dom data to the dom so the clone can pickup the data
	      this.writeDataToDom()
	
	      // clone element and assign new id
	      var clone = assignNewId(this.node.cloneNode(true))
	
	      // insert the clone in the given parent or after myself
	      if(parent) parent.add(clone)
	      else this.after(clone)
	
	      return clone
	    }
	    // Remove element
	  , remove: function() {
	      if (this.parent())
	        this.parent().removeElement(this)
	
	      return this
	    }
	    // Replace element
	  , replace: function(element) {
	      this.after(element).remove()
	
	      return element
	    }
	    // Add element to given container and return self
	  , addTo: function(parent) {
	      return parent.put(this)
	    }
	    // Add element to given container and return container
	  , putIn: function(parent) {
	      return parent.add(this)
	    }
	    // Get / set id
	  , id: function(id) {
	      return this.attr('id', id)
	    }
	    // Checks whether the given point inside the bounding box of the element
	  , inside: function(x, y) {
	      var box = this.bbox()
	
	      return x > box.x
	          && y > box.y
	          && x < box.x + box.width
	          && y < box.y + box.height
	    }
	    // Show element
	  , show: function() {
	      return this.style('display', '')
	    }
	    // Hide element
	  , hide: function() {
	      return this.style('display', 'none')
	    }
	    // Is element visible?
	  , visible: function() {
	      return this.style('display') != 'none'
	    }
	    // Return id on string conversion
	  , toString: function() {
	      return this.attr('id')
	    }
	    // Return array of classes on the node
	  , classes: function() {
	      var attr = this.attr('class')
	
	      return attr == null ? [] : attr.trim().split(SVG.regex.delimiter)
	    }
	    // Return true if class exists on the node, false otherwise
	  , hasClass: function(name) {
	      return this.classes().indexOf(name) != -1
	    }
	    // Add class to the node
	  , addClass: function(name) {
	      if (!this.hasClass(name)) {
	        var array = this.classes()
	        array.push(name)
	        this.attr('class', array.join(' '))
	      }
	
	      return this
	    }
	    // Remove class from the node
	  , removeClass: function(name) {
	      if (this.hasClass(name)) {
	        this.attr('class', this.classes().filter(function(c) {
	          return c != name
	        }).join(' '))
	      }
	
	      return this
	    }
	    // Toggle the presence of a class on the node
	  , toggleClass: function(name) {
	      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
	    }
	    // Get referenced element form attribute value
	  , reference: function(attr) {
	      return SVG.get(this.attr(attr))
	    }
	    // Returns the parent element instance
	  , parent: function(type) {
	      var parent = this
	
	      // check for parent
	      if(!parent.node.parentNode) return null
	
	      // get parent element
	      parent = SVG.adopt(parent.node.parentNode)
	
	      if(!type) return parent
	
	      // loop trough ancestors if type is given
	      while(parent && parent.node instanceof window.SVGElement){
	        if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
	        if(parent.node.parentNode.nodeName == '#document') return null // #720
	        parent = SVG.adopt(parent.node.parentNode)
	      }
	    }
	    // Get parent document
	  , doc: function() {
	      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
	    }
	    // return array of all ancestors of given type up to the root svg
	  , parents: function(type) {
	      var parents = [], parent = this
	
	      do{
	        parent = parent.parent(type)
	        if(!parent || !parent.node) break
	
	        parents.push(parent)
	      } while(parent.parent)
	
	      return parents
	    }
	    // matches the element vs a css selector
	  , matches: function(selector){
	      return matches(this.node, selector)
	    }
	    // Returns the svg node to call native svg methods on it
	  , native: function() {
	      return this.node
	    }
	    // Import raw svg
	  , svg: function(svg) {
	      // create temporary holder
	      var well = document.createElement('svg')
	
	      // act as a setter if svg is given
	      if (svg && this instanceof SVG.Parent) {
	        // dump raw svg
	        well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'
	
	        // transplant nodes
	        for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
	          this.node.appendChild(well.firstChild.firstChild)
	
	      // otherwise act as a getter
	      } else {
	        // create a wrapping svg element in case of partial content
	        well.appendChild(svg = document.createElement('svg'))
	
	        // write svgjs data to the dom
	        this.writeDataToDom()
	
	        // insert a copy of this node
	        svg.appendChild(this.node.cloneNode(true))
	
	        // return target element
	        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
	      }
	
	      return this
	    }
	  // write svgjs data to the dom
	  , writeDataToDom: function() {
	
	      // dump variables recursively
	      if(this.each || this.lines){
	        var fn = this.each ? this : this.lines();
	        fn.each(function(){
	          this.writeDataToDom()
	        })
	      }
	
	      // remove previously set data
	      this.node.removeAttribute('svgjs:data')
	
	      if(Object.keys(this.dom).length)
	        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428
	
	      return this
	    }
	  // set given data to the elements data property
	  , setData: function(o){
	      this.dom = o
	      return this
	    }
	  , is: function(obj){
	      return is(this, obj)
	    }
	  }
	})
	
	SVG.easing = {
	  '-': function(pos){return pos}
	, '<>':function(pos){return -Math.cos(pos * Math.PI) / 2 + 0.5}
	, '>': function(pos){return  Math.sin(pos * Math.PI / 2)}
	, '<': function(pos){return -Math.cos(pos * Math.PI / 2) + 1}
	}
	
	SVG.morph = function(pos){
	  return function(from, to) {
	    return new SVG.MorphObj(from, to).at(pos)
	  }
	}
	
	SVG.Situation = SVG.invent({
	
	  create: function(o){
	    this.init = false
	    this.reversed = false
	    this.reversing = false
	
	    this.duration = new SVG.Number(o.duration).valueOf()
	    this.delay = new SVG.Number(o.delay).valueOf()
	
	    this.start = +new Date() + this.delay
	    this.finish = this.start + this.duration
	    this.ease = o.ease
	
	    // this.loop is incremented from 0 to this.loops
	    // it is also incremented when in an infinite loop (when this.loops is true)
	    this.loop = 0
	    this.loops = false
	
	    this.animations = {
	      // functionToCall: [list of morphable objects]
	      // e.g. move: [SVG.Number, SVG.Number]
	    }
	
	    this.attrs = {
	      // holds all attributes which are not represented from a function svg.js provides
	      // e.g. someAttr: SVG.Number
	    }
	
	    this.styles = {
	      // holds all styles which should be animated
	      // e.g. fill-color: SVG.Color
	    }
	
	    this.transforms = [
	      // holds all transformations as transformation objects
	      // e.g. [SVG.Rotate, SVG.Translate, SVG.Matrix]
	    ]
	
	    this.once = {
	      // functions to fire at a specific position
	      // e.g. "0.5": function foo(){}
	    }
	
	  }
	
	})
	
	
	SVG.FX = SVG.invent({
	
	  create: function(element) {
	    this._target = element
	    this.situations = []
	    this.active = false
	    this.situation = null
	    this.paused = false
	    this.lastPos = 0
	    this.pos = 0
	    // The absolute position of an animation is its position in the context of its complete duration (including delay and loops)
	    // When performing a delay, absPos is below 0 and when performing a loop, its value is above 1
	    this.absPos = 0
	    this._speed = 1
	  }
	
	, extend: {
	
	    /**
	     * sets or returns the target of this animation
	     * @param o object || number In case of Object it holds all parameters. In case of number its the duration of the animation
	     * @param ease function || string Function which should be used for easing or easing keyword
	     * @param delay Number indicating the delay before the animation starts
	     * @return target || this
	     */
	    animate: function(o, ease, delay){
	
	      if(typeof o == 'object'){
	        ease = o.ease
	        delay = o.delay
	        o = o.duration
	      }
	
	      var situation = new SVG.Situation({
	        duration: o || 1000,
	        delay: delay || 0,
	        ease: SVG.easing[ease || '-'] || ease
	      })
	
	      this.queue(situation)
	
	      return this
	    }
	
	    /**
	     * sets a delay before the next element of the queue is called
	     * @param delay Duration of delay in milliseconds
	     * @return this.target()
	     */
	  , delay: function(delay){
	      // The delay is performed by an empty situation with its duration
	      // attribute set to the duration of the delay
	      var situation = new SVG.Situation({
	        duration: delay,
	        delay: 0,
	        ease: SVG.easing['-']
	      })
	
	      return this.queue(situation)
	    }
	
	    /**
	     * sets or returns the target of this animation
	     * @param null || target SVG.Element which should be set as new target
	     * @return target || this
	     */
	  , target: function(target){
	      if(target && target instanceof SVG.Element){
	        this._target = target
	        return this
	      }
	
	      return this._target
	    }
	
	    // returns the absolute position at a given time
	  , timeToAbsPos: function(timestamp){
	      return (timestamp - this.situation.start) / (this.situation.duration/this._speed)
	    }
	
	    // returns the timestamp from a given absolute positon
	  , absPosToTime: function(absPos){
	      return this.situation.duration/this._speed * absPos + this.situation.start
	    }
	
	    // starts the animationloop
	  , startAnimFrame: function(){
	      this.stopAnimFrame()
	      this.animationFrame = window.requestAnimationFrame(function(){ this.step() }.bind(this))
	    }
	
	    // cancels the animationframe
	  , stopAnimFrame: function(){
	      window.cancelAnimationFrame(this.animationFrame)
	    }
	
	    // kicks off the animation - only does something when the queue is currently not active and at least one situation is set
	  , start: function(){
	      // dont start if already started
	      if(!this.active && this.situation){
	        this.active = true
	        this.startCurrent()
	      }
	
	      return this
	    }
	
	    // start the current situation
	  , startCurrent: function(){
	      this.situation.start = +new Date + this.situation.delay/this._speed
	      this.situation.finish = this.situation.start + this.situation.duration/this._speed
	      return this.initAnimations().step()
	    }
	
	    /**
	     * adds a function / Situation to the animation queue
	     * @param fn function / situation to add
	     * @return this
	     */
	  , queue: function(fn){
	      if(typeof fn == 'function' || fn instanceof SVG.Situation)
	        this.situations.push(fn)
	
	      if(!this.situation) this.situation = this.situations.shift()
	
	      return this
	    }
	
	    /**
	     * pulls next element from the queue and execute it
	     * @return this
	     */
	  , dequeue: function(){
	      // stop current animation
	      this.stop()
	
	      // get next animation from queue
	      this.situation = this.situations.shift()
	
	      if(this.situation){
	        if(this.situation instanceof SVG.Situation) {
	          this.start()
	        } else {
	          // If it is not a SVG.Situation, then it is a function, we execute it
	          this.situation.call(this)
	        }
	      }
	
	      return this
	    }
	
	    // updates all animations to the current state of the element
	    // this is important when one property could be changed from another property
	  , initAnimations: function() {
	      var i, j, source
	      var s = this.situation
	
	      if(s.init) return this
	
	      for(i in s.animations){
	        source = this.target()[i]()
	
	        if(!Array.isArray(source)) {
	          source = [source]
	        }
	
	        if(!Array.isArray(s.animations[i])) {
	          s.animations[i] = [s.animations[i]]
	        }
	
	        //if(s.animations[i].length > source.length) {
	        //  source.concat = source.concat(s.animations[i].slice(source.length, s.animations[i].length))
	        //}
	
	        for(j = source.length; j--;) {
	          // The condition is because some methods return a normal number instead
	          // of a SVG.Number
	          if(s.animations[i][j] instanceof SVG.Number)
	            source[j] = new SVG.Number(source[j])
	
	          s.animations[i][j] = source[j].morph(s.animations[i][j])
	        }
	      }
	
	      for(i in s.attrs){
	        s.attrs[i] = new SVG.MorphObj(this.target().attr(i), s.attrs[i])
	      }
	
	      for(i in s.styles){
	        s.styles[i] = new SVG.MorphObj(this.target().style(i), s.styles[i])
	      }
	
	      s.initialTransformation = this.target().matrixify()
	
	      s.init = true
	      return this
	    }
	  , clearQueue: function(){
	      this.situations = []
	      return this
	    }
	  , clearCurrent: function(){
	      this.situation = null
	      return this
	    }
	    /** stops the animation immediately
	     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately.
	     * @param clearQueue A Boolean indicating whether to remove queued animation as well.
	     * @return this
	     */
	  , stop: function(jumpToEnd, clearQueue){
	      var active = this.active
	      this.active = false
	
	      if(clearQueue){
	        this.clearQueue()
	      }
	
	      if(jumpToEnd && this.situation){
	        // initialize the situation if it was not
	        !active && this.startCurrent()
	        this.atEnd()
	      }
	
	      this.stopAnimFrame()
	
	      return this.clearCurrent()
	    }
	
	    /** resets the element to the state where the current element has started
	     * @return this
	     */
	  , reset: function(){
	      if(this.situation){
	        var temp = this.situation
	        this.stop()
	        this.situation = temp
	        this.atStart()
	      }
	      return this
	    }
	
	    // Stop the currently-running animation, remove all queued animations, and complete all animations for the element.
	  , finish: function(){
	
	      this.stop(true, false)
	
	      while(this.dequeue().situation && this.stop(true, false));
	
	      this.clearQueue().clearCurrent()
	
	      return this
	    }
	
	    // set the internal animation pointer at the start position, before any loops, and updates the visualisation
	  , atStart: function() {
	      return this.at(0, true)
	    }
	
	    // set the internal animation pointer at the end position, after all the loops, and updates the visualisation
	  , atEnd: function() {
	      if (this.situation.loops === true) {
	        // If in a infinite loop, we end the current iteration
	        this.situation.loops = this.situation.loop + 1
	      }
	
	      if(typeof this.situation.loops == 'number') {
	        // If performing a finite number of loops, we go after all the loops
	        return this.at(this.situation.loops, true)
	      } else {
	        // If no loops, we just go at the end
	        return this.at(1, true)
	      }
	    }
	
	    // set the internal animation pointer to the specified position and updates the visualisation
	    // if isAbsPos is true, pos is treated as an absolute position
	  , at: function(pos, isAbsPos){
	      var durDivSpd = this.situation.duration/this._speed
	
	      this.absPos = pos
	      // If pos is not an absolute position, we convert it into one
	      if (!isAbsPos) {
	        if (this.situation.reversed) this.absPos = 1 - this.absPos
	        this.absPos += this.situation.loop
	      }
	
	      this.situation.start = +new Date - this.absPos * durDivSpd
	      this.situation.finish = this.situation.start + durDivSpd
	
	      return this.step(true)
	    }
	
	    /**
	     * sets or returns the speed of the animations
	     * @param speed null || Number The new speed of the animations
	     * @return Number || this
	     */
	  , speed: function(speed){
	      if (speed === 0) return this.pause()
	
	      if (speed) {
	        this._speed = speed
	        // We use an absolute position here so that speed can affect the delay before the animation
	        return this.at(this.absPos, true)
	      } else return this._speed
	    }
	
	    // Make loopable
	  , loop: function(times, reverse) {
	      var c = this.last()
	
	      // store total loops
	      c.loops = (times != null) ? times : true
	      c.loop = 0
	
	      if(reverse) c.reversing = true
	      return this
	    }
	
	    // pauses the animation
	  , pause: function(){
	      this.paused = true
	      this.stopAnimFrame()
	
	      return this
	    }
	
	    // unpause the animation
	  , play: function(){
	      if(!this.paused) return this
	      this.paused = false
	      // We use an absolute position here so that the delay before the animation can be paused
	      return this.at(this.absPos, true)
	    }
	
	    /**
	     * toggle or set the direction of the animation
	     * true sets direction to backwards while false sets it to forwards
	     * @param reversed Boolean indicating whether to reverse the animation or not (default: toggle the reverse status)
	     * @return this
	     */
	  , reverse: function(reversed){
	      var c = this.last()
	
	      if(typeof reversed == 'undefined') c.reversed = !c.reversed
	      else c.reversed = reversed
	
	      return this
	    }
	
	
	    /**
	     * returns a float from 0-1 indicating the progress of the current animation
	     * @param eased Boolean indicating whether the returned position should be eased or not
	     * @return number
	     */
	  , progress: function(easeIt){
	      return easeIt ? this.situation.ease(this.pos) : this.pos
	    }
	
	    /**
	     * adds a callback function which is called when the current animation is finished
	     * @param fn Function which should be executed as callback
	     * @return number
	     */
	  , after: function(fn){
	      var c = this.last()
	        , wrapper = function wrapper(e){
	            if(e.detail.situation == c){
	              fn.call(this, c)
	              this.off('finished.fx', wrapper) // prevent memory leak
	            }
	          }
	
	      this.target().on('finished.fx', wrapper)
	
	      return this._callStart()
	    }
	
	    // adds a callback which is called whenever one animation step is performed
	  , during: function(fn){
	      var c = this.last()
	        , wrapper = function(e){
	            if(e.detail.situation == c){
	              fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, c)
	            }
	          }
	
	      // see above
	      this.target().off('during.fx', wrapper).on('during.fx', wrapper)
	
	      this.after(function(){
	        this.off('during.fx', wrapper)
	      })
	
	      return this._callStart()
	    }
	
	    // calls after ALL animations in the queue are finished
	  , afterAll: function(fn){
	      var wrapper = function wrapper(e){
	            fn.call(this)
	            this.off('allfinished.fx', wrapper)
	          }
	
	      // see above
	      this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper)
	
	      return this._callStart()
	    }
	
	    // calls on every animation step for all animations
	  , duringAll: function(fn){
	      var wrapper = function(e){
	            fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, e.detail.situation)
	          }
	
	      this.target().off('during.fx', wrapper).on('during.fx', wrapper)
	
	      this.afterAll(function(){
	        this.off('during.fx', wrapper)
	      })
	
	      return this._callStart()
	    }
	
	  , last: function(){
	      return this.situations.length ? this.situations[this.situations.length-1] : this.situation
	    }
	
	    // adds one property to the animations
	  , add: function(method, args, type){
	      this.last()[type || 'animations'][method] = args
	      return this._callStart()
	    }
	
	    /** perform one step of the animation
	     *  @param ignoreTime Boolean indicating whether to ignore time and use position directly or recalculate position based on time
	     *  @return this
	     */
	  , step: function(ignoreTime){
	
	      // convert current time to an absolute position
	      if(!ignoreTime) this.absPos = this.timeToAbsPos(+new Date)
	
	      // This part convert an absolute position to a position
	      if(this.situation.loops !== false) {
	        var absPos, absPosInt, lastLoop
	
	        // If the absolute position is below 0, we just treat it as if it was 0
	        absPos = Math.max(this.absPos, 0)
	        absPosInt = Math.floor(absPos)
	
	        if(this.situation.loops === true || absPosInt < this.situation.loops) {
	          this.pos = absPos - absPosInt
	          lastLoop = this.situation.loop
	          this.situation.loop = absPosInt
	        } else {
	          this.absPos = this.situation.loops
	          this.pos = 1
	          // The -1 here is because we don't want to toggle reversed when all the loops have been completed
	          lastLoop = this.situation.loop - 1
	          this.situation.loop = this.situation.loops
	        }
	
	        if(this.situation.reversing) {
	          // Toggle reversed if an odd number of loops as occured since the last call of step
	          this.situation.reversed = this.situation.reversed != Boolean((this.situation.loop - lastLoop) % 2)
	        }
	
	      } else {
	        // If there are no loop, the absolute position must not be above 1
	        this.absPos = Math.min(this.absPos, 1)
	        this.pos = this.absPos
	      }
	
	      // while the absolute position can be below 0, the position must not be below 0
	      if(this.pos < 0) this.pos = 0
	
	      if(this.situation.reversed) this.pos = 1 - this.pos
	
	
	      // apply easing
	      var eased = this.situation.ease(this.pos)
	
	      // call once-callbacks
	      for(var i in this.situation.once){
	        if(i > this.lastPos && i <= eased){
	          this.situation.once[i].call(this.target(), this.pos, eased)
	          delete this.situation.once[i]
	        }
	      }
	
	      // fire during callback with position, eased position and current situation as parameter
	      if(this.active) this.target().fire('during', {pos: this.pos, eased: eased, fx: this, situation: this.situation})
	
	      // the user may call stop or finish in the during callback
	      // so make sure that we still have a valid situation
	      if(!this.situation){
	        return this
	      }
	
	      // apply the actual animation to every property
	      this.eachAt()
	
	      // do final code when situation is finished
	      if((this.pos == 1 && !this.situation.reversed) || (this.situation.reversed && this.pos == 0)){
	
	        // stop animation callback
	        this.stopAnimFrame()
	
	        // fire finished callback with current situation as parameter
	        this.target().fire('finished', {fx:this, situation: this.situation})
	
	        if(!this.situations.length){
	          this.target().fire('allfinished')
	
	          // Recheck the length since the user may call animate in the afterAll callback
	          if(!this.situations.length){
	            this.target().off('.fx') // there shouldnt be any binding left, but to make sure...
	            this.active = false
	          }
	        }
	
	        // start next animation
	        if(this.active) this.dequeue()
	        else this.clearCurrent()
	
	      }else if(!this.paused && this.active){
	        // we continue animating when we are not at the end
	        this.startAnimFrame()
	      }
	
	      // save last eased position for once callback triggering
	      this.lastPos = eased
	      return this
	
	    }
	
	    // calculates the step for every property and calls block with it
	  , eachAt: function(){
	      var i, len, at, self = this, target = this.target(), s = this.situation
	
	      // apply animations which can be called trough a method
	      for(i in s.animations){
	
	        at = [].concat(s.animations[i]).map(function(el){
	          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
	        })
	
	        target[i].apply(target, at)
	
	      }
	
	      // apply animation which has to be applied with attr()
	      for(i in s.attrs){
	
	        at = [i].concat(s.attrs[i]).map(function(el){
	          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
	        })
	
	        target.attr.apply(target, at)
	
	      }
	
	      // apply animation which has to be applied with style()
	      for(i in s.styles){
	
	        at = [i].concat(s.styles[i]).map(function(el){
	          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
	        })
	
	        target.style.apply(target, at)
	
	      }
	
	      // animate initialTransformation which has to be chained
	      if(s.transforms.length){
	
	        // get initial initialTransformation
	        at = s.initialTransformation
	        for(i = 0, len = s.transforms.length; i < len; i++){
	
	          // get next transformation in chain
	          var a = s.transforms[i]
	
	          // multiply matrix directly
	          if(a instanceof SVG.Matrix){
	
	            if(a.relative){
	              at = at.multiply(new SVG.Matrix().morph(a).at(s.ease(this.pos)))
	            }else{
	              at = at.morph(a).at(s.ease(this.pos))
	            }
	            continue
	          }
	
	          // when transformation is absolute we have to reset the needed transformation first
	          if(!a.relative)
	            a.undo(at.extract())
	
	          // and reapply it after
	          at = at.multiply(a.at(s.ease(this.pos)))
	
	        }
	
	        // set new matrix on element
	        target.matrix(at)
	      }
	
	      return this
	
	    }
	
	
	    // adds an once-callback which is called at a specific position and never again
	  , once: function(pos, fn, isEased){
	      var c = this.last()
	      if(!isEased) pos = c.ease(pos)
	
	      c.once[pos] = fn
	
	      return this
	    }
	
	  , _callStart: function() {
	      setTimeout(function(){this.start()}.bind(this), 0)
	      return this
	    }
	
	  }
	
	, parent: SVG.Element
	
	  // Add method to parent elements
	, construct: {
	    // Get fx module or create a new one, then animate with given duration and ease
	    animate: function(o, ease, delay) {
	      return (this.fx || (this.fx = new SVG.FX(this))).animate(o, ease, delay)
	    }
	  , delay: function(delay){
	      return (this.fx || (this.fx = new SVG.FX(this))).delay(delay)
	    }
	  , stop: function(jumpToEnd, clearQueue) {
	      if (this.fx)
	        this.fx.stop(jumpToEnd, clearQueue)
	
	      return this
	    }
	  , finish: function() {
	      if (this.fx)
	        this.fx.finish()
	
	      return this
	    }
	    // Pause current animation
	  , pause: function() {
	      if (this.fx)
	        this.fx.pause()
	
	      return this
	    }
	    // Play paused current animation
	  , play: function() {
	      if (this.fx)
	        this.fx.play()
	
	      return this
	    }
	    // Set/Get the speed of the animations
	  , speed: function(speed) {
	      if (this.fx)
	        if (speed == null)
	          return this.fx.speed()
	        else
	          this.fx.speed(speed)
	
	      return this
	    }
	  }
	
	})
	
	// MorphObj is used whenever no morphable object is given
	SVG.MorphObj = SVG.invent({
	
	  create: function(from, to){
	    // prepare color for morphing
	    if(SVG.Color.isColor(to)) return new SVG.Color(from).morph(to)
	    // prepare value list for morphing
	    if(SVG.regex.delimiter.test(from)) return new SVG.Array(from).morph(to)
	    // prepare number for morphing
	    if(SVG.regex.numberAndUnit.test(to)) return new SVG.Number(from).morph(to)
	
	    // prepare for plain morphing
	    this.value = from
	    this.destination = to
	  }
	
	, extend: {
	    at: function(pos, real){
	      return real < 1 ? this.value : this.destination
	    },
	
	    valueOf: function(){
	      return this.value
	    }
	  }
	
	})
	
	SVG.extend(SVG.FX, {
	  // Add animatable attributes
	  attr: function(a, v, relative) {
	    // apply attributes individually
	    if (typeof a == 'object') {
	      for (var key in a)
	        this.attr(key, a[key])
	
	    } else {
	      this.add(a, v, 'attrs')
	    }
	
	    return this
	  }
	  // Add animatable styles
	, style: function(s, v) {
	    if (typeof s == 'object')
	      for (var key in s)
	        this.style(key, s[key])
	
	    else
	      this.add(s, v, 'styles')
	
	    return this
	  }
	  // Animatable x-axis
	, x: function(x, relative) {
	    if(this.target() instanceof SVG.G){
	      this.transform({x:x}, relative)
	      return this
	    }
	
	    var num = new SVG.Number(x)
	    num.relative = relative
	    return this.add('x', num)
	  }
	  // Animatable y-axis
	, y: function(y, relative) {
	    if(this.target() instanceof SVG.G){
	      this.transform({y:y}, relative)
	      return this
	    }
	
	    var num = new SVG.Number(y)
	    num.relative = relative
	    return this.add('y', num)
	  }
	  // Animatable center x-axis
	, cx: function(x) {
	    return this.add('cx', new SVG.Number(x))
	  }
	  // Animatable center y-axis
	, cy: function(y) {
	    return this.add('cy', new SVG.Number(y))
	  }
	  // Add animatable move
	, move: function(x, y) {
	    return this.x(x).y(y)
	  }
	  // Add animatable center
	, center: function(x, y) {
	    return this.cx(x).cy(y)
	  }
	  // Add animatable size
	, size: function(width, height) {
	    if (this.target() instanceof SVG.Text) {
	      // animate font size for Text elements
	      this.attr('font-size', width)
	
	    } else {
	      // animate bbox based size for all other elements
	      var box
	
	      if(!width || !height){
	        box = this.target().bbox()
	      }
	
	      if(!width){
	        width = box.width / box.height  * height
	      }
	
	      if(!height){
	        height = box.height / box.width  * width
	      }
	
	      this.add('width' , new SVG.Number(width))
	          .add('height', new SVG.Number(height))
	
	    }
	
	    return this
	  }
	  // Add animatable width
	, width: function(width) {
	    return this.add('width', new SVG.Number(width))
	  }
	  // Add animatable height
	, height: function(height) {
	    return this.add('height', new SVG.Number(height))
	  }
	  // Add animatable plot
	, plot: function(a, b, c, d) {
	    // Lines can be plotted with 4 arguments
	    if(arguments.length == 4) {
	      return this.plot([a, b, c, d])
	    }
	
	    return this.add('plot', new (this.target().morphArray)(a))
	  }
	  // Add leading method
	, leading: function(value) {
	    return this.target().leading ?
	      this.add('leading', new SVG.Number(value)) :
	      this
	  }
	  // Add animatable viewbox
	, viewbox: function(x, y, width, height) {
	    if (this.target() instanceof SVG.Container) {
	      this.add('viewbox', new SVG.ViewBox(x, y, width, height))
	    }
	
	    return this
	  }
	, update: function(o) {
	    if (this.target() instanceof SVG.Stop) {
	      if (typeof o == 'number' || o instanceof SVG.Number) {
	        return this.update({
	          offset:  arguments[0]
	        , color:   arguments[1]
	        , opacity: arguments[2]
	        })
	      }
	
	      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
	      if (o.color   != null) this.attr('stop-color', o.color)
	      if (o.offset  != null) this.attr('offset', o.offset)
	    }
	
	    return this
	  }
	})
	
	SVG.Box = SVG.invent({
	  create: function(x, y, width, height) {
	    if (typeof x == 'object' && !(x instanceof SVG.Element)) {
	      // chromes getBoundingClientRect has no x and y property
	      return SVG.Box.call(this, x.left != null ? x.left : x.x , x.top != null ? x.top : x.y, x.width, x.height)
	    } else if (arguments.length == 4) {
	      this.x = x
	      this.y = y
	      this.width = width
	      this.height = height
	    }
	
	    // add center, right, bottom...
	    fullBox(this)
	  }
	, extend: {
	    // Merge rect box with another, return a new instance
	    merge: function(box) {
	      var b = new this.constructor()
	
	      // merge boxes
	      b.x      = Math.min(this.x, box.x)
	      b.y      = Math.min(this.y, box.y)
	      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
	      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
	
	      return fullBox(b)
	    }
	
	  , transform: function(m) {
	      var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, p, bbox
	
	      var pts = [
	        new SVG.Point(this.x, this.y),
	        new SVG.Point(this.x2, this.y),
	        new SVG.Point(this.x, this.y2),
	        new SVG.Point(this.x2, this.y2)
	      ]
	
	      pts.forEach(function(p) {
	        p = p.transform(m)
	        xMin = Math.min(xMin,p.x)
	        xMax = Math.max(xMax,p.x)
	        yMin = Math.min(yMin,p.y)
	        yMax = Math.max(yMax,p.y)
	      })
	
	      bbox = new this.constructor()
	      bbox.x = xMin
	      bbox.width = xMax-xMin
	      bbox.y = yMin
	      bbox.height = yMax-yMin
	
	      fullBox(bbox)
	
	      return bbox
	    }
	  }
	})
	
	SVG.BBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    SVG.Box.apply(this, [].slice.call(arguments))
	
	    // get values if element is given
	    if (element instanceof SVG.Element) {
	      var box
	
	      // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
	      try {
	
	        if (!document.documentElement.contains){
	          // This is IE - it does not support contains() for top-level SVGs
	          var topParent = element.node
	          while (topParent.parentNode){
	            topParent = topParent.parentNode
	          }
	          if (topParent != document) throw new Exception('Element not in the dom')
	        } else {
	          // the element is NOT in the dom, throw error
	          if(!document.documentElement.contains(element.node)) throw new Exception('Element not in the dom')
	        }
	
	        // find native bbox
	        box = element.node.getBBox()
	      } catch(e) {
	        if(element instanceof SVG.Shape){
	          var clone = element.clone(SVG.parser.draw.instance).show()
	          box = clone.node.getBBox()
	          clone.remove()
	        }else{
	          box = {
	            x:      element.node.clientLeft
	          , y:      element.node.clientTop
	          , width:  element.node.clientWidth
	          , height: element.node.clientHeight
	          }
	        }
	      }
	
	      SVG.Box.call(this, box)
	    }
	
	  }
	
	  // Define ancestor
	, inherit: SVG.Box
	
	  // Define Parent
	, parent: SVG.Element
	
	  // Constructor
	, construct: {
	    // Get bounding box
	    bbox: function() {
	      return new SVG.BBox(this)
	    }
	  }
	
	})
	
	SVG.BBox.prototype.constructor = SVG.BBox
	
	
	SVG.extend(SVG.Element, {
	  tbox: function(){
	    console.warn('Use of TBox is deprecated and mapped to RBox. Use .rbox() instead.')
	    return this.rbox(this.doc())
	  }
	})
	
	SVG.RBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    SVG.Box.apply(this, [].slice.call(arguments))
	
	    if (element instanceof SVG.Element) {
	      SVG.Box.call(this, element.node.getBoundingClientRect())
	    }
	  }
	
	, inherit: SVG.Box
	
	  // define Parent
	, parent: SVG.Element
	
	, extend: {
	    addOffset: function() {
	      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
	      this.x += window.pageXOffset
	      this.y += window.pageYOffset
	      return this
	    }
	  }
	
	  // Constructor
	, construct: {
	    // Get rect box
	    rbox: function(el) {
	      if (el) return new SVG.RBox(this).transform(el.screenCTM().inverse())
	      return new SVG.RBox(this).addOffset()
	    }
	  }
	
	})
	
	SVG.RBox.prototype.constructor = SVG.RBox
	
	SVG.Matrix = SVG.invent({
	  // Initialize
	  create: function(source) {
	    var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])
	
	    // ensure source as object
	    source = source instanceof SVG.Element ?
	      source.matrixify() :
	    typeof source === 'string' ?
	      arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat)) :
	    arguments.length == 6 ?
	      arrayToMatrix([].slice.call(arguments)) :
	    Array.isArray(source) ?
	      arrayToMatrix(source) :
	    typeof source === 'object' ?
	      source : base
	
	    // merge source
	    for (i = abcdef.length - 1; i >= 0; --i)
	      this[abcdef[i]] = source[abcdef[i]] != null ?
	        source[abcdef[i]] : base[abcdef[i]]
	  }
	
	  // Add methods
	, extend: {
	    // Extract individual transformations
	    extract: function() {
	      // find delta transform points
	      var px    = deltaTransformPoint(this, 0, 1)
	        , py    = deltaTransformPoint(this, 1, 0)
	        , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90
	
	      return {
	        // translation
	        x:        this.e
	      , y:        this.f
	      , transformedX:(this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b)
	      , transformedY:(this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d)
	        // skew
	      , skewX:    -skewX
	      , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
	        // scale
	      , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
	      , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
	        // rotation
	      , rotation: skewX
	      , a: this.a
	      , b: this.b
	      , c: this.c
	      , d: this.d
	      , e: this.e
	      , f: this.f
	      , matrix: new SVG.Matrix(this)
	      }
	    }
	    // Clone matrix
	  , clone: function() {
	      return new SVG.Matrix(this)
	    }
	    // Morph one matrix into another
	  , morph: function(matrix) {
	      // store new destination
	      this.destination = new SVG.Matrix(matrix)
	
	      return this
	    }
	    // Get morphed matrix at a given position
	  , at: function(pos) {
	      // make sure a destination is defined
	      if (!this.destination) return this
	
	      // calculate morphed matrix at a given position
	      var matrix = new SVG.Matrix({
	        a: this.a + (this.destination.a - this.a) * pos
	      , b: this.b + (this.destination.b - this.b) * pos
	      , c: this.c + (this.destination.c - this.c) * pos
	      , d: this.d + (this.destination.d - this.d) * pos
	      , e: this.e + (this.destination.e - this.e) * pos
	      , f: this.f + (this.destination.f - this.f) * pos
	      })
	
	      return matrix
	    }
	    // Multiplies by given matrix
	  , multiply: function(matrix) {
	      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
	    }
	    // Inverses matrix
	  , inverse: function() {
	      return new SVG.Matrix(this.native().inverse())
	    }
	    // Translate matrix
	  , translate: function(x, y) {
	      return new SVG.Matrix(this.native().translate(x || 0, y || 0))
	    }
	    // Scale matrix
	  , scale: function(x, y, cx, cy) {
	      // support uniformal scale
	      if (arguments.length == 1) {
	        y = x
	      } else if (arguments.length == 3) {
	        cy = cx
	        cx = y
	        y = x
	      }
	
	      return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
	    }
	    // Rotate matrix
	  , rotate: function(r, cx, cy) {
	      // convert degrees to radians
	      r = SVG.utils.radians(r)
	
	      return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
	    }
	    // Flip matrix on x or y, at a given offset
	  , flip: function(a, o) {
	      return a == 'x' ?
	          this.scale(-1, 1, o, 0) :
	        a == 'y' ?
	          this.scale(1, -1, 0, o) :
	          this.scale(-1, -1, a, o != null ? o : a)
	    }
	    // Skew
	  , skew: function(x, y, cx, cy) {
	      // support uniformal skew
	      if (arguments.length == 1) {
	        y = x
	      } else if (arguments.length == 3) {
	        cy = cx
	        cx = y
	        y = x
	      }
	
	      // convert degrees to radians
	      x = SVG.utils.radians(x)
	      y = SVG.utils.radians(y)
	
	      return this.around(cx, cy, new SVG.Matrix(1, Math.tan(y), Math.tan(x), 1, 0, 0))
	    }
	    // SkewX
	  , skewX: function(x, cx, cy) {
	      return this.skew(x, 0, cx, cy)
	    }
	    // SkewY
	  , skewY: function(y, cx, cy) {
	      return this.skew(0, y, cx, cy)
	    }
	    // Transform around a center point
	  , around: function(cx, cy, matrix) {
	      return this
	        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
	        .multiply(matrix)
	        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
	    }
	    // Convert to native SVGMatrix
	  , native: function() {
	      // create new matrix
	      var matrix = SVG.parser.native.createSVGMatrix()
	
	      // update with current values
	      for (var i = abcdef.length - 1; i >= 0; i--)
	        matrix[abcdef[i]] = this[abcdef[i]]
	
	      return matrix
	    }
	    // Convert matrix to string
	  , toString: function() {
	      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
	    }
	  }
	
	  // Define parent
	, parent: SVG.Element
	
	  // Add parent method
	, construct: {
	    // Get current matrix
	    ctm: function() {
	      return new SVG.Matrix(this.node.getCTM())
	    },
	    // Get current screen matrix
	    screenCTM: function() {
	      /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
	         This is needed because FF does not return the transformation matrix
	         for the inner coordinate system when getScreenCTM() is called on nested svgs.
	         However all other Browsers do that */
	      if(this instanceof SVG.Nested) {
	        var rect = this.rect(1,1)
	        var m = rect.node.getScreenCTM()
	        rect.remove()
	        return new SVG.Matrix(m)
	      }
	      return new SVG.Matrix(this.node.getScreenCTM())
	    }
	
	  }
	
	})
	
	SVG.Point = SVG.invent({
	  // Initialize
	  create: function(x,y) {
	    var i, source, base = {x:0, y:0}
	
	    // ensure source as object
	    source = Array.isArray(x) ?
	      {x:x[0], y:x[1]} :
	    typeof x === 'object' ?
	      {x:x.x, y:x.y} :
	    x != null ?
	      {x:x, y:(y != null ? y : x)} : base // If y has no value, then x is used has its value
	
	    // merge source
	    this.x = source.x
	    this.y = source.y
	  }
	
	  // Add methods
	, extend: {
	    // Clone point
	    clone: function() {
	      return new SVG.Point(this)
	    }
	    // Morph one point into another
	  , morph: function(x, y) {
	      // store new destination
	      this.destination = new SVG.Point(x, y)
	
	      return this
	    }
	    // Get morphed point at a given position
	  , at: function(pos) {
	      // make sure a destination is defined
	      if (!this.destination) return this
	
	      // calculate morphed matrix at a given position
	      var point = new SVG.Point({
	        x: this.x + (this.destination.x - this.x) * pos
	      , y: this.y + (this.destination.y - this.y) * pos
	      })
	
	      return point
	    }
	    // Convert to native SVGPoint
	  , native: function() {
	      // create new point
	      var point = SVG.parser.native.createSVGPoint()
	
	      // update with current values
	      point.x = this.x
	      point.y = this.y
	
	      return point
	    }
	    // transform point with matrix
	  , transform: function(matrix) {
	      return new SVG.Point(this.native().matrixTransform(matrix.native()))
	    }
	
	  }
	
	})
	
	SVG.extend(SVG.Element, {
	
	  // Get point
	  point: function(x, y) {
	    return new SVG.Point(x,y).transform(this.screenCTM().inverse());
	  }
	
	})
	
	SVG.extend(SVG.Element, {
	  // Set svg element attribute
	  attr: function(a, v, n) {
	    // act as full getter
	    if (a == null) {
	      // get an object of attributes
	      a = {}
	      v = this.node.attributes
	      for (n = v.length - 1; n >= 0; n--)
	        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
	
	      return a
	
	    } else if (typeof a == 'object') {
	      // apply every attribute individually if an object is passed
	      for (v in a) this.attr(v, a[v])
	
	    } else if (v === null) {
	        // remove value
	        this.node.removeAttribute(a)
	
	    } else if (v == null) {
	      // act as a getter if the first and only argument is not an object
	      v = this.node.getAttribute(a)
	      return v == null ?
	        SVG.defaults.attrs[a] :
	      SVG.regex.isNumber.test(v) ?
	        parseFloat(v) : v
	
	    } else {
	      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
	      if (a == 'stroke-width')
	        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
	      else if (a == 'stroke')
	        this._stroke = v
	
	      // convert image fill and stroke to patterns
	      if (a == 'fill' || a == 'stroke') {
	        if (SVG.regex.isImage.test(v))
	          v = this.doc().defs().image(v, 0, 0)
	
	        if (v instanceof SVG.Image)
	          v = this.doc().defs().pattern(0, 0, function() {
	            this.add(v)
	          })
	      }
	
	      // ensure correct numeric values (also accepts NaN and Infinity)
	      if (typeof v === 'number')
	        v = new SVG.Number(v)
	
	      // ensure full hex color
	      else if (SVG.Color.isColor(v))
	        v = new SVG.Color(v)
	
	      // parse array values
	      else if (Array.isArray(v))
	        v = new SVG.Array(v)
	
	      // if the passed attribute is leading...
	      if (a == 'leading') {
	        // ... call the leading method instead
	        if (this.leading)
	          this.leading(v)
	      } else {
	        // set given attribute on node
	        typeof n === 'string' ?
	          this.node.setAttributeNS(n, a, v.toString()) :
	          this.node.setAttribute(a, v.toString())
	      }
	
	      // rebuild if required
	      if (this.rebuild && (a == 'font-size' || a == 'x'))
	        this.rebuild(a, v)
	    }
	
	    return this
	  }
	})
	SVG.extend(SVG.Element, {
	  // Add transformations
	  transform: function(o, relative) {
	    // get target in case of the fx module, otherwise reference this
	    var target = this
	      , matrix, bbox
	
	    // act as a getter
	    if (typeof o !== 'object') {
	      // get current matrix
	      matrix = new SVG.Matrix(target).extract()
	
	      return typeof o === 'string' ? matrix[o] : matrix
	    }
	
	    // get current matrix
	    matrix = new SVG.Matrix(target)
	
	    // ensure relative flag
	    relative = !!relative || !!o.relative
	
	    // act on matrix
	    if (o.a != null) {
	      matrix = relative ?
	        // relative
	        matrix.multiply(new SVG.Matrix(o)) :
	        // absolute
	        new SVG.Matrix(o)
	
	    // act on rotation
	    } else if (o.rotation != null) {
	      // ensure centre point
	      ensureCentre(o, target)
	
	      // apply transformation
	      matrix = relative ?
	        // relative
	        matrix.rotate(o.rotation, o.cx, o.cy) :
	        // absolute
	        matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)
	
	    // act on scale
	    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
	      // ensure centre point
	      ensureCentre(o, target)
	
	      // ensure scale values on both axes
	      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
	      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
	
	      if (!relative) {
	        // absolute; multiply inversed values
	        var e = matrix.extract()
	        o.scaleX = o.scaleX * 1 / e.scaleX
	        o.scaleY = o.scaleY * 1 / e.scaleY
	      }
	
	      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)
	
	    // act on skew
	    } else if (o.skew != null || o.skewX != null || o.skewY != null) {
	      // ensure centre point
	      ensureCentre(o, target)
	
	      // ensure skew values on both axes
	      o.skewX = o.skew != null ? o.skew : o.skewX != null ? o.skewX : 0
	      o.skewY = o.skew != null ? o.skew : o.skewY != null ? o.skewY : 0
	
	      if (!relative) {
	        // absolute; reset skew values
	        var e = matrix.extract()
	        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
	      }
	
	      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)
	
	    // act on flip
	    } else if (o.flip) {
	      if(o.flip == 'x' || o.flip == 'y') {
	        o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
	      } else {
	        if(o.offset == null) {
	          bbox = target.bbox()
	          o.flip = bbox.cx
	          o.offset = bbox.cy
	        } else {
	          o.flip = o.offset
	        }
	      }
	
	      matrix = new SVG.Matrix().flip(o.flip, o.offset)
	
	    // act on translate
	    } else if (o.x != null || o.y != null) {
	      if (relative) {
	        // relative
	        matrix = matrix.translate(o.x, o.y)
	      } else {
	        // absolute
	        if (o.x != null) matrix.e = o.x
	        if (o.y != null) matrix.f = o.y
	      }
	    }
	
	    return this.attr('transform', matrix)
	  }
	})
	
	SVG.extend(SVG.FX, {
	  transform: function(o, relative) {
	    // get target in case of the fx module, otherwise reference this
	    var target = this.target()
	      , matrix, bbox
	
	    // act as a getter
	    if (typeof o !== 'object') {
	      // get current matrix
	      matrix = new SVG.Matrix(target).extract()
	
	      return typeof o === 'string' ? matrix[o] : matrix
	    }
	
	    // ensure relative flag
	    relative = !!relative || !!o.relative
	
	    // act on matrix
	    if (o.a != null) {
	      matrix = new SVG.Matrix(o)
	
	    // act on rotation
	    } else if (o.rotation != null) {
	      // ensure centre point
	      ensureCentre(o, target)
	
	      // apply transformation
	      matrix = new SVG.Rotate(o.rotation, o.cx, o.cy)
	
	    // act on scale
	    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
	      // ensure centre point
	      ensureCentre(o, target)
	
	      // ensure scale values on both axes
	      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
	      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
	
	      matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)
	
	    // act on skew
	    } else if (o.skewX != null || o.skewY != null) {
	      // ensure centre point
	      ensureCentre(o, target)
	
	      // ensure skew values on both axes
	      o.skewX = o.skewX != null ? o.skewX : 0
	      o.skewY = o.skewY != null ? o.skewY : 0
	
	      matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)
	
	    // act on flip
	    } else if (o.flip) {
	      if(o.flip == 'x' || o.flip == 'y') {
	        o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
	      } else {
	        if(o.offset == null) {
	          bbox = target.bbox()
	          o.flip = bbox.cx
	          o.offset = bbox.cy
	        } else {
	          o.flip = o.offset
	        }
	      }
	
	      matrix = new SVG.Matrix().flip(o.flip, o.offset)
	
	    // act on translate
	    } else if (o.x != null || o.y != null) {
	      matrix = new SVG.Translate(o.x, o.y)
	    }
	
	    if(!matrix) return this
	
	    matrix.relative = relative
	
	    this.last().transforms.push(matrix)
	
	    return this._callStart()
	  }
	})
	
	SVG.extend(SVG.Element, {
	  // Reset all transformations
	  untransform: function() {
	    return this.attr('transform', null)
	  },
	  // merge the whole transformation chain into one matrix and returns it
	  matrixify: function() {
	
	    var matrix = (this.attr('transform') || '')
	      // split transformations
	      .split(SVG.regex.transforms).slice(0,-1).map(function(str){
	        // generate key => value pairs
	        var kv = str.trim().split('(')
	        return [kv[0], kv[1].split(SVG.regex.delimiter).map(function(str){ return parseFloat(str) })]
	      })
	      // merge every transformation into one matrix
	      .reduce(function(matrix, transform){
	
	        if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
	        return matrix[transform[0]].apply(matrix, transform[1])
	
	      }, new SVG.Matrix())
	
	    return matrix
	  },
	  // add an element to another parent without changing the visual representation on the screen
	  toParent: function(parent) {
	    if(this == parent) return this
	    var ctm = this.screenCTM()
	    var pCtm = parent.screenCTM().inverse()
	
	    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))
	
	    return this
	  },
	  // same as above with parent equals root-svg
	  toDoc: function() {
	    return this.toParent(this.doc())
	  }
	
	})
	
	SVG.Transformation = SVG.invent({
	
	  create: function(source, inversed){
	
	    if(arguments.length > 1 && typeof inversed != 'boolean'){
	      return this.constructor.call(this, [].slice.call(arguments))
	    }
	
	    if(Array.isArray(source)){
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        this[this.arguments[i]] = source[i]
	      }
	    } else if(typeof source == 'object'){
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        this[this.arguments[i]] = source[this.arguments[i]]
	      }
	    }
	
	    this.inversed = false
	
	    if(inversed === true){
	      this.inversed = true
	    }
	
	  }
	
	, extend: {
	
	    arguments: []
	  , method: ''
	
	  , at: function(pos){
	
	      var params = []
	
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        params.push(this[this.arguments[i]])
	      }
	
	      var m = this._undo || new SVG.Matrix()
	
	      m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos)
	
	      return this.inversed ? m.inverse() : m
	
	    }
	
	  , undo: function(o){
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]]
	      }
	
	      // The method SVG.Matrix.extract which was used before calling this
	      // method to obtain a value for the parameter o doesn't return a cx and
	      // a cy so we use the ones that were provided to this object at its creation
	      o.cx = this.cx
	      o.cy = this.cy
	
	      this._undo = new SVG[capitalize(this.method)](o, true).at(1)
	
	      return this
	    }
	
	  }
	
	})
	
	SVG.Translate = SVG.invent({
	
	  parent: SVG.Matrix
	, inherit: SVG.Transformation
	
	, create: function(source, inversed){
	    this.constructor.apply(this, [].slice.call(arguments))
	  }
	
	, extend: {
	    arguments: ['transformedX', 'transformedY']
	  , method: 'translate'
	  }
	
	})
	
	SVG.Rotate = SVG.invent({
	
	  parent: SVG.Matrix
	, inherit: SVG.Transformation
	
	, create: function(source, inversed){
	    this.constructor.apply(this, [].slice.call(arguments))
	  }
	
	, extend: {
	    arguments: ['rotation', 'cx', 'cy']
	  , method: 'rotate'
	  , at: function(pos){
	      var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy)
	      return this.inversed ? m.inverse() : m
	    }
	  , undo: function(o){
	      this._undo = o
	      return this
	    }
	  }
	
	})
	
	SVG.Scale = SVG.invent({
	
	  parent: SVG.Matrix
	, inherit: SVG.Transformation
	
	, create: function(source, inversed){
	    this.constructor.apply(this, [].slice.call(arguments))
	  }
	
	, extend: {
	    arguments: ['scaleX', 'scaleY', 'cx', 'cy']
	  , method: 'scale'
	  }
	
	})
	
	SVG.Skew = SVG.invent({
	
	  parent: SVG.Matrix
	, inherit: SVG.Transformation
	
	, create: function(source, inversed){
	    this.constructor.apply(this, [].slice.call(arguments))
	  }
	
	, extend: {
	    arguments: ['skewX', 'skewY', 'cx', 'cy']
	  , method: 'skew'
	  }
	
	})
	
	SVG.extend(SVG.Element, {
	  // Dynamic style generator
	  style: function(s, v) {
	    if (arguments.length == 0) {
	      // get full style
	      return this.node.style.cssText || ''
	
	    } else if (arguments.length < 2) {
	      // apply every style individually if an object is passed
	      if (typeof s == 'object') {
	        for (v in s) this.style(v, s[v])
	
	      } else if (SVG.regex.isCss.test(s)) {
	        // parse css string
	        s = s.split(/\s*;\s*/)
	          // filter out suffix ; and stuff like ;;
	          .filter(function(e) { return !!e })
	          .map(function(e){ return e.split(/\s*:\s*/) })
	
	        // apply every definition individually
	        while (v = s.pop()) {
	          this.style(v[0], v[1])
	        }
	      } else {
	        // act as a getter if the first and only argument is not an object
	        return this.node.style[camelCase(s)]
	      }
	
	    } else {
	      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
	    }
	
	    return this
	  }
	})
	SVG.Parent = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }
	
	  // Inherit from
	, inherit: SVG.Element
	
	  // Add class methods
	, extend: {
	    // Returns all child elements
	    children: function() {
	      return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
	        return SVG.adopt(node)
	      })
	    }
	    // Add given element at a position
	  , add: function(element, i) {
	      if (i == null)
	        this.node.appendChild(element.node)
	      else if (element.node != this.node.childNodes[i])
	        this.node.insertBefore(element.node, this.node.childNodes[i])
	
	      return this
	    }
	    // Basically does the same as `add()` but returns the added element instead
	  , put: function(element, i) {
	      this.add(element, i)
	      return element
	    }
	    // Checks if the given element is a child
	  , has: function(element) {
	      return this.index(element) >= 0
	    }
	    // Gets index of given element
	  , index: function(element) {
	      return [].slice.call(this.node.childNodes).indexOf(element.node)
	    }
	    // Get a element at the given index
	  , get: function(i) {
	      return SVG.adopt(this.node.childNodes[i])
	    }
	    // Get first child
	  , first: function() {
	      return this.get(0)
	    }
	    // Get the last child
	  , last: function() {
	      return this.get(this.node.childNodes.length - 1)
	    }
	    // Iterates over all children and invokes a given block
	  , each: function(block, deep) {
	      var i, il
	        , children = this.children()
	
	      for (i = 0, il = children.length; i < il; i++) {
	        if (children[i] instanceof SVG.Element)
	          block.apply(children[i], [i, children])
	
	        if (deep && (children[i] instanceof SVG.Container))
	          children[i].each(block, deep)
	      }
	
	      return this
	    }
	    // Remove a given child
	  , removeElement: function(element) {
	      this.node.removeChild(element.node)
	
	      return this
	    }
	    // Remove all elements in this container
	  , clear: function() {
	      // remove children
	      while(this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)
	
	      // remove defs reference
	      delete this._defs
	
	      return this
	    }
	  , // Get defs
	    defs: function() {
	      return this.doc().defs()
	    }
	  }
	
	})
	
	SVG.extend(SVG.Parent, {
	
	  ungroup: function(parent, depth) {
	    if(depth === 0 || this instanceof SVG.Defs || this.node == SVG.parser.draw) return this
	
	    parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent))
	    depth = depth || Infinity
	
	    this.each(function(){
	      if(this instanceof SVG.Defs) return this
	      if(this instanceof SVG.Parent) return this.ungroup(parent, depth-1)
	      return this.toParent(parent)
	    })
	
	    this.node.firstChild || this.remove()
	
	    return this
	  },
	
	  flatten: function(parent, depth) {
	    return this.ungroup(parent, depth)
	  }
	
	})
	SVG.Container = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }
	
	  // Inherit from
	, inherit: SVG.Parent
	
	})
	
	SVG.ViewBox = SVG.invent({
	
	  create: function(source) {
	    var i, base = [0, 0, 0, 0]
	
	    var x, y, width, height, box, view, we, he
	      , wm   = 1 // width multiplier
	      , hm   = 1 // height multiplier
	      , reg  = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi
	
	    if(source instanceof SVG.Element){
	
	      we = source
	      he = source
	      view = (source.attr('viewBox') || '').match(reg)
	      box = source.bbox
	
	      // get dimensions of current node
	      width  = new SVG.Number(source.width())
	      height = new SVG.Number(source.height())
	
	      // find nearest non-percentual dimensions
	      while (width.unit == '%') {
	        wm *= width.value
	        width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width())
	        we = we.parent()
	      }
	      while (height.unit == '%') {
	        hm *= height.value
	        height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height())
	        he = he.parent()
	      }
	
	      // ensure defaults
	      this.x      = 0
	      this.y      = 0
	      this.width  = width  * wm
	      this.height = height * hm
	      this.zoom   = 1
	
	      if (view) {
	        // get width and height from viewbox
	        x      = parseFloat(view[0])
	        y      = parseFloat(view[1])
	        width  = parseFloat(view[2])
	        height = parseFloat(view[3])
	
	        // calculate zoom accoring to viewbox
	        this.zoom = ((this.width / this.height) > (width / height)) ?
	          this.height / height :
	          this.width  / width
	
	        // calculate real pixel dimensions on parent SVG.Doc element
	        this.x      = x
	        this.y      = y
	        this.width  = width
	        this.height = height
	
	      }
	
	    }else{
	
	      // ensure source as object
	      source = typeof source === 'string' ?
	        source.match(reg).map(function(el){ return parseFloat(el) }) :
	      Array.isArray(source) ?
	        source :
	      typeof source == 'object' ?
	        [source.x, source.y, source.width, source.height] :
	      arguments.length == 4 ?
	        [].slice.call(arguments) :
	        base
	
	      this.x = source[0]
	      this.y = source[1]
	      this.width = source[2]
	      this.height = source[3]
	    }
	
	
	  }
	
	, extend: {
	
	    toString: function() {
	      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
	    }
	  , morph: function(x, y, width, height){
	      this.destination = new SVG.ViewBox(x, y, width, height)
	      return this
	    }
	
	  , at: function(pos) {
	
	      if(!this.destination) return this
	
	      return new SVG.ViewBox([
	          this.x + (this.destination.x - this.x) * pos
	        , this.y + (this.destination.y - this.y) * pos
	        , this.width + (this.destination.width - this.width) * pos
	        , this.height + (this.destination.height - this.height) * pos
	      ])
	
	    }
	
	  }
	
	  // Define parent
	, parent: SVG.Container
	
	  // Add parent method
	, construct: {
	
	    // get/set viewbox
	    viewbox: function(x, y, width, height) {
	      if (arguments.length == 0)
	        // act as a getter if there are no arguments
	        return new SVG.ViewBox(this)
	
	      // otherwise act as a setter
	      return this.attr('viewBox', new SVG.ViewBox(x, y, width, height))
	    }
	
	  }
	
	})
	// Add events to elements
	;[  'click'
	  , 'dblclick'
	  , 'mousedown'
	  , 'mouseup'
	  , 'mouseover'
	  , 'mouseout'
	  , 'mousemove'
	  // , 'mouseenter' -> not supported by IE
	  // , 'mouseleave' -> not supported by IE
	  , 'touchstart'
	  , 'touchmove'
	  , 'touchleave'
	  , 'touchend'
	  , 'touchcancel' ].forEach(function(event) {
	
	  // add event to SVG.Element
	  SVG.Element.prototype[event] = function(f) {
	    // bind event to element rather than element node
	    SVG.on(this.node, event, f)
	    return this
	  }
	})
	
	// Initialize listeners stack
	SVG.listeners = []
	SVG.handlerMap = []
	SVG.listenerId = 0
	
	// Add event binder in the SVG namespace
	SVG.on = function(node, event, listener, binding, options) {
	  // create listener, get object-index
	  var l     = listener.bind(binding || node.instance || node)
	    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
	    , ev    = event.split('.')[0]
	    , ns    = event.split('.')[1] || '*'
	
	
	  // ensure valid object
	  SVG.listeners[index]         = SVG.listeners[index]         || {}
	  SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
	  SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}
	
	  if(!listener._svgjsListenerId)
	    listener._svgjsListenerId = ++SVG.listenerId
	
	  // reference listener
	  SVG.listeners[index][ev][ns][listener._svgjsListenerId] = l
	
	  // add listener
	  node.addEventListener(ev, l, options || false)
	}
	
	// Add event unbinder in the SVG namespace
	SVG.off = function(node, event, listener) {
	  var index = SVG.handlerMap.indexOf(node)
	    , ev    = event && event.split('.')[0]
	    , ns    = event && event.split('.')[1]
	    , namespace = ''
	
	  if(index == -1) return
	
	  if (listener) {
	    if(typeof listener == 'function') listener = listener._svgjsListenerId
	    if(!listener) return
	
	    // remove listener reference
	    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
	      // remove listener
	      node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)
	
	      delete SVG.listeners[index][ev][ns || '*'][listener]
	    }
	
	  } else if (ns && ev) {
	    // remove all listeners for a namespaced event
	    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
	      for (listener in SVG.listeners[index][ev][ns])
	        SVG.off(node, [ev, ns].join('.'), listener)
	
	      delete SVG.listeners[index][ev][ns]
	    }
	
	  } else if (ns){
	    // remove all listeners for a specific namespace
	    for(event in SVG.listeners[index]){
	        for(namespace in SVG.listeners[index][event]){
	            if(ns === namespace){
	                SVG.off(node, [event, ns].join('.'))
	            }
	        }
	    }
	
	  } else if (ev) {
	    // remove all listeners for the event
	    if (SVG.listeners[index][ev]) {
	      for (namespace in SVG.listeners[index][ev])
	        SVG.off(node, [ev, namespace].join('.'))
	
	      delete SVG.listeners[index][ev]
	    }
	
	  } else {
	    // remove all listeners on a given node
	    for (event in SVG.listeners[index])
	      SVG.off(node, event)
	
	    delete SVG.listeners[index]
	    delete SVG.handlerMap[index]
	
	  }
	}
	
	//
	SVG.extend(SVG.Element, {
	  // Bind given event to listener
	  on: function(event, listener, binding, options) {
	    SVG.on(this.node, event, listener, binding, options)
	
	    return this
	  }
	  // Unbind event from listener
	, off: function(event, listener) {
	    SVG.off(this.node, event, listener)
	
	    return this
	  }
	  // Fire given event
	, fire: function(event, data) {
	
	    // Dispatch event
	    if(event instanceof window.Event){
	        this.node.dispatchEvent(event)
	    }else{
	        this.node.dispatchEvent(event = new window.CustomEvent(event, {detail:data, cancelable: true}))
	    }
	
	    this._event = event
	    return this
	  }
	, event: function() {
	    return this._event
	  }
	})
	
	
	SVG.Defs = SVG.invent({
	  // Initialize node
	  create: 'defs'
	
	  // Inherit from
	, inherit: SVG.Container
	
	})
	SVG.G = SVG.invent({
	  // Initialize node
	  create: 'g'
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2)
	    }
	  , gbox: function() {
	
	      var bbox  = this.bbox()
	        , trans = this.transform()
	
	      bbox.x  += trans.x
	      bbox.x2 += trans.x
	      bbox.cx += trans.x
	
	      bbox.y  += trans.y
	      bbox.y2 += trans.y
	      bbox.cy += trans.y
	
	      return bbox
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create a group element
	    group: function() {
	      return this.put(new SVG.G)
	    }
	  }
	})
	
	// ### This module adds backward / forward functionality to elements.
	
	//
	SVG.extend(SVG.Element, {
	  // Get all siblings, including myself
	  siblings: function() {
	    return this.parent().children()
	  }
	  // Get the curent position siblings
	, position: function() {
	    return this.parent().index(this)
	  }
	  // Get the next element (will return null if there is none)
	, next: function() {
	    return this.siblings()[this.position() + 1]
	  }
	  // Get the next element (will return null if there is none)
	, previous: function() {
	    return this.siblings()[this.position() - 1]
	  }
	  // Send given element one step forward
	, forward: function() {
	    var i = this.position() + 1
	      , p = this.parent()
	
	    // move node one step forward
	    p.removeElement(this).add(this, i)
	
	    // make sure defs node is always at the top
	    if (p instanceof SVG.Doc)
	      p.node.appendChild(p.defs().node)
	
	    return this
	  }
	  // Send given element one step backward
	, backward: function() {
	    var i = this.position()
	
	    if (i > 0)
	      this.parent().removeElement(this).add(this, i - 1)
	
	    return this
	  }
	  // Send given element all the way to the front
	, front: function() {
	    var p = this.parent()
	
	    // Move node forward
	    p.node.appendChild(this.node)
	
	    // Make sure defs node is always at the top
	    if (p instanceof SVG.Doc)
	      p.node.appendChild(p.defs().node)
	
	    return this
	  }
	  // Send given element all the way to the back
	, back: function() {
	    if (this.position() > 0)
	      this.parent().removeElement(this).add(this, 0)
	
	    return this
	  }
	  // Inserts a given element before the targeted element
	, before: function(element) {
	    element.remove()
	
	    var i = this.position()
	
	    this.parent().add(element, i)
	
	    return this
	  }
	  // Insters a given element after the targeted element
	, after: function(element) {
	    element.remove()
	
	    var i = this.position()
	
	    this.parent().add(element, i + 1)
	
	    return this
	  }
	
	})
	SVG.Mask = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('mask'))
	
	    // keep references to masked elements
	    this.targets = []
	  }
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Unmask all masked elements and remove itself
	    remove: function() {
	      // unmask all targets
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unmask()
	      this.targets = []
	
	      // remove mask from parent
	      this.parent().removeElement(this)
	
	      return this
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create masking element
	    mask: function() {
	      return this.defs().put(new SVG.Mask)
	    }
	  }
	})
	
	
	SVG.extend(SVG.Element, {
	  // Distribute mask to svg element
	  maskWith: function(element) {
	    // use given mask or create a new one
	    this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)
	
	    // store reverence on self in mask
	    this.masker.targets.push(this)
	
	    // apply mask
	    return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
	  }
	  // Unmask element
	, unmask: function() {
	    delete this.masker
	    return this.attr('mask', null)
	  }
	
	})
	
	SVG.ClipPath = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('clipPath'))
	
	    // keep references to clipped elements
	    this.targets = []
	  }
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Unclip all clipped elements and remove itself
	    remove: function() {
	      // unclip all targets
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unclip()
	      this.targets = []
	
	      // remove clipPath from parent
	      this.parent().removeElement(this)
	
	      return this
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create clipping element
	    clip: function() {
	      return this.defs().put(new SVG.ClipPath)
	    }
	  }
	})
	
	//
	SVG.extend(SVG.Element, {
	  // Distribute clipPath to svg element
	  clipWith: function(element) {
	    // use given clip or create a new one
	    this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)
	
	    // store reverence on self in mask
	    this.clipper.targets.push(this)
	
	    // apply mask
	    return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
	  }
	  // Unclip element
	, unclip: function() {
	    delete this.clipper
	    return this.attr('clip-path', null)
	  }
	
	})
	SVG.Gradient = SVG.invent({
	  // Initialize node
	  create: function(type) {
	    this.constructor.call(this, SVG.create(type + 'Gradient'))
	
	    // store type
	    this.type = type
	  }
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Add a color stop
	    at: function(offset, color, opacity) {
	      return this.put(new SVG.Stop).update(offset, color, opacity)
	    }
	    // Update gradient
	  , update: function(block) {
	      // remove all stops
	      this.clear()
	
	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)
	
	      return this
	    }
	    // Return the fill id
	  , fill: function() {
	      return 'url(#' + this.id() + ')'
	    }
	    // Alias string convertion to fill
	  , toString: function() {
	      return this.fill()
	    }
	    // custom attr to handle transform
	  , attr: function(a, b, c) {
	      if(a == 'transform') a = 'gradientTransform'
	      return SVG.Container.prototype.attr.call(this, a, b, c)
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create gradient element in defs
	    gradient: function(type, block) {
	      return this.defs().gradient(type, block)
	    }
	  }
	})
	
	// Add animatable methods to both gradient and fx module
	SVG.extend(SVG.Gradient, SVG.FX, {
	  // From position
	  from: function(x, y) {
	    return (this._target || this).type == 'radial' ?
	      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
	      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
	  }
	  // To position
	, to: function(x, y) {
	    return (this._target || this).type == 'radial' ?
	      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
	      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
	  }
	})
	
	// Base gradient generation
	SVG.extend(SVG.Defs, {
	  // define gradient
	  gradient: function(type, block) {
	    return this.put(new SVG.Gradient(type)).update(block)
	  }
	
	})
	
	SVG.Stop = SVG.invent({
	  // Initialize node
	  create: 'stop'
	
	  // Inherit from
	, inherit: SVG.Element
	
	  // Add class methods
	, extend: {
	    // add color stops
	    update: function(o) {
	      if (typeof o == 'number' || o instanceof SVG.Number) {
	        o = {
	          offset:  arguments[0]
	        , color:   arguments[1]
	        , opacity: arguments[2]
	        }
	      }
	
	      // set attributes
	      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
	      if (o.color   != null) this.attr('stop-color', o.color)
	      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
	
	      return this
	    }
	  }
	
	})
	
	SVG.Pattern = SVG.invent({
	  // Initialize node
	  create: 'pattern'
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Return the fill id
	    fill: function() {
	      return 'url(#' + this.id() + ')'
	    }
	    // Update pattern by rebuilding
	  , update: function(block) {
	      // remove content
	      this.clear()
	
	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)
	
	      return this
	    }
	    // Alias string convertion to fill
	  , toString: function() {
	      return this.fill()
	    }
	    // custom attr to handle transform
	  , attr: function(a, b, c) {
	      if(a == 'transform') a = 'patternTransform'
	      return SVG.Container.prototype.attr.call(this, a, b, c)
	    }
	
	  }
	
	  // Add parent method
	, construct: {
	    // Create pattern element in defs
	    pattern: function(width, height, block) {
	      return this.defs().pattern(width, height, block)
	    }
	  }
	})
	
	SVG.extend(SVG.Defs, {
	  // Define gradient
	  pattern: function(width, height, block) {
	    return this.put(new SVG.Pattern).update(block).attr({
	      x:            0
	    , y:            0
	    , width:        width
	    , height:       height
	    , patternUnits: 'userSpaceOnUse'
	    })
	  }
	
	})
	SVG.Doc = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    if (element) {
	      // ensure the presence of a dom element
	      element = typeof element == 'string' ?
	        document.getElementById(element) :
	        element
	
	      // If the target is an svg element, use that element as the main wrapper.
	      // This allows svg.js to work with svg documents as well.
	      if (element.nodeName == 'svg') {
	        this.constructor.call(this, element)
	      } else {
	        this.constructor.call(this, SVG.create('svg'))
	        element.appendChild(this.node)
	        this.size('100%', '100%')
	      }
	
	      // set svg element attributes and ensure defs node
	      this.namespace().defs()
	    }
	  }
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Add namespaces
	    namespace: function() {
	      return this
	        .attr({ xmlns: SVG.ns, version: '1.1' })
	        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
	        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
	    }
	    // Creates and returns defs element
	  , defs: function() {
	      if (!this._defs) {
	        var defs
	
	        // Find or create a defs element in this instance
	        if (defs = this.node.getElementsByTagName('defs')[0])
	          this._defs = SVG.adopt(defs)
	        else
	          this._defs = new SVG.Defs
	
	        // Make sure the defs node is at the end of the stack
	        this.node.appendChild(this._defs.node)
	      }
	
	      return this._defs
	    }
	    // custom parent method
	  , parent: function() {
	      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
	    }
	    // Fix for possible sub-pixel offset. See:
	    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
	  , spof: function() {
	      var pos = this.node.getScreenCTM()
	
	      if (pos)
	        this
	          .style('left', (-pos.e % 1) + 'px')
	          .style('top',  (-pos.f % 1) + 'px')
	
	      return this
	    }
	
	      // Removes the doc from the DOM
	  , remove: function() {
	      if(this.parent()) {
	        this.parent().removeChild(this.node)
	      }
	
	      return this
	    }
	  , clear: function() {
	      // remove children
	      while(this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)
	
	      // remove defs reference
	      delete this._defs
	
	      // add back parser
	      if(!SVG.parser.draw.parentNode)
	        this.node.appendChild(SVG.parser.draw)
	
	      return this
	    }
	  }
	
	})
	
	SVG.Shape = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }
	
	  // Inherit from
	, inherit: SVG.Element
	
	})
	
	SVG.Bare = SVG.invent({
	  // Initialize
	  create: function(element, inherit) {
	    // construct element
	    this.constructor.call(this, SVG.create(element))
	
	    // inherit custom methods
	    if (inherit)
	      for (var method in inherit.prototype)
	        if (typeof inherit.prototype[method] === 'function')
	          this[method] = inherit.prototype[method]
	  }
	
	  // Inherit from
	, inherit: SVG.Element
	
	  // Add methods
	, extend: {
	    // Insert some plain text
	    words: function(text) {
	      // remove contents
	      while (this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)
	
	      // create text node
	      this.node.appendChild(document.createTextNode(text))
	
	      return this
	    }
	  }
	})
	
	
	SVG.extend(SVG.Parent, {
	  // Create an element that is not described by SVG.js
	  element: function(element, inherit) {
	    return this.put(new SVG.Bare(element, inherit))
	  }
	})
	
	SVG.Symbol = SVG.invent({
	  // Initialize node
	  create: 'symbol'
	
	  // Inherit from
	, inherit: SVG.Container
	
	, construct: {
	    // create symbol
	    symbol: function() {
	      return this.put(new SVG.Symbol)
	    }
	  }
	})
	
	SVG.Use = SVG.invent({
	  // Initialize node
	  create: 'use'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add class methods
	, extend: {
	    // Use element as a reference
	    element: function(element, file) {
	      // Set lined element
	      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create a use element
	    use: function(element, file) {
	      return this.put(new SVG.Use).element(element, file)
	    }
	  }
	})
	SVG.Rect = SVG.invent({
	  // Initialize node
	  create: 'rect'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add parent method
	, construct: {
	    // Create a rect element
	    rect: function(width, height) {
	      return this.put(new SVG.Rect()).size(width, height)
	    }
	  }
	})
	SVG.Circle = SVG.invent({
	  // Initialize node
	  create: 'circle'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add parent method
	, construct: {
	    // Create circle element, based on ellipse
	    circle: function(size) {
	      return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
	    }
	  }
	})
	
	SVG.extend(SVG.Circle, SVG.FX, {
	  // Radius x value
	  rx: function(rx) {
	    return this.attr('r', rx)
	  }
	  // Alias radius x value
	, ry: function(ry) {
	    return this.rx(ry)
	  }
	})
	
	SVG.Ellipse = SVG.invent({
	  // Initialize node
	  create: 'ellipse'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add parent method
	, construct: {
	    // Create an ellipse
	    ellipse: function(width, height) {
	      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
	    }
	  }
	})
	
	SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
	  // Radius x value
	  rx: function(rx) {
	    return this.attr('rx', rx)
	  }
	  // Radius y value
	, ry: function(ry) {
	    return this.attr('ry', ry)
	  }
	})
	
	// Add common method
	SVG.extend(SVG.Circle, SVG.Ellipse, {
	    // Move over x-axis
	    x: function(x) {
	      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.attr('cx') : this.attr('cx', x)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.attr('cy') : this.attr('cy', y)
	    }
	    // Set width of element
	  , width: function(width) {
	      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
	    }
	    // Set height of element
	  , height: function(height) {
	      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
	    }
	    // Custom size function
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)
	
	      return this
	        .rx(new SVG.Number(p.width).divide(2))
	        .ry(new SVG.Number(p.height).divide(2))
	    }
	})
	SVG.Line = SVG.invent({
	  // Initialize node
	  create: 'line'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add class methods
	, extend: {
	    // Get array
	    array: function() {
	      return new SVG.PointArray([
	        [ this.attr('x1'), this.attr('y1') ]
	      , [ this.attr('x2'), this.attr('y2') ]
	      ])
	    }
	    // Overwrite native plot() method
	  , plot: function(x1, y1, x2, y2) {
	      if (x1 == null)
	        return this.array()
	      else if (typeof y1 !== 'undefined')
	        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
	      else
	        x1 = new SVG.PointArray(x1).toLine()
	
	      return this.attr(x1)
	    }
	    // Move by left top corner
	  , move: function(x, y) {
	      return this.attr(this.array().move(x, y).toLine())
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)
	
	      return this.attr(this.array().size(p.width, p.height).toLine())
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create a line element
	    line: function(x1, y1, x2, y2) {
	      // make sure plot is called as a setter
	      // x1 is not necessarily a number, it can also be an array, a string and a SVG.PointArray
	      return SVG.Line.prototype.plot.apply(
	        this.put(new SVG.Line)
	      , x1 != null ? [x1, y1, x2, y2] : [0, 0, 0, 0]
	      )
	    }
	  }
	})
	
	SVG.Polyline = SVG.invent({
	  // Initialize node
	  create: 'polyline'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add parent method
	, construct: {
	    // Create a wrapped polyline element
	    polyline: function(p) {
	      // make sure plot is called as a setter
	      return this.put(new SVG.Polyline).plot(p || new SVG.PointArray)
	    }
	  }
	})
	
	SVG.Polygon = SVG.invent({
	  // Initialize node
	  create: 'polygon'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add parent method
	, construct: {
	    // Create a wrapped polygon element
	    polygon: function(p) {
	      // make sure plot is called as a setter
	      return this.put(new SVG.Polygon).plot(p || new SVG.PointArray)
	    }
	  }
	})
	
	// Add polygon-specific functions
	SVG.extend(SVG.Polyline, SVG.Polygon, {
	  // Get array
	  array: function() {
	    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
	  }
	  // Plot new path
	, plot: function(p) {
	    return (p == null) ?
	      this.array() :
	      this.clear().attr('points', typeof p == 'string' ? p : (this._array = new SVG.PointArray(p)))
	  }
	  // Clear array cache
	, clear: function() {
	    delete this._array
	    return this
	  }
	  // Move by left top corner
	, move: function(x, y) {
	    return this.attr('points', this.array().move(x, y))
	  }
	  // Set element size to given width and height
	, size: function(width, height) {
	    var p = proportionalSize(this, width, height)
	
	    return this.attr('points', this.array().size(p.width, p.height))
	  }
	
	})
	
	// unify all point to point elements
	SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
	  // Define morphable array
	  morphArray:  SVG.PointArray
	  // Move by left top corner over x-axis
	, x: function(x) {
	    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	  }
	  // Move by left top corner over y-axis
	, y: function(y) {
	    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	  }
	  // Set width of element
	, width: function(width) {
	    var b = this.bbox()
	
	    return width == null ? b.width : this.size(width, b.height)
	  }
	  // Set height of element
	, height: function(height) {
	    var b = this.bbox()
	
	    return height == null ? b.height : this.size(b.width, height)
	  }
	})
	SVG.Path = SVG.invent({
	  // Initialize node
	  create: 'path'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add class methods
	, extend: {
	    // Define morphable array
	    morphArray:  SVG.PathArray
	    // Get array
	  , array: function() {
	      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
	    }
	    // Plot new path
	  , plot: function(d) {
	      return (d == null) ?
	        this.array() :
	        this.clear().attr('d', typeof d == 'string' ? d : (this._array = new SVG.PathArray(d)))
	    }
	    // Clear array cache
	  , clear: function() {
	      delete this._array
	      return this
	    }
	    // Move by left top corner
	  , move: function(x, y) {
	      return this.attr('d', this.array().move(x, y))
	    }
	    // Move by left top corner over x-axis
	  , x: function(x) {
	      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	    }
	    // Move by left top corner over y-axis
	  , y: function(y) {
	      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)
	
	      return this.attr('d', this.array().size(p.width, p.height))
	    }
	    // Set width of element
	  , width: function(width) {
	      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
	    }
	    // Set height of element
	  , height: function(height) {
	      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
	    }
	
	  }
	
	  // Add parent method
	, construct: {
	    // Create a wrapped path element
	    path: function(d) {
	      // make sure plot is called as a setter
	      return this.put(new SVG.Path).plot(d || new SVG.PathArray)
	    }
	  }
	})
	
	SVG.Image = SVG.invent({
	  // Initialize node
	  create: 'image'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add class methods
	, extend: {
	    // (re)load image
	    load: function(url) {
	      if (!url) return this
	
	      var self = this
	        , img  = new window.Image()
	
	      // preload image
	      SVG.on(img, 'load', function() {
	        var p = self.parent(SVG.Pattern)
	
	        if(p === null) return
	
	        // ensure image size
	        if (self.width() == 0 && self.height() == 0)
	          self.size(img.width, img.height)
	
	        // ensure pattern size if not set
	        if (p && p.width() == 0 && p.height() == 0)
	          p.size(self.width(), self.height())
	
	        // callback
	        if (typeof self._loaded === 'function')
	          self._loaded.call(self, {
	            width:  img.width
	          , height: img.height
	          , ratio:  img.width / img.height
	          , url:    url
	          })
	      })
	
	      SVG.on(img, 'error', function(e){
	        if (typeof self._error === 'function'){
	            self._error.call(self, e)
	        }
	      })
	
	      return this.attr('href', (img.src = this.src = url), SVG.xlink)
	    }
	    // Add loaded callback
	  , loaded: function(loaded) {
	      this._loaded = loaded
	      return this
	    }
	
	  , error: function(error) {
	      this._error = error
	      return this
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // create image element, load image and set its size
	    image: function(source, width, height) {
	      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
	    }
	  }
	
	})
	SVG.Text = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('text'))
	
	    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
	    this._rebuild = true                      // enable automatic updating of dy values
	    this._build   = false                     // disable build mode for adding multiple lines
	
	    // set default font
	    this.attr('font-family', SVG.defaults.attrs['font-family'])
	  }
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      // act as getter
	      if (x == null)
	        return this.attr('x')
	
	      return this.attr('x', x)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      var oy = this.attr('y')
	        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0
	
	      // act as getter
	      if (y == null)
	        return typeof oy === 'number' ? oy - o : oy
	
	      return this.attr('y', typeof y === 'number' ? y + o : y)
	    }
	    // Move center over x-axis
	  , cx: function(x) {
	      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
	    }
	    // Move center over y-axis
	  , cy: function(y) {
	      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
	    }
	    // Set the text content
	  , text: function(text) {
	      // act as getter
	      if (typeof text === 'undefined'){
	        var text = ''
	        var children = this.node.childNodes
	        for(var i = 0, len = children.length; i < len; ++i){
	
	          // add newline if its not the first child and newLined is set to true
	          if(i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true){
	            text += '\n'
	          }
	
	          // add content of this node
	          text += children[i].textContent
	        }
	
	        return text
	      }
	
	      // remove existing content
	      this.clear().build(true)
	
	      if (typeof text === 'function') {
	        // call block
	        text.call(this, this)
	
	      } else {
	        // store text and make sure text is not blank
	        text = text.split('\n')
	
	        // build new lines
	        for (var i = 0, il = text.length; i < il; i++)
	          this.tspan(text[i]).newLine()
	      }
	
	      // disable build mode and rebuild lines
	      return this.build(false).rebuild()
	    }
	    // Set font size
	  , size: function(size) {
	      return this.attr('font-size', size).rebuild()
	    }
	    // Set / get leading
	  , leading: function(value) {
	      // act as getter
	      if (value == null)
	        return this.dom.leading
	
	      // act as setter
	      this.dom.leading = new SVG.Number(value)
	
	      return this.rebuild()
	    }
	    // Get all the first level lines
	  , lines: function() {
	      var node = (this.textPath && this.textPath() || this).node
	
	      // filter tspans and map them to SVG.js instances
	      var lines = SVG.utils.map(SVG.utils.filterSVGElements(node.childNodes), function(el){
	        return SVG.adopt(el)
	      })
	
	      // return an instance of SVG.set
	      return new SVG.Set(lines)
	    }
	    // Rebuild appearance type
	  , rebuild: function(rebuild) {
	      // store new rebuild flag if given
	      if (typeof rebuild == 'boolean')
	        this._rebuild = rebuild
	
	      // define position of all lines
	      if (this._rebuild) {
	        var self = this
	          , blankLineOffset = 0
	          , dy = this.dom.leading * new SVG.Number(this.attr('font-size'))
	
	        this.lines().each(function() {
	          if (this.dom.newLined) {
	            if (!self.textPath())
	              this.attr('x', self.attr('x'))
	            if(this.text() == '\n') {
	              blankLineOffset += dy
	            }else{
	              this.attr('dy', dy + blankLineOffset)
	              blankLineOffset = 0
	            }
	          }
	        })
	
	        this.fire('rebuild')
	      }
	
	      return this
	    }
	    // Enable / disable build mode
	  , build: function(build) {
	      this._build = !!build
	      return this
	    }
	    // overwrite method from parent to set data properly
	  , setData: function(o){
	      this.dom = o
	      this.dom.leading = new SVG.Number(o.leading || 1.3)
	      return this
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create text element
	    text: function(text) {
	      return this.put(new SVG.Text).text(text)
	    }
	    // Create plain text element
	  , plain: function(text) {
	      return this.put(new SVG.Text).plain(text)
	    }
	  }
	
	})
	
	SVG.Tspan = SVG.invent({
	  // Initialize node
	  create: 'tspan'
	
	  // Inherit from
	, inherit: SVG.Shape
	
	  // Add class methods
	, extend: {
	    // Set text content
	    text: function(text) {
	      if(text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')
	
	      typeof text === 'function' ? text.call(this, this) : this.plain(text)
	
	      return this
	    }
	    // Shortcut dx
	  , dx: function(dx) {
	      return this.attr('dx', dx)
	    }
	    // Shortcut dy
	  , dy: function(dy) {
	      return this.attr('dy', dy)
	    }
	    // Create new line
	  , newLine: function() {
	      // fetch text parent
	      var t = this.parent(SVG.Text)
	
	      // mark new line
	      this.dom.newLined = true
	
	      // apply new hy¡n
	      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
	    }
	  }
	
	})
	
	SVG.extend(SVG.Text, SVG.Tspan, {
	  // Create plain text node
	  plain: function(text) {
	    // clear if build mode is disabled
	    if (this._build === false)
	      this.clear()
	
	    // create text node
	    this.node.appendChild(document.createTextNode(text))
	
	    return this
	  }
	  // Create a tspan
	, tspan: function(text) {
	    var node  = (this.textPath && this.textPath() || this).node
	      , tspan = new SVG.Tspan
	
	    // clear if build mode is disabled
	    if (this._build === false)
	      this.clear()
	
	    // add new tspan
	    node.appendChild(tspan.node)
	
	    return tspan.text(text)
	  }
	  // Clear all lines
	, clear: function() {
	    var node = (this.textPath && this.textPath() || this).node
	
	    // remove existing child nodes
	    while (node.hasChildNodes())
	      node.removeChild(node.lastChild)
	
	    return this
	  }
	  // Get length of text element
	, length: function() {
	    return this.node.getComputedTextLength()
	  }
	})
	
	SVG.TextPath = SVG.invent({
	  // Initialize node
	  create: 'textPath'
	
	  // Inherit from
	, inherit: SVG.Parent
	
	  // Define parent class
	, parent: SVG.Text
	
	  // Add parent method
	, construct: {
	    morphArray: SVG.PathArray
	    // Create path for text to run on
	  , path: function(d) {
	      // create textPath element
	      var path  = new SVG.TextPath
	        , track = this.doc().defs().path(d)
	
	      // move lines to textpath
	      while (this.node.hasChildNodes())
	        path.node.appendChild(this.node.firstChild)
	
	      // add textPath element as child node
	      this.node.appendChild(path.node)
	
	      // link textPath to path and add content
	      path.attr('href', '#' + track, SVG.xlink)
	
	      return this
	    }
	    // return the array of the path track element
	  , array: function() {
	      var track = this.track()
	
	      return track ? track.array() : null
	    }
	    // Plot path if any
	  , plot: function(d) {
	      var track = this.track()
	        , pathArray = null
	
	      if (track) {
	        pathArray = track.plot(d)
	      }
	
	      return (d == null) ? pathArray : this
	    }
	    // Get the path track element
	  , track: function() {
	      var path = this.textPath()
	
	      if (path)
	        return path.reference('href')
	    }
	    // Get the textPath child
	  , textPath: function() {
	      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
	        return SVG.adopt(this.node.firstChild)
	    }
	  }
	})
	
	SVG.Nested = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('svg'))
	
	    this.style('overflow', 'visible')
	  }
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add parent method
	, construct: {
	    // Create nested svg document
	    nested: function() {
	      return this.put(new SVG.Nested)
	    }
	  }
	})
	SVG.A = SVG.invent({
	  // Initialize node
	  create: 'a'
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Link url
	    to: function(url) {
	      return this.attr('href', url, SVG.xlink)
	    }
	    // Link show attribute
	  , show: function(target) {
	      return this.attr('show', target, SVG.xlink)
	    }
	    // Link target attribute
	  , target: function(target) {
	      return this.attr('target', target)
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create a hyperlink element
	    link: function(url) {
	      return this.put(new SVG.A).to(url)
	    }
	  }
	})
	
	SVG.extend(SVG.Element, {
	  // Create a hyperlink element
	  linkTo: function(url) {
	    var link = new SVG.A
	
	    if (typeof url == 'function')
	      url.call(link, link)
	    else
	      link.to(url)
	
	    return this.parent().put(link).put(this)
	  }
	
	})
	SVG.Marker = SVG.invent({
	  // Initialize node
	  create: 'marker'
	
	  // Inherit from
	, inherit: SVG.Container
	
	  // Add class methods
	, extend: {
	    // Set width of element
	    width: function(width) {
	      return this.attr('markerWidth', width)
	    }
	    // Set height of element
	  , height: function(height) {
	      return this.attr('markerHeight', height)
	    }
	    // Set marker refX and refY
	  , ref: function(x, y) {
	      return this.attr('refX', x).attr('refY', y)
	    }
	    // Update marker
	  , update: function(block) {
	      // remove all content
	      this.clear()
	
	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)
	
	      return this
	    }
	    // Return the fill id
	  , toString: function() {
	      return 'url(#' + this.id() + ')'
	    }
	  }
	
	  // Add parent method
	, construct: {
	    marker: function(width, height, block) {
	      // Create marker element in defs
	      return this.defs().marker(width, height, block)
	    }
	  }
	
	})
	
	SVG.extend(SVG.Defs, {
	  // Create marker
	  marker: function(width, height, block) {
	    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
	    return this.put(new SVG.Marker)
	      .size(width, height)
	      .ref(width / 2, height / 2)
	      .viewbox(0, 0, width, height)
	      .attr('orient', 'auto')
	      .update(block)
	  }
	
	})
	
	SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
	  // Create and attach markers
	  marker: function(marker, width, height, block) {
	    var attr = ['marker']
	
	    // Build attribute name
	    if (marker != 'all') attr.push(marker)
	    attr = attr.join('-')
	
	    // Set marker attribute
	    marker = arguments[1] instanceof SVG.Marker ?
	      arguments[1] :
	      this.doc().marker(width, height, block)
	
	    return this.attr(attr, marker)
	  }
	
	})
	// Define list of available attributes for stroke and fill
	var sugar = {
	  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
	, fill:   ['color', 'opacity', 'rule']
	, prefix: function(t, a) {
	    return a == 'color' ? t : t + '-' + a
	  }
	}
	
	// Add sugar for fill and stroke
	;['fill', 'stroke'].forEach(function(m) {
	  var i, extension = {}
	
	  extension[m] = function(o) {
	    if (typeof o == 'undefined')
	      return this
	    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
	      this.attr(m, o)
	
	    else
	      // set all attributes from sugar.fill and sugar.stroke list
	      for (i = sugar[m].length - 1; i >= 0; i--)
	        if (o[sugar[m][i]] != null)
	          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
	
	    return this
	  }
	
	  SVG.extend(SVG.Element, SVG.FX, extension)
	
	})
	
	SVG.extend(SVG.Element, SVG.FX, {
	  // Map rotation to transform
	  rotate: function(d, cx, cy) {
	    return this.transform({ rotation: d, cx: cx, cy: cy })
	  }
	  // Map skew to transform
	, skew: function(x, y, cx, cy) {
	    return arguments.length == 1  || arguments.length == 3 ?
	      this.transform({ skew: x, cx: y, cy: cx }) :
	      this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
	  }
	  // Map scale to transform
	, scale: function(x, y, cx, cy) {
	    return arguments.length == 1  || arguments.length == 3 ?
	      this.transform({ scale: x, cx: y, cy: cx }) :
	      this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
	  }
	  // Map translate to transform
	, translate: function(x, y) {
	    return this.transform({ x: x, y: y })
	  }
	  // Map flip to transform
	, flip: function(a, o) {
	    o = typeof a == 'number' ? a : o
	    return this.transform({ flip: a || 'both', offset: o })
	  }
	  // Map matrix to transform
	, matrix: function(m) {
	    return this.attr('transform', new SVG.Matrix(arguments.length == 6 ? [].slice.call(arguments) : m))
	  }
	  // Opacity
	, opacity: function(value) {
	    return this.attr('opacity', value)
	  }
	  // Relative move over x axis
	, dx: function(x) {
	    return this.x(new SVG.Number(x).plus(this instanceof SVG.FX ? 0 : this.x()), true)
	  }
	  // Relative move over y axis
	, dy: function(y) {
	    return this.y(new SVG.Number(y).plus(this instanceof SVG.FX ? 0 : this.y()), true)
	  }
	  // Relative move over x and y axes
	, dmove: function(x, y) {
	    return this.dx(x).dy(y)
	  }
	})
	
	SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
	  // Add x and y radius
	  radius: function(x, y) {
	    var type = (this._target || this).type;
	    return type == 'radial' || type == 'circle' ?
	      this.attr('r', new SVG.Number(x)) :
	      this.rx(x).ry(y == null ? x : y)
	  }
	})
	
	SVG.extend(SVG.Path, {
	  // Get path length
	  length: function() {
	    return this.node.getTotalLength()
	  }
	  // Get point at length
	, pointAt: function(length) {
	    return this.node.getPointAtLength(length)
	  }
	})
	
	SVG.extend(SVG.Parent, SVG.Text, SVG.Tspan, SVG.FX, {
	  // Set font
	  font: function(a, v) {
	    if (typeof a == 'object') {
	      for (v in a) this.font(v, a[v])
	    }
	
	    return a == 'leading' ?
	        this.leading(v) :
	      a == 'anchor' ?
	        this.attr('text-anchor', v) :
	      a == 'size' || a == 'family' || a == 'weight' || a == 'stretch' || a == 'variant' || a == 'style' ?
	        this.attr('font-'+ a, v) :
	        this.attr(a, v)
	  }
	})
	
	SVG.Set = SVG.invent({
	  // Initialize
	  create: function(members) {
	    // Set initial state
	    Array.isArray(members) ? this.members = members : this.clear()
	  }
	
	  // Add class methods
	, extend: {
	    // Add element to set
	    add: function() {
	      var i, il, elements = [].slice.call(arguments)
	
	      for (i = 0, il = elements.length; i < il; i++)
	        this.members.push(elements[i])
	
	      return this
	    }
	    // Remove element from set
	  , remove: function(element) {
	      var i = this.index(element)
	
	      // remove given child
	      if (i > -1)
	        this.members.splice(i, 1)
	
	      return this
	    }
	    // Iterate over all members
	  , each: function(block) {
	      for (var i = 0, il = this.members.length; i < il; i++)
	        block.apply(this.members[i], [i, this.members])
	
	      return this
	    }
	    // Restore to defaults
	  , clear: function() {
	      // initialize store
	      this.members = []
	
	      return this
	    }
	    // Get the length of a set
	  , length: function() {
	      return this.members.length
	    }
	    // Checks if a given element is present in set
	  , has: function(element) {
	      return this.index(element) >= 0
	    }
	    // retuns index of given element in set
	  , index: function(element) {
	      return this.members.indexOf(element)
	    }
	    // Get member at given index
	  , get: function(i) {
	      return this.members[i]
	    }
	    // Get first member
	  , first: function() {
	      return this.get(0)
	    }
	    // Get last member
	  , last: function() {
	      return this.get(this.members.length - 1)
	    }
	    // Default value
	  , valueOf: function() {
	      return this.members
	    }
	    // Get the bounding box of all members included or empty box if set has no items
	  , bbox: function(){
	      // return an empty box of there are no members
	      if (this.members.length == 0)
	        return new SVG.RBox()
	
	      // get the first rbox and update the target bbox
	      var rbox = this.members[0].rbox(this.members[0].doc())
	
	      this.each(function() {
	        // user rbox for correct position and visual representation
	        rbox = rbox.merge(this.rbox(this.doc()))
	      })
	
	      return rbox
	    }
	  }
	
	  // Add parent method
	, construct: {
	    // Create a new set
	    set: function(members) {
	      return new SVG.Set(members)
	    }
	  }
	})
	
	SVG.FX.Set = SVG.invent({
	  // Initialize node
	  create: function(set) {
	    // store reference to set
	    this.set = set
	  }
	
	})
	
	// Alias methods
	SVG.Set.inherit = function() {
	  var m
	    , methods = []
	
	  // gather shape methods
	  for(var m in SVG.Shape.prototype)
	    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
	      methods.push(m)
	
	  // apply shape aliasses
	  methods.forEach(function(method) {
	    SVG.Set.prototype[method] = function() {
	      for (var i = 0, il = this.members.length; i < il; i++)
	        if (this.members[i] && typeof this.members[i][method] == 'function')
	          this.members[i][method].apply(this.members[i], arguments)
	
	      return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
	    }
	  })
	
	  // clear methods for the next round
	  methods = []
	
	  // gather fx methods
	  for(var m in SVG.FX.prototype)
	    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
	      methods.push(m)
	
	  // apply fx aliasses
	  methods.forEach(function(method) {
	    SVG.FX.Set.prototype[method] = function() {
	      for (var i = 0, il = this.set.members.length; i < il; i++)
	        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)
	
	      return this
	    }
	  })
	}
	
	
	
	
	SVG.extend(SVG.Element, {
	  // Store data values on svg nodes
	  data: function(a, v, r) {
	    if (typeof a == 'object') {
	      for (v in a)
	        this.data(v, a[v])
	
	    } else if (arguments.length < 2) {
	      try {
	        return JSON.parse(this.attr('data-' + a))
	      } catch(e) {
	        return this.attr('data-' + a)
	      }
	
	    } else {
	      this.attr(
	        'data-' + a
	      , v === null ?
	          null :
	        r === true || typeof v === 'string' || typeof v === 'number' ?
	          v :
	          JSON.stringify(v)
	      )
	    }
	
	    return this
	  }
	})
	SVG.extend(SVG.Element, {
	  // Remember arbitrary data
	  remember: function(k, v) {
	    // remember every item in an object individually
	    if (typeof arguments[0] == 'object')
	      for (var v in k)
	        this.remember(v, k[v])
	
	    // retrieve memory
	    else if (arguments.length == 1)
	      return this.memory()[k]
	
	    // store memory
	    else
	      this.memory()[k] = v
	
	    return this
	  }
	
	  // Erase a given memory
	, forget: function() {
	    if (arguments.length == 0)
	      this._memory = {}
	    else
	      for (var i = arguments.length - 1; i >= 0; i--)
	        delete this.memory()[arguments[i]]
	
	    return this
	  }
	
	  // Initialize or return local memory object
	, memory: function() {
	    return this._memory || (this._memory = {})
	  }
	
	})
	// Method for getting an element by id
	SVG.get = function(id) {
	  var node = document.getElementById(idFromReference(id) || id)
	  return SVG.adopt(node)
	}
	
	// Select elements by query string
	SVG.select = function(query, parent) {
	  return new SVG.Set(
	    SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
	      return SVG.adopt(node)
	    })
	  )
	}
	
	SVG.extend(SVG.Parent, {
	  // Scoped select method
	  select: function(query) {
	    return SVG.select(query, this.node)
	  }
	
	})
	function pathRegReplace(a, b, c, d) {
	  return c + d.replace(SVG.regex.dots, ' .')
	}
	
	// creates deep clone of array
	function array_clone(arr){
	  var clone = arr.slice(0)
	  for(var i = clone.length; i--;){
	    if(Array.isArray(clone[i])){
	      clone[i] = array_clone(clone[i])
	    }
	  }
	  return clone
	}
	
	// tests if a given element is instance of an object
	function is(el, obj){
	  return el instanceof obj
	}
	
	// tests if a given selector matches an element
	function matches(el, selector) {
	  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	}
	
	// Convert dash-separated-string to camelCase
	function camelCase(s) {
	  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
	    return g.toUpperCase()
	  })
	}
	
	// Capitalize first letter of a string
	function capitalize(s) {
	  return s.charAt(0).toUpperCase() + s.slice(1)
	}
	
	// Ensure to six-based hex
	function fullHex(hex) {
	  return hex.length == 4 ?
	    [ '#',
	      hex.substring(1, 2), hex.substring(1, 2)
	    , hex.substring(2, 3), hex.substring(2, 3)
	    , hex.substring(3, 4), hex.substring(3, 4)
	    ].join('') : hex
	}
	
	// Component to hex value
	function compToHex(comp) {
	  var hex = comp.toString(16)
	  return hex.length == 1 ? '0' + hex : hex
	}
	
	// Calculate proportional width and height values when necessary
	function proportionalSize(element, width, height) {
	  if (width == null || height == null) {
	    var box = element.bbox()
	
	    if (width == null)
	      width = box.width / box.height * height
	    else if (height == null)
	      height = box.height / box.width * width
	  }
	
	  return {
	    width:  width
	  , height: height
	  }
	}
	
	// Delta transform point
	function deltaTransformPoint(matrix, x, y) {
	  return {
	    x: x * matrix.a + y * matrix.c + 0
	  , y: x * matrix.b + y * matrix.d + 0
	  }
	}
	
	// Map matrix array to object
	function arrayToMatrix(a) {
	  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
	}
	
	// Parse matrix if required
	function parseMatrix(matrix) {
	  if (!(matrix instanceof SVG.Matrix))
	    matrix = new SVG.Matrix(matrix)
	
	  return matrix
	}
	
	// Add centre point to transform object
	function ensureCentre(o, target) {
	  o.cx = o.cx == null ? target.bbox().cx : o.cx
	  o.cy = o.cy == null ? target.bbox().cy : o.cy
	}
	
	// PathArray Helpers
	function arrayToString(a) {
	  for (var i = 0, il = a.length, s = ''; i < il; i++) {
	    s += a[i][0]
	
	    if (a[i][1] != null) {
	      s += a[i][1]
	
	      if (a[i][2] != null) {
	        s += ' '
	        s += a[i][2]
	
	        if (a[i][3] != null) {
	          s += ' '
	          s += a[i][3]
	          s += ' '
	          s += a[i][4]
	
	          if (a[i][5] != null) {
	            s += ' '
	            s += a[i][5]
	            s += ' '
	            s += a[i][6]
	
	            if (a[i][7] != null) {
	              s += ' '
	              s += a[i][7]
	            }
	          }
	        }
	      }
	    }
	  }
	
	  return s + ' '
	}
	
	// Deep new id assignment
	function assignNewId(node) {
	  // do the same for SVG child nodes as well
	  for (var i = node.childNodes.length - 1; i >= 0; i--)
	    if (node.childNodes[i] instanceof window.SVGElement)
	      assignNewId(node.childNodes[i])
	
	  return SVG.adopt(node).id(SVG.eid(node.nodeName))
	}
	
	// Add more bounding box properties
	function fullBox(b) {
	  if (b.x == null) {
	    b.x      = 0
	    b.y      = 0
	    b.width  = 0
	    b.height = 0
	  }
	
	  b.w  = b.width
	  b.h  = b.height
	  b.x2 = b.x + b.width
	  b.y2 = b.y + b.height
	  b.cx = b.x + b.width / 2
	  b.cy = b.y + b.height / 2
	
	  return b
	}
	
	// Get id from reference string
	function idFromReference(url) {
	  var m = url.toString().match(SVG.regex.reference)
	
	  if (m) return m[1]
	}
	
	// Create matrix array for looping
	var abcdef = 'abcdef'.split('')
	// Add CustomEvent to IE9 and IE10
	if (typeof window.CustomEvent !== 'function') {
	  // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	  var CustomEvent = function(event, options) {
	    options = options || { bubbles: false, cancelable: false, detail: undefined }
	    var e = document.createEvent('CustomEvent')
	    e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
	    return e
	  }
	
	  CustomEvent.prototype = window.Event.prototype
	
	  window.CustomEvent = CustomEvent
	}
	
	// requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
	(function(w) {
	  var lastTime = 0
	  var vendors = ['moz', 'webkit']
	
	  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
	    w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
	                              w[vendors[x] + 'CancelRequestAnimationFrame']
	  }
	
	  w.requestAnimationFrame = w.requestAnimationFrame ||
	    function(callback) {
	      var currTime = new Date().getTime()
	      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
	
	      var id = w.setTimeout(function() {
	        callback(currTime + timeToCall)
	      }, timeToCall)
	
	      lastTime = currTime + timeToCall
	      return id
	    }
	
	  w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;
	
	}(window))
	
	return SVG
	
	}));

/***/ })

});