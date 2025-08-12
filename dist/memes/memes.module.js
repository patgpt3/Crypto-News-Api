"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const memes_controller_1 = require("./memes.controller");
const memes_service_1 = require("./memes.service");
const meme_schema_1 = require("./schemas/meme.schema");
let MemesModule = class MemesModule {
};
exports.MemesModule = MemesModule;
exports.MemesModule = MemesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Meme', schema: meme_schema_1.MemeSchema }])],
        controllers: [memes_controller_1.MemesController],
        providers: [memes_service_1.MemesService],
    })
], MemesModule);
//# sourceMappingURL=memes.module.js.map