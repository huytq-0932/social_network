import Base from '@core/Databases/BaseModel';
import ExtendQueryBuilder from './QueryBuilder';

class BaseModel extends Base {
    static QueryBuilder = ExtendQueryBuilder
}

export default BaseModel