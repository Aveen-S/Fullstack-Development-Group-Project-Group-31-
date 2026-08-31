const express = require("express");
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  createColumn,
  getColumns,
  updateColumn,
  deleteColumn,
  moveTask,
} = require("../controllers/boardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getBoards)
  .post(createBoard);

router.route("/:id")
  .get(getBoardById)
  .put(updateBoard)
  .delete(deleteBoard);

router.route("/:boardId/columns")
  .get(getColumns)
  .post(createColumn);

router.route("/:boardId/columns/:columnId")
  .put(updateColumn)
  .delete(deleteColumn);

router.route("/:boardId/tasks/:taskId/move")
  .put(moveTask);

module.exports = router;
