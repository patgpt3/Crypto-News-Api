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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const item_dto_1 = require("./dto/item.dto");
const items_service_1 = require("./items.service");
const logger_service_1 = require("../logger/logger.service");
let ItemsController = class ItemsController {
    constructor(itemsService, logger) {
        this.itemsService = itemsService;
        this.logger = logger;
    }
    async findAll() {
        this.logger.debug('Get All Items Endpoint');
        const fa = await this.itemsService.findAll();
        return fa;
    }
    async findAllPast() {
        this.logger.debug('Get All Items Past Endpoint');
        const fa = await this.itemsService.findAllPast();
        return fa;
    }
    async findAllNewest() {
        this.logger.debug('Get All Newest Items Endpoint');
        const fa = await this.itemsService.findAllNewest();
        return fa;
    }
    async findAllMain() {
        this.logger.debug('Get All Main Items Endpoint');
        const fa = await this.itemsService.findAllMain();
        return fa;
    }
    async findAllMainPagination(param, page) {
        this.logger.debug('Get All Main Items Pages Endpoint');
        const fa = await this.itemsService.findAllMainPagination(page.pageNumber);
        return fa;
    }
    async findAllNewestPagination(param, page) {
        this.logger.debug('Get All New Items Pages Endpoint');
        const fa = await this.itemsService.findAllNewestPagination(page.pageNumber);
        return fa;
    }
    async findAllAskPagination(param, page) {
        this.logger.debug('Get All Ask Items Pages Endpoint');
        const fa = await this.itemsService.findAllAskPagination(page.pageNumber);
        return fa;
    }
    async findAllShowPagination(param, page) {
        this.logger.debug('Get All Show Items Pages Endpoint');
        const fa = await this.itemsService.findAllShowPagination(page.pageNumber);
        return fa;
    }
    async findAllShow() {
        this.logger.debug('Get All Show Items Endpoint');
        const fa = await this.itemsService.findAllShow();
        return fa;
    }
    async findAllAsk() {
        this.logger.debug('Get All Ask Items Endpoint');
        const fa = await this.itemsService.findAllAsk();
        return fa;
    }
    async upVote(param, currentUser) {
        this.logger.debug('upVote Endpoint');
        const fa = await this.itemsService.upVote(param.id, currentUser);
        return fa;
    }
    async downVote(param, currentUser) {
        this.logger.debug('Down Vote Endpoint');
        const fa = await this.itemsService.downVote(param.id, currentUser);
        return fa;
    }
    async findById(param) {
        this.logger.debug('Get Item by ID Endpoint');
        return this.itemsService.findById(param.id);
    }
    async findbyIds(idsObj) {
        this.logger.debug('Get All Items by Ids Endpoint');
        const results = [];
        const ids = idsObj.items;
        console.log(ids);
        for (const id of ids) {
            try {
                console.log(id);
                const data = await this.itemsService.findById(id);
                console.log(data);
                results.push(data);
            }
            catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }
        return results;
    }
    async create(itemDTO) {
        this.logger.debug('Create Item Endpoint');
        const createI = await this.itemsService.create(itemDTO);
        return createI;
    }
    async update(param, itemDTO) {
        this.logger.debug('Update Items Endpoint');
        return this.itemsService.update(param.id, itemDTO);
    }
    async delete(param) {
        this.logger.debug('Delete Item Endpoint');
        return this.itemsService.delete(param.id);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('past'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllPast", null);
__decorate([
    (0, common_1.Get)('newest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllNewest", null);
__decorate([
    (0, common_1.Get)('main'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllMain", null);
__decorate([
    (0, common_1.Put)('main/pages'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllMainPagination", null);
__decorate([
    (0, common_1.Put)('newest/pages'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllNewestPagination", null);
__decorate([
    (0, common_1.Put)('ask/pages'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllAskPagination", null);
__decorate([
    (0, common_1.Put)('show/pages'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllShowPagination", null);
__decorate([
    (0, common_1.Get)('show'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllShow", null);
__decorate([
    (0, common_1.Get)('ask'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAllAsk", null);
__decorate([
    (0, common_1.Put)('upVote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "upVote", null);
__decorate([
    (0, common_1.Put)('downVote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "downVote", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)('items/findbyIds'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findbyIds", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_dto_1.ItemDTO]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, item_dto_1.ItemDTO]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "delete", null);
exports.ItemsController = ItemsController = __decorate([
    (0, common_1.Controller)('items'),
    __param(0, (0, common_1.Inject)(items_service_1.ItemsService)),
    __metadata("design:paramtypes", [items_service_1.ItemsService,
        logger_service_1.LoggerService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map