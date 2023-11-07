"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// require('../.babelrc');
var customer_controller_1 = require("./Customers/customer.controller");
var app = (0, express_1.default)();
var customerController_d = new customer_controller_1.customerController();
app.use('/customer', customerController_d.getRouter());
app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
