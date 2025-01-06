const { cmd, commands } = require("../command");
const { fetchJson } = require('../lib/functions');

// Define the 'ai' command with a pattern and aliases for triggering it
cmd({
  'pattern': 'ai', // Trigger pattern for the command
  'alias': ["gpt", "bot"], // Aliases for the command
  'react': '🧠', // Emoji reaction for the command
  'desc': "Chat with the AI bot.", // Command description
  'category': "main", // Command category
  'filename': __filename // Path of the current file
}, async (conn, receivedMessage, messageInfo, {
  from: sender, // The sender of the message
  quoted: quotedMessage, // The quoted message (if any)
  body: messageBody, // The body of the message sent by the user
  isCmd: isCommand, // Whether the message is a command
  command: commandName, // The command name used
  args: commandArgs, // Command arguments
  q: query, // User's query (after the command)
  isGroup: isGroup, // Whether the message is in a group
  sender: senderId, // Sender's ID
  senderNumber: senderPhoneNumber, // Sender's phone number
  botNumber2: botPhoneNumber2, // Second bot phone number (if applicable)
  botNumber: botPhoneNumber, // Bot phone number
  pushname: senderName, // The sender's name
  isMe: isSelf, // Whether the sender is the bot itself
  isOwner: isOwner, // Whether the sender is the bot owner
  groupMetadata: groupMetadata, // Group metadata (if the message is from a group)
  groupName: groupName, // Group name (if the message is from a group)
  participants: groupParticipants, // Participants of the group (if the message is from a group)
  groupAdmins: groupAdmins, // Admins of the group (if the message is from a group)
  isBotAdmins: isBotAdmin, // Whether the bot is an admin in the group
  isAdmins: isAdmin, // Whether the sender is an admin in the group
  reply: replyFunction // Function to send a reply
}) => {
  try {
    // Make an API request to get the AI response based on the user's query
    let aiResponse = await fetchJson("https://api.davidcyriltech.my.id/ai/chatbot?query=" + query);
    
    // Check if the response contains valid data
    if (!aiResponse || !aiResponse.data) {
      console.error("Invalid AI response structure:", aiResponse); // Log if the response is invalid
      return replyFunction('AI response is empty or invalid.'); // Send error message to user
    }

    // Extract the message from the AI response
    const message = aiResponse.data;

    // Send the AI response back to the user with a context info, including the forwarded message info
    await conn.sendMessage(
      sender, // Send to the user who initiated the command
      {
        text: message, // The AI-generated message to send back
        contextInfo: {
          mentionedJid: [senderId], // Mention the sender in the message
          forwardingScore: 999, // Set forwarding score for the message
          isForwarded: true, // Mark the message as forwarded
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363200367779016@newsletter', // Newsletter ID for forwarding context
            newsletterName: 'SILVA SPARK', // Name of the newsletter
            serverMessageId: 143 // Server message ID for the forwarded message
          }
        }
      },
      { quoted: quotedMessage } // If the message is quoted, include the quoted message
    );
  } catch (error) {
    // Log and send error message if the API call fails
    console.error("Error during SILVA AI API call:", error);
    replyFunction('SILVA We got an Error: ' + (error.message || error)); // Inform the user about the error
  }
});
