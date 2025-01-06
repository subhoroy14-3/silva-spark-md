const { cmd, commands } = require("../command");
const { fetchJson } = require('../lib/functions');

// Define the AI chatbot command
cmd({
  'pattern': 'ai', // The command trigger pattern
  'alias': ["gpt", "bot"], // Aliases for the command
  'react': '🥳', // Reaction emoji
  'desc': "Chat with the AI bot.", // Description of the command
  'category': "main", // Category of the command
  'filename': __filename // Path to the current file
}, async (conn, receivedMessage, messageInfo, {
  from: sender,
  quoted: quotedMessage,
  body: messageBody,
  isCmd: isCommand,
  command: commandName,
  args: commandArgs,
  q: query,
  isGroup: isGroup,
  sender: senderId,
  senderNumber: senderPhoneNumber,
  botNumber2: botPhoneNumber2,
  botNumber: botPhoneNumber,
  pushname: senderName,
  isMe: isSelf,
  isOwner: isOwner,
  groupMetadata: groupMetadata,
  groupName: groupName,
  participants: groupParticipants,
  groupAdmins: groupAdmins,
  isBotAdmins: isBotAdmin,
  isAdmins: isAdmin,
  reply: replyFunction
}) => {
  try {
    // Fetch response from the AI API based on the user's query
    let aiResponse = await fetchJson("https://api.davidcyriltech.my.id/ai/chatbot?query=" + query);
    
    // Prepare the AI response message
    const message = aiResponse.data;

    // Send the AI response text message with the mentioned context info
    await conn.sendMessage(
      sender,
      {
        text: message, // AI response text
        contextInfo: {
          mentionedJid: [senderId], // Mention the sender
          forwardingScore: 999, // Set forwarding score
          isForwarded: true, // Mark as forwarded
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363200367779016@newsletter', // Newsletter ID
            newsletterName: 'SILVA SPARK', // Newsletter Name
            serverMessageId: 143 // Server message ID
          }
        }
      },
      { quoted: quotedMessage } // Quote the original message if applicable
    );
  } catch (error) {
    // Log and send error if the API call fails
    console.log(error);
    replyFunction('Error: ' + error);
  }
});
