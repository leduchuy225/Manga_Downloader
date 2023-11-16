import Fs from "fs";
import Path from "path";
import axios from "axios";

const baseUrl = "https://cdn.nhentai.com/nhentai/storage/images/232453/";

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

async function main() {
  const lastIndex = 238;
  const paths = ["SuccubiSupporter"];

  try {
    if (!Fs.existsSync(Path.resolve(__dirname, "resources", ...paths))) {
      Fs.mkdirSync(Path.resolve(__dirname, "resources", ...paths));
    }
  } catch (err) {
    console.error(err);
  }

  for (let i = 1; i <= lastIndex; i++) {
    await downloadImage(
      baseUrl + i.toString() + ".jpg",
      i.toString() + ".jpg",
      paths
    );
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.log(e);
  }
})();
