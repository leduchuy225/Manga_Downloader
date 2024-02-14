import axios from "axios";
import parse from "node-html-parser";
import { createFolder, downloadImage } from "./helpers/share";

const BaseURL = "https://ww7.mangakakalot.tv";
(async () => {
  try {
    // const chapterList = await getListChapter(BaseURL + "/manga/manga-nk991219");
    const chapterList = [
      "/chapter/manga-nk991219/chapter-8",
      "/chapter/manga-nk991219/chapter-9",
      "/chapter/manga-nk991219/chapter-10",
      "/chapter/manga-nk991219/chapter-11",
      "/chapter/manga-nk991219/chapter-12",
      "/chapter/manga-nk991219/chapter-13",
      "/chapter/manga-nk991219/chapter-14",
      "/chapter/manga-nk991219/chapter-15",
      "/chapter/manga-nk991219/chapter-16",
      "/chapter/manga-nk991219/chapter-17",
      "/chapter/manga-nk991219/chapter-18",
      "/chapter/manga-nk991219/chapter-19",
    ];
    for (const chapter of chapterList) {
      const chapterName = chapter.split("/")[chapter.split("/").length - 1];
      createFolder(["My_Manga", "Imaizumi", chapterName]);
      const imageList = await getImageInChapter(BaseURL + chapter);
      for (let i = 0; i < imageList.length; i += 1) {
        await downloadImage(imageList[i], (i + 1).toString() + ".jpg", [
          "My_Manga",
          "Imaizumi",
          chapterName,
        ]);
      }
    }
  } catch (e) {
    console.log(e);
  }
})();

// async function getListChapter(path: string) {
//   return axios.get(path).then(async function (response) {
//     const root = parse(response.data);
//     const episodeArea = root.querySelector(".chapter-list");
//     const episodeList = episodeArea?.querySelectorAll("a") ?? [];

//     return episodeList.map((e) => e.attrs["href"]).reverse();
//   });
// }

async function getImageInChapter(path: string) {
  console.log(path);

  return axios.get(path).then(async function (response) {
    const root = parse(response.data);
    const imgList = root.querySelector("#vungdoc");
    const imgSourceList = imgList?.querySelectorAll("img") ?? [];

    return imgSourceList.map((e) => e.attrs["data-src"]);
  });
}
