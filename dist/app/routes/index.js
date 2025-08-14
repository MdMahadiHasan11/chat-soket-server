"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/ph-tour/user/user.routes");
const auth_routes_1 = require("../modules/ph-tour/auth/auth.routes");
const tour_routes_1 = require("../modules/ph-tour/tour/tour.routes");
const division_routes_1 = require("../modules/ph-tour/division/division.routes");
const booking_route_1 = require("../modules/ph-tour/booking/booking.route");
const payment_route_1 = require("../modules/ph-tour/payment/payment.route");
const otp_route_1 = require("../modules/ph-tour/otp/otp.route");
const stats_route_1 = require("../modules/ph-tour/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/tour",
        route: tour_routes_1.TourRoutes,
    },
    {
        path: "/division",
        route: division_routes_1.DivisionRoutes,
    },
    {
        path: "/booking",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
