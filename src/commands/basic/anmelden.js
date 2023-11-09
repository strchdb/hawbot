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
    const roleToAssign = interaction.options.getRole("kurs");

    if (user && roleToAssign) {
      const member = interaction.guild.members.cache.get(user.id);

      // Ausschließen bestimmter Rollen
      const excludedRoles = ["HAW Student", "botDev"];

      if (excludedRoles.some((excludedRole) => member.roles.cache.some((role) => role.name === excludedRole))) {
        await interaction.reply("Du kannst diese Rolle nicht erhalten.");
        return;
      }

      try {
        // Überprüfen, ob die Rolle bereits zugewiesen ist
        if (member.roles.cache.some((role) => role.name === roleToAssign.name)) {
          await interaction.reply(`${user.tag} ist bereits für ${roleToAssign.name} eingeschrieben.`);
        } else {
          // Rolle hinzufügen, wenn nicht bereits vorhanden
          await member.roles.add(roleToAssign);
          await interaction.reply(`${user.tag} wurde erfolgreich eingeschrieben für ${roleToAssign.name}`);
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
