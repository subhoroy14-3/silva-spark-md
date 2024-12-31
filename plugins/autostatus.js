export async function before(message, { isAdmin, isBotAdmin, conn }) {
  try {
    // Check if AUTO_STATUS_LIKE is enabled
    const autoStatusLike = process.env.AUTO_STATUS_LIKE === "true";
    if (!autoStatusLike) {
      console.log("AUTO_STATUS_LIKE is disabled. Skipping status like.");
      return false;
    }

    // Get the like emoji from the environment variable, default to '💚' if not set
    const likeEmoji = process.env.AUTO_STATUS_LIKE_EMOJI || "💚";

    if (!message || message.key.remoteJid !== 'status@broadcast') {
      return false;
    }

    // React to the status
    if (message.key.remoteJid === "status@broadcast") {
      const botId = await conn.decodeJid(conn.user.id);
      await conn.sendMessage(message.key.remoteJid, {
        react: {
          key: message.key,
          text: likeEmoji,
        },
      }, {
        statusJidList: [message.key.participant, botId],
      });
    }

    // Status saver functionality
    if (process.env.Status_Saver !== 'true') {
      console.log("Status Saver is disabled.");
      return false;
    }

    const { mtype, sender } = message;

    console.log("Received message object:", JSON.stringify(message, null, 2));
    if (!sender) {
      console.error("Sender is null or undefined");
      return false;
    }

    const senderName = conn.getName(sender) || "Unknown";
    let statusText = '';
    const baseMessage = Buffer.from("QVVUTyBTVEFUVVMgU0FWRVI=", "base64").toString("utf-8");

    if (mtype === 'imageMessage' || mtype === "videoMessage") {
      statusText = `${baseMessage}\n\n*Status:* ${senderName}\n*Caption:* ${message.caption || ''}`;
      await conn.copyNForward(conn.user.id, message, true);
      await conn.reply(conn.user.id, statusText, message, { mentions: [sender] });
    } else if (mtype === 'audioMessage') {
      statusText = `${baseMessage}\n\n*Status:* ${senderName}`;
      await conn.copyNForward(conn.user.id, message, true);
      await conn.reply(conn.user.id, statusText, message, { mimetype: message.mimetype });
    } else if (mtype === "extendedTextMessage") {
      statusText = `${baseMessage}\n\n${message.text || ''}`;
      await conn.reply(conn.user.id, statusText, message, { mentions: [sender] });
    } else {
      console.log("Unsupported message type or empty message.");
      return false;
    }
  } catch (error) {
    console.error("Failed to process message:", error.message || "Unknown error");
    if (message.quoted && message.quoted.text) {
      await conn.reply(conn.user.id, message.quoted.text, message);
    } else {
      await conn.reply(conn.user.id, "Failed to process message: " + (error.message || "Unknown error"), message);
    }
  }

  return true;
}
