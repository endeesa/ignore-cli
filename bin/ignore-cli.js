#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const https = require('https');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');


const _prepareDownloadDir = (downloadDir) => {
    try {
        if (!fs.existsSync(downloadDir)) {
            console.log(downloadDir, "does not exist, creating")
            fs.mkdirSync(downloadDir, { recursive: true });
            return downloadDir;
        } else return downloadDir;
    } catch (error) {
        console.trace(error);
        return error;
    }
}


const downloadFile = (url, dest, downloadOkCb, downloadErrCb) => {
    console.debug("Fetching file from", url, "to", dest)

    const outFile = fs.createWriteStream(dest);

    https.get(url, function (response) {
        response.pipe(outFile);

        outFile.on('finish', function () {
            outFile.close(downloadOkCb);
        });

        outFile.on('error', function (err) {
            if (fs.existsSync(dest)) {
                fs.unlink(dest);
            }
            downloadErrCb(err);
        });

    });

}


const supportedLanguages = ["C++", "Node", "Python", "Android"];


const userOpts = yargs
    .usage("Quickly add .ignore files to your project.\n Usage: ignore [options] <language>")
    .option("language",
        { alias: "lang", describe: "Language e.g. Python", choices: supportedLanguages, type: "string", nargs: 1, requiresArg: true, demandOption: true })
    .option("out", {
        alias: "o", default: process.cwd(),
        describe: "Where the .ignore files should be downloaded to", type: "string", demandOption: false
    })
    .option("local", { alias: "l", describe: "Add from your own local .ignore repository", type: "string", demandOption: false })
    .example('ignore --service git Python', '# Add a .gitignore file for Python')
    .epilog('Peculia Group @Copyright 2022')
    .argv;

const downloadCallback = () => {
    // if (err) {
    //     console.error("Download failed", err);
    //     process.exit(1);
    // }
    // console.info("File download ok");
}

const getUserConfirmation = (question) => {

    return new Promise((res, rej) => {
        const rl = readline.createInterface({ input, output });
        rl.question(question, (answer) => {
            console.info(`You answered: ${answer}`);
            rl.close();
            res(answer);
        });
    });
}


const getIgnoreFile = async () => {
    if (userOpts.local) {
        console.warn("This feature is not in production yet, apologies for the delay.");
        process.exit(0);
    }

    const downloadDir = _prepareDownloadDir(path.join(path.resolve(userOpts.out)));
    if (!fs.existsSync(downloadDir)) {
        console.error(`Unable to download to ${userOpts.out}.\n${downloadDir}`)
        process.exit(1);
    }

    const destinationFile = path.join(downloadDir, ".gitignore");
    if (fs.existsSync(destinationFile)) {
        console.warn(`Destination file(${destinationFile}) already exists, ask user confirmation`);
        const y = await getUserConfirmation(`Overwrite existing file at ${destinationFile} ? [y/n] `);
        if (y == null || y == undefined || y.toLowerCase() !== "y") {
            console.info("Operation cancelled by user");
            process.exit(0);
        }
    }

    const srcUrl = `https://raw.githubusercontent.com/github/gitignore/main/${userOpts.language}.gitignore`;
    downloadFile(srcUrl, destinationFile, downloadCallback, downloadCallback);
    console.info("Done");
}



getIgnoreFile();
// console.log(path.resolve(userOpts.out));


