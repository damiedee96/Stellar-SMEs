require('dotenv').config();
const StellarSdk = require('stellar-sdk');

async function fundAccount(publicKey) {
  try {
    console.log(`Funding testnet account: ${publicKey}`);
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    const result = await response.json();
    console.log('Account funded successfully!');
    console.log('Transaction:', result.hash);
  } catch (err) {
    console.error('Failed to fund account:', err.message);
  }
}

const publicKey = process.argv[2];
if (!publicKey) {
  console.error('Usage: node fundAccount.js <PUBLIC_KEY>');
  process.exit(1);
}

fundAccount(publicKey);
