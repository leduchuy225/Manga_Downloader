import Fs from "fs";
import Path from "path";
import axios from "axios";
import CryptoJS from "crypto-js";
import { parse } from "node-html-parser";

const URL = "https://bato.to";

const MyMangaPath = URL + "/series/108679";

axios.get(MyMangaPath).then(async function (response) {
  const root = parse(response.data);
  const episodeArea = root.querySelector(".mt-4.episode-list");
  const episodeList =
    episodeArea?.querySelectorAll(".p-2.d-flex.flex-column.flex-md-row.item") ??
    [];

  console.log(episodeList);

  for (let i = 0; i < episodeList.length; i++) {
    const name = episodeList[i].querySelector("a");
    const path = name?.getAttribute("href");
    const chapterName = name?.text
      .replace(/[\r\n]/gm, "")
      .replace(/\s/g, "")
      .trim();

    try {
      if (
        path &&
        chapterName &&
        !Fs.existsSync(Path.resolve(__dirname, "resources", chapterName))
      ) {
        Fs.mkdirSync(Path.resolve(__dirname, "resources", chapterName));
        await downloadChapter(path, chapterName);
      }
    } catch (err) {
      console.error(err);
    }
  }
});

async function downloadChapter(path: string, chapterName: string) {
  const response = await axios.get(URL + path);
  const root = parse(response.data).toString();

  const batoPass = getBatoPass(getKeyValue(root, "const batoPass = "));
  const batoWord = getKeyValue(root, "const batoWord = ").replace('"', "");

  const decode = getBatoDecode(batoWord, batoPass);

  const batoImages = eval(getKeyValue(root, "const imgHttpLis ="));

  const images = [];

  for (let i = 0; i < batoImages.length; i++) {
    const fullPath = batoImages[i] + "?" + decode[i];
    await downloadImage(fullPath, (i + 1).toString(), chapterName);

    console.log(fullPath);

    images.push({
      order: i + 1,
      path: fullPath,
    });
  }

  Fs.writeFile(
    Path.resolve(__dirname, "resources", chapterName, "data.json"),
    JSON.stringify(images),
    "utf8",
    () => {
      console.log("Download successfully");
    }
  );
}

function getKeyValue(data: string, key: string) {
  const index = data.indexOf(key);
  const text = data.substring(index + key.length, data.indexOf(";", index));
  return text;
}

function getBatoPass(data: string) {
  return eval(data);
}

function getBatoDecode(batoWord: string, batoPass: string) {
  return JSON.parse(
    CryptoJS.AES.decrypt(batoWord, batoPass).toString(CryptoJS.enc.Utf8)
  );
}

async function downloadImage(
  url: string,
  filename: string,
  chapterName: string
) {
  const filePath = getPath(filename, chapterName);
  const writer = Fs.createWriteStream(filePath);

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

function getPath(filename: string, chapterName: string) {
  return Path.resolve(__dirname, "resources", chapterName, filename + ".webp");
}
