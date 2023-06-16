class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    // will try to change  our query from  (.find({name:"product"})) to  wiht regex query twist
    search() {
        // in order to have search as per amazon type we have make use of regex
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i',
            },
        } : {};
        // this.query will call  Product.find()(as it was passed as an argument) so doing .find({...keyword}) on this.qeury will filter the fin result
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        // {...this.queryStr}(1) not directly =this.queryStr(2) bcz doing 2 will giv refernce of this.quertStr to copiedQuery which we don't want
        const copiedQuery = { ...this.queryStr };
        // removing some of the undesired fields for getting product as per category
        // value of considered fields are case sensitive and we haven't done it as case insensitive bcz we will predified category from frontend in a fiexd format i.e Laptop and not laptop
        const removeFields = ['keyword', 'page', 'limit']
        removeFields.forEach((key) => delete copiedQuery[key])
        // filter for price and rating (which are present in range not exact number)
        // console.log(copiedQuery);
        let queryStr = JSON.stringify(copiedQuery);
        // making gt,lt etc with
        // console.log(queryStr);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(JSON.parse(queryStr));
        return this;
    }
    pagination(resultPerPage){
        const currPage=Number(this.queryStr.page) || 1;
        // this will skip no of product to be shown on  current page as oer per page no we are  on
        const skipPages=resultPerPage*(currPage-1);
        this.query=this.query.limit(resultPerPage).skip(skipPages);
        return this;
    }

}
module.exports = ApiFeatures;
