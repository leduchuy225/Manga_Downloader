(() => {
  const myJson = {};

  const myData = [];
  const data = document.querySelector("#__NEXT_DATA__");
  const json = JSON.parse(data.text);

  const chapterData = json.props.pageProps.chapter;

  const images = chapterData.md_images;
  const chapter = chapterData.chap + "_" + chapterData.title;

  console.log(chapter);

  for (let image of images) {
    myData.push("https://meo.comick.pictures/" + image.b2key);
  }

  myJson.chap = chapter;
  myJson.images = myData;

  const blob = new Blob([JSON.stringify(myJson)], { type: "text/plain" });
  let url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.download = chapter + ".json";
  downloadLink.href = url;

  downloadLink.click();

  const nextChaper = json.props.pageProps.next;

  if (nextChaper == null) {
    return;
  }

  const newLocation =
    "https://comick.app/comic/one-outs/" +
    nextChaper.hid +
    "-chapter-" +
    nextChaper.chap +
    "-" +
    nextChaper.lang;

  console.log(newLocation);

  this.document.location = newLocation;
})();
