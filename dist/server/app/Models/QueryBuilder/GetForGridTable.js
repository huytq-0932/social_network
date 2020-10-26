"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('mq:getForGridTable');
const _ = require('lodash');
class GetForGridTable {
    constructor(builder) {
        this.builder = builder;
    }
    getDefaultOperator(dataType) {
        const defaultOperators = {
            "number": "equal",
            "date": "beetween",
            "default": "contains"
        };
        return defaultOperators[dataType] || defaultOperators['default'];
    }
    buildFilters() {
        for (let filter of this.filters) {
            let operator, columnName, value;
            try {
                if (typeof filter == "string")
                    filter = JSON.parse(filter);
                operator = filter.operator;
                columnName = filter.field;
                value = filter.value;
                if (!columnName) {
                    throw new Error(`filter format invalid: ${JSON.stringify(filter)}`);
                }
            }
            catch (e) {
                throw new Error(`filter format invalid: ${JSON.stringify(filter)}`);
            }
            if (value == null || value === "") {
                debug(`value null or empty, skip filter in ${columnName}`);
                continue;
            }
            switch (operator) {
                case 'contains':
                    this.builder.where(columnName, 'ILIKE', `%${value.replace(/%/, '\%')}%`);
                    debug(`add filter contains: ${columnName} ILIKE %${value}%`);
                    break;
                case 'startWiths':
                    this.builder.where(columnName, 'ILIKE', `${value.replace(/%/, '\%')}%`);
                    debug(`add filter startWiths: ${columnName} ILIKE ${value}%`);
                    break;
                case 'endWiths':
                    this.builder.where(columnName, 'ILIKE', `%${value.replace(/%/, '\%')}`);
                    debug(`add filter endWiths: ${columnName} ILIKE %${value}`);
                    break;
                case 'between':
                    if (typeof value == "string")
                        value = JSON.parse(value);
                    this.builder.whereBetween(columnName, value);
                    debug(`add filter between: ${columnName} between ${JSON.stringify(value)}`);
                    break;
                default:
                    this.builder.where(columnName, operator, value);
                    debug(`add filter operators: ${columnName}, operator: ${operator}, value:${value}`);
                    break;
            }
        }
    }
    buildSorting() {
        let sortData = [];
        for (let sorting of this.sorting) {
            try {
                let { field, direction = 'asc' } = JSON.parse(sorting);
                if (!field) {
                    throw new Error(`sorting format invalid: ${JSON.stringify(this.sorting)}`);
                }
                sortData.push({
                    column: field,
                    order: direction
                });
            }
            catch (e) {
                throw new Error(`filter format invalid: ${JSON.stringify(this.sorting)}`);
            }
        }
        this.builder.orderBy(sortData);
    }
    getTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            let queryTotal = this.builder.clone();
            queryTotal._events = this.builder._events;
            const [result] = yield queryTotal.clearSelect().count();
            const count = _.get(result, 'count', 0);
            return Number(count);
        });
    }
    exec({ sorting = [], filters = [], pageSize = 50, page = 0 } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sorting = sorting;
            this.filters = filters;
            this.buildFilters();
            this.buildSorting();
            let result;
            if (pageSize == -1) {
                result = yield this.builder;
                result = {
                    results: result,
                    total: result.length
                };
            }
            else {
                result = yield this.builder.page(page, pageSize);
            }
            return {
                total: result.total,
                data: result.results,
                page,
                pageSize
            };
        });
    }
}
exports.default = (builder) => {
    return new GetForGridTable(builder);
};
