require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Board = require("../src/models/Board");
const Column = require("../src/models/Column");
const Task = require("../src/models/Task");
const boardService = require("../src/services/boardService");

const runBoardTests = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const testUser = await User.create({
      name: "Member 7 Test User",
      email: `member7-${Date.now()}@example.com`,
      password: "password123",
    });

    const { board, columns } = await boardService.createBoard(
      {
        title: "Sprint 1 Board",
        description: "Project board for sprint 1 tasks",
      },
      testUser._id
    );

    if (columns.length !== 3) {
      throw new Error("Expected 3 default columns (To Do, Doing, Done)");
    }

    const userBoards = await boardService.getUserBoards(testUser._id);
    if (!userBoards.some((b) => b._id.toString() === board._id.toString())) {
      throw new Error("Created board not found in user's boards list");
    }

    const newColumn = await boardService.createColumn(
      board._id,
      { title: "Review" },
      testUser._id
    );

    const allColumns = await boardService.getBoardColumns(board._id, testUser._id);
    if (allColumns.length !== 4) {
      throw new Error("Expected 4 columns after adding Review column");
    }

    await boardService.updateColumn(
      board._id,
      newColumn._id,
      { title: "In Review", position: 3 },
      testUser._id
    );

    const todoColumn = columns.find((c) => c.title === "To Do");
    const doingColumn = columns.find((c) => c.title === "Doing");

    const testTask = await Task.create({
      title: "Design Landing Page",
      description: "Create high-fidelity wireframes",
      status: "todo",
      priority: "High",
      assignedTo: testUser._id,
      board: board._id,
      column: todoColumn._id,
      createdBy: testUser._id,
    });

    const movedTask = await boardService.moveTaskBetweenColumns(
      board._id,
      testTask._id,
      doingColumn._id,
      testUser._id
    );
    if (movedTask.column.toString() !== doingColumn._id.toString() || movedTask.status !== "doing") {
      throw new Error("Task move or status synchronization failed");
    }

    await boardService.getBoardById(board._id, testUser._id);

    await boardService.updateBoard(
      board._id,
      { title: "Sprint 1 Board - Updated" },
      testUser._id
    );

    await boardService.deleteColumn(
      board._id,
      newColumn._id,
      testUser._id
    );

    await boardService.deleteBoard(board._id, testUser._id);

    const remainingTasks = await Task.find({ board: board._id });
    const remainingCols = await Column.find({ board: board._id });
    if (remainingTasks.length > 0 || remainingCols.length > 0) {
      throw new Error("Cascade deletion failed: orphaned tasks or columns remain");
    }

    await User.deleteOne({ _id: testUser._id });

    console.log("All Member 7 tests passed successfully.");
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runBoardTests();
