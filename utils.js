"use strict";
exports.__esModule = true;
exports.reGenerateSerialNumberDurationTime = exports.rootKey = exports.isEmptyObject = exports.getRandomSerial = exports.generateNewSha = exports.validatePermissionAndGetDocument = exports.decryptJwt = exports.isEmail = void 0;
var tslib_1 = require("tslib");
var admin = require('firebase-admin');
var isEmail = function (experimentalEmail) {
    var emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return emailRegExp.test(experimentalEmail);
};
exports.isEmail = isEmail;
var decryptJwt = function (jwt) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, admin.auth().verifyIdToken(jwt)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.decryptJwt = decryptJwt;
var validatePermissionAndGetDocument = function (requesterUid, requiredPermissions) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _i, requiredPermissions_1, requiredPermission, userDocument, permission, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, requiredPermissions_1 = requiredPermissions;
                _b.label = 1;
            case 1:
                if (!(_i < requiredPermissions_1.length)) return [3 /*break*/, 6];
                requiredPermission = requiredPermissions_1[_i];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, admin.firestore()
                        .collection('/' + requiredPermission + 's')
                        .doc(requesterUid)
                        .get()];
            case 3:
                userDocument = (_b.sent()).data();
                permission = userDocument['role'].toString();
                if (permission && requiredPermission === permission) {
                    return [2 /*return*/, userDocument];
                }
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, undefined];
        }
    });
}); };
exports.validatePermissionAndGetDocument = validatePermissionAndGetDocument;
var generateNewSha = function (data) {
    var crypto = require('crypto');
    return crypto.createHash('sha3-512')
        .update(data.toString())
        .digest('hex');
};
exports.generateNewSha = generateNewSha;
var getRandomSerial = function (size) {
    var now = Date.now();
    var randomKeyA = Math.random();
    var randomKeyB = Math.random();
    return exports.generateNewSha(now * randomKeyA * randomKeyB).slice(0, size > 128 ? 128 : size);
};
exports.getRandomSerial = getRandomSerial;
var isEmptyObject = function (object) {
    return !Boolean(object) || (Object.keys(object).length === 0 && object.constructor === Object);
};
exports.isEmptyObject = isEmptyObject;
exports.rootKey = '7e1cbfa86c1ef2c47081cadf7d36c70c89cae491a74a0dc6112964e2bf6958772082c390080681c8048f5e3f46bd56be8df980107c483c03594a24bbe06f49d6';
exports.reGenerateSerialNumberDurationTime = 300 * 1000;
