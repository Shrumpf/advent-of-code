import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync, stat, statSync } from "fs";
import path, { dirname } from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";

const { PROJECT_ROOT } = process.env;

const year = "2021";
const day = "01";

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
//# sourceMappingURL=main.js.map