const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("abmelden")
    .setDescription(
      "Meldet euch aus einem Kurs ab, um zukünftig keine Benachrichtigungen mehr zu erhalten!"
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
        await interaction.reply("Du kannst dich aus diesem Kurs nicht ausschreiben");
        return;
      }

      try {
        // Überprüfen, ob die Rolle bereits zugewiesen ist
        if (member.roles.cache.some((role) => role.name === selectedRole.name)) {
          await interaction.reply(`${user.tag} ist bereits für ${selectedRole.name} eingeschrieben.`);
        } else {
          
          await member.role.remove(selectedRole);
          await interaction.reply(`${user.tag} wurde erfolgreich entfernt aus ${selectedRole.name}`);
        }
      } catch (error) {
        console.error("Error:", error);
        await interaction.reply("Fehler beim Ausschreiben");
      }
    } else {
      await interaction.reply("Kurs nicht gefunden");
    }
  },
};
