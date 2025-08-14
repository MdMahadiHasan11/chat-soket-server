"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionSchema = exports.createDivisionSchema = void 0;
const zod_1 = require("zod");
exports.createDivisionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    thumbnail: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.updateDivisionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    thumbnail: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
