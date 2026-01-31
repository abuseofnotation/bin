"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.constant = exports.compose = exports.rCompose = exports.printMap = void 0;
    var printMap = function (arr) { return arr.map(function (row) { return row.join(' '); }).join('\n'); };
    exports.printMap = printMap;
    var rCompose = function (functions) { return functions
        .reduce(function (fn1, fn2) { return function (state) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fn2(state)(fn1(state).apply(void 0, args));
    }; }; }); };
    exports.rCompose = rCompose;
    var compose = function (functions) { return functions
        .reduce(function (fn1, fn2) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fn2(fn1.apply(void 0, args));
    }; }); };
    exports.compose = compose;
    var constant = function (a) { return function () { return a; }; };
    exports.constant = constant;
});
define("lib", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.fillCanvas = exports.init = exports.pick = exports.getRandomInt = exports.intensityMap = exports.random = void 0;
    var random = function (intensity) { return (0, exports.getRandomInt)(intensity) + 1 === intensity; };
    exports.random = random;
    var intensityMap = function (_a) {
        var width = _a.width, height = _a.height;
        return function (intensityFn) {
            return Array(width).fill(1).map(function (_, x) { return Array(height).fill(1).map(function (_, y) { return intensityFn(x, y); }); });
        };
    };
    exports.intensityMap = intensityMap;
    var getRandomInt = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    exports.getRandomInt = getRandomInt;
    var pick = function (options) { return options[(0, exports.getRandomInt)(options.length)]; };
    exports.pick = pick;
    var init = function (_a) {
        var width = _a.width, height = _a.height;
        return function () {
            return (0, exports.intensityMap)({ width: width, height: height })(function () { return undefined; });
        };
    };
    exports.init = init;
    var fillCanvas = function (canvas, _a, grid) {
        var pixelSize = _a.pixelSize;
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Rendering grid", grid);
        grid.forEach(function (row, horizontalIndex) {
            row.forEach(function (blockColor, verticalIndex) {
                if (blockColor) {
                    var width = horizontalIndex * pixelSize;
                    var height = verticalIndex * pixelSize;
                    context.fillStyle = blockColor;
                    context.fillRect(width, height, pixelSize, pixelSize);
                }
            });
        });
        return canvas;
    };
    exports.fillCanvas = fillCanvas;
    var createCanvas = function (grid, _a) {
        var pixelSize = _a.pixelSize;
        var canvas = document.createElement('canvas');
        canvas.width = grid.length * pixelSize;
        canvas.height = grid[0].length * pixelSize;
        canvas.style.margin = pixelSize * 20 + 'px';
        return canvas;
    };
    var render = function (config) { return function (grid) {
        return (0, exports.fillCanvas)(createCanvas(grid, config), config, grid);
    }; };
});
define("maps", ["require", "exports", "lib"], function (require, exports, lib_js_1) {
    "use strict";
    exports.__esModule = true;
    exports.circle = exports.triangles = exports.fractal = exports.grandient = exports.horizontalLines = exports.verticalLines = exports.constant = exports.symmetry = exports.verticalSymmetry = exports.horizontalSymmetry = exports.diagonals = exports.hallway = exports.cornerProximity = exports.centerProximity = void 0;
    var centerProximityFn = function (intensity, _a) {
        var width = _a.width, height = _a.height;
        return function (x, y) {
            var xP = Math.abs(width / 2 - x);
            var yP = Math.abs(height / 2 - y);
            return intensity * (Math.sqrt(xP * xP + yP * yP));
        };
    };
    var centerProximity = function (config, intensity) {
        if (intensity === void 0) { intensity = 1; }
        return (0, lib_js_1.intensityMap)(config)(centerProximityFn(intensity, config));
    };
    exports.centerProximity = centerProximity;
    var cornerDistance = function (x, l) { return x < (l - x) ? x : (l - x); };
    var cornerProximityFn = function (intensity, _a) {
        if (intensity === void 0) { intensity = 1; }
        var width = _a.width, height = _a.height;
        return function (x, y) {
            var xP = cornerDistance(x, width);
            var yP = cornerDistance(y, height);
            return intensity * Math.sqrt(xP * xP + yP * yP);
        };
    };
    var cornerProximity = function (config, intensity) {
        if (intensity === void 0) { intensity = 2; }
        return (0, lib_js_1.intensityMap)(config)(cornerProximityFn(intensity, config));
    };
    exports.cornerProximity = cornerProximity;
    var hallwayFn = function (intensity, _a) {
        if (intensity === void 0) { intensity = 1; }
        var width = _a.width, height = _a.height;
        return function (x, y) {
            var hallwaySize = 3;
            if (x < height / hallwaySize || x > 2 * (height / hallwaySize)) {
                return intensity;
            }
            else {
                return 0;
            }
        };
    };
    var hallway = function (config, intensity) {
        if (intensity === void 0) { intensity = 4; }
        return (0, lib_js_1.intensityMap)(config)(hallwayFn(intensity, config));
    };
    exports.hallway = hallway;
    var smallestNumber = function (numbers) { return numbers.reduce(function (a, b) { return a < b ? a : b; }); };
    var diagonalsFn = function (intensity, _a) {
        if (intensity === void 0) { intensity = 600; }
        var width = _a.width, height = _a.height;
        return function (x, y) {
            var leftDiagonal = 1 + (intensity * Math.abs(x / width - y / height));
            var rightDiagonal = 1 + (intensity * Math.abs((width - x) / width - y / height));
            var num = smallestNumber([leftDiagonal, rightDiagonal]);
            return Math.floor(num);
        };
    };
    var diagonals = function (config, intensity) {
        if (intensity === void 0) { intensity = 4; }
        return (0, lib_js_1.intensityMap)(config)(diagonalsFn(intensity, config));
    };
    exports.diagonals = diagonals;
    var createSymmetry = function (map) { return map.map(function (row, i) {
        if (i < map.length / 2) {
            return row;
        }
        else {
            return map[map.length - i];
        }
    }); };
    var horizontalSymmetry = function (config, intensity) {
        if (intensity === void 0) { intensity = 2000; }
        var map = (0, lib_js_1.intensityMap)(config)(function () { return (0, lib_js_1.random)(intensity) ? 1 : undefined; });
        return createSymmetry(map);
    };
    exports.horizontalSymmetry = horizontalSymmetry;
    var verticalSymmetry = function (config, intensity) {
        if (intensity === void 0) { intensity = 2000; }
        var map = (0, lib_js_1.intensityMap)(config)(function () { return (0, lib_js_1.random)(intensity) ? 1 : undefined; });
        return map.map(createSymmetry);
    };
    exports.verticalSymmetry = verticalSymmetry;
    var symmetry = function (config, intensity) {
        if (intensity === void 0) { intensity = 2000; }
        var map = (0, lib_js_1.intensityMap)(config)(function () { return (0, lib_js_1.random)(intensity) ? 1 : undefined; });
        return createSymmetry(map).map(createSymmetry);
    };
    exports.symmetry = symmetry;
    var constant = function (config, intensity) {
        if (intensity === void 0) { intensity = 2000; }
        return (0, lib_js_1.intensityMap)(config)(function () { return intensity; });
    };
    exports.constant = constant;
    var verticalLinesFn = function (intensity, _a) {
        if (intensity === void 0) { intensity = 1; }
        var width = _a.width, height = _a.height;
        return function (x, y) {
            var xP = cornerDistance(x, width);
            var yP = cornerDistance(y, height);
            return intensity * Math.sqrt(xP * xP + yP * yP);
        };
    };
    var verticalLines = function (config, intensity) {
        if (intensity === void 0) { intensity = 100; }
        return (0, lib_js_1.intensityMap)(config)(function (x, y) { return x % (config.width / intensity) * 5; });
    };
    exports.verticalLines = verticalLines;
    var horizontalLines = function (config, intensity) {
        if (intensity === void 0) { intensity = 100; }
        return (0, lib_js_1.intensityMap)(config)(function (x, y) { return y % (config.height / intensity) * 5; });
    };
    exports.horizontalLines = horizontalLines;
    var grandient = function (config, intensity) {
        if (intensity === void 0) { intensity = 100; }
        return (0, lib_js_1.intensityMap)(config)(function (x, y) { return (config.height - y) * intensity; });
    };
    exports.grandient = grandient;
    var fractal = function (config, intensity) {
        if (intensity === void 0) { intensity = 5; }
        return (0, lib_js_1.intensityMap)(config)(function (x, y) { return ((x ^ y) % intensity === 0) ? 0 : 1; });
    };
    exports.fractal = fractal;
    var triangles = function (config, intensity) {
        if (intensity === void 0) { intensity = 5; }
        return (0, lib_js_1.intensityMap)(config)(function (x, y) { return (((x) & (x ^ y)) === 0) ? 1 : 0; });
    };
    exports.triangles = triangles;
    var circle = function (config, radiusCoefficient) {
        if (radiusCoefficient === void 0) { radiusCoefficient = 4; }
        return (0, lib_js_1.intensityMap)(config)(function (x, y) {
            var radius = config.width / (radiusCoefficient / 10);
            var xCentre = config.width / 2;
            var yCentre = config.height / 2;
            var xDistance = Math.abs(x - xCentre);
            var yDistance = Math.abs(y - yCentre);
            if (((xDistance * xDistance) + (yDistance * yDistance)) > radius * radius) {
                return 1;
            }
            else {
                return 0;
            }
        });
    };
    exports.circle = circle;
});
define("sizers", ["require", "exports", "lib"], function (require, exports, lib) {
    "use strict";
    exports.__esModule = true;
    exports.intenso = exports.intensoReversed = exports.random = exports.constant = void 0;
    var constant = function (config, size) {
        if (size === void 0) { size = 2000; }
        return function (_a, cellIntensity) {
            var x = _a.x, y = _a.y;
            return lib.random(cellIntensity) ? size : 0;
        };
    };
    exports.constant = constant;
    var random = function (config, size) {
        if (size === void 0) { size = 2000; }
        return function (_a, cellIntensity) {
            var x = _a.x, y = _a.y;
            return lib.random(cellIntensity) ? lib.getRandomInt(size) : 0;
        };
    };
    exports.random = random;
    var minIntensityCoefficient = 20;
    var intensoReversed = function (config, size) {
        if (size === void 0) { size = 2000; }
        return function (_a, cellIntensity) {
            var x = _a.x, y = _a.y;
            return lib.random(cellIntensity) ? size * (cellIntensity / (minIntensityCoefficient * size)) : 0;
        };
    };
    exports.intensoReversed = intensoReversed;
    var intenso = function (config, size) {
        if (size === void 0) { size = 2000; }
        return function (_a, cellIntensity) {
            var x = _a.x, y = _a.y;
            return lib.random(cellIntensity) ? size - (size * (cellIntensity / (minIntensityCoefficient * size))) : 0;
        };
    };
    exports.intenso = intenso;
});
define("fillers", ["require", "exports", "lib", "maps", "sizers"], function (require, exports, lib_js_2, maps, sizers) {
    "use strict";
    exports.__esModule = true;
    exports.layer = exports.plasher = exports.splasher = void 0;
    var splashSpot = function (canvas, x, y, color, size) {
        if (size === void 0) { size = 3; }
        var indexInRange = function (i, y) { return (i > (y - size)) && (i < (y + size)); };
        canvas.forEach(function (row, i) {
            if (indexInRange(i, x)) {
                row.forEach(function (_, i) {
                    if (indexInRange(i, y)) {
                        row[i] = color;
                    }
                });
            }
        });
    };
    var empty = function (canvas, x, y, color, size) {
        if (size === void 0) { size = 3; }
        var empty = true;
        var indexInRange = function (i, y) { return (i > (y - size)) && (i < (y + size)); };
        canvas.forEach(function (row, i) {
            if (indexInRange(i, x)) {
                row.forEach(function (_, i) {
                    if (indexInRange(i, y)) {
                        if (row[i] !== undefined) {
                            empty = false;
                        }
                    }
                });
            }
        });
        return empty;
    };
    var verify = function (filler) { return function (layer, config, canvas) {
        var _a = layer.dataset, size = _a.size, sizeParams = _a.sizeParams, colors = _a.colors, map = _a.map, params = _a.params;
        var theColors = (colors || config.colors).split(',');
        var mapFn = maps[map];
        var sizeFn = sizers[size];
        if (mapFn === undefined) {
            throw "Undefined map - ".concat(map);
        }
        else if (sizeFn === undefined) {
            throw "Undefined sizer - ".concat(size);
        }
        else {
            var map_1 = mapFn(config, parseFloat(params));
            console.log('Filling layer', { size: size, colors: colors, map: map_1, params: params });
            console.log("Generated intensity map", map_1);
            return filler({
                colors: theColors,
                sizeFn: sizeFn(config, parseFloat(sizeParams)),
                map: map_1
            }, config, canvas);
        }
    }; };
    exports.splasher = verify(function (_a, config, canvas) {
        var sizeFn = _a.sizeFn, colors = _a.colors, map = _a.map;
        map
            .forEach(function (row, _x) { return row.forEach(function (cellIntensity, _y) {
            var x = _x + (config.x || 0);
            var y = _y + (config.y || 0);
            splashSpot(canvas, x, y, (0, lib_js_2.pick)(colors || config.colors), parseInt(sizeFn({ x: x, y: y }, cellIntensity)));
        }); });
        return canvas;
    });
    exports.plasher = verify(function (_a, config, canvas) {
        var sizeFn = _a.sizeFn, colors = _a.colors, map = _a.map;
        map
            .forEach(function (row, _x) { return row.forEach(function (cellIntensity, _y) {
            var x = _x + (config.x || 0);
            var y = _y + (config.y || 0);
            var size = sizeFn({ x: x, y: y }, cellIntensity);
            if (empty(canvas, x, y, (0, lib_js_2.pick)(colors || config.colors), parseInt(size))) {
                splashSpot(canvas, x, y, (0, lib_js_2.pick)(colors || config.colors), parseInt(size));
            }
        }); });
        return canvas;
    });
    var toNumber = function (quantity, globalQuantity) {
        if (quantity) {
            if (/px/.test(quantity)) {
                return parseInt(quantity);
            }
            else if (/%/.test(quantity)) {
                return globalQuantity * parseFloat(quantity) / 100;
            }
            else {
                throw new TypeError("Invalid quantity ".concat(quantity));
            }
        }
        else {
            return globalQuantity;
        }
    };
    var layer = function (canvas, parentConfig, grid) {
        var config = __assign(__assign({}, parentConfig), { width: toNumber(canvas.getAttribute("width"), parentConfig.width), height: toNumber(canvas.getAttribute("height"), parentConfig.height), x: toNumber((canvas.getAttribute("x") || "0px"), parentConfig.width) + (parent.x || 0), y: toNumber((canvas.getAttribute("y") || "0px"), parentConfig.height) + (parent.y || 0) });
        console.log(parent.x || 0);
        console.log(toNumber((canvas.getAttribute("x") || "0px"), parentConfig.width) + parent.x || 0);
        console.log("Found layer ", config);
        Array.prototype.slice.call(canvas.children)
            .forEach(function (layer) {
            var filler = fillers[layer.localName];
            if (filler === undefined) {
                throw "Invalid filler ".concat(layer.localName);
            }
            else {
                grid = filler(layer, config, grid);
            }
        });
        return grid;
    };
    exports.layer = layer;
    var fillers = { splasher: exports.splasher, plasher: exports.plasher, layer: exports.layer };
});
define("render", ["require", "exports", "lib", "fillers"], function (require, exports, lib_1, fillers) {
    "use strict";
    exports.__esModule = true;
    exports.render = void 0;
    var render = function (canvas, config) {
        config.width = parseInt(canvas.width);
        config.height = parseInt(canvas.height);
        config.pixelSize = 1;
        var grid = fillers.layer(canvas, config, (0, lib_1.init)(config)());
        console.log('config', config);
        (0, lib_1.fillCanvas)(canvas, config, grid);
    };
    exports.render = render;
});
define("index", ["require", "exports", "render"], function (require, exports, render_1) {
    "use strict";
    exports.__esModule = true;
    var parseBool = function (str) {
        if (str === "true" || str === true) {
            return true;
        }
        if (str === "false" || str === false) {
            return false;
        }
        if (str === undefined) {
            return false;
        }
        else {
            throw new TypeError("".concat(str, " is not a bool"));
        }
    };
    var defaultConfig = {
        drawLayerByLayer: true
    };
    var renderStuff = function () {
        Array.prototype.slice.call(document.getElementsByClassName('art')).forEach(function (canvas) {
            console.log('data', canvas.dataset);
            var config = Object.assign({}, defaultConfig, canvas.dataset);
            config.repeat = parseInt(config.repeat);
            config.drawLayerbyLayer = parseBool(config.drawLayerByLayer);
            console.log('Rendering canvas with data ', config);
            (0, render_1.render)(canvas, config);
            if (config.repeat) {
                setInterval(function () { return (0, render_1.render)(canvas, config); }, config.repeat);
            }
        });
    };
    if (document.readyState === "complete" || document.readyState === "interactive") {
        renderStuff();
    }
    else {
        document.addEventListener("DOMContentLoaded", renderStuff);
    }
});
define("processors", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.clearEveryNthLine = exports.clearLines = void 0;
    var clearLines = function (pixels) { return function (map) { return map.map(function (row, i) {
        if (Math.floor(i / pixels) % 2 === 0) {
            return row;
        }
        else {
            return row.map(function () { return undefined; });
        }
    }); }; };
    exports.clearLines = clearLines;
    var clearEveryNthLine = function (pixels) { return function (map) { return map.map(function (row, i) {
        if (i % pixels !== 0) {
            return row;
        }
        else {
            return row.map(function () { return undefined; });
        }
    }); }; };
    exports.clearEveryNthLine = clearEveryNthLine;
});
var requirejs, require, define;
(function (global, setTimeout) {
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = '2.3.6', commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document), isWebWorker = !isBrowser && typeof importScripts !== 'undefined', readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
        /^complete$/ : /^(complete|loaded)$/, defContextName = '_', isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]', contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = false;
    function commentReplace(match, singlePrefix) {
        return singlePrefix || '';
    }
    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }
    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }
    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    }
                    else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }
    function scripts() {
        return document.getElementsByTagName('script');
    }
    function defaultOnError(err) {
        throw err;
    }
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttps://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }
    if (typeof define !== 'undefined') {
        return;
    }
    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }
    if (typeof require !== 'undefined' && !isFunction(require)) {
        cfg = require;
        require = undefined;
    }
    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers, checkLoadedTimeoutId, config = {
            waitSeconds: 7,
            baseUrl: './',
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, registry = {}, enabledRegistry = {}, undefEvents = {}, defQueue = [], defined = {}, urlFetched = {}, bundlesMap = {}, requireCounter = 1, unnormalizedCounter = 1;
        function trimDots(ary) {
            var i, part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                }
                else if (part === '..') {
                    if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    }
                    else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex, foundMap, foundI, foundStarMap, starI, normalizedBaseParts, baseParts = (baseName && baseName.split('/')), map = config.map, starMap = map && map['*'];
            if (name) {
                name = name.split('/');
                lastIndex = name.length - 1;
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }
                if (name[0].charAt(0) === '.' && baseParts) {
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = normalizedBaseParts.concat(name);
                }
                trimDots(name);
                name = name.join('/');
            }
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');
                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');
                    if (baseParts) {
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }
                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }
                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }
            pkgMain = getOwn(config.pkgs, name);
            return pkgMain ? pkgMain : name;
        }
        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                        scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }
        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                pathConfig.shift();
                context.require.undef(id);
                context.makeRequire(null, {
                    skipMap: true
                })([id]);
                return true;
            }
        }
        function splitPrefix(name) {
            var prefix, index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts, prefix = null, parentName = parentModuleMap ? parentModuleMap.name : null, originalName = name, isDefine = true, normalizedName = '';
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }
            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];
            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }
            if (name) {
                if (prefix) {
                    if (isNormalized) {
                        normalizedName = name;
                    }
                    else if (pluginModule && pluginModule.normalize) {
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    }
                    else {
                        normalizedName = name.indexOf('!') === -1 ?
                            normalize(name, parentName, applyMap) :
                            name;
                    }
                }
                else {
                    normalizedName = normalize(name, parentName, applyMap);
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;
                    url = context.nameToUrl(normalizedName);
                }
            }
            suffix = prefix && !pluginModule && !isNormalized ?
                '_unnormalized' + (unnormalizedCounter += 1) :
                '';
            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                    prefix + '!' + normalizedName :
                    normalizedName) + suffix
            };
        }
        function getModule(depMap) {
            var id = depMap.id, mod = getOwn(registry, id);
            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }
            return mod;
        }
        function on(depMap, name, fn) {
            var id = depMap.id, mod = getOwn(registry, id);
            if (hasProp(defined, id) &&
                (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            }
            else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                }
                else {
                    mod.on(name, fn);
                }
            }
        }
        function onError(err, errback) {
            var ids = err.requireModules, notified = false;
            if (errback) {
                errback(err);
            }
            else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });
                if (!notified) {
                    req.onError(err);
                }
            }
        }
        function takeGlobalQueue() {
            if (globalDefQueue.length) {
                each(globalDefQueue, function (queueItem) {
                    var id = queueItem[0];
                    if (typeof id === 'string') {
                        context.defQueueMap[id] = true;
                    }
                    defQueue.push(queueItem);
                });
                globalDefQueue = [];
            }
        }
        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                }
                else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    }
                    else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                }
                else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };
        function cleanRegistry(id) {
            delete registry[id];
            delete enabledRegistry[id];
        }
        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;
            if (mod.error) {
                mod.emit('error', mod.error);
            }
            else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id, dep = getOwn(registry, depId);
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check();
                        }
                        else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }
        function checkLoaded() {
            var err, usingPathFallback, waitInterval = config.waitSeconds * 1000, expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(), noLoads = [], reqCalls = [], stillLoading = false, needCycleCheck = true;
            if (inCheckLoaded) {
                return;
            }
            inCheckLoaded = true;
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map, modId = map.id;
                if (!mod.enabled) {
                    return;
                }
                if (!map.isDefine) {
                    reqCalls.push(mod);
                }
                if (!mod.error) {
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        }
                        else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    }
                    else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            return (needCycleCheck = false);
                        }
                    }
                }
            });
            if (expired && noLoads.length) {
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }
            if ((!expired || usingPathFallback) && stillLoading) {
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }
            inCheckLoaded = false;
        }
        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;
        };
        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};
                if (this.inited) {
                    return;
                }
                this.factory = factory;
                if (errback) {
                    this.on('error', errback);
                }
                else if (this.events.error) {
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }
                this.depMaps = depMaps && depMaps.slice(0);
                this.errback = errback;
                this.inited = true;
                this.ignore = options.ignore;
                if (options.enabled || this.enabled) {
                    this.enable();
                }
                else {
                    this.check();
                }
            },
            defineDep: function (i, depExports) {
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },
            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;
                context.startTime = (new Date()).getTime();
                var map = this.map;
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                }
                else {
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },
            load: function () {
                var url = this.map.url;
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }
                var err, cjsModule, id = this.map.id, depExports = this.depExports, exports = this.exports, factory = this.factory;
                if (!this.inited) {
                    if (!hasProp(context.defQueueMap, id)) {
                        this.fetch();
                    }
                }
                else if (this.error) {
                    this.emit('error', this.error);
                }
                else if (!this.defining) {
                    this.defining = true;
                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                }
                                catch (e) {
                                    err = e;
                                }
                            }
                            else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                }
                                else if (this.usingExports) {
                                    exports = this.exports;
                                }
                            }
                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }
                        }
                        else {
                            exports = factory;
                        }
                        this.exports = exports;
                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;
                            if (req.onResourceLoad) {
                                var resLoadMaps = [];
                                each(this.depMaps, function (depMap) {
                                    resLoadMaps.push(depMap.normalizedMap || depMap);
                                });
                                req.onResourceLoad(context, this.map, resLoadMaps);
                            }
                        }
                        cleanRegistry(id);
                        this.defined = true;
                    }
                    this.defining = false;
                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }
                }
            },
            callPlugin: function () {
                var map = this.map, id = map.id, pluginMap = makeModuleMap(map.prefix);
                this.depMaps.push(pluginMap);
                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod, bundleId = getOwn(bundlesMap, this.map.id), name = this.map.name, parentName = this.map.parentMap ? this.map.parentMap.name : null, localRequire = context.makeRequire(map.parentMap, {
                        enableBuildCallback: true
                    });
                    if (this.map.unnormalized) {
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }
                        normalizedMap = makeModuleMap(map.prefix + '!' + name, this.map.parentMap, true);
                        on(normalizedMap, 'defined', bind(this, function (value) {
                            this.map.normalizedMap = normalizedMap;
                            this.init([], function () { return value; }, null, {
                                enabled: true,
                                ignore: true
                            });
                        }));
                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            this.depMaps.push(normalizedMap);
                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }
                        return;
                    }
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }
                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });
                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });
                        onError(err);
                    });
                    load.fromText = bind(this, function (text, textAlt) {
                        var moduleName = map.name, moduleMap = makeModuleMap(moduleName), hasInteractive = useInteractive;
                        if (textAlt) {
                            text = textAlt;
                        }
                        if (hasInteractive) {
                            useInteractive = false;
                        }
                        getModule(moduleMap);
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }
                        try {
                            req.exec(text);
                        }
                        catch (e) {
                            return onError(makeError('fromtexteval', 'fromText eval for ' + id +
                                ' failed: ' + e, e, [id]));
                        }
                        if (hasInteractive) {
                            useInteractive = true;
                        }
                        this.depMaps.push(moduleMap);
                        context.completeLoad(moduleName);
                        localRequire([moduleName], load);
                    });
                    plugin.load(map.name, localRequire, load, config);
                }));
                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },
            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;
                this.enabling = true;
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;
                    if (typeof depMap === 'string') {
                        depMap = makeModuleMap(depMap, (this.map.isDefine ? this.map : this.map.parentMap), false, !this.skipMap);
                        this.depMaps[i] = depMap;
                        handler = getOwn(handlers, depMap.id);
                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }
                        this.depCount += 1;
                        on(depMap, 'defined', bind(this, function (depExports) {
                            if (this.undefed) {
                                return;
                            }
                            this.defineDep(i, depExports);
                            this.check();
                        }));
                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                        else if (this.events.error) {
                            on(depMap, 'error', bind(this, function (err) {
                                this.emit('error', err);
                            }));
                        }
                    }
                    id = depMap.id;
                    mod = registry[id];
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));
                this.enabling = false;
                this.check();
            },
            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },
            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    delete this.events[name];
                }
            }
        };
        function callGetModule(args) {
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }
        function removeListener(node, func, name, ieName) {
            if (node.detachEvent && !isOpera) {
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            }
            else {
                node.removeEventListener(name, func, false);
            }
        }
        function getScriptData(evt) {
            var node = evt.currentTarget || evt.srcElement;
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');
            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }
        function intakeDefines() {
            var args;
            takeGlobalQueue();
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' +
                        args[args.length - 1]));
                }
                else {
                    callGetModule(args);
                }
            }
            context.defQueueMap = {};
        }
        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            defQueueMap: {},
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,
            configure: function (cfg) {
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }
                if (typeof cfg.urlArgs === 'string') {
                    var urlArgs = cfg.urlArgs;
                    cfg.urlArgs = function (id, url) {
                        return (url.indexOf('?') === -1 ? '?' : '&') + urlArgs;
                    };
                }
                var shim = config.shim, objs = {
                    paths: true,
                    bundles: true,
                    config: true,
                    map: true
                };
                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    }
                    else {
                        config[prop] = value;
                    }
                });
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;
                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                            .replace(currDirRegExp, '')
                            .replace(jsSuffixRegExp, '');
                    });
                }
                eachProp(registry, function (mod, id) {
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id, null, true);
                    }
                });
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },
            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },
            makeRequire: function (relMap, options) {
                options = options || {};
                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;
                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }
                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;
                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                id +
                                '" has not been loaded yet for context: ' +
                                contextName +
                                (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }
                    intakeDefines();
                    context.nextTick(function () {
                        intakeDefines();
                        requireMod = getModule(makeModuleMap(null, relMap));
                        requireMod.skipMap = options.skipMap;
                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });
                        checkLoaded();
                    });
                    return localRequire;
                }
                mixin(localRequire, {
                    isBrowser: isBrowser,
                    toUrl: function (moduleNamePlusExt) {
                        var ext, index = moduleNamePlusExt.lastIndexOf('.'), segment = moduleNamePlusExt.split('/')[0], isRelative = segment === '.' || segment === '..';
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }
                        return context.nameToUrl(normalize(moduleNamePlusExt, relMap && relMap.id, true), ext, true);
                    },
                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },
                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });
                if (!relMap) {
                    localRequire.undef = function (id) {
                        takeGlobalQueue();
                        var map = makeModuleMap(id, relMap, true), mod = getOwn(registry, id);
                        mod.undefed = true;
                        removeScript(id);
                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];
                        eachReverse(defQueue, function (args, i) {
                            if (args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });
                        delete context.defQueueMap[id];
                        if (mod) {
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }
                            cleanRegistry(id);
                        }
                    };
                }
                return localRequire;
            },
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },
            completeLoad: function (moduleName) {
                var found, args, mod, shim = getOwn(config.shim, moduleName) || {}, shExports = shim.exports;
                takeGlobalQueue();
                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        if (found) {
                            break;
                        }
                        found = true;
                    }
                    else if (args[0] === moduleName) {
                        found = true;
                    }
                    callGetModule(args);
                }
                context.defQueueMap = {};
                mod = getOwn(registry, moduleName);
                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        }
                        else {
                            return onError(makeError('nodefine', 'No define call for ' + moduleName, null, [moduleName]));
                        }
                    }
                    else {
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }
                checkLoaded();
            },
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url, parentPath, bundleId, pkgMain = getOwn(config.pkgs, moduleName);
                if (pkgMain) {
                    moduleName = pkgMain;
                }
                bundleId = getOwn(bundlesMap, moduleName);
                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }
                if (req.jsExtRegExp.test(moduleName)) {
                    url = moduleName + (ext || '');
                }
                else {
                    paths = config.paths;
                    syms = moduleName.split('/');
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }
                    url = syms.join('/');
                    url += (ext || (/^data\:|^blob\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }
                return config.urlArgs && !/^blob\:/.test(url) ?
                    url + config.urlArgs(moduleName, url) : url;
            },
            load: function (id, url) {
                req.load(context, id, url);
            },
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },
            onScriptLoad: function (evt) {
                if (evt.type === 'load' ||
                    (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    interactiveScript = null;
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    var parents = [];
                    eachProp(registry, function (value, key) {
                        if (key.indexOf('_@r') !== 0) {
                            each(value.depMaps, function (depMap) {
                                if (depMap.id === data.id) {
                                    parents.push(key);
                                    return true;
                                }
                            });
                        }
                    });
                    return onError(makeError('scripterror', 'Script error for "' + data.id +
                        (parents.length ?
                            '", needed by: ' + parents.join(', ') :
                            '"'), evt, [data.id]));
                }
            }
        };
        context.require = context.makeRequire();
        return context;
    }
    req = requirejs = function (deps, callback, errback, optional) {
        var context, config, contextName = defContextName;
        if (!isArray(deps) && typeof deps !== 'string') {
            config = deps;
            if (isArray(callback)) {
                deps = callback;
                callback = errback;
                errback = optional;
            }
            else {
                deps = [];
            }
        }
        if (config && config.context) {
            contextName = config.context;
        }
        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }
        if (config) {
            context.configure(config);
        }
        return context.require(deps, callback, errback);
    };
    req.config = function (config) {
        return req(config);
    };
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };
    if (!require) {
        require = req;
    }
    req.version = version;
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };
    req({});
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });
    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }
    req.onError = defaultOnError;
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
            document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
            document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {}, node;
        if (isBrowser) {
            node = req.createNode(config, moduleName, url);
            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);
            if (node.attachEvent &&
                !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                !isOpera) {
                useInteractive = true;
                node.attachEvent('onreadystatechange', context.onScriptLoad);
            }
            else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;
            if (config.onNodeCreated) {
                config.onNodeCreated(node, config, moduleName, url);
            }
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            }
            else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;
            return node;
        }
        else if (isWebWorker) {
            try {
                setTimeout(function () { }, 0);
                importScripts(url);
                context.completeLoad(moduleName);
            }
            catch (e) {
                context.onError(makeError('importscripts', 'importScripts failed for ' +
                    moduleName + ' at ' + url, e, [moduleName]));
            }
        }
    };
    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }
        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }
    if (isBrowser && !cfg.skipDataMain) {
        eachReverse(scripts(), function (script) {
            if (!head) {
                head = script.parentNode;
            }
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                mainScript = dataMain;
                if (!cfg.baseUrl && mainScript.indexOf('!') === -1) {
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/') + '/' : './';
                    cfg.baseUrl = subPath;
                }
                mainScript = mainScript.replace(jsSuffixRegExp, '');
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];
                return true;
            }
        });
    }
    define = function (name, deps, callback) {
        var node, context;
        if (typeof name !== 'string') {
            callback = deps;
            deps = name;
            name = null;
        }
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }
        if (!deps && isFunction(callback)) {
            deps = [];
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, commentReplace)
                    .replace(cjsRequireRegExp, function (match, dep) {
                    deps.push(dep);
                });
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }
        if (context) {
            context.defQueue.push([name, deps, callback]);
            context.defQueueMap[name] = true;
        }
        else {
            globalDefQueue.push([name, deps, callback]);
        }
    };
    define.amd = {
        jQuery: true
    };
    req.exec = function (text) {
        return eval(text);
    };
    req(cfg);
}(this, (typeof setTimeout === 'undefined' ? undefined : setTimeout)));
define("00/drope", ["require", "exports", "../engine.js", "utils", "maps", "processors"], function (require, exports, engine_js_1, utils_js_1, maps_1, processors_1) {
    "use strict";
    exports.__esModule = true;
    exports.drope = void 0;
    var colors = ['green', 'blue', 'yellow'];
    var config = {
        pixelSize: 1,
        width: 200,
        height: 200
    };
    var drope = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (0, utils_js_1.compose)([
            (0, engine_js_1.init)(config),
            (0, engine_js_1.splasher)(2, colors, (0, maps_1.cornerProximity)(config, 0.1)),
            (0, engine_js_1.splasher)(3, colors, (0, maps_1.cornerProximity)(config, 0.1)),
            (0, engine_js_1.splasher)(10, colors, (0, maps_1.symmetry)(config, 5000)),
            (0, engine_js_1.splasher)(20, colors, (0, maps_1.symmetry)(config, 7000)),
            (0, engine_js_1.splasher)(30, colors, (0, maps_1.centerProximity)(config, 10)),
            (0, processors_1.clearEveryNthLine)(10),
            (0, engine_js_1.render)(config)
        ]).apply(void 0, args);
    };
    exports.drope = drope;
});
define("00/film", ["require", "exports", "../engine.js", "utils", "maps"], function (require, exports, engine_js_2, utils_js_2, maps_2) {
    "use strict";
    exports.__esModule = true;
    exports.film = void 0;
    var colors = ['green', 'blue', 'yellow', 'white'];
    var config = {
        pixelSize: 10,
        width: 200,
        height: 200
    };
    exports.film = (0, utils_js_2.compose)([
        (0, engine_js_2.init)(config),
        (0, engine_js_2.splasher)(1, colors, (0, maps_2.constant)(config, 1)),
        (0, engine_js_2.splasher)(10, colors, (0, maps_2.constant)(config, 10000)),
        (0, engine_js_2.splasher)(50, colors, (0, maps_2.constant)(config, 10000)),
        (0, engine_js_2.render)(config)
    ]);
});
define("00/flare", ["require", "exports", "../engine.js", "utils", "maps"], function (require, exports, engine_js_3, utils_js_3, maps_3) {
    "use strict";
    exports.__esModule = true;
    exports.flare = void 0;
    var colors = ['green', 'blue', 'yellow'];
    var config = {
        pixelSize: 10,
        width: 200,
        height: 200
    };
    var flare = function () { return (0, utils_js_3.compose)([
        (0, engine_js_3.init)(config),
        (0, engine_js_3.splasher)(30, colors, (0, maps_3.constant)(config, 30 * 20)),
        (0, engine_js_3.splasher)(2, colors, (0, maps_3.centerProximity)(config)),
        (0, engine_js_3.splasher)(2, colors, (0, maps_3.centerProximity)(config)),
        (0, engine_js_3.splasher)(3, colors, (0, maps_3.centerProximity)(config)),
        (0, engine_js_3.splasher)(5, colors, (0, maps_3.centerProximity)(config)),
        (0, engine_js_3.splasher)(7, colors, (0, maps_3.centerProximity)(config)),
        (0, engine_js_3.render)(config)
    ])(); };
    exports.flare = flare;
});
define("00/lare", ["require", "exports", "../engine.js", "utils", "maps"], function (require, exports, engine_js_4, utils_js_4, maps_4) {
    "use strict";
    exports.__esModule = true;
    exports.lare = void 0;
    var colors = ['green', 'blue', 'yellow'];
    var config = {
        pixelSize: 20,
        width: 100,
        height: 100
    };
    var cutLine = function (size, map) { return map.map(function (row, i) {
        var regionSize = row.length / size;
        if (i > regionSize && i < regionSize * (size - 1)) {
            return row;
        }
        else {
            return row.map(function () { return undefined; });
        }
    }); };
    var lare = function () { return (0, utils_js_4.compose)([
        (0, engine_js_4.init)(config),
        (0, engine_js_4.splasher)(1, colors, (0, maps_4.constant)(config, 10)),
        (0, engine_js_4.splasher)(2, colors, cutLine(6, (0, maps_4.constant)(config, 50))),
        (0, engine_js_4.splasher)(10, colors, cutLine(3, (0, maps_4.constant)(config, 30 * 20))),
        (0, engine_js_4.splasher)(5, colors, cutLine(4, (0, maps_4.constant)(config, 30 * 20))),
        (0, engine_js_4.render)(config)
    ])(); };
    exports.lare = lare;
});
define("00/scope", ["require", "exports", "../engine", "utils", "maps"], function (require, exports, engine_1, utils_1, maps_5) {
    "use strict";
    exports.__esModule = true;
    exports.scope = void 0;
    var colors = ['green', 'blue', 'yellow'];
    var config = {
        pixelSize: 10,
        width: 200,
        height: 200
    };
    var scope = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (0, utils_1.compose)([
            (0, engine_1.init)(config),
            (0, engine_1.splasher)(60, colors, (0, maps_5.verticalSymmetry)(config, 100000)),
            (0, engine_1.splasher)(60, colors, (0, maps_5.constant)(config, 50000)),
            (0, engine_1.splasher)(10, colors, (0, maps_5.verticalSymmetry)(config, 3000)),
            (0, engine_1.splasher)(20, colors, (0, maps_5.verticalSymmetry)(config, 6000)),
            (0, engine_1.splasher)(2, colors, (0, maps_5.verticalSymmetry)(config, 100)),
            (0, engine_1.splasher)(1, colors, (0, maps_5.constant)(config, 10)),
            (0, engine_1.render)(config)
        ]).apply(void 0, args);
    };
    exports.scope = scope;
});
//# sourceMappingURL=out.js.map