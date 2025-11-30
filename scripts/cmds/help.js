const { getPrefix } = global.utils || {};
const { commands, aliases } = global.GoatBot || {};

const PAGE_SIZE = 100;
const AUTO_UNSEND = 50 * 1000;

module.exports = {
  config: {
    name: "help",
    version: "3.1",
    author: "Abid Hasan",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Premium Cyber Help Menu" },
    longDescription: { en: "Displays all commands in a premium cyber styled interface." },
    category: "info",
    guide: { en: "{pn}help [page|command]" }
  },

  onStart: async function ({ message, args, event, api }) {
    const prefix = getPrefix(event.threadID) || "!";
    const allCommands = Array.from(commands.values());

    // =========== SINGLE COMMAND INFO =========== //
    if (args[0] && isNaN(args[0])) {
      const name = args[0].toLowerCase();
      const cmd = commands.get(name) || commands.get(aliases.get(name));

      if (!cmd) return message.reply(`❌ Command "${name}" not found.`);

      const cfg = cmd.config;

      const role =
        cfg.role === 0 ? "🌍 Everyone" :
        cfg.role === 1 ? "🛡 Group Admin" :
        cfg.role === 2 ? "🤖 Bot Admin" :
        cfg.role === 3 ? "🧠 Developer" :
        "❓ Unknown";

      const premium = cfg.premium ? "💎 Premium" : "🆓 Free";
      const cost = cfg.cost ? `💰 ${cfg.cost} taka/use` : "💰 Free";

      const infoCard = `
╔════ 🔥【 𝘾𝙈𝘿 𝙄𝙉𝙁𝙊 】🔥 ═══╗
║ ⚡ Name: ${cfg.name}
║ 🌀 Aliases: ${cfg.aliases?.join(", ") || "None"}
║ 👤 Author: ${cfg.author || "Unknown"}
║ 🔐 Access: ${role}
║ 💎 Status: ${premium}
║ 💰 Cost: ${cost}
║ 📜 Description:
║   ${cfg.longDescription?.en || cfg.shortDescription?.en}
║ 📌 Usage:
║   ${cfg.guide?.en || prefix + cfg.name}
╚════════════════════════════╝`;

      const sent = await message.reply(infoCard);
      setTimeout(() => api.unsendMessage(sent.messageID), AUTO_UNSEND);
      return;
    }

    // =========== PAGINATION =========== //
    let page = !isNaN(args[0]) ? parseInt(args[0]) : 1;
    const totalPages = Math.ceil(allCommands.length / PAGE_SIZE);

    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const start = (page - 1) * PAGE_SIZE;
    const cmdPage = allCommands.slice(start, start + PAGE_SIZE);

    // Group commands
    const grouped = {};
    cmdPage.forEach(cmd => {
      const cat = cmd.config.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(cmd);
    });

    // Category icons
    const icons = {
      info: "📘",
      fun: "🎉",
      admin: "🛡",
      owner: "👑",
      other: "⚡",
      system: "💻"
    };

    // =========== BUILD PREMIUM MENU =========== //
    let msg = `
╔═════ 💠 𝘼𝘽𝙄𝘿 𝙃𝘼𝙎𝘼𝙉'𝙎 𝘾𝙔𝘽𝙀𝙍 𝙈𝙀𝙉𝙐 💠 ═════╗
║ 📄 Page: ${page}/${totalPages}
║ 🟢 Total Commands: ${allCommands.length}
╚════════════════════════════════╝
`;

    for (const cat of Object.keys(grouped)) {
      const icon = icons[cat.toLowerCase()] || "📁";

      const list = grouped[cat].map(c => {
        const premium = c.config.premium ? "💎" : "";
        const cost = c.config.cost ? `💰${c.config.cost}` : "🆓";

        return `${c.config.name}${premium}(${cost})`;
      });

      msg += `
【 ${icon}  ${cat.toUpperCase()} — ${list.length} 】
➤ ${list.join(" │ ")}\n`;
    }

    // ========== PREMIUM FOOTER WITH CONTACT LINK ========== //
    msg += `
╔══════ 🔥 𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 𝘼𝘽𝙄𝘿 𝙃𝘼𝙎𝘼𝙉 🔥 ══════╗
║ Use: ${prefix}help <command>
║ 📬 Contact Owner:
║ 👉 m.me/imnotabid
╚══════════════════════════════╝`;

    const sent = await message.reply(msg);
    setTimeout(() => api.unsendMessage(sent.messageID), AUTO_UNSEND);
  }
};
