"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var RequestCounter = (function (_super) {
    __extends(RequestCounter, _super);
    function RequestCounter() {
        var _this = _super.call(this) || this;
        _this.__counter = 0;
        return _this;
    }
    Object.defineProperty(RequestCounter.prototype, "Counter", {
        get: function () { return this.__counter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestCounter.prototype, "Middleware", {
        get: function () {
            var _this = this;
            return function (req, res, next) {
                _this.__counter++;
                _this.emit("change", _this.__counter);
                _this.emit("req-start", req, res);
                req.on("end", function () {
                    _this.__counter--;
                    _this.emit("change", _this.__counter);
                    _this.emit("req-end", false, req, res);
                    if (_this.__counter === 0)
                        _this.emit("zero-count");
                });
                res.on("close", function () {
                    _this.__counter--;
                    _this.emit("change", _this.__counter);
                    _this.emit("req-end", true, req, res);
                    if (_this.__counter === 0)
                        _this.emit("zero-count");
                });
                next();
            };
        },
        enumerable: true,
        configurable: true
    });
    return RequestCounter;
}(events.EventEmitter));
function get() { return new RequestCounter(); }
exports.get = get;
