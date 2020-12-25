"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var machine_1 = require("./machine");
var functions = require('firebase-functions');
var admin = require('firebase-admin');
exports["default"] = functions.https.onRequest(function (req, resp) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var data, decodedToken, userDocument, role, staffDocument, guestDocument_1, guestDocumentId_1, isStaffOrAdmin, decodedToken, userDocument, machineData;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.method === 'GET')) return [3 /*break*/, 13];
                data = req.query;
                // check if the request body is correct.
                if (!data ||
                    (!data.jwtToken && !data.serialNumber && !data.uid) ||
                    (data.jwtToken && data.serialNumber && data.uid) ||
                    (!data.jwtToken && !data.serialNumber && data.uid) ||
                    (!data.jwtToken && data.serialNumber && data.uid)) {
                    resp.status(400).send('Incorrect request format or lack of necessary information!');
                    return [2 /*return*/];
                }
                if (!(!data.serialNumber && data.jwtToken)) return [3 /*break*/, 5];
                return [4 /*yield*/, utils_1.decryptJwt(data.jwtToken)];
            case 1:
                decodedToken = _a.sent();
                if (!decodedToken) {
                    resp.status(401).send('Invalid jwt token.');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, utils_1.validatePermissionAndGetDocument(decodedToken.uid, ['administrator', 'staff'])];
            case 2:
                userDocument = _a.sent();
                if (utils_1.isEmptyObject(userDocument)) {
                    resp.status(403).send('Permission validation failed, access denied.');
                    return [2 /*return*/];
                }
                role = userDocument['role'];
                // A => only jwt
                if (!data.uid) {
                    resp.status(200).json(Object.assign({ uid: decodedToken.uid }, userDocument));
                    return [2 /*return*/];
                }
                if (!data.uid) return [3 /*break*/, 4];
                if (role !== 'administrator') {
                    resp.status(403).send('Permission validation failed, access denied.');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, utils_1.validatePermissionAndGetDocument(data.uid, ['staff'])];
            case 3:
                staffDocument = _a.sent();
                if (utils_1.isEmptyObject(staffDocument)) {
                    resp.status(404).send('Could not find the user data by this uid.');
                    return [2 /*return*/];
                }
                resp.status(200).json(Object.assign({ uid: data.uid }, staffDocument));
                return [2 /*return*/];
            case 4: return [3 /*break*/, 13];
            case 5:
                if (!data.serialNumber) return [3 /*break*/, 12];
                guestDocument_1 = {};
                guestDocumentId_1 = '';
                return [4 /*yield*/, admin.firestore()
                        .collection('guests')
                        .where('serialNumber', '==', data.serialNumber).get()];
            case 6:
                (_a.sent())
                    .forEach(function (doc) {
                    guestDocument_1 = doc.data();
                    guestDocumentId_1 = doc.id;
                });
                if (!guestDocument_1 || !guestDocumentId_1 || utils_1.isEmptyObject(guestDocument_1)) {
                    resp.status(404).send('Could not find the user data by this serialNumber.');
                    return [2 /*return*/];
                }
                isStaffOrAdmin = false;
                if (!data.jwtToken) return [3 /*break*/, 9];
                return [4 /*yield*/, utils_1.decryptJwt(data.jwtToken)];
            case 7:
                decodedToken = _a.sent();
                if (!decodedToken) return [3 /*break*/, 9];
                return [4 /*yield*/, utils_1.validatePermissionAndGetDocument(decodedToken.uid, ['administrator', 'staff'])];
            case 8:
                userDocument = _a.sent();
                isStaffOrAdmin = !utils_1.isEmptyObject(userDocument);
                _a.label = 9;
            case 9:
                // check if expired.
                if (!isStaffOrAdmin && guestDocument_1 && guestDocument_1.expire < Date.now()) {
                    // B => only serialNumber
                    resp.status(410).send('This account has expired.');
                    return [2 /*return*/];
                }
                machineData = void 0;
                if (!guestDocumentId_1) return [3 /*break*/, 11];
                return [4 /*yield*/, machine_1.getMachineData(guestDocumentId_1)];
            case 10:
                machineData = (_a.sent());
                // detect existed.
                if (utils_1.isEmptyObject(machineData)) {
                    resp.status(404).send('Could not find the machine data by this machineId.');
                    return [2 /*return*/];
                }
                _a.label = 11;
            case 11:
                // D => jwt and serialNumber
                resp.status(200).json(tslib_1.__assign({ machine: guestDocumentId_1 }, { machineData: machineData,
                    guestDocument: guestDocument_1 }));
                return [2 /*return*/];
            case 12:
                resp.status(400).send('Incorrect request format.');
                return [2 /*return*/];
            case 13:
                resp.status(405).send('Invalid request method!');
                return [2 /*return*/];
        }
    });
}); });
