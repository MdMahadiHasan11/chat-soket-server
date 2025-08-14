"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
// src/modules/otp/otp.routes.ts
const express_1 = __importDefault(require("express"));
const otp_controller_1 = require("./otp.controller");
const router = express_1.default.Router();
router.post("/send", otp_controller_1.OTPController.sendOTP);
router.post("/verify", otp_controller_1.OTPController.verifyOTP);
exports.OtpRoutes = router;
