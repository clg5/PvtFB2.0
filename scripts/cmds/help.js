

const { getPrefix } = global.utils || {};
const { commands, aliases } = global.GoatBot || {};

const PAGE_SIZE = 100;
const AUTO_UNSEND = 50 * 1000;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Abid",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Cyber-Styled Help Menu by Abid" },
    longDescription: { en: "Displays all commands in a matrix/cyber styled interface." },
    category: "info",
    guide: { en: "{pn}help [page|command]" }
  },

  onStart: async function ({ message, args, event, api }) {
    const prefix = getPrefix(event.threadID) || "!";
    const allCommands = Array.from(commands.values());
    let page = 1;

    // ========================= SINGLE COMMAND INFO ========================= //
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

      const premium = cfg.premium ? "💎 Premium Only" : "🆓 Free";
      const cost = cfg.cost ? `💰 Cost: ${cfg.cost} taka/use` : "💰 Cost: Free";

      const text = `
╔═【 📘 COMMAND INFO — ABID 】═╗
║ 🔧 Name: ${cfg.name.toUpperCase()}
║ 🔁 Aliases: ${cfg.aliases?.join(", ") || "None"}
║ 👤 Author: ${cfg.author || "Abid"}
║ 🔐 Permission: ${role}
║ 💎 Status: ${premium}
║ 💰 ${cost}
║ 📝 Description:
║   ${cfg.longDescription?.en || cfg.shortDescription?.en || "No description"}
║ 📌 Usage:
║   ${cfg.guide?.en || prefix + cfg.name}
╚════════════════════════════╝`;

      const sent = await message.reply(text);
      setTimeout(() => api.unsendMessage(sent.messageID), AUTO_UNSEND);
      return;
    }

    // ========================= PAGINATION ========================= //
    if (!isNaN(args[0])) page = parseInt(args[0]);
    const totalPages = Math.ceil(allCommands.length / PAGE_SIZE);
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const start = (page - 1) * PAGE_SIZE;
    const commandPage = allCommands.slice(start, start + PAGE_SIZE);

    // Group by category
    const grouped = {};
    commandPage.forEach(cmd => {
      const cat = cmd.config.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(cmd);
    });

    const categoryIcons = {
      info: "📘",
      fun: "🎉",
      admin: "🛡",
      owner: "👑",
      other: "⚡"
    };

    // ========================= BUILD CYBER HELP MENU ========================= //

    let msg = `
╔═【 💠 ABID CYBER HELP MENU 💠 】═╗
║ 📄 Page: ${page}/${totalPages}
║ 🟩 Total Commands: ${allCommands.length}
╚════════════════════════════════╝

`;

    for (const cat of Object.keys(grouped)) {
      const icon = categoryIcons[cat.toLowerCase()] || "📁";

      const list = grouped[cat].map(c => {
        const cost = c.config.cost ? `💰${c.config.cost}` : "🆓";
        const premium = c.config.premium ? "💎" : "";
        return `${c.config.name}${premium} (${cost})`;
      });

      msg += `
╔═【 ${icon} ${cat.toUpperCase()} — ${list.length} cmds 】═╗
║ ${list.join(" │ ")}
╚══════════════════════════════╝

`;
    }

    msg += `
╔═【 🔥 POWERED BY ABID 🔥 】═╗
║ Type: ${prefix}help <command> for details
║ Owner: Abid
╚════════════════════════════╝`;

    const sent = await message.reply(msg);
    setTimeout(() => api.unsendMessage(sent.messageID), AUTO_UNSEND);
  }
};
