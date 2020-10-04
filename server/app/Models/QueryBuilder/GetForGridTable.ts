const debug = require('debug')('mq:getForGridTable')
const _ = require('lodash')
class GetForGridTable {
    builder: any
    filters: any[]
    sorting: any[]

    constructor(builder) {
        this.builder = builder
    }

    getDefaultOperator(dataType) {
        const defaultOperators = {
            "number": "equal",
            "date": "beetween",
            "default": "contains"
        }
        return defaultOperators[dataType] || defaultOperators['default']
    }

    buildFilters() {
        for (let filter of this.filters) {
            let operator, columnName, value;
            try {
                if (typeof filter == "string") filter = JSON.parse(filter)
                operator = filter.operator;
                columnName = filter.field;
                value = filter.value;
                if (!columnName) {
                    throw new Error(`filter format invalid: ${JSON.stringify(filter)}`)
                }
            }
            catch (e) {
                throw new Error(`filter format invalid: ${JSON.stringify(filter)}`)
            }

            if (value == null || value === "") {
                debug(`value null or empty, skip filter in ${columnName}`)
                continue;
            }

            switch (operator) {
                case 'contains':
                    this.builder.where(columnName, 'ILIKE', `%${value.replace(/%/, '\%')}%`)
                    debug(`add filter contains: ${columnName} ILIKE %${value}%`)
                    break;
                case 'startWiths':
                    this.builder.where(columnName, 'ILIKE', `${value.replace(/%/, '\%')}%`)
                    debug(`add filter startWiths: ${columnName} ILIKE ${value}%`)
                    break;
                case 'endWiths':
                    this.builder.where(columnName, 'ILIKE', `%${value.replace(/%/, '\%')}`)
                    debug(`add filter endWiths: ${columnName} ILIKE %${value}`)
                    break;
                case 'between':
                    if (typeof value == "string") value = JSON.parse(value)
                    this.builder.whereBetween(columnName, value)
                    debug(`add filter between: ${columnName} between ${JSON.stringify(value)}`)
                    break;
                default:
                    this.builder.where(columnName, operator, value)
                    debug(`add filter operators: ${columnName}, operator: ${operator}, value:${value}`)
                    break;
            }
        }
    }

    buildSorting() {
        let sortData = []
        for (let sorting of this.sorting) {

            try {
                let { field, direction = 'asc' } = JSON.parse(sorting)
                if (!field) {
                    throw new Error(`sorting format invalid: ${JSON.stringify(this.sorting)}`)
                }
                sortData.push({
                    column: field,
                    order: direction
                })
            }
            catch (e) {
                throw new Error(`filter format invalid: ${JSON.stringify(this.sorting)}`)
            }
        }
        this.builder.orderBy(sortData)
    }

    async getTotal() {
        let queryTotal = this.builder.clone();
        queryTotal._events = this.builder._events;

        const [result] = await queryTotal.clearSelect().count();
        const count = _.get(result, 'count', 0)
        return Number(count)
    }

    async exec({ sorting = [], filters = [], pageSize = 50, page = 0 } = {}) {
        this.sorting = sorting;
        this.filters = filters;

        this.buildFilters()
        this.buildSorting();
        let result
        if (pageSize == -1) {
            result = await this.builder;
            result = {
                results: result,
                total: result.length
            }
        }
        else {
            result = await this.builder.page(page, pageSize)
        }

        return {
            total: result.total,
            data: result.results,
            page,
            pageSize
        }
    }
}

export default (builder) => {
    return new GetForGridTable(builder)
}