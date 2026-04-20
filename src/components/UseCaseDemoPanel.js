import React, { useState } from "react";

const USE_CASES = [
  {
    id: 1,
    name: "CTA Notification",
    description: "Send a claim certificate / collaboration request",
    method: "triggerCTANotification",
    type: "direct",
    inputs: [{ name: "recipient", label: "Recipient Address", placeholder: "0x...", type: "address" }],
  },
  {
    id: 2,
    name: "DAO Governance Vote",
    description: "Broadcast a voting announcement with proposal ID",
    method: "triggerDAOVoteNotification",
    type: "broadcast",
    inputs: [{ name: "proposalId", label: "Proposal ID", placeholder: "42", type: "uint" }],
  },
  {
    id: 3,
    name: "DEX Price Alert",
    description: "Broadcast a stop-loss / price limit alert",
    method: "triggerDEXNotification",
    type: "broadcast",
    inputs: [{ name: "currentPrice", label: "Current Price", placeholder: "1500", type: "uint" }],
  },
  {
    id: 4,
    name: "NFT Offer",
    description: "Notify an NFT owner about a new offer",
    method: "triggerNFTOfferNotification",
    type: "direct",
    inputs: [
      { name: "nftOwner", label: "NFT Owner Address", placeholder: "0x...", type: "address" },
      { name: "nftId", label: "NFT ID", placeholder: "7", type: "uint" },
    ],
  },
  {
    id: 5,
    name: "Metaverse Event",
    description: "Broadcast a metaverse event announcement",
    method: "triggerMetaverseEventNotification",
    type: "broadcast",
    inputs: [{ name: "eventId", label: "Event ID", placeholder: "99", type: "uint" }],
  },
  {
    id: 6,
    name: "ENS Domain Expiration",
    description: "Warn a domain owner about upcoming expiration",
    method: "triggerENSDomainExpiration",
    type: "direct",
    inputs: [
      { name: "domainOwner", label: "Domain Owner Address", placeholder: "0x...", type: "address" },
      { name: "domainName", label: "Domain Name", placeholder: "example.eth", type: "string" },
    ],
  },
  {
    id: 7,
    name: "Anonymous Collaboration",
    description: "Broadcast an anonymous collaboration request",
    method: "triggerAnonymousCollaboration",
    type: "broadcast",
    inputs: [],
  },
  {
    id: 8,
    name: "Social Recovery",
    description: "Notify a contact to initiate social recovery",
    method: "triggerSocialRecoveryNotification",
    type: "direct",
    inputs: [{ name: "recipient", label: "Recipient Address", placeholder: "0x...", type: "address" }],
  },
];

function UseCaseCard({ useCase, useCasesContract }) {
  const [inputs, setInputs] = useState({});
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState(null);

  function updateInput(name, value) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  async function handleTrigger() {
    if (!useCasesContract) return;
    setSending(true);
    setTxHash(null);
    try {
      const args = useCase.inputs.map((inp) => inputs[inp.name] || "");
      const tx = await useCasesContract[useCase.method](...args);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
    } catch (err) {
      console.error(`${useCase.name} failed:`, err);
      alert(`Failed: ${err.reason || err.message}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-bold text-gray-500">#{useCase.id}</span>
        <h3 className="font-semibold text-white">{useCase.name}</h3>
        <span
          className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
            useCase.type === "direct"
              ? "bg-blue-900/50 text-blue-300 border border-blue-700"
              : "bg-purple-900/50 text-purple-300 border border-purple-700"
          }`}
        >
          {useCase.type}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-3">{useCase.description}</p>

      {useCase.inputs.map((inp) => (
        <div key={inp.name} className="mb-2">
          <label className="block text-xs text-gray-500 mb-0.5">
            {inp.label}
          </label>
          <input
            type="text"
            value={inputs[inp.name] || ""}
            onChange={(e) => updateInput(inp.name, e.target.value)}
            placeholder={inp.placeholder}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      ))}

      <button
        onClick={handleTrigger}
        disabled={sending || !useCasesContract}
        className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
      >
        {sending ? "Sending..." : "Trigger"}
      </button>

      {txHash && (
        <p className="mt-2 text-xs text-green-400 font-mono truncate">
          Tx: {txHash}
        </p>
      )}
    </div>
  );
}

function UseCaseDemoPanel({ useCasesContract }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {USE_CASES.map((uc) => (
        <UseCaseCard
          key={uc.id}
          useCase={uc}
          useCasesContract={useCasesContract}
        />
      ))}
    </div>
  );
}

export default UseCaseDemoPanel;
