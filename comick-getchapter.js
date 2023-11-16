const fs = require("fs");
const Humanoid = require("humanoid-js");

// Create a new humanoid instance
const humanoid = new Humanoid();

// Send Get request to the target website
humanoid
  .get("https://api.comick.app/comic/asTlnfBq/chapters?lang=en")
  .then((res) => {
    console.log(res.body);

    const data = JSON.parse(res.body);

    fs.writeFile("liargame-list-chapter.json", JSON.stringify(data), (err) => {
      if (err) {
        throw err;
      }
    });

    // https://comick.app/comic/liar-game/xNOJ-chapter-1-en
  })
  // Catch errors if any
  .catch((err) => {
    console.log(err);
  });
