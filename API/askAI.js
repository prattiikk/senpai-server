// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // CLI commands will be generated using Google's Generative AI model
// const askAI = async (task) => {
//   console.log("inside askAI function.............");

//   const promptString = `Generate a list of CLI commands required for the given task: ${task}. The response should only be an array of commands in double quotes, with no additional text or explanations. For example:
  
//     [
//       "sudo apt-get update",
//       "sudo apt-get install apache2",
//       "sudo apt-get install mysql-server",
//       "sudo apt-get install php libapache2-mod-php",
//       "sudo systemctl enable apache2",
//       "sudo systemctl enable mysql",
//       "sudo systemctl start apache2",
//       "sudo systemctl start mysql"
//     ]
    
//     If it is not possible to perform the entire task using CLI commands, return an array with a single string saying so. Don't send any command within single quotes.`;

//   try {
//     const genAI = new GoogleGenerativeAI(process.env.API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate content based on the prompt
//     let result = await model.generateContent(promptString);
//     let output = result.response.text();

//     console.log( output);

//     // Clean up the output by removing any unnecessary code block formatting
//     output = output.replace(/```/g, "");

//     // Parse the output into an array
//     const outputArray = JSON.parse(output);

//     return outputArray; // Return the parsed array directly
//   } catch (error) {
//     console.error("Error generating commands:", error);
//     throw error; // Throw the error for handling upstream
//   }
// };

// module.exports = { askAI };

















// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const askAI = async (task) => {
//   const promptString = `Generate a list of CLI commands required for the given task: ${task}.
//   Return the commands as a **comma-separated list** of strings without any extra text or explanation. For example:

//   curl "https://awscli.amazonaws.com/awscli-exe-macos-x86_64.zip" -o "awscli.zip", unzip "awscli.zip", sudo ./awscli-macos-x86_64/install
//   Ensure each command is enclosed in double quotes, and do not include commas between them.`;

//   try {
//     const genAI = new GoogleGenerativeAI(process.env.API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate content based on the prompt
//     let result = await model.generateContent(promptString);
//     let output = result.response.text();

//     console.log("Raw output:", output);

//     // Clean the output by trimming and removing any extra spaces
//     output = output.trim();

//     // Split the string into an array of commands by separating by commas
//     const outputArray = output.split(",").map(command => command.trim().replace(/^"(.*)"$/, '$1'));

//     return outputArray; // Return the array directly
//   } catch (error) {
//     console.error("Error generating commands:", error);
//     throw error; // Throw the error for handling upstream
//   }
// };

// module.exports = { askAI };








const { GoogleGenerativeAI } = require("@google/generative-ai");

const askAI = async (task) => {
  const promptString = `Generate a list of CLI commands required for the given task: ${task}.
  Return the commands as a **comma-separated list** of strings without any extra text or explanation. For example:

  curl "https://awscli.amazonaws.com/awscli-exe-macos-x86_64.zip" -o "awscli.zip", unzip "awscli.zip", sudo ./awscli-macos-x86_64/install
  Ensure each command is enclosed in double quotes, and do not include commas between them.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Retry logic (optional)
    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        // Generate content based on the prompt
        result = await model.generateContent(promptString);
        if (result && result.response && result.response.text()) {
          break;
        } else {
          throw new Error("Empty response from the model.");
        }
      } catch (error) {
        console.error(`Error during generation attempt ${4 - retries}:`, error);
        retries--;
        if (retries === 0) throw new Error("Failed to generate commands after multiple attempts.");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retrying
      }
    }

    let output = result.response.text();
    console.log("Raw output:", output);

    // Validate if the output is not empty or malformed
    if (!output || output.trim() === "") {
      throw new Error("Model returned an empty or invalid response.");
    }

    // Clean the output by trimming and removing any extra spaces
    output = output.trim();

    // Validate the format (comma-separated strings)
    if (!/^"(.*)",\s*"[^"]+"(,|$)/.test(output)) {
      throw new Error("The response does not match the expected format of comma-separated commands.");
    }

    // Split the string into an array of commands by separating by commas
    const outputArray = output.split(",").map((command) => command.trim().replace(/^"(.*)"$/, '$1'));

    return outputArray; // Return the array directly
  } catch (error) {
    console.error("Error generating commands:", error);
    throw error; // Throw the error for handling upstream
  }
};

module.exports = { askAI };
