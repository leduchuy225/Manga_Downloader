import Fs from "fs";
import axios from "axios";
import parse from "node-html-parser";
import { RequestInit } from "node-fetch";
import { createFolder, fetchImage, getPath } from "./share";

(async () => {
  createFolder(["resources", "tight_encounters"]);
  await downloadFromJson(["tight_encounters"], "tight_encounters.json");

  // await getListImageInChapter(
  //   "https://hentai2read.com/trembling_lips/1/",
  //   "trembling_lips"
  // );
})();

async function downloadFromJson(path: string[], name: string) {
  const defaultFolderName = "0";
  const BaseURL = "https://static.hentai.direct/hentai";
  Fs.readFile(
    getPath(name, ["resources", ...path]),
    "utf8",
    async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const images = JSON.parse(data)["images"];
      console.log(images);
      createFolder(["resources", ...path, defaultFolderName]);
      for (const image of images) {
        const fileName = image.split("/")[image.split("/").length - 1];
        console.log(BaseURL + image);
        await fetchImage({
          filename: fileName,
          url: BaseURL + image,
          paths: ["resources", ...path, defaultFolderName],
          headers: { referrer: "https://hentai2read.com/" } as RequestInit,
        });
      }
    }
  );
}

async function getListImageInChapter(url: string, name: string) {
  const response = await axios.get(url);
  const root = parse(response.data).toString();

  const data = getKeyValue(root, "var gData =");

  Fs.writeFileSync(getPath(name + ".json", ["resources", name]), data);
}

function getKeyValue(data: string, key: string) {
  const index = data.indexOf(key);
  const text = data.substring(index + key.length, data.indexOf(";", index));
  return text;
}
