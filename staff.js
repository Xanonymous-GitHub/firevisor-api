"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var functions = require('firebase-functions');
var admin = require('firebase-admin');
exports["default"] = functions.https.onRequest(function (req, resp) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var authJwt, data, e_1, fakeEmailDomain, email, isValidPassword, password, isValidDisplayName, displayName, userRecord, e_2, userName, userEmail, uid, role, newFireStoreData, data, e_3, staffs, e_4, data, e_5, e_6;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authJwt = function (jwt) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var decodedToken;
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
                                return [4 /*yield*/, utils_1.validatePermissionAndGetDocument(decodedToken.uid, ['administrator'])];
                            case 2:
                                // validate permission
                                if (!(_a.sent())) {
                                    resp.status(403).send('Insufficient permission, access denied.')(function () {
                                        throw new Error();
                                    })();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                if (!(req.method === 'POST')) return [3 /*break*/, 10];
                data = req.body;
                // check if the request body is correct.
                if (!data || !data.jwtToken || !data.email || !data.displayName || !data.password) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, authJwt(data.jwtToken)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/];
            case 4:
                // pre-fix request data.
                data.email = data.email.trim();
                data.displayName = data.displayName.trim();
                // check if the request body is correct.
                if (!data.email || !data.displayName || !data.password) {
                    resp.status(400).send('Invalid request!');
                    return [2 /*return*/];
                }
                fakeEmailDomain = '@vghtpe.tw';
                email = void 0;
                if (utils_1.isEmail(data.email)) {
                    email = data.email;
                }
                else {
                    email = data.email + fakeEmailDomain;
                }
                isValidPassword = data.password.length >= 6;
                password = void 0;
                if (isValidPassword) {
                    password = data.password;
                }
                else {
                    resp.status(400).send('Password is too short, at least six characters!');
                    return [2 /*return*/];
                }
                isValidDisplayName = Boolean(data.displayName);
                displayName = void 0;
                if (isValidDisplayName) {
                    displayName = data.displayName;
                }
                userRecord = void 0;
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, admin.auth().createUser({
                        email: email,
                        password: password,
                        displayName: displayName
                    })];
            case 6:
                userRecord = (_a.sent());
                return [3 /*break*/, 8];
            case 7:
                e_2 = _a.sent();
                resp.status(500).json({
                    result: 'Unable to create user.',
                    messages: e_2
                });
                return [2 /*return*/];
            case 8:
                userName = userRecord.displayName;
                userEmail = userRecord.email;
                if (userEmail !== email || userName !== displayName) {
                    resp.status(500).send('Unknown error happened when creating user in firestore');
                    return [2 /*return*/];
                }
                uid = userRecord.uid;
                role = 'staff';
                newFireStoreData = {
                    displayName: userName,
                    email: userEmail,
                    role: role
                };
                return [4 /*yield*/, admin.firestore().collection('/staffs').doc(uid).set(newFireStoreData)];
            case 9:
                _a.sent();
                resp
                    .status(201)
                    .json({
                    message: 'Successfully created a staff.',
                    staffData: tslib_1.__assign({ uid: uid }, newFireStoreData)
                });
                return [2 /*return*/];
            case 10:
                if (!(req.method === 'GET')) return [3 /*break*/, 17];
                data = req.query;
                // check if the request body is correct.
                if (!data || !data.jwtToken) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                _a.label = 11;
            case 11:
                _a.trys.push([11, 13, , 14]);
                return [4 /*yield*/, authJwt(data.jwtToken)];
            case 12:
                _a.sent();
                return [3 /*break*/, 14];
            case 13:
                e_3 = _a.sent();
                return [2 /*return*/];
            case 14:
                _a.trys.push([14, 16, , 17]);
                return [4 /*yield*/, admin.firestore().collection('staffs').get()];
            case 15:
                staffs = (_a.sent()).docs
                    .map(function (staff) { return Object.assign({ uid: staff.id }, staff.data()); });
                resp.status(200).json(tslib_1.__spreadArrays(staffs));
                return [2 /*return*/];
            case 16:
                e_4 = _a.sent();
                resp.status(500).json({
                    result: 'Unable to get staffs in firestore',
                    messages: e_4
                });
                return [3 /*break*/, 17];
            case 17:
                if (!(req.method === 'DELETE')) return [3 /*break*/, 25];
                data = req.query;
                // check if the request body is correct.
                if (!data || !data.jwtToken || !data.uid) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                _a.label = 18;
            case 18:
                _a.trys.push([18, 20, , 21]);
                return [4 /*yield*/, authJwt(data.jwtToken)];
            case 19:
                _a.sent();
                return [3 /*break*/, 21];
            case 20:
                e_5 = _a.sent();
                return [2 /*return*/];
            case 21:
                _a.trys.push([21, 24, , 25]);
                return [4 /*yield*/, admin.firestore().collection('staffs').doc(data.uid)["delete"]()];
            case 22:
                _a.sent();
                return [4 /*yield*/, admin.auth().deleteUser(data.uid)];
            case 23:
                _a.sent();
                resp.status(200).json({
                    message: 'Successfully deleted a staff',
                    uid: data.uid
                });
                return [2 /*return*/];
            case 24:
                e_6 = _a.sent();
                resp.status(500).json({
                    result: 'Unable to delete staff in firestore',
                    messages: e_6
                });
                return [2 /*return*/];
            case 25:
                resp.status(405).send('Invalid request method!');
                return [2 /*return*/];
        }
    });
}); });
