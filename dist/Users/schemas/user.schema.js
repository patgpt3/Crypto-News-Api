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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let User = class User extends mongoose_2.Document {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false, unique: true, sparse: true }),
    __metadata("design:type", String)
], User.prototype, "privyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], User.prototype, "about", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], User.prototype, "isFlagged", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], User.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: false }),
    __metadata("design:type", Array)
], User.prototype, "submissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: false }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: false }),
    __metadata("design:type", Array)
], User.prototype, "upvotedSubmissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: false }),
    __metadata("design:type", Array)
], User.prototype, "jobs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: false }),
    __metadata("design:type", Array)
], User.prototype, "replies", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map