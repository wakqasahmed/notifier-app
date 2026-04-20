import React, { useState } from "react";

function convertIPFSToHTTP(uri) {
  const gateway =
    process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/";
  if (uri && uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", gateway);
  }
  return uri;
}

function NotificationFeed({ notifications }) {
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["all", "direct", "broadcast"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-lg">No notifications yet</p>
          <p className="text-sm mt-1">
            Send a notification using the "Send" tab or trigger a demo
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                {n.formatted?.icon && (
                  <img
                    src={convertIPFSToHTTP(n.formatted.icon)}
                    alt=""
                    className="w-10 h-10 rounded-lg mt-0.5"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        n.type === "direct"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                          : "bg-purple-900/50 text-purple-300 border border-purple-700"
                      }`}
                    >
                      {n.type}
                    </span>
                    <h3 className="font-semibold text-white truncate">
                      {n.formatted?.title || n.subject}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    {n.formatted?.message || n.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-mono truncate" title={n.from}>
                      From: {n.from?.slice(0, 8)}...{n.from?.slice(-4)}
                    </span>
                    {n.to && (
                      <span className="font-mono truncate" title={n.to}>
                        To: {n.to?.slice(0, 8)}...{n.to?.slice(-4)}
                      </span>
                    )}
                    <span
                      className="font-mono truncate"
                      title={n.transactionHash}
                    >
                      Tx: {n.transactionHash?.slice(0, 10)}...
                    </span>
                  </div>
                </div>
                {n.formatted?.click && (
                  <a
                    href={n.formatted.click}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm shrink-0"
                  >
                    View &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationFeed;
