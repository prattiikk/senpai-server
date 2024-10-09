const { askAI } = require("./API/askAI.js");

async function test() {
    const res = await askAI("list all the files")
    console.log(res)

}
test()