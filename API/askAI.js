const { GoogleGenerativeAI } = require("@google/generative-ai");

// CLI commands will be generated using Google's Generative AI model
const askAI = async (task) => {
  console.log("inside askAI function.............");

  const promptString = `Generate a list of CLI commands required for the given task: ${task}. The response should only be an array of commands in double quotes, with no additional text or explanations. For example:
  
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
    
    If it is not possible to perform the entire task using CLI commands, return an array with a single string saying so. Don't send any command within single quotes.`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content based on the prompt
    let result = await model.generateContent(promptString);
    let output = result.response.text();

    console.log("output is: ", output);

    // Clean up the output by removing any unnecessary code block formatting
    output = output.replace(/```/g, "");

    // Parse the output into an array
    const outputArray = JSON.parse(output);

    return outputArray; // Return the parsed array directly
  } catch (error) {
    console.error("Error generating commands:", error);
    throw error; // Throw the error for handling upstream
  }
};

module.exports = { askAI };
