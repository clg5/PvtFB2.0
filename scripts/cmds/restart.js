const fs = require("fs-extra");

module.exports = {
	config: {
		name: "restart",
		version: "2.0",
		author: "Abid Hasan", // Updated watermark
		countDown: 5,
		role: 2,
		description: {
			vi: "Khởi động lại bot",
			en: "Restart bot"
		},
		category: "Owner",
		guide: {
			vi: `
━━━━━━━━━━  ⚡️ RESTART BOT ⚡️  ━━━━━━━━━━
📌 Lệnh: {pn}
👉 Công dụng: Khởi động lại bot ngay lập tức
👑 Quyền yêu cầu: Admin/Owner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
			en: `
━━━━━━━━━━  ⚡️ RESTART BOT ⚡️  ━━━━━━━━━━
📌 Command: {pn}
👉 Function: Instantly restart the bot
👑 Required Role: Admin/Owner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
		}
	},

	langs: {
		vi: {
			restartting: "🔄 | Đang khởi động lại bot...\n✨ Tác giả: Abid Hasan"
		},
		en: {
			restartting: "🔄 | Restarting bot...\n✨ Author: Abid Hasan"
		}
	},

	onLoad: function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;

		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(
				`✅ | Bot restarted successfully!\n⏰ Uptime after restart: ${(Date.now() - time) / 1000}s\n✨ Author: Abid Hasan`,
				tid
			);
			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;

		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await message.reply(getLang("restartting"));

		process.exit(2);
	}
};
