class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr }; // creates a copy of queryStr, if we directly write queryStr instead of { ...this.queryStr } it changes the value of queryStr in above codes also
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // paging
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page)||1;
    const skip=resultPerPage*(currentPage-1);
    this.query=this.query.limit(resultPerPage).skip(skip)
    return this;
    // Add pagination logic here
  }
}

module.exports = ApiFeatures;
