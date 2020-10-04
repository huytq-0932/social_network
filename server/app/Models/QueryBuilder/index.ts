import { QueryBuilder, Model } from 'objection';
import GetForGridTable from './GetForGridTable'

class ExtendQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
    getForGridTable({ sorting = [], filters = [], pageSize = 50, page = 0 } = {}) {
        return GetForGridTable(this).exec({ sorting, filters, pageSize, page })
    }
}
export default ExtendQueryBuilder