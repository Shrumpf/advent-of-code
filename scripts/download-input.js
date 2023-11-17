import minimist from "minimist";

const { AOC_USER_AGENT, AOC_SESSION_COOKIE } = process.env;

let { year, day } = minimist(process.argv.slice(2), {
    string: ["year", "day"],
    default: {
        "year": "2020",  // new Date().getFullYear().toString()
        "day": "01", // new Date().getDay().toString().padStart(2, "0")
    }
});

day = day.padStart(2, "0");

console.log(process.argv.slice(3));


import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * 
 * @param {string} year 
 * @param {string} day 
 * @returns 
 */
async function getInput(year, day) {
    const res = await fetch(`https://adventofcode.com/${year}/day/${parseInt(day)}/input`, {
        method: "GET",
        headers: {
            "Cookie": `session=${AOC_SESSION_COOKIE}`,
            "User-Agent": AOC_USER_AGENT,
            "Accept": "text/plain",
        }
    });

    if (res.ok) {
        return res.text();
    } else {
        console.log(await res.text())
    }
}

/**
 * 
 * @param {string} year 
 * @param {string} day 
 */
async function saveInput(year, day) {
    try {
        const inputPath = path.join(process.cwd(), "inputs", year);
        const filePath = path.join(inputPath, `${day}.input.txt`);

        if (!existsSync(inputPath)) {
            await mkdir(inputPath);
        }

        if (existsSync(filePath)) {
            const existingFile = await readFile(path.join(inputPath, `${day}.input.txt`));
            if (existingFile.length > 0) {
                throw new Error("Already exists!");
            }
            console.log("File is there, but empty, refill");
        }

        const data = await getInput(year, day);

        writeFile(filePath, data, {
            flag: "w+",
        });


    } catch (ex) {
        switch (ex.code) {
            default:
                console.error(ex);
                break;
        }
    }
}

saveInput(year, day);