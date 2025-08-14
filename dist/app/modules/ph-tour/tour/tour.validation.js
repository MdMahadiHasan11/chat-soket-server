"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTourTypeZodSchema = exports.updateTourZodSchema = exports.createTourZodSchema = void 0;
const zod_1 = require("zod");
exports.createTourZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    location: zod_1.z.string().optional(),
    costFrom: zod_1.z.number().optional(),
    startDate: zod_1.z.string().optional().optional(),
    endDate: zod_1.z.string().optional().optional(),
    tourType: zod_1.z.string(), // <- changed here
    included: zod_1.z.array(zod_1.z.string()).optional(),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number().optional(),
    minAge: zod_1.z.number().optional(),
    division: zod_1.z.string(),
    departureLocation: zod_1.z.string().optional(),
    arrivalLocation: zod_1.z.string().optional(),
    deleteImages: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateTourZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivalLocation: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    costFrom: zod_1.z.number().optional(),
    startDate: zod_1.z.string().optional().optional(),
    endDate: zod_1.z.string().optional().optional(),
    tourType: zod_1.z.string().optional(), // <- changed here
    included: zod_1.z.array(zod_1.z.string()).optional(),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number().optional(),
    minAge: zod_1.z.number().optional(),
    deleteImages: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.createTourTypeZodSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
