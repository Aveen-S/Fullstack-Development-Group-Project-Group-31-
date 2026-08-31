const boardService = require("../src/services/boardService");
const boardController = require("../src/controllers/boardController");

const runMockUnitTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  assert(typeof boardService.createBoard === "function", "boardService.createBoard is exported");
  assert(typeof boardService.getUserBoards === "function", "boardService.getUserBoards is exported");
  assert(typeof boardService.getBoardById === "function", "boardService.getBoardById is exported");
  assert(typeof boardService.updateBoard === "function", "boardService.updateBoard is exported");
  assert(typeof boardService.deleteBoard === "function", "boardService.deleteBoard is exported");
  assert(typeof boardService.createColumn === "function", "boardService.createColumn is exported");
  assert(typeof boardService.getBoardColumns === "function", "boardService.getBoardColumns is exported");
  assert(typeof boardService.updateColumn === "function", "boardService.updateColumn is exported");
  assert(typeof boardService.deleteColumn === "function", "boardService.deleteColumn is exported");
  assert(typeof boardService.moveTaskBetweenColumns === "function", "boardService.moveTaskBetweenColumns is exported");

  assert(typeof boardController.createBoard === "function", "boardController.createBoard is exported");
  assert(typeof boardController.getBoards === "function", "boardController.getBoards is exported");
  assert(typeof boardController.getBoardById === "function", "boardController.getBoardById is exported");
  assert(typeof boardController.updateBoard === "function", "boardController.updateBoard is exported");
  assert(typeof boardController.deleteBoard === "function", "boardController.deleteBoard is exported");
  assert(typeof boardController.createColumn === "function", "boardController.createColumn is exported");
  assert(typeof boardController.getColumns === "function", "boardController.getColumns is exported");
  assert(typeof boardController.updateColumn === "function", "boardController.updateColumn is exported");
  assert(typeof boardController.deleteColumn === "function", "boardController.deleteColumn is exported");
  assert(typeof boardController.moveTask === "function", "boardController.moveTask is exported");

  const req1 = { body: {}, user: { _id: "60c72b2f9b1d8b2badbee555" } };
  let res1Status = null;
  let res1Json = null;
  const res1 = {
    status: (code) => {
      res1Status = code;
      return {
        json: (data) => {
          res1Json = data;
        },
      };
    },
  };
  await boardController.createBoard(req1, res1);
  assert(res1Status === 400 && res1Json.success === false, "createBoard validates empty title returns 400");

  const req2 = { params: { id: "invalid-id" }, user: { _id: "60c72b2f9b1d8b2badbee555" } };
  let res2Status = null;
  let res2Json = null;
  const res2 = {
    status: (code) => {
      res2Status = code;
      return {
        json: (data) => {
          res2Json = data;
        },
      };
    },
  };
  await boardController.getBoardById(req2, res2);
  assert(res2Status === 400 && res2Json.message === "Invalid board ID format", "getBoardById rejects invalid ObjectId");

  const req3 = {
    params: { boardId: "60c72b2f9b1d8b2badbee555" },
    body: { title: "" },
    user: { _id: "60c72b2f9b1d8b2badbee555" },
  };
  let res3Status = null;
  const res3 = {
    status: (code) => {
      res3Status = code;
      return { json: () => {} };
    },
  };
  await boardController.createColumn(req3, res3);
  assert(res3Status === 400, "createColumn rejects empty column title with 400");

  const req4 = {
    params: { boardId: "60c72b2f9b1d8b2badbee555", taskId: "60c72b2f9b1d8b2badbee666" },
    body: {},
    user: { _id: "60c72b2f9b1d8b2badbee555" },
  };
  let res4Status = null;
  const res4 = {
    status: (code) => {
      res4Status = code;
      return { json: () => {} };
    },
  };
  await boardController.moveTask(req4, res4);
  assert(res4Status === 400, "moveTask rejects missing targetColumnId with 400");

  const app = require("../src/app");
  assert(typeof app === "function", "app.js loads properly with board routes mounted");

  console.log(`\nTests finished: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runMockUnitTests();
