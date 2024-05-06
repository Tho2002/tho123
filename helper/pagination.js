module.exports = (objPagination, query, countRecords) => {
  if (query.page) {
    objPagination.currentPage = parseInt(query.page);
  }
  if (query.limit) {
    objPagination.limitItem = parseInt(query.limit);
  }
  objPagination.skip =
    (objPagination.currentPage - 1) * objPagination.limitItem;

  const totalPage = Math.ceil(countRecords / objPagination.limitItem);
  objPagination.totalPage = totalPage;
  return objPagination;
};
