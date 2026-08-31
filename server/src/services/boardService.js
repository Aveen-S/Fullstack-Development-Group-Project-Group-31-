const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

const verifyBoardAccess = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) {
    const error = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = board.owner.toString() === userId.toString();
  const isMember = board.members.some(
    (memberId) => memberId.toString() === userId.toString()
  );

  if (!isOwner && !isMember) {
    const error = new Error("Not authorized to access this board");
    error.statusCode = 403;
    throw error;
  }

  return { board, isOwner, isMember };
};

const createBoard = async ({ title, description }, userId) => {
  const board = await Board.create({
    title,
    description: description || "",
    owner: userId,
    members: [userId],
  });

  const defaultColumns = [
    { title: "To Do", board: board._id, position: 0 },
    { title: "Doing", board: board._id, position: 1 },
    { title: "Done", board: board._id, position: 2 },
  ];

  const columns = await Column.insertMany(defaultColumns);

  return {
    board,
    columns,
  };
};

const getUserBoards = async (userId) => {
  const boards = await Board.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email avatar")
    .populate("members", "name email avatar")
    .sort({ updatedAt: -1 });

  return boards;
};

const getBoardById = async (boardId, userId) => {
  const { board } = await verifyBoardAccess(boardId, userId);

  await board.populate("owner", "name email avatar");
  await board.populate("members", "name email avatar");

  const columns = await Column.find({ board: boardId }).sort({ position: 1 });
  const tasks = await Task.find({ board: boardId })
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort({ createdAt: -1 });

  return {
    ...board.toObject(),
    columns,
    tasks,
  };
};

const updateBoard = async (boardId, { title, description, members }, userId) => {
  const { board, isOwner } = await verifyBoardAccess(boardId, userId);

  if (!isOwner) {
    const error = new Error("Only the board owner can update board settings");
    error.statusCode = 403;
    throw error;
  }

  if (title !== undefined) board.title = title;
  if (description !== undefined) board.description = description;
  if (members !== undefined && Array.isArray(members)) {
    const membersSet = new Set(members.map((m) => m.toString()));
    membersSet.add(board.owner.toString());
    board.members = Array.from(membersSet);
  }

  await board.save();
  await board.populate("owner", "name email avatar");
  await board.populate("members", "name email avatar");

  return board;
};

const deleteBoard = async (boardId, userId) => {
  const { board, isOwner } = await verifyBoardAccess(boardId, userId);

  if (!isOwner) {
    const error = new Error("Only the board owner can delete the board");
    error.statusCode = 403;
    throw error;
  }

  await Task.deleteMany({ board: boardId });
  await Column.deleteMany({ board: boardId });
  await Board.deleteOne({ _id: boardId });

  return { message: "Board and all associated data deleted successfully" };
};

const createColumn = async (boardId, { title, position }, userId) => {
  await verifyBoardAccess(boardId, userId);

  let columnPosition = position;
  if (columnPosition === undefined || columnPosition === null) {
    const lastColumn = await Column.findOne({ board: boardId }).sort({
      position: -1,
    });
    columnPosition = lastColumn ? lastColumn.position + 1 : 0;
  }

  const column = await Column.create({
    title,
    board: boardId,
    position: columnPosition,
  });

  return column;
};

const getBoardColumns = async (boardId, userId) => {
  await verifyBoardAccess(boardId, userId);

  const columns = await Column.find({ board: boardId }).sort({ position: 1 });
  return columns;
};

const updateColumn = async (boardId, columnId, { title, position }, userId) => {
  await verifyBoardAccess(boardId, userId);

  const column = await Column.findOne({ _id: columnId, board: boardId });
  if (!column) {
    const error = new Error("Column not found in this board");
    error.statusCode = 404;
    throw error;
  }

  if (title !== undefined) column.title = title;
  if (position !== undefined) column.position = position;

  await column.save();
  return column;
};

const deleteColumn = async (boardId, columnId, userId) => {
  await verifyBoardAccess(boardId, userId);

  const column = await Column.findOne({ _id: columnId, board: boardId });
  if (!column) {
    const error = new Error("Column not found in this board");
    error.statusCode = 404;
    throw error;
  }

  await Task.deleteMany({ column: columnId });
  await Column.deleteOne({ _id: columnId });

  return { message: "Column deleted successfully" };
};

const moveTaskBetweenColumns = async (boardId, taskId, targetColumnId, userId) => {
  await verifyBoardAccess(boardId, userId);

  const task = await Task.findOne({ _id: taskId, board: boardId });
  if (!task) {
    const error = new Error("Task not found in this board");
    error.statusCode = 404;
    throw error;
  }

  const targetColumn = await Column.findOne({
    _id: targetColumnId,
    board: boardId,
  });
  if (!targetColumn) {
    const error = new Error("Target column not found in this board");
    error.statusCode = 404;
    throw error;
  }

  task.column = targetColumn._id;

  const colTitleNormalized = targetColumn.title.trim().toLowerCase();
  if (colTitleNormalized.includes("todo") || colTitleNormalized === "to do") {
    task.status = "todo";
  } else if (
    colTitleNormalized.includes("doing") ||
    colTitleNormalized.includes("progress") ||
    colTitleNormalized.includes("in review")
  ) {
    task.status = "doing";
  } else if (
    colTitleNormalized.includes("done") ||
    colTitleNormalized.includes("completed")
  ) {
    task.status = "done";
  }

  await task.save();
  await task.populate("assignedTo", "name email avatar");
  await task.populate("createdBy", "name email avatar");

  return task;
};

module.exports = {
  verifyBoardAccess,
  createBoard,
  getUserBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  createColumn,
  getBoardColumns,
  updateColumn,
  deleteColumn,
  moveTaskBetweenColumns,
};
