require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../src/models/User");
const Board = require("../src/models/Board");
const Column = require("../src/models/Column");
const Task = require("../src/models/Task");

const testDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connection successful");

    // -----------------------------------------
    // Create test user
    // -----------------------------------------

    const user = await User.create({
      name: "Database Test User",
      email: `database-test-${Date.now()}@example.com`,
      password: "test-password",
    });

    console.log("User model working");

    // -----------------------------------------
    // Create test board
    // -----------------------------------------

    const board = await Board.create({
      title: "Database Test Board",
      description: "Temporary database test",
      owner: user._id,
      members: [user._id],
    });

    console.log("Board model working");

    // -----------------------------------------
    // Create test column
    // -----------------------------------------

    const column = await Column.create({
      title: "To Do",
      board: board._id,
      position: 0,
    });

    console.log("Column model working");

    // -----------------------------------------
    // Create test task
    // -----------------------------------------

    const task = await Task.create({
      title: "Database Test Task",
      description: "Temporary database test",
      status: "todo",
      priority: "Medium",
      assignedTo: user._id,
      board: board._id,
      column: column._id,
      createdBy: user._id,
    });

    console.log("Task model working");

    // -----------------------------------------
    // Display created records
    // -----------------------------------------

    console.log("\nDatabase test successful!");

    console.log({
      userId: user._id,
      boardId: board._id,
      columnId: column._id,
      taskId: task._id,
    });

    // -----------------------------------------
    // Delete test data
    // -----------------------------------------

    await Task.deleteOne({ _id: task._id });
    await Column.deleteOne({ _id: column._id });
    await Board.deleteOne({ _id: board._id });
    await User.deleteOne({ _id: user._id });

    console.log("\nTemporary test data removed");
  } catch (error) {
    console.error("\nDatabase test failed:", error.message);
  } finally {
    await mongoose.connection.close();

    console.log("Database connection closed");
  }
};

testDatabase();
