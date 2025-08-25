// seedAnime.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Anime from "./models/Anime.js";

dotenv.config();

// Try multiple env var names for compatibility
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGOURL || "";

const animeData = [
  {
    title: "Naruto",
    description: "A young ninja seeks recognition and dreams of becoming the Hokage.",
    episodes: Array.from({ length: 220 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/naruto-ep${i + 1}`
    })),
    status: "completed",
    trending: true,
    popularity: 100
  },
  {
    title: "Naruto Shippuden",
    description: "Naruto returns after training to confront new threats and enemies.",
    episodes: Array.from({ length: 500 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/narutoshippuden-ep${i + 1}`
    })),
    status: "completed",
    trending: true,
    popularity: 98
  },
  {
    title: "One Piece",
    description: "Monkey D. Luffy sails the seas to find the legendary treasure One Piece.",
    episodes: Array.from({ length: 1050 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/onepiece-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true,
    popularity: 99
  },
  {
    title: "Attack on Titan",
    description: "Humans fight giant humanoid creatures known as Titans to survive.",
    episodes: Array.from({ length: 87 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/aot-ep${i + 1}`
    })),
    status: "completed",
    trending: true,
    popularity: 95
  },
  {
    title: "Demon Slayer",
    description: "Tanjiro becomes a demon slayer to save his sister and avenge his family.",
    episodes: Array.from({ length: 26 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/demonslayer-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true,
    popularity: 92
  },
  {
    title: "My Hero Academia",
    description: "A world where people have superpowers, and heroes rise to protect society.",
    episodes: Array.from({ length: 113 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/mha-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true,
    popularity: 90
  },
  {
    title: "Tokyo Revengers",
    description: "Takemichi travels back in time to save his ex-girlfriend from a gang.",
    episodes: Array.from({ length: 24 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/tokyorevengers-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true,
    popularity: 85
  },
  {
    title: "Bleach",
    description: "Ichigo Kurosaki gains the powers of a Soul Reaper to protect humans from evil spirits.",
    episodes: Array.from({ length: 366 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/bleach-ep${i + 1}`
    })),
    status: "completed",
    trending: false,
    popularity: 80
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers use alchemy to try and restore their bodies after a failed ritual.",
    episodes: Array.from({ length: 64 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/fma-brotherhood-ep${i + 1}`
    })),
    status: "completed",
    trending: true,
    popularity: 96
  },
  {
    title: "Jujutsu Kaisen",
    description: "Yuji Itadori joins a school of sorcerers to battle curses and protect humanity.",
    episodes: Array.from({ length: 24 }, (_, i) => ({
      episode: i + 1,
      url: `https://streaming-url.com/jujutsukaisen-ep${i + 1}`
    })),
    status: "ongoing",
    trending: true,
    popularity: 94
  },
  // placeholder additional anime
];

for (let i = 1; i <= 40; i++) {
  animeData.push({
    title: `Anime ${i}`,
    description: `Description for Anime ${i}.`,
    episodes: Array.from({ length: 12 }, (_, j) => ({
      episode: j + 1,
      url: `https://streaming-url.com/anime${i}-ep${j + 1}`
    })),
    status: "ongoing",
    trending: i % 2 === 0,
    popularity: 50 + (i % 10)
  });
}

const seedDatabase = async () => {
  try {
    if (!MONGO_URI || typeof MONGO_URI !== "string" || MONGO_URI.trim() === "") {
      console.error("❌ MONGO_URI / MONGODB_URI is not set or is empty.");
      console.error("Expected one of process.env.MONGODB_URI or process.env.MONGO_URI.");
      console.error("Set that environment variable and try again.");
      process.exit(1);
    }

    // Log host for verification without printing credentials
    try {
      const host = new URL(MONGO_URI.replace(/^mongodb\+srv:/, "https:"));
      console.log("Seeding DB — connecting to host:", host.hostname);
    } catch (e) {
      console.log("Seeding DB — connecting to Mongo (host not parsed for SRV).");
    }

    // Connect (no deprecated options)
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || undefined
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing documents (optional)
    await Anime.deleteMany({});
    console.log("🧹 Cleared old anime data");

    // Insert
    await Anime.insertMany(animeData);
    console.log(`✅ Inserted ${animeData.length} anime documents`);

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(1);
  }
};

seedDatabase();
