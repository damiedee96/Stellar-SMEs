require('dotenv').config();
const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

async function checkBalance(publicKey) {
  try {
    console.log(`Checking balance for: ${publicKey}\n`);
    const account = await server.loadAccount(publicKey);
    
    console.log('Balances:');
    account.balances.forEach((balance) => {
      const asset = balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`;
      console.log(`  ${asset}: ${balance.balance}`);
    });
  } catch (err) {
    if (err.response?.status === 404) {
      console.error('Account not found. Fund it first using Friendbot.');
    } else {
      console.error('Error:', err.message);
    }
  }
}

const publicKey = process.argv[2];
if (!publicKey) {
  console.error('Usage: node checkBalance.js <PUBLIC_KEY>');
  process.exit(1);
}

checkBalance(publicKey);
