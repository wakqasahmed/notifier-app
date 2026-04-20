import React from "react";

const NETWORK_NAMES = {
  1: "Mainnet",
  5: "Goerli",
  11155111: "Sepolia",
  1337: "Ganache",
  5777: "Ganache",
  31337: "Hardhat",
};

function Header({ account, chainId, onConnect }) {
  const networkName = NETWORK_NAMES[chainId] || `Chain ${chainId}`;
  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo100.png" alt="Logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-white">
              Decentralized Notifications
            </h1>
            <p className="text-xs text-gray-400">EIP-7017 Implementation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {chainId && (
            <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-full border border-indigo-700">
              {networkName}
            </span>
          )}
          {account ? (
            <span className="px-3 py-1 bg-gray-800 text-gray-200 text-sm rounded-lg font-mono border border-gray-600">
              {shortAddress}
            </span>
          ) : (
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
