const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anmelden')
    .setDescription('Meldet euch für einen Kurs an, um zukünftig Benachrichtigungen zu erhalten!')
    .addRoleOption(option => option.setName('Kurs').setDescription('Wählt einen Kurs aus').setRequired(true)),
  async execute(interaction) {
    const user = interaction.user;
    const role = interaction.options.getRole('role');

    if (user && role) {
      const member = interaction.guild.members.cache.get(user.id);

      try {
        await member.roles.add(role);
        await interaction.reply(`${user.tag} wurde erfolgreich eingeschrieben für  ${role.name}`);
      } catch (error) {
        console.error('Error:', error);
        await interaction.reply('Fehler beim Einschreiben');
      }
    } else {
      await interaction.reply('Kurs nicht gefunden');
    }
  },
};
