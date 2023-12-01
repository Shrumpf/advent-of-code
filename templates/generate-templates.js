#!/usr/bin/env node

import 'dotenv/config'
import minimist from "minimist";
import prompts from "prompts";
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { dirname } from "path";


const { PROJECT_ROOT } = process.env;

let { year, day } = minimist(process.argv.slice(2), {
    string: ["year", "day", "lang"],
    default: {
        "year": new Date().getFullYear().toString(),
        "day": new Date().getDate().toString().padStart(2, "0"),
        "lang": "js",
    }
});

day = day.padStart(2, "0");

// const templatePath = "./" + lang + "/{{day}}.ejs";
// const toPath = "../solutions/" + lang + "/years/" + year + "/" + day + ".js";

function getFiles(folder) {
    return readdirSync(`${PROJECT_ROOT}/templates/${folder}`);
}
function replacePlaceHolder(toPath) {
    let fileContent = readFileSync(toPath).toString().replaceAll("{{day}}", day).replaceAll("{{year}}", year);
    writeFileSync(toPath, fileContent);
}
async function copyTemplate(templatePath, toPath) {
    const toPathDir = dirname(toPath);
    if (!existsSync(toPathDir)) {
        mkdirSync(toPathDir, { recursive: true });
    }
    if (existsSync(toPath)) {
        let wantOverride;
        const answers = await prompts([
            {
                type: "select",
                name: "overwriteFile",
                message: `Do you want to overwrite ${toPath} ? `,
                choices: [
                    {
                        title: "Yes",
                        value: "true"
                    },
                    {
                        title: "No",
                        value: "false"
                    },
                ],
            },
        ], {
            onCancel: () => {
                process.exit();
            },
        });
        if (answers.overwriteFile === "true") {
            wantOverride = true;
        }
        if (wantOverride) {
            copyFileSync(templatePath, toPath);
            replacePlaceHolder(toPath);
        }
    }
    else {
        copyFileSync(templatePath, toPath);
        replacePlaceHolder(toPath);
    }
}

// const folders  = readdirSync(`${PROJECT_ROOT}/templates`);
// for (const folder in folders) {
//     if (!statSync(folder).isDirectory) {
//         continue;
//     }    
// }

const solutionTemplates = getFiles("solutions/js");
for (const file of solutionTemplates) {
    const fileName = file.replace("{day}", day).replace(".template", "");
    // Solutions!
    const toPath = `${PROJECT_ROOT}/${"solutions/js"}/years/${year}/${fileName}`; // "../solutions/" + lang + "/years/" + year + "/" + fileName;
    const templatePath = `${PROJECT_ROOT}/templates/${"solutions/js"}/${file}`; //" + lang + "/" + file;
    await copyTemplate(templatePath, toPath);
}

const exampleTemplates = getFiles("examples");
for (const file of exampleTemplates) {
    const fileName = file.replace("{day}", day).replace(".template", "");
    const toPath = `${PROJECT_ROOT}/${"examples"}/${year}/${fileName}`; // "../solutions/" + lang + "/years/" + year + "/" + fileName;
    const templatePath = `${PROJECT_ROOT}/templates/${"examples"}/${file}`; //" + lang + "/" + file;
    await copyTemplate(templatePath, toPath);
}