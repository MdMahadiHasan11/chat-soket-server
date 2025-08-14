"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../../middlewares/checkAuth");
const router = express_1.default.Router();
router.post("/init-payment/:bookingId", payment_controller_1.PaymentController.initPayment);
router.post("/success", payment_controller_1.PaymentController.successPayment);
router.post("/fail", payment_controller_1.PaymentController.failPayment);
router.post("/cancel", payment_controller_1.PaymentController.cancelPayment);
router.get("/invoice/:paymentId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), payment_controller_1.PaymentController.getInvoiceDownloadUrl);
router.post("/validate-payment", payment_controller_1.PaymentController.validatePayment);
exports.PaymentRoutes = router;
