import Fs from "fs";
import Path from "path";
import axios from "axios";
import { RequestInit } from "node-fetch";
import { url } from "inspector";
// import fetch from "node-fetch";

require("esm-hook");
const fetch = require("node-fetch").default;

export async function downloadImage({
  url,
  paths,
  filename,
}: {
  url: string;
  paths: string[];
  filename: string;
}) {
  const filePath = getPath(filename, paths);
  const writer = Fs.createWriteStream(filePath);

  console.log("Download", filePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => setTimeout(resolve, 1000));
    writer.on("error", reject);
  });
}

// url: string
// paths: string[]
// filename: string
// headers: RequestInit
export async function fetchImage({
  url,
  paths,
  headers,
  filename,
}: {
  url: string;
  paths: string[];
  filename: string;
  headers?: RequestInit;
}) {
  const filePath = getPath(filename, paths);
  const writer = Fs.createWriteStream(filePath);

  console.log("Fetch", filePath);
  const res = await fetch(url, headers);

  return new Promise((resolve, reject) => {
    res.body?.pipe(writer);
    writer.on("error", reject);
    writer.on("finish", () => setTimeout(resolve, 1000));
  });
}

export function getPath(filename: string, paths: string[]) {
  return Path.resolve(__dirname, ...paths, filename);
}

export function createFolder(paths: string[]) {
  try {
    if (!Fs.existsSync(Path.resolve(__dirname, ...paths))) {
      Fs.mkdirSync(Path.resolve(__dirname, ...paths), {
        recursive: true,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export function writeMyFile({
  paths,
  data,
  name,
}: {
  name: string;
  data: object;
  paths: string[];
}) {
  createFolder(paths);
  Fs.writeFileSync(getPath(name, paths), JSON.stringify(data));
}

export function readMyFile({ name, paths }: { name: string; paths: string[] }) {
  return Fs.readFileSync(getPath(name, ["resources", ...paths]), {
    flag: "r",
    encoding: "utf8",
  });
}

export function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp)$/.test(url);
}

export async function downloadFromJson({
  inputName,
  inputPath,
  outputPath,
}: {
  inputName: string;
  inputPath: string[];
  outputPath: string[];
}) {
  Fs.readFile(
    getPath(inputName, ["resources", ...inputPath]),
    "utf8",
    async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const images = JSON.parse(data)["images"];
      console.log(images);

      createFolder(["resources", ...outputPath]);

      for (const image of images) {
        const fileName = image.split("/")[image.split("/").length - 1];
        console.log(image);

        // setTimeout(async () => {
        //   await downloadImage({
        //     url: image,
        //     filename: fileName,
        //     paths: ["resources", ...outputPath],
        //   });
        // }, 1000);

        await fetchImage({
          url: image,
          filename: fileName,
          paths: ["resources", ...outputPath],
          // headers: { referrer: "https://hentai2read.com/" } as RequestInit,
        });
      }
    }
  );
}
