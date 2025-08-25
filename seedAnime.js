import mongoose from "mongoose";
import dotenv from "dotenv";
import Anime from "./models/Anime.js"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const animeData = [
  {
    title: "Naruto",
    description: "A young ninja seeks recognition and dreams of becoming the Hokage.",
    episodes: Array.from({ length: 220 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/naruto-ep${i + 1}`
    })),
    status: "completed",
    trending: true
  },
  {
    title: "Naruto Shippuden",
    description: "Naruto returns after training to confront new threats and enemies.",
    episodes: Array.from({ length: 500 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/narutoshippuden-ep${i + 1}`
    })),
    status: "completed",
    trending: true
  },
  {
    title: "One Piece",
    description: "Monkey D. Luffy sails the seas to find the legendary treasure One Piece.",
    episodes: Array.from({ length: 1050 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/onepiece-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true
  },
  {
    title: "Attack on Titan",
    description: "Humans fight giant humanoid creatures known as Titans to survive.",
    episodes: Array.from({ length: 87 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/aot-ep${i + 1}`
    })),
    status: "completed",
    trending: true
  },
  {
    title: "Demon Slayer",
    description: "Tanjiro becomes a demon slayer to save his sister and avenge his family.",
    episodes: Array.from({ length: 26 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/demonslayer-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true
  },
  {
    title: "My Hero Academia",
    description: "A world where people have superpowers, and heroes rise to protect society.",
    episodes: Array.from({ length: 113 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/mha-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true
  },
  {
    title: "Tokyo Revengers",
    description: "Takemichi travels back in time to save his ex-girlfriend from a gang.",
    episodes: Array.from({ length: 24 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/tokyorevengers-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true
  },
  {
    title: "Bleach",
    description: "Ichigo Kurosaki gains the powers of a Soul Reaper to protect humans from evil spirits.",
    episodes: Array.from({ length: 366 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/bleach-ep${i + 1}`
    })),
    status: "completed",
    trending: false
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers use alchemy to try and restore their bodies after a failed ritual.",
    episodes: Array.from({ length: 64 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/fma-brotherhood-ep${i + 1}`
    })),
    status: "completed",
    trending: true
  },
  {
    title: "Jujutsu Kaisen",
    description: "Yuji Itadori joins a school of sorcerers to battle curses and protect humanity.",
    episodes: Array.from({ length: 24 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/jujutsukaisen-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true
  },
  // Add 40+ more anime similarly...
];

// Example: generate dummy placeholders for additional anime
for (let i = 1; i <= 40; i++) {
  animeData.push({
    title: `Anime ${i}`,
    description: `Description for Anime ${i}.`,
    episodes: Array.from({ length: 12 }, (_, j) => ({
      episode: j + 1,
      url: `https://streaming-url.com/anime${i}-ep${j + 1}`
    })),
    status: "ongoing",
    trending: i % 2 === 0
  });
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    await Anime.deleteMany({}); // Clear old data
    console.log("Old anime data cleared");

    await Anime.insertMany(animeData);
    console.log("Anime data inserted successfully!");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.disconnect();
  }
};

seedDatabase();
