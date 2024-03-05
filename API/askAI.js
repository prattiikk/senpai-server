const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
// const { json } = require("body-parser");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// CLI commands will be generated using googles generative ai  model
const askAI = async (task) => {
  const promptString = `Generate a list of CLI commands required for the given task, which is: ${task}. The response should be a list containing the commands,enclosed in double inverted commas, and presented as an array. For example, if the task is to install a web server with PHP and MySQL support, then the response should look like this:
  
    [
      "sudo apt-get update",
      "sudo apt-get install apache2",
      "sudo apt-get install mysql-server",
      "sudo apt-get install php libapache2-mod-php",
      "sudo systemctl enable apache2",
      "sudo systemctl enable mysql",
      "sudo systemctl start apache2",
      "sudo systemctl start mysql"
    ]
    
    Always return the array of commands, not just the string of commands. If it is not possible to perform the entire task using CLI commands, return an array with a single string saying so. dont send any command within single inverted commas`;
  const stopSequences = [];

  try {
    const result = await client.generateText({
      model: MODEL_NAME,
      temperature: 0.3,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
      max_output_tokens: 1024,
      safety_settings: [
        { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
        { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
        { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
        { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
        { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
        { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
      ],
      prompt: {
        text: promptString,
      },
    });
    let output = result[0].candidates[0].output;

    // Replace single inverted commas with double inverted commas
    output = output
      .replace(/'(?=([^"]*"[^"]*")*[^"]*$)/g, '"')
      .replace(/```/g, "");

    // console.log(typeof output);
    // console.log(output);

    // Escape the inner single quotes within the string
    output = output.replace(/'(\w+)'\s*:\s*(\d+)/g, '\\"$1\\": $2');
    const outputArray = JSON.parse(output);
    const dataArray = Object.values(outputArray);

    return dataArray;
  } catch (error) {
    throw error;
  }
};

module.exports = { askAI };
