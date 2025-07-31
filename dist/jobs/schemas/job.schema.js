"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSchema = exports.Job = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Job = class Job extends mongoose_2.Document {
};
exports.Job = Job;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Job.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Job.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Job.prototype, "isFlagged", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Job.prototype, "author", void 0);
exports.Job = Job = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Job);
exports.JobSchema = mongoose_1.SchemaFactory.createForClass(Job);
//# sourceMappingURL=job.schema.js.map