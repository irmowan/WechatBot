import {conversation, getReply} from './chatUtil'
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("close", function(){
	process.exit(0)
})

async function queryOnce() {
  return new Promise<void>((resolve) => {
    rl.question("User:\t", async function (user_message) {
      const result = await conversation(user_message);
      console.log("Assistant:\t", result);
      resolve();
    });
  });
}

async function runQueries() {
  var i = 0;
  while (i < 10) {
    await queryOnce();
    i += 1;
  }
}

runQueries();
