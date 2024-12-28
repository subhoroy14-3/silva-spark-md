const axios = require("axios");
const yts = require("yt-search");
const { youtube } = require("btch-downloader");
const { cmd } = require('../command');

cmd({
  pattern: 'audio3',
  alias: ['spotify', "ytmusic", "play"],
  react: '🎵',
  desc: "Fetch audio from Spotify or YouTube",
  category: "media",
  filename: __filename
}, async (client, message, details, context) => {
  const { 
    from, quoted, body, isCmd, command, args, q, 
    isGroup, sender, senderNumber, botNumber, 
    pushname, reply 
  } = context;

  if (!q) {
    return reply("Please provide a title or link (Spotify/YouTube)!");
  }

  reply("💎 Sɪʟᴠᴀ Sᴘᴀʀᴋ MD 💎 Fetching audio... 🎧");

  let spotifySent = false;
  let youtubeSent = false;

  try {
    // Fetching from Spotify
    const spotifyResponse = await axios.get(
      `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(q)}`
    );
    const spotifyTrack = spotifyResponse.data[0];

    if (spotifyTrack) {
      const trackStream = await axios({
        url: `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(spotifyTrack.url)}`,
        method: "GET",
        responseType: 'stream'
      });

      if (trackStream.headers["content-type"] === "audio/mpeg") {
        await client.sendMessage(from, {
          audio: trackStream.data,
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: spotifyTrack.title,
              body: `SILVA A UNIVERSAL DEVELOPER🥰💖: SPOTIFY`,
              mediaType: 1,
              sourceUrl: spotifyTrack.url,
              renderLargerThumbnail: true
            }
          }
        });
        spotifySent = true;
      }
    }
  } catch (error) {
    console.error("Spotify Error:", error.message);
  }

  try {
    // Fetching from YouTube
    const youtubeSearchResults = await yts(q);
    const youtubeVideo = youtubeSearchResults.videos[0];

    if (youtubeVideo && youtubeVideo.seconds < 3600) { // Video duration < 1 hour
      const youtubeAudio = await youtube(youtubeVideo.url);

      if (youtubeAudio && youtubeAudio.mp3) {
        await client.sendMessage(from, {
          audio: { url: youtubeAudio.mp3 },
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: youtubeVideo.title,
              body: "SILVA A UNIVERSAL DEVELOPER 🥰: YOUTUBE",
              mediaType: 1,
              sourceUrl: youtubeVideo.url,
              renderLargerThumbnail: true
            }
          }
        });
        youtubeSent = true;
      } else {
        reply("Failed to fetch audio from YouTube.");
      }
    } else {
      reply("No suitable YouTube results found.");
    }
  } catch (error) {
    console.error("YouTube Error:", error.message);
  }

  if (!spotifySent && !youtubeSent) {
    reply("Failed to fetch audio from both Spotify and YouTube.");
  } else if (spotifySent && youtubeSent) {
    reply("Silva Spark says: Both Spotify and YouTube audio sent successfully.\n\n\n world class bot created by silva tech\n\n silva md bot\n\nsilva spark md");
  } else if (spotifySent) {
    reply("Spotify audio sent successfully.");
  } else if (youtubeSent) {
    reply("YouTube audio sent successfully.");
  }
});
