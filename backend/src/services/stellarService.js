const StellarSdk = require('stellar-sdk');

const isTestnet = process.env.STELLAR_NETWORK !== 'mainnet';
const server = new StellarSdk.Horizon.Server(
  process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'
);
const networkPassphrase = isTestnet
  ? StellarSdk.Networks.TESTNET
  : StellarSdk.Networks.PUBLIC;

/**
 * Generate a new Stellar keypair
 */
function generateKeypair() {
  return StellarSdk.Keypair.random();
}

/**
 * Fund a testnet account via Friendbot
 */
async function fundTestnetAccount(publicKey) {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );
  return response.json();
}

/**
 * Get account balances
 */
async function getAccountBalances(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances.map((b) => ({
      asset: b.asset_type === 'native' ? 'XLM' : `${b.asset_code}:${b.asset_issuer}`,
      balance: b.balance,
    }));
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
}

/**
 * Send a payment on Stellar
 */
async function sendPayment({ secretKey, destination, amount, asset = 'XLM' }) {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const stellarAsset =
    asset === 'XLM' ? StellarSdk.Asset.native() : StellarSdk.Asset.native(); // extend for custom assets

  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: await server.fetchBaseFee(),
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: stellarAsset,
        amount: String(amount),
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(sourceKeypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

/**
 * Get recent transactions for an account
 */
async function getAccountTransactions(publicKey) {
  try {
    const txs = await server
      .transactions()
      .forAccount(publicKey)
      .limit(20)
      .order('desc')
      .call();
    return txs.records.map((t) => ({
      id: t.id,
      hash: t.hash,
      created_at: t.created_at,
      fee_charged: t.fee_charged,
      successful: t.successful,
    }));
  } catch {
    return [];
  }
}

module.exports = {
  generateKeypair,
  fundTestnetAccount,
  getAccountBalances,
  sendPayment,
  getAccountTransactions,
};
