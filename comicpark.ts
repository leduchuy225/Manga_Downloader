import Fs from "fs";
import axios from "axios";
import { downloadFromJson, getPath, isImage } from "./share";

const BASE_URL = "https://comicpark.org";

const BASE_URL_LIST: string[] = [
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8082278-chapter-1",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8082279-chapter-1-5",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8082280-chapter-2",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8082281-chapter-2-5",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8082282-chapter-3",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8082283-chapter-3-5",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8085810-chapter-4",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8083681-chapter-4-5",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8084233-side-stories",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8083682-chapter-5-part-1",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8083683-chapter-5-part-2",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8083691-chapter-5-5",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8086009-chapter-6-part-1",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8086011-chapter-6-part-2",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8086020-chapter-6-5",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8083651-chapter-7-part-1",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8083660-chapter-7-part-2",
  "/title/357717-en-tales-of-a-harem-in-another-world-uncensored/8085992-chapter-7-5",
];

(async () => {
  // for (let i = 0; i < BASE_URL_LIST.length; i++) {
  //   const url = BASE_URL + BASE_URL_LIST[i];
  //   await axios.get(url).then(async function (response) {
  //     const matches = response.data.match(
  //       /<script type="qwik\/json">(.*?)<\/script>/g
  //     );
  //     const images = [];
  //     if (matches) {
  //       const scriptContents = matches.map((match: string) =>
  //         match.replace(/<script type="qwik\/json">|<\/script>/g, "")
  //       );
  //       const data = JSON.parse(scriptContents.toString());
  //       for (const line of data.objs) {
  //         if (typeof line === "string" && isImage(line)) {
  //           images.push(line);
  //         }
  //       }
  //       console.log(`Found data in ${url}`);
  //       Fs.writeFileSync(
  //         getPath((i + 1).toString() + ".json", [
  //           "resources",
  //           "Tales of a Harem in Another World",
  //         ]),
  //         JSON.stringify({ images: images })
  //       );
  //     } else {
  //       console.log(`No data found in ${url}.`);
  //     }
  //   });
  // }

  for (let i = 2; i <= 18; i++) {
    await downloadFromJson({
      inputName: i.toString() + ".json",
      inputPath: ["TalesOfAHaremInAnotherWorld"],
      outputPath: ["TalesOfAHaremInAnotherWorld_image", i.toString()],
    });
  }
})();
