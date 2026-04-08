/**
 * Eagle Eye SDK — Telegram Bot Example
 *
 * Create a Telegram bot that scans Solana tokens using the Eagle Eye API.
 *
 * Install:
 *   npm install @eagle-eye/sdk grammy
 *
 * Set env vars:
 *   TELEGRAM_TOKEN=your_bot_token
 *   EAGLE_API_KEY=eagle_sk_xxxxx
 */

const { Bot } = require('grammy');
const { EagleClient } = require('@eagle-eye/sdk');

const bot = new Bot(process.env.TELEGRAM_TOKEN);
const eagle = new EagleClient({ 
  apiKey: process.env.EAGLE_API_KEY,
  baseUrl: 'https://api.eagleeyes.tech'
});

bot.command('start', (ctx) => {
  ctx.reply(
    '🦅 Welcome to Eagle Eye Sniper Bot! (@eagleeyeagent_bot)\n\n' +
    'Send me any Solana Contract Address (CA) and I will analyze it using our Dual Cognitive AI framework.\n\n' +
    'Example: 7pskt3A1yZkCUV8F95MvqZpQvPUMvK31t3SABAGS\n\n' +
    '📢 Updates: https://t.me/eagleeye_channel'
  );
});

bot.on('message:text', async (ctx) => {
  const ca = ctx.message.text.trim();
  if (ca.startsWith('/')) return;
  if (ca.length < 32 || ca.length > 44) {
    return ctx.reply('❌ Invalid Solana Contract Address.');
  }

  const msg = await ctx.reply('🦅 Scanning Token via On-Chain Oracle... Please wait.');

  try {
    const result = await eagle.scanToken({ ca });
    
    const text = `🦅 **EAGLE EYE ANALYSIS**\n` +
      `CA: \`${ca}\`\n\n` +
      `**Score:** ${result.eagleScore.score}/100\n` +
      `**Verdict:** ${result.eagleScore.verdict}\n\n` +
      `🛡️ Honeypot: ${result.security.is_honeypot ? 'YES ❌' : 'NO ✅'}\n` +
      `🔥 LP Burned: ${result.security.lp_burned || 0}%\n\n` +
      `🧠 AI Note: _${result.aiReasoning}_\n\n` +
      `🌐 https://eagleeyes.tech`;

    await ctx.api.editMessageText(ctx.chat.id, msg.message_id, text, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.api.editMessageText(ctx.chat.id, msg.message_id, `❌ Scan failed: ${err.message}`);
  }
});

bot.start();
console.log('🦅 Eagle Eye Telegram Bot running!');
