import axios from "axios";
import parse from "node-html-parser";
import { downloadFromJson, isImage, readMyFile, writeMyFile } from "./share";

const getChapterName = (name: string) => {
  return name.split("/")[name.split("/").length - 2];
};

(async () => {
  const index = 7;
  const chunkSize = 10;

  const data = readMyFile({ name: "data.json", paths: [] });

  let chapterList = JSON.parse(data);
  chapterList = chapterList.slice(
    chunkSize * (index - 1),
    chunkSize * (index - 1) + chunkSize
  );

  for (let i = 0; i < chapterList.length; i++) {
    await downloadChapter(chapterList[i]);
  }
})();

async function downloadChapter(baseURL: string) {
  setTimeout(async function () {
    console.log("URL", baseURL);
    const response = await axios.get(baseURL);

    const root = parse(response.data);

    const images = root.querySelectorAll("img");
    const imageSrcs = Array.from(images)
      .map((img) => img.getAttribute("src"))
      .filter((img) => img && isImage(img));

    console.log(imageSrcs); // Array of all src attributes

    const name = getChapterName(baseURL);
    console.log("Name", name);

    writeMyFile({
      name: name + ".json",
      data: { images: imageSrcs },
      paths: ["resources", "Hyouka_json"],
    });

    downloadFromJson({
      inputName: name + ".json",
      inputPath: ["Hyouka_json"],
      outputPath: ["Hyouka", name],
    });
  }, 5000);
}
