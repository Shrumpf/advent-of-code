#!/usr/bin/env node

import 'dotenv/config'
import path from "node:path";
import minimist from "minimist";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const { AOC_USER_AGENT, AOC_SESSION_COOKIE } = process.env;

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
async function getInput(year, day) {
    const url = new URL(`https://adventofcode.com/${year}/day/${parseInt(day)}/input`);

    if (!AOC_SESSION_COOKIE && !AOC_USER_AGENT) {
        throw new Error("No Session or User-Agent");
    }

    const res = await fetch(url.href, {
        method: "GET",
        credentials: "include",
        headers: {
            "Cookie": `session=${AOC_SESSION_COOKIE}`,
            "User-Agent": AOC_USER_AGENT,
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