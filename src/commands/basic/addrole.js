const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role to a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Select the role to add').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    if (user && role) {
      const member = interaction.guild.members.cache.get(user.id);

      try {
        await member.roles.add(role);
        await interaction.reply(`Successfully added the role ${role.name} to ${user.tag}`);
      } catch (error) {
        console.error('Error adding role:', error);
        await interaction.reply('There was an error adding the role.');
      }
    } else {
      await interaction.reply('User or role not found.');
    }
  },
};
