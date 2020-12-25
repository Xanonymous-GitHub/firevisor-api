"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var staff_1 = tslib_1.__importDefault(require("./staff"));
var user_1 = tslib_1.__importDefault(require("./user"));
var guest_1 = tslib_1.__importDefault(require("./guest"));
var machine_1 = require("./machine");
var admin = require('firebase-admin');
admin.initializeApp();
exports.staff = staff_1["default"];
exports.user = user_1["default"];
exports.guest = guest_1["default"];
exports.createMachine = machine_1.onCreateMachine;
exports.updateMachine = machine_1.onUpdateMachine;
exports.deleteMachine = machine_1.onDeleteMachine;