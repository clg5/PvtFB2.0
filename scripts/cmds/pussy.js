const axios = require("axios");
module.exports = {
  config: {
    name: "pussy",
    aliases: ["pussyphoto", "pussypic"],
    version: "1.0",
    author: "Abid",
    countDown: 3,
    role: 2,
    shortDescription: "Send a pussy picture",
    longDescription: "Sends a random pussy picture. Warning it's only 18+ command",
    category: "fun"
  },
  onStart: async function ({ message }) {
    const images = [
      "https://i.supaimg.com/1c01fe8b-00d2-48b7-a31b-f1275d5d9295.jpg",
      "https://i.supaimg.com/4f9e19a5-9699-4663-8b36-44fc2e78c467.jpg",
      "https://i.supaimg.com/8970d4c7-4ad0-416a-96cc-061b528492d8.jpg",
      "https://i.supaimg.com/585ffd6b-62f1-41c7-80d2-581d01e0e5b3.jpg",
      "https://i.supaimg.com/7968e5a0-dbf3-4855-8a12-d17168f3d398.jpg",
      "https://i.supaimg.com/deac41ff-bc75-4e2b-9ab8-27ef6575c736.jpg",
      "https://i.supaimg.com/deac41ff-bc75-4e2b-9ab8-27ef6575c736.jpg",
      "https://i.supaimg.com/ca60303b-11a1-4d4b-85c2-d2b1ba4879cf.jpg",
      "https://i.supaimg.com/03cd182f-609d-49ff-a5ac-f729a7d0ea3b.jpg",
      "https://i.supaimg.com/22938db8-e0e5-4095-865e-10517e662424.jpg",
      "https://i.supaimg.com/49b39f7c-ff90-468a-8ce3-36a8f5b2d831.jpg",
      "https://i.supaimg.com/f260c352-6bc6-4fae-919a-1409f8e1f5c9.jpg",
      "https://i.supaimg.com/92f94aed-2349-4045-92a1-a7f95469edeb.jpg",
      "https://i.supaimg.com/49b39f7c-ff90-468a-8ce3-36a8f5b2d831.jpg",
      "https://i.supaimg.com/e85e6b62-2346-45ee-a89b-419b8cb46c7b.jpg",
      "https://i.supaimg.com/b5f4ed68-ee84-4e4f-b2fb-0e9598c7aa28.jpg",
      "https://i.supaimg.com/18e613ff-20fd-45b3-9bf0-a9522fdfd5c5.jpg" 
    ];
    const link = images[Math.floor(Math.random() * images.length)];
    try {
      const img = await axios.get(link, { responseType: "arraybuffer" });
      message.reply({
        body: "📸 Here a pussy picture for you!",
        attachment: Buffer.from(img.data)
      });
    } catch (e) {
      message.reply("❌ Failed to load image, try again!");
    }
  }
};
