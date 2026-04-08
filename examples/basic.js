/**
 * Eagle Eye SDK — Basic Example
 *
 * Scans a Solana token and retrieves the Eagle Score™ intelligence.
 *
 * Install: npm install @eagle-eye/sdk
 * Get API key: https://app.eagleeyes.tech
 */

const { EagleClient } = require('@eagle-eye/sdk');

const eagle = new EagleClient({
  apiKey: 'eagle_sk_your_api_key_here',
});

async function main() {
  console.log('🦅 Scouting Token...');
  
  // 1. Generate an intelligence scan
  const result = await eagle.scanToken({
    ca: '7pskt3A1yZkCUV8F95MvqZpQvPUMvK31t3SABAGS',
    includeAdvancedData: true,
  });

  console.log('Verdict:', result.eagleScore.verdict);
  console.log('Score:', result.eagleScore.score);
  console.log('Risk Level:', result.eagleScore.level);
  console.log('');
  
  console.log('🔍 Breakdown:');
  console.log(' - LP Burned:', result.security.lp_burned, '%');
  console.log(' - Mentions Honeypot?', result.security.is_honeypot ? 'YES' : 'NO');
  console.log(' - AI Reasoning:', result.aiReasoning);
}

main().catch(console.error);
