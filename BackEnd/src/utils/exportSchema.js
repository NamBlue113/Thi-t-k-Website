const fs = require("fs");

const User = require("../models/userModel");
const Question = require("../models/questionModel");

let output = "";

function appendSchema(modelName, model) {

    output += `# ${modelName}\n`;

    const paths = model.schema.paths;

    for (const key in paths) {

        if (key === "__v") continue;

        const instance = paths[key].instance;

        output += `- ${key}: ${instance}\n`;
    }

    output += `\n`;
}

appendSchema("User", User);
appendSchema("Question", Question);

fs.writeFileSync("AI_DATABASE_SCHEMA.md", output);

console.log("Schema exported!");