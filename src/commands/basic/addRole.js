const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anmelden")
    .setDescription(
      "Meldet euch für einen Kurs an, um zukünftig Benachrichtigungen zu erhalten!"
    )
    .addRoleOption((option) =>
      option
        .setName("kurs")
        .setDescription("Wählt einen Kurs aus")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.user;
    const selectedRole = interaction.options.getRole("kurs");

    if (user && selectedRole) {
      const member = interaction.guild.members.cache.get(user.id);

      // Ausschließen bestimmter Rollen basierend auf dem ausgewählten Kurs
      const excludedRoles = ["HAW Student", "botDev"];

      if (excludedRoles.includes(selectedRole.name)) {
        await interaction.reply("Du kannst dich in diesen Kurs nicht einschreiben");
        return;
      }

      try {
        // Überprüfen, ob die Rolle bereits zugewiesen ist
        if (member.roles.cache.some((role) => role.name === selectedRole.name)) {
          await interaction.reply(`${user.tag} ist bereits für ${selectedRole.name} eingeschrieben.`);
        } else {
          // Rolle hinzufügen, wenn nicht bereits vorhanden
          await member.roles.add(selectedRole);
          await interaction.reply(`${user.tag} wurde erfolgreich eingeschrieben für ${selectedRole.name}`);
        }
      } catch (error) {
        console.error("Error:", error);
        await interaction.reply("Fehler beim Einschreiben");
      }
    } else {
      await interaction.reply("Kurs nicht gefunden");
    }
  },
};
