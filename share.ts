import Fs from "fs";
import Path from "path";
import axios from "axios";

export async function downloadImage(
  url: string,
  filename: string,
  paths: string[]
) {
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
