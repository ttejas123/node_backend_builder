"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
var customer_service_1 = require("./customer.service");
var express_1 = require("express");
var router = (0, express_1.Router)();
var Helper_1 = require("../helper/Helper");
var customerController = /** @class */ (function () {
    function customerController() {
        this.service = new customer_service_1.customerService();
        // Define the routes and mappings within the constructor
        router.get('/', this.readAll.bind(this));
        router.post('/', this.create.bind(this));
        router.get('/:id', this.read.bind(this));
        router.put('/:id', this.update.bind(this));
        router.delete('/:id', this.delete.bind(this));
    }
    // Create API
    customerController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = req.body;
                        return [4 /*yield*/, this.service.create(data)];
                    case 1:
                        result = _a.sent();
                        (0, Helper_1.generateApiResponse)(res, 'Create customer', 'Item created successfully', result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        (0, Helper_1.generateApiResponse)(res, 'Create customer', 'Failed to create the item', null, 500);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Read API
    customerController.prototype.read = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, this.service.read(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            (0, Helper_1.generateApiResponse)(res, 'Read customer', 'Item fetched successfully', result);
                        }
                        else {
                            (0, Helper_1.generateApiResponse)(res, 'Read customer', 'Item not found', null, 404);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        (0, Helper_1.generateApiResponse)(res, 'Read customer', 'Failed to fetch the item', null, 500);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    customerController.prototype.readAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Called");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.service.read()];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            (0, Helper_1.generateApiResponse)(res, 'Read customer', 'Item fetched successfully', result);
                        }
                        else {
                            (0, Helper_1.generateApiResponse)(res, 'Read customer', 'Item not found', null, 404);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        (0, Helper_1.generateApiResponse)(res, 'Read customer', 'Failed to fetch the item', null, 500);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Update API
    customerController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        data = req.body;
                        return [4 /*yield*/, this.service.update(id, data)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            (0, Helper_1.generateApiResponse)(res, 'Update customer', 'Item updated successfully', result);
                        }
                        else {
                            (0, Helper_1.generateApiResponse)(res, 'Update customer', 'Item not found', null, 404);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        (0, Helper_1.generateApiResponse)(res, 'Update customer', 'Failed to update the item', null, 500);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Delete API
    customerController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, this.service.delete(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            (0, Helper_1.generateApiResponse)(res, 'Delete customer', 'Item deleted successfully', result);
                        }
                        else {
                            (0, Helper_1.generateApiResponse)(res, 'Delete customer', 'Item not found', null, 404);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        (0, Helper_1.generateApiResponse)(res, 'Delete customer', 'Failed to delete the item', null, 500);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Export the router for use in your Express application
    customerController.prototype.getRouter = function () {
        return router;
    };
    return customerController;
}());
exports.customerController = customerController;
