import Fs from "fs";
import Path from "path";
import axios from "axios";

async function downloadImage(url: string, filename: string, paths: string[]) {
  const filePath = getPath(filename, paths);
  const writer = Fs.createWriteStream(filePath);

  console.log("Download", filePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

function getPath(filename: string, paths: string[]) {
  return Path.resolve(__dirname, "resources", ...paths, filename);
}

async function downloadChapter(data: any, paths: string[]) {
  const chapterName: string = data.chap.replace(" ", "_");

  try {
    if (
      !Fs.existsSync(
        Path.resolve(__dirname, "resources", ...paths, chapterName)
      )
    ) {
      Fs.mkdirSync(
        Path.resolve(__dirname, "resources", ...paths, chapterName),
        { recursive: true }
      );
    }

    for (let i = 0; i < data.images.length; i++) {
      await downloadImage(
        data.images[i],
        chapterName + "_" + (i + 1).toString() + ".jpg",
        [...paths, chapterName]
      );
    }
  } catch (err) {
    console.error(err);
    return;
  }
}

async function readDataFromFolder() {
  let i = 3;

  const paths = ["Kindaichi_Series", "Kindaichi_Series_" + i.toString()];

  const fileNames = Fs.readdirSync(Path.resolve(__dirname, ...paths));

  try {
    if (!Fs.existsSync(Path.resolve(__dirname, ...paths))) {
      Fs.mkdirSync(Path.resolve(__dirname, ...paths));
    }
  } catch (err) {
    console.error(err);
  }

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
    await readDataFromFolder();
  } catch (e) {
    console.log(e);
  }
})();
