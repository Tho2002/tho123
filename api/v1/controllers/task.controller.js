const Task = require("../../v1/models/task.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");
const { listUser } = require("./user.controller");
module.exports.index = async (req, res) => {
  const find = {
    $or: [{ createdBy: req.user.id }, { listUser: req.user.id }],
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  ///

  //search

  let ojbSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = ojbSearch.regex;
  }
  ///
  //Pagination
  let initPagination = { limitItem: 2, currentPage: 1 };
  const countTask = await Task.countDocuments(find); //dem so luong sp
  const objPagination = paginationHelper(initPagination, req.query, countTask);
  //
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  //
  const task = await Task.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);

  res.json(task);
};
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({ _id: id, deleted: false });
  res.json(task);
};

module.exports.ChangeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne({
      _id: id,
      status: status,
    });
    res.json({ code: 200, message: "ngon rồi em nhé !!" });
  } catch (error) {
    res.json({ code: 400, message: "dell ngon rồi" });
  }
};
module.exports.ChangeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          { status: value }
        );
        res.json({ code: 200, message: "ngon rồi em nhé !!" });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          { deleted: true, deletedAt: new Date() }
        );
        res.json({ code: 200, message: "Xóa ok rồi em ơi" });
        break;

      default:
        break;
    }
  } catch (error) {
    res.json({ code: 400, message: "dell ngon rồi" });
  }
};
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();
    res.json({ code: 200, message: "ngon rồi em nhé !!", data: data });
  } catch (error) {
    res.json({ code: 400, message: "dell ngon rồi" });
  }
};
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({ _id: id }, req.body);

    res.json({ code: 200, message: "ngon rồi em nhé !!" });
  } catch (error) {
    res.json({ code: 400, message: "dell ngon rồi" });
  }
};
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    res.json({ code: 200, message: "Xóa thành công" });
  } catch (error) {
    res.json({ code: 400, message: "dell ngon rồi" });
  }
};
