const fs = require('fs');
const path = require("path");
const { cmd, commands } = require('../command');

// Define the updatecmd command
cmd({
  'pattern': "updatecmd",
  'react': '🧞',
  'desc': "Update commands.",
  'category': "owner",
  'filename': __filename
}, async (_0x5596d4, _0x31cbbc, _0x4d448e, {
  from: _0x1ed3b9,
  quoted: _0x2505d6,
  body: _0x33c604,
  isCmd: _0x329e89,
  command: _0x1e7345,
  args: _0x230489,
  q: _0x102ad2,
  isGroup: _0x2fade7,
  sender: _0x1fd53b,
  senderNumber: _0x4ed1c3,
  botNumber2: _0x1f3dbd,
  botNumber: _0x452d05,
  pushname: _0x246127,
  isMe: _0x1939a2,
  isOwner: _0x2f9b7f,
  groupMetadata: _0x5986c1,
  groupName: _0x3bcbcd,
  participants: _0x28764c,
  groupAdmins: _0x50b0b8,
  isBotAdmins: _0x18528a,
  isAdmins: _0x2b5b9d,
  reply: _0x262952
}) => {
  try {
    // Check if the user is the bot owner
    if (!_0x2f9b7f) {
      return _0x262952("Only the bot owner can use this command.");
    }

    // Define the directory where plugins are located
    const pluginDir = path.join(__dirname, "../plugins");
    const pluginFiles = fs.readdirSync(pluginDir);

    // Load each plugin file
    for (const pluginFile of pluginFiles) {
      if (pluginFile.endsWith(".js")) {
        const pluginPath = path.join(pluginDir, pluginFile);
        require(pluginPath); // Load the plugin
        console.log("Loaded " + pluginFile);
      }
    }

    // Respond that the commands were updated successfully
    _0x262952("Commands updated successfully.");
  } catch (error) {
    // Log and display any errors
    console.log(error);
    _0x262952("Error updating commands: " + error.message);
  }
});
