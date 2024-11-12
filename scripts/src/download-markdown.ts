#!/usr/bin/env node

import 'dotenv/config'
import path from "node:path";
import minimist from "minimist";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

// @ts-ignore
import { gfm } from "turndown-plugin-gfm";
import TurndownService from "turndown";

const { AOC_USER_AGENT, AOC_SESSION_COOKIE, PROJECT_ROOT } = process.env;

let { year, day } = minimist(process.argv.slice(2), {
    string: ["year", "day"],
    default: {
        "year": new Date().getFullYear().toString(),
        "day": new Date().getDate().toString().padStart(2, "0")
    }
});

day = day.padStart(2, "0");


function stripHyphens(str: string | undefined) {
    if (!str) {
        return;
    }
    const regex = /--- (.+) ---/g;
    return str.replaceAll(regex, (_match, p1) => {
        return p1;
    });
}

function generateMarkdown(doc: string | TurndownService.Node): string {
    const turndownService = new TurndownService({
        headingStyle: "atx",
    });

    turndownService.remove(["script", "header"]);

    // Use GitHub-flavored Markdown since that seems to be pretty feature-filled
    // and generates files that render well on GitHub.
    turndownService.use(gfm);

    // Special handling for emphasized code blocks.
    //
    // ```html
    // <code><em>1234<em></code>
    // ```
    //
    // The default results in the underscores being rendered within the code
    // block. Since the entire code block should be emphasized a simple solution
    // is to just move the emphasis outside the block which appears to create the
    // correct result (on GitHub at least).
    turndownService.addRule("emphasizedCode", {
        filter: (node) =>
            node.nodeName == "CODE" &&
            node.childNodes.length == 1 &&
            node.firstChild?.nodeName == "EM" &&
            node.firstChild.childNodes.length == 1 &&
            node.firstChild.firstChild?.nodeType == 3,
        replacement: (_content, node, options) =>
            `${options.emDelimiter}\`${node.textContent}\`${options.emDelimiter}`,
    });

    turndownService.addRule("shrug", {
        filter: (node) =>
            node.classList.contains("sponsor"),
        replacement: () => ''
    });

    turndownService.addRule("fullLink", {
        filter: (node) => node.nodeName === "A",
        replacement: (_content, node) => {
            // @ts-ignore
            node.href = "https://adventofcode.com" + node.href;
            // @ts-ignore
            return node.outerHTML;
        }
    })

    // Special handling for emphasized text within code blocks.
    //
    // ```html
    // <code>1 + 1 = <em>2</em></code>
    // ```
    //
    // The default rendering results in the underscores being rendered, as there
    // isn't a proper way to render emphasis within code blocks without resorting
    // to HTML again. In this case the best solution is to drop the emphasis
    // completely, rendering the content without any markup.
    //
    // Since the rules are applied in order this should only consider instances
    // where the previous code did not make a modification.
    turndownService.addRule("emphasisWithinCode", {
        filter: (node) =>
            node.nodeName == "EM" && node.parentNode?.nodeName == "CODE",
        replacement: (content) => content,
    });

    // Keep the spans which are used for alternate text in the puzzle description.
    turndownService.keep(["span"]);

    // Generate the document and append a newline.
    return turndownService.turndown(doc).concat("\n");
}

async function getMarkdown(year: string, day: string) {
    const regex = /<article\b[^>]*>[\s\S]*?<\/article\b[^>]*>/gim;

    const doc = await getHtml(year, day);

    if (!doc) {
        throw new Error("Nothing found");
    }

    const newDoc = stripHyphens(doc.match(regex)?.join(""));

    if (newDoc) {
        const md = generateMarkdown(newDoc);
        return md;
    }
}

/**
 * 
 * @param {string} year 
 * @param {string} day 
 * @returns 
 */
async function getHtml(year: string, day: string) {
    const url = new URL(`https://adventofcode.com/${year}/day/${parseInt(day)}`);

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
async function saveMarkdown(year: string, day: string) {
    try {
        const inputPath = path.join(PROJECT_ROOT!, "examples", year, day);
        const filePath = path.join(inputPath, `README.md`);

        if (!existsSync(inputPath)) {
            await mkdir(inputPath);
        }

        if (existsSync(filePath)) {
            const existingFile = await readFile(filePath);
            if (existingFile.length > 0) {
                throw new Error("Already exists!");
            }
            console.log("File is there, but empty, refill");
        }

        const data = await getMarkdown(year, day);

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

saveMarkdown(year, day);