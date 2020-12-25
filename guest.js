"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var functions = require('firebase-functions');
var admin = require('firebase-admin');
exports["default"] = functions.https.onRequest(function (req, resp) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var modifyGuestSerialNumber, authJwt, data, permission, e_1, guestUser, e_2, e_3, data, e_4, guests, e_5, data, e_6, e_7;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                modifyGuestSerialNumber = function (machine, guestUser, expire) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                guestUser.expire = expire;
                                guestUser.serialNumber = utils_1.getRandomSerial(6);
                                guestUser.reGenerateSerialNumberTime = Date.now() + utils_1.reGenerateSerialNumberDurationTime;
                                return [4 /*yield*/, admin.firestore()
                                        .collection('/guests')
                                        .doc(machine)
                                        .update(guestUser)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                authJwt = function (jwt) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var decodedToken, document;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, utils_1.decryptJwt(jwt)];
                            case 1:
                                decodedToken = _a.sent();
                                if (!decodedToken) {
                                    resp.status(401).send('Invalid jwt token.')(function () {
                                        throw new Error();
                                    })();
                                }
                                return [4 /*yield*/, utils_1.validatePermissionAndGetDocument(decodedToken.uid, ['administrator', 'staff'])];
                            case 2:
                                document = (_a.sent());
                                if (!document) {
                                    resp.status(403).send('Insufficient permission, access denied.')(function () {
                                        throw new Error();
                                    })();
                                }
                                return [2 /*return*/, document['role']];
                        }
                    });
                }); };
                if (!(req.method === 'POST')) return [3 /*break*/, 16];
                data = req.body;
                // check if the request body is correct.
                if (!data || !data.jwtToken || !data.expire || !data.machine) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                permission = void 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, authJwt(data.jwtToken)];
            case 2:
                permission = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/];
            case 4:
                // pre-fix request data.
                data.machine = data.machine.trim();
                data.expire = Number(data.expire);
                if (Number.isNaN(data.expire)) {
                    resp.status(400).send('Incorrect request format!');
                }
                guestUser = void 0;
                _a.label = 5;
            case 5:
                _a.trys.push([5, 14, , 15]);
                return [4 /*yield*/, admin.firestore()
                        .collection('/guests')
                        .doc(data.machine)
                        .get()];
            case 6:
                guestUser = (_a.sent()).data();
                if (!(!guestUser || utils_1.isEmptyObject(guestUser))) return [3 /*break*/, 7];
                resp.status(404).send('Unable to find this machine.');
                return [2 /*return*/];
            case 7:
                if (!(permission === 'administrator' || Date.now() > guestUser.reGenerateSerialNumberTime)) return [3 /*break*/, 12];
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 11]);
                return [4 /*yield*/, modifyGuestSerialNumber(data.machine, guestUser, data.expire)];
            case 9:
                _a.sent();
                return [3 /*break*/, 11];
            case 10:
                e_2 = _a.sent();
                resp.status(500).send('Internal error when trying to modify serial number.');
                return [2 /*return*/];
            case 11: return [3 /*break*/, 13];
            case 12:
                resp.status(403).send('Please wait for this operation again.');
                return [2 /*return*/];
            case 13: return [3 /*break*/, 15];
            case 14:
                e_3 = _a.sent();
                resp.status(500).send('Unable to create user, process errored.');
                return [2 /*return*/];
            case 15:
                resp.status(202).json({
                    message: 'Successfully regenerated a new serial number.',
                    guestData: tslib_1.__assign({ machine: data.machine }, guestUser)
                });
                return [2 /*return*/];
            case 16:
                if (!(req.method === 'GET')) return [3 /*break*/, 23];
                data = req.query;
                // check if the request body is correct.
                if (!data || !data.jwtToken) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                _a.label = 17;
            case 17:
                _a.trys.push([17, 19, , 20]);
                return [4 /*yield*/, authJwt(data.jwtToken)];
            case 18:
                _a.sent();
                return [3 /*break*/, 20];
            case 19:
                e_4 = _a.sent();
                return [2 /*return*/];
            case 20:
                _a.trys.push([20, 22, , 23]);
                return [4 /*yield*/, admin.firestore().collection('guests').get()];
            case 21:
                guests = (_a.sent()).docs
                    .map(function (guest) { return Object.assign({ machine: guest.id }, guest.data()); });
                resp.status(200).json(tslib_1.__spreadArrays(guests));
                return [2 /*return*/];
            case 22:
                e_5 = _a.sent();
                resp.status(500).json({
                    result: 'Unable to get guests in firestore',
                    messages: e_5
                });
                return [3 /*break*/, 23];
            case 23:
                if (!(req.method === 'DELETE')) return [3 /*break*/, 31];
                data = req.query;
                // check if the request body is correct.
                if (!data || !data.jwtToken || !data.machine) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                _a.label = 24;
            case 24:
                _a.trys.push([24, 26, , 27]);
                return [4 /*yield*/, authJwt(data.jwtToken)];
            case 25:
                _a.sent();
                return [3 /*break*/, 27];
            case 26:
                e_6 = _a.sent();
                return [2 /*return*/];
            case 27:
                _a.trys.push([27, 30, , 31]);
                return [4 /*yield*/, admin.firestore().collection('guests').doc(data.machine)["delete"]()];
            case 28:
                _a.sent();
                return [4 /*yield*/, admin.firestore().collection('NTUTLab321').doc(data.machine)["delete"]()];
            case 29:
                _a.sent();
                resp.status(200).json({
                    message: 'Successfully unregister the machine and remove the guest user.',
                    machine: data.machine
                });
                return [2 /*return*/];
            case 30:
                e_7 = _a.sent();
                resp.status(500).json({
                    result: 'Unable to unregister the machine in firestore',
                    messages: e_7
                });
                return [2 /*return*/];
            case 31:
                resp.status(405).send('Invalid request method!');
                return [2 /*return*/];
        }
    });
}); });
