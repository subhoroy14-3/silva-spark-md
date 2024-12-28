const axios = require('axios');
const { cmd, commands } = require('../command');
const config = require('../config');

// Repo info
cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Info about the bot repository",
    category: "main",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch repository data from GitHub API
        const repoResponse = await axios.get('https://api.github.com/repos/SilvaTechB/silva-spark-md');
        const { stargazers_count, forks_count } = repoResponse.data;
        const userCount = forks_count * 3; // Calculate users based on forks

        // Construct the message
        const message = `
*Hello there Silva Spark User! 👋🏻*

💻 *Silva Spark MD Repository Info*:

⭐ *Stars*: ${stargazers_count}
🍴 *Forks*: ${forks_count}
👥 *Users*: ${userCount}

> Simple, Straightforward, but loaded with features 🎊. Meet Silva Spark WhatsApp Bot!

*Thanks for using Silva Spark 🚩*  

🔗 *Repository*: https://github.com/SilvaTechB/silva-spark-md

*Don't forget to fork the repo and star it!*
        `;

        // Send the repository info as a text message
        await conn.sendMessage(from, { text: message }, { quoted: mek });

        // Send a related image with context information
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/x3bdmi.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363200367779016@newsletter',
                    newsletterName: 'SILVA SPARK REPO💖💖🥰',
                    serverMessageId: 143,
                }
            }
        }, { quoted: mek });

        // Send an audio response
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/JawadYTX/KHAN-DATA/raw/refs/heads/main/autovoice/repo.m4a' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.error('Error:', e);
        reply(`❌ *Error fetching repository data:* ${e.message}`);
    }
});
