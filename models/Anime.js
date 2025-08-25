import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  episodes: [
    {
      episode: Number,
      url: String
    }
  ],
  episodesCount: { type: Number, default: 0 },
  status: { type: String, default: "Ongoing" }, // Ongoing / Completed
  thumbnail: { type: String },
  streamUrl: { type: String },
  downloadUrl: { type: String },
  popularity: { type: Number, default: 0 }, // used for trending
  trending: { type: Boolean, default: false }
}, { timestamps: true });

const Anime = mongoose.model("Anime", animeSchema);
export default Anime;
