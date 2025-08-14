import { Router } from "express";
import { UserRoutes } from "../modules/ph-tour/user/user.routes";
import { AuthRoutes } from "../modules/ph-tour/auth/auth.routes";
import { TourRoutes } from "../modules/ph-tour/tour/tour.routes";
import { DivisionRoutes } from "../modules/ph-tour/division/division.routes";
import { BookingRoutes } from "../modules/ph-tour/booking/booking.route";
import { PaymentRoutes } from "../modules/ph-tour/payment/payment.route";
import { OtpRoutes } from "../modules/ph-tour/otp/otp.route";
import { StatsRoutes } from "../modules/ph-tour/stats/stats.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
