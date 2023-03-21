import Keyable from './structures/Keyable';

// Class that applies sort, filter, and pagination features to mongoose query
class QueryFeatures {
    query: any;
    queryParams: Keyable;

    //@param query - the mongoose inital query
    //@param queryString - object holding values for the operations
    constructor(query: any, queryString: Keyable) {
        this.query = query;
        this.queryParams = queryString;
    }

    // Filter the query by queryString
    filter() {
        const queryObj = { ...this.queryParams };
        const excludedFields = ['sort', 'page', 'limit'];
        excludedFields.forEach((el) => delete queryObj[el]);

        this.query = this.query.find(queryObj);
        return this;
    }

    // Sort the query by queryString['sort']
    sort() {
        if (this.queryParams.sort === 'asc') {
            this.query = this.query.sort('updatedAt');
        } else {
            this.query = this.query.sort('-updatedAt');
        }

        return this;
    }

    // Page the query by queryString['page'] and sort by queryString['limit']
    page() {
        let page: number = this.queryParams.page * 1 || 1;
        let limit: number = this.queryParams.limit * 1 || 50;

        page = page > 0 ? page : 1;
        limit = limit > 0 ? limit : 50;
        this.query = this.query.skip((page - 1) * limit).limit(limit);

        return this;
    }
}

export default QueryFeatures;
