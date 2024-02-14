import Fs from "fs";
import Path from "path";
import { createFolder, downloadImage } from "./helpers/share";

async function downloadChapter(data: any, paths: string[]) {
  const chapterName: string = data.chap.replace(" ", "_");
  const path = ["resources", ...paths, chapterName];

  try {
    createFolder(path);
    for (let i = 0; i < data.images.length; i++) {
      await downloadImage(
        data.images[i],
        chapterName + "_" + (i + 1).toString() + ".png",
        path
      );
    }
  } catch (err) {
    console.error(err);
    return;
  }
}

async function readDataFromFolder(index: number) {
  const paths = ["liar_game", "liar_game_" + index.toString()];

  const fileNames = Fs.readdirSync(Path.resolve(__dirname, ...paths));
  for (const file of fileNames) {
    Fs.readFile(
      Path.resolve(__dirname, ...paths, file),
      "utf-8",
      async (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        await downloadChapter(JSON.parse(data), paths);
      }
    );
  }
}

(async () => {
  try {
    // for (let i = 2; i <= 7; i++) {
    //   await readDataFromFolder(i);
    // }

    await readDataFromFolder(7);
  } catch (e) {
    console.log(e);
  }
})();
