const fs = require("fs");
const Humanoid = require("humanoid-js");
const HTMLParser = require("node-html-parser");

const humanoid = new Humanoid();

function writeFile(name, data) {
  fs.writeFileSync(name, JSON.stringify(data));
}

async function getChapterList() {
  const data = await humanoid
    .get("https://api.comick.app/comic/asTlnfBq/chapters?lang=en")
    .then((res) => {
      const data = JSON.parse(res.body);

      writeFile("liargame-list-chapter.json", data);

      const processedData = [];
      for (const item of data.chapters) {
        processedData.push({
          chap: item.chap,
          title: item.chap + "_" + item.title.replace(/ /g, "_").toLowerCase(),
          url: `https://comick.app/comic/liar-game/${item.hid}-chapter-${item.chap}-${item.lang}`,
        });
      }

      writeFile("liargame-list-chapter_processed.json", processedData);

      return processedData;
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
}

async function getImageJsonData(item) {
  const dataReturned = await humanoid
    .get(item.url)
    .then((response) => {
      const document = HTMLParser.parse(response.body);
      const data = document.querySelector("#__NEXT_DATA__");

      const myJson = {};
      const myData = [];

      const json = JSON.parse(data.text);

      const chapterData = json.props.pageProps.chapter;

      const images = chapterData.md_images;

      for (let image of images) {
        myData.push("https://meo.comick.pictures/" + image.b2key);
      }

      myJson.images = myData;
      myJson.chap = item.title;

      console.log(myJson);

      return myJson;
    })
    .catch((err) => {
      console.log(err);
    });

  return dataReturned;
}

(async () => {
  const data = await getChapterList();
  for (const item of data) {
    const imageJsonData = await getImageJsonData(item);
    writeFile("./liar_game/" + item.title + ".json", imageJsonData);
  }
})();
