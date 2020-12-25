"use strict";
exports.__esModule = true;
exports.onDeleteMachine = exports.onUpdateMachine = exports.onCreateMachine = exports.getMachineData = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var firebase_functions_1 = require("firebase-functions");
var functions = require('firebase-functions');
var admin = require('firebase-admin');
var getGuest = function (machineId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, admin.firestore()
                        .collection('/guests')
                        .doc(machineId)
                        .get()];
            case 1: return [2 /*return*/, (_a.sent()).data()];
            case 2:
                e_1 = _a.sent();
                firebase_functions_1.logger.warn('Something happened when query a document in /guests.\n' + e_1);
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
var isThisMachineRegisteredAGuestAccount = function (machineId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var guestUser;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getGuest(machineId)];
            case 1:
                guestUser = _a.sent();
                return [2 /*return*/, !utils_1.isEmptyObject(guestUser)];
        }
    });
}); };
var generateNewGuestData = function (position) {
    // 1. generate a empty serialNumber.
    var serialNumber = "";
    // 2. create and return document.
    return {
        serialNumber: serialNumber,
        expire: -1,
        reGenerateSerialNumberTime: 0,
        position: position ? position : 'unknown',
        role: 'guest'
    };
};
var createNewGuest = function (machinePosition, machineId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var newGuestData, e_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newGuestData = generateNewGuestData(machinePosition);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, admin.firestore()
                        .collection('/guests')
                        .doc(machineId)
                        .set(newGuestData)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                firebase_functions_1.logger.error('could not create a guest document in /guests.\n' + e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getMachineData = function (machineId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var machineData, e_3;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, admin.firestore()
                        .collection('NTUTLab321')
                        .doc(machineId.toString().trim())
                        .get()];
            case 1:
                machineData = (_a.sent()).data();
                // detect schema version.
                if (!('judge' in machineData)) {
                    if ('title' in machineData) {
                        machineData.judge = machineData.title;
                    }
                    else {
                        machineData.judge = "unknown";
                    }
                }
                // remove title property anyway.
                if ('title' in machineData) {
                    delete machineData.title;
                }
                return [2 /*return*/, machineData];
            case 2:
                e_3 = _a.sent();
                firebase_functions_1.logger.warn("Could not get the machine data! request machineId(" + machineId + ") may not exist.");
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMachineData = getMachineData;
exports.onCreateMachine = functions.firestore.document('/NTUTLab321/{machineId}')
    .onCreate(function (snapshot) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var data, machineId, machinePosition;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = snapshot.data();
                machineId = snapshot.id;
                machinePosition = (_a = data.judge) !== null && _a !== void 0 ? _a : data.title;
                // validate the data
                if (utils_1.isEmptyObject(data) || !machinePosition) {
                    firebase_functions_1.logger.error('could not receive the new machine data pack!');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, isThisMachineRegisteredAGuestAccount(machineId)];
            case 1:
                if (!!(_b.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, createNewGuest(machinePosition, machineId)];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                firebase_functions_1.logger.info(machineId + ' is already exist in guest collection.');
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.onUpdateMachine = functions.firestore.document('/NTUTLab321/{machineId}')
    .onUpdate(function (change) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var data, machineId, machinePosition, guestDoc, e_4;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = change.after.data();
                machineId = change.after.id;
                machinePosition = (_a = data.judge) !== null && _a !== void 0 ? _a : data.title;
                // validate the data
                if (utils_1.isEmptyObject(data) || !machinePosition) {
                    firebase_functions_1.logger.error('could not receive the new machine data pack!');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, getGuest(machineId)];
            case 1:
                guestDoc = _b.sent();
                if (!utils_1.isEmptyObject(guestDoc)) return [3 /*break*/, 3];
                firebase_functions_1.logger.warn("there is a machine(" + machineId + ") that not have a guest account! try to automatically create a new one...");
                return [4 /*yield*/, createNewGuest(machinePosition, machineId)];
            case 2:
                _b.sent();
                return [2 /*return*/];
            case 3:
                if (!(!('position' in guestDoc) || machinePosition !== (guestDoc === null || guestDoc === void 0 ? void 0 : guestDoc.position))) return [3 /*break*/, 7];
                // update position.
                guestDoc.position = machinePosition.toString().trim();
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, admin.firestore()
                        .collection('/guests')
                        .doc(machineId)
                        .update(guestDoc)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                e_4 = _b.sent();
                firebase_functions_1.logger.error('could not update a guest document in guests collection.\n' + e_4);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.onDeleteMachine = functions.firestore.document('/NTUTLab321/{machineId}')
    .onDelete(function (snapshot) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var data, machineId, e_5;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = snapshot.data();
                machineId = snapshot.id;
                // validate the data
                if (utils_1.isEmptyObject(data)) {
                    firebase_functions_1.logger.error('could not receive the new machine data pack!');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, isThisMachineRegisteredAGuestAccount(machineId)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, admin.firestore()
                        .collection('/guests')
                        .doc(machineId)["delete"]()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_5 = _a.sent();
                firebase_functions_1.logger.error('could not delete a guest document in guests collection.\n' + e_5);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                firebase_functions_1.logger.info("This machine(" + machineId + ") is already lost its guest account, delete operation done.");
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
