const mongoose = require("mongoose");
const boardService = require("../services/boardService");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a board title",
      });
    }

    const result = await boardService.createBoard(
      {
        title: title.trim(),
        description: description ? description.trim() : "",
      },
      req.user._id
    );

    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      board: result.board,
      columns: result.columns,
    });
  } catch (error) {
    console.error("Create board error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error creating board",
    });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await boardService.getUserBoards(req.user._id);

    return res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    });
  } catch (error) {
    console.error("Get boards error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error fetching boards",
    });
  }
};

const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID format",
      });
    }

    const boardData = await boardService.getBoardById(id, req.user._id);

    return res.status(200).json({
      success: true,
      board: boardData,
    });
  } catch (error) {
    console.error("Get board by ID error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error fetching board details",
    });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID format",
      });
    }

    const { title, description, members } = req.body;

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: "Board title cannot be empty",
      });
    }

    const updatedBoard = await boardService.updateBoard(
      id,
      {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        members,
      },
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      board: updatedBoard,
    });
  } catch (error) {
    console.error("Update board error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error updating board",
    });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID format",
      });
    }

    const result = await boardService.deleteBoard(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete board error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error deleting board",
    });
  }
};

const createColumn = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, position } = req.body;

    if (!isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID format",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a column title",
      });
    }

    const column = await boardService.createColumn(
      boardId,
      {
        title: title.trim(),
        position,
      },
      req.user._id
    );

    return res.status(201).json({
      success: true,
      message: "Column created successfully",
      column,
    });
  } catch (error) {
    console.error("Create column error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error creating column",
    });
  }
};

const getColumns = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID format",
      });
    }

    const columns = await boardService.getBoardColumns(boardId, req.user._id);

    return res.status(200).json({
      success: true,
      count: columns.length,
      columns,
    });
  } catch (error) {
    console.error("Get columns error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error fetching columns",
    });
  }
};

const updateColumn = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { title, position } = req.body;

    if (!isValidObjectId(boardId) || !isValidObjectId(columnId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: "Column title cannot be empty",
      });
    }

    const updatedColumn = await boardService.updateColumn(
      boardId,
      columnId,
      {
        title: title !== undefined ? title.trim() : undefined,
        position,
      },
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Column updated successfully",
      column: updatedColumn,
    });
  } catch (error) {
    console.error("Update column error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error updating column",
    });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;

    if (!isValidObjectId(boardId) || !isValidObjectId(columnId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const result = await boardService.deleteColumn(boardId, columnId, req.user._id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete column error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error deleting column",
    });
  }
};

const moveTask = async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const { targetColumnId } = req.body;

    if (!isValidObjectId(boardId) || !isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board or task ID format",
      });
    }

    if (!targetColumnId || !isValidObjectId(targetColumnId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid targetColumnId",
      });
    }

    const updatedTask = await boardService.moveTaskBetweenColumns(
      boardId,
      taskId,
      targetColumnId,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Task moved successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Move task error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error moving task",
    });
  }
};

module.exports = {
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
};
