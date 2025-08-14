"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusZodSchema = exports.createBookingZodSchema = void 0;
const zod_1 = require("zod");
const booking_interface_1 = require("./booking.interface");
exports.createBookingZodSchema = zod_1.z.object({
    tour: zod_1.z.string(),
    guestCount: zod_1.z.number().int().positive()
});
exports.updateBookingStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(booking_interface_1.BOOKING_STATUS)),
});
