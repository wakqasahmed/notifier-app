import React, { useState, useEffect } from "react";

function FormatterSettings({ notifierContract }) {
  const [directURI, setDirectURI] = useState("");
  const [broadcastURI, setBroadcastURI] = useState("");
  const [newDirectURI, setNewDirectURI] = useState("");
  const [newBroadcastURI, setNewBroadcastURI] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchURIs() {
      if (!notifierContract) return;
      try {
        const d = await notifierContract.directFormatterURI();
        const b = await notifierContract.broadcastFormatterURI();
        setDirectURI(d);
        setBroadcastURI(b);
      } catch (err) {
        console.error("Error fetching formatter URIs:", err);
      }
    }
    fetchURIs();
  }, [notifierContract]);

  async function handleSave(type) {
    if (!notifierContract) return;
    setSaving(true);
    try {
      const uri = type === "direct" ? newDirectURI : newBroadcastURI;
      let tx;
      if (type === "direct") {
        tx = await notifierContract.setDirectFormatterURI(uri);
      } else {
        tx = await notifierContract.setBroadcastFormatterURI(uri);
      }
      await tx.wait();
      if (type === "direct") {
        setDirectURI(uri);
        setNewDirectURI("");
      } else {
        setBroadcastURI(uri);
        setNewBroadcastURI("");
      }
    } catch (err) {
      console.error("Failed to update formatter URI:", err);
      alert("Failed: " + (err.reason || err.message));
    } finally {
      setSaving(false);
    }
  }

  if (!notifierContract) {
    return (
      <div className="max-w-lg p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl text-sm text-yellow-300">
        <strong>Contract not connected.</strong> Make sure your <code className="font-mono">.env</code> file
        has valid <code className="font-mono">REACT_APP_NOTIFIER_ADDRESS</code> and
        <code className="font-mono"> REACT_APP_USECASES_ADDRESS</code> values from your Ganache
        deployment, then restart <code className="font-mono">npm start</code>.
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          Direct Notification Formatter URI
        </h3>
        <p className="text-xs text-gray-500 font-mono mb-2 break-all">
          {directURI || "(not set)"}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newDirectURI}
            onChange={(e) => setNewDirectURI(e.target.value)}
            placeholder="ipfs://... or https://..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={() => handleSave("direct")}
            disabled={saving || !newDirectURI}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
          >
            {saving ? "..." : "Update"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          Broadcast Notification Formatter URI
        </h3>
        <p className="text-xs text-gray-500 font-mono mb-2 break-all">
          {broadcastURI || "(not set)"}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBroadcastURI}
            onChange={(e) => setNewBroadcastURI(e.target.value)}
            placeholder="ipfs://... or https://..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={() => handleSave("broadcast")}
            disabled={saving || !newBroadcastURI}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg transition-colors"
          >
            {saving ? "..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormatterSettings;
