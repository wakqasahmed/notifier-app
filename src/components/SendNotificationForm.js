import React, { useState } from "react";

function SendNotificationForm({ notifierContract }) {
  const [mode, setMode] = useState("direct");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    if (!notifierContract) return;
    setSending(true);
    setTxHash(null);
    try {
      let tx;
      if (mode === "direct") {
        tx = await notifierContract.sendDirectNotification(to, subject, message);
      } else {
        tx = await notifierContract.broadcastNotification(subject, message);
      }
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed: " + (err.reason || err.message));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex gap-2 mb-6">
        {["direct", "broadcast"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
            }`}
          >
            {m} Notification
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        {mode === "direct" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Notification subject"
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification message"
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={sending || !notifierContract}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
        >
          {sending ? "Sending..." : `Send ${mode === "direct" ? "Direct" : "Broadcast"} Notification`}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-sm">
          <p className="text-green-300">Transaction confirmed!</p>
          <p className="text-green-400 font-mono text-xs mt-1 truncate">
            {txHash}
          </p>
        </div>
      )}
    </div>
  );
}

export default SendNotificationForm;
