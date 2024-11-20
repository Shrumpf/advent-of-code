#!/usr/bin/env node

import 'dotenv/config'
import path from "node:path";
import minimist from "minimist";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const { AOC_USER_AGENT, AOC_SESSION_COOKIE, PROJECT_ROOT } = process.env;

let { year, day } = minimist(process.argv.slice(2), {
    string: ["year", "day"],
    default: {
        "year": new Date().getFullYear().toString(),
        "day": new Date().getDate().toString().padStart(2, "0")
    }
});

day = day.padStart(2, "0");


/**
 * 
 * @param {string} year 
 * @param {string} day 
 * @returns 
 */
async function getInput(year: string, day: string) {
    const url = new URL(`https://adventofcode.com/${year}/day/${parseInt(day)}/input`);

    if (!AOC_SESSION_COOKIE && !AOC_USER_AGENT) {
        throw new Error("No Session or User-Agent");
    }

    const res = await fetch(url.href, {
        method: "GET",
        credentials: "include",
        headers: {
            "Cookie": `session=${AOC_SESSION_COOKIE!}`,
            "User-Agent": AOC_USER_AGENT!,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
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
async function saveInput(year: string, day: string) {
    try {
        const inputPath = path.join(PROJECT_ROOT!, "inputs", year, day);
        const filePath = path.join(inputPath, `${day}.input.txt`);

        if (!existsSync(inputPath)) {
            await mkdir(inputPath, { recursive: true });
        }

        if (existsSync(filePath)) {
            const existingFile = await readFile(filePath);
            if (existingFile.length > 0) {
                throw new Error("Already exists!");
            }
            console.log("File is there, but empty, refill");
        }

        const data = await getInput(year, day);

        if (data) {
            writeFile(filePath, data, {
                flag: "w+",
            });
        }
    } catch (ex) {
        if (ex instanceof Error) {
            console.error(ex);
        }
    }
}

saveInput(year, day);