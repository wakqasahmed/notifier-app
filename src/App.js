import React, { useEffect, useState, useRef, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotificationDetails from "./NotificationDetails";
import Header from "./components/Header";
import NotificationFeed from "./components/NotificationFeed";
import SendNotificationForm from "./components/SendNotificationForm";
import UseCaseDemoPanel from "./components/UseCaseDemoPanel";
import FormatterSettings from "./components/FormatterSettings";

const notifierAbi = [
  "event AttestDirectFormatter(string uri)",
  "event AttestBroadcastFormatter(string uri)",
  "event DirectNotification(address indexed from, address indexed to, string subject, string message)",
  "event BroadcastNotification(address indexed from, string subject, string message)",
  "function directFormatterURI() view returns (string)",
  "function broadcastFormatterURI() view returns (string)",
  "function sendDirectNotification(address to, string subject, string message)",
  "function broadcastNotification(string subject, string message)",
  "function setDirectFormatterURI(string _uri)",
  "function setBroadcastFormatterURI(string _uri)",
];

const useCasesAbi = [
  "function triggerCTANotification(address recipient)",
  "function triggerDAOVoteNotification(uint256 proposalId)",
  "function triggerDEXNotification(uint256 currentPrice)",
  "function triggerNFTOfferNotification(address nftOwner, uint256 nftId)",
  "function triggerMetaverseEventNotification(uint256 eventId)",
  "function triggerENSDomainExpiration(address domainOwner, string domainName)",
  "function triggerAnonymousCollaboration()",
  "function triggerSocialRecoveryNotification(address recipient)",
];

const notifierAddress = process.env.REACT_APP_NOTIFIER_ADDRESS;
const useCasesAddress = process.env.REACT_APP_USECASES_ADDRESS;

function convertIPFSToHTTP(uri) {
  const gateway = process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/";
  if (uri && uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", gateway);
  }
  return uri;
}

function applyTemplate(template, eventData) {
  return template.replace(/{{\s*([^{}]+)\s*}}/g, (match, key) => {
    key = key.trim();
    if (key.startsWith("event.")) {
      key = key.slice("event.".length);
    }
    return eventData[key] !== undefined ? eventData[key] : match;
  });
}

function formatNotification(rule, eventData) {
  return {
    icon: rule.icon,
    title: applyTemplate(rule.title, eventData),
    message: applyTemplate(rule.message, eventData),
    click: applyTemplate(rule.click, eventData),
  };
}

const TABS = [
  { id: "notifications", label: "Notifications" },
  { id: "send", label: "Send" },
  { id: "demos", label: "Use Case Demos" },
  { id: "settings", label: "Settings" },
];

function App() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [directFormatter, setDirectFormatter] = useState(null);
  const [broadcastFormatter, setBroadcastFormatter] = useState(null);
  const [notifierContract, setNotifierContract] = useState(null);
  const [useCasesContract, setUseCasesContract] = useState(null);
  const [activeTab, setActiveTab] = useState("notifications");

  const directFormatterRef = useRef(null);
  const broadcastFormatterRef = useRef(null);

  useEffect(() => {
    directFormatterRef.current = directFormatter;
  }, [directFormatter]);

  useEffect(() => {
    broadcastFormatterRef.current = broadcastFormatter;
  }, [broadcastFormatter]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      if (notifierAddress) {
        const notifier = new Contract(notifierAddress, notifierAbi, signer);
        setNotifierContract(notifier);
      }
      if (useCasesAddress) {
        const useCases = new Contract(useCasesAddress, useCasesAbi, signer);
        setUseCasesContract(useCases);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet();
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        connectWallet();
      });
    }
  }, [connectWallet]);

  useEffect(() => {
    if (!notifierContract) return;
    let listenerContract;

    async function initListeners() {
      const provider = notifierContract.runner?.provider || notifierContract.provider;
      listenerContract = new Contract(notifierAddress, notifierAbi, provider);

      async function fetchDirectFormatter(uri) {
        const httpURI = convertIPFSToHTTP(uri);
        try {
          const response = await fetch(httpURI);
          const json = await response.json();
          if (Array.isArray(json) && json.length > 0) {
            setDirectFormatter(json[0]);
          }
        } catch (err) {
          console.error("Error fetching direct formatter:", err);
        }
      }

      async function fetchBroadcastFormatter(uri) {
        const httpURI = convertIPFSToHTTP(uri);
        try {
          const response = await fetch(httpURI);
          const json = await response.json();
          if (Array.isArray(json) && json.length > 0) {
            setBroadcastFormatter(json[0]);
          }
        } catch (err) {
          console.error("Error fetching broadcast formatter:", err);
        }
      }

      listenerContract.on("AttestDirectFormatter", async (uri) => {
        await fetchDirectFormatter(uri);
      });
      listenerContract.on("AttestBroadcastFormatter", async (uri) => {
        await fetchBroadcastFormatter(uri);
      });

      try {
        const directURI = await listenerContract.directFormatterURI();
        const broadcastURI = await listenerContract.broadcastFormatterURI();
        if (directURI && directURI.length > 0) await fetchDirectFormatter(directURI);
        if (broadcastURI && broadcastURI.length > 0) await fetchBroadcastFormatter(broadcastURI);
      } catch (err) {
        console.error("Error fetching initial formatter URIs:", err);
      }

      listenerContract.on("DirectNotification", (from, to, subject, message, event) => {
        const eventData = {
          from,
          to,
          subject,
          message,
          transactionHash: event.log.transactionHash,
          type: "direct",
        };
        const currentDirectFormatter = directFormatterRef.current;
        const formatted = currentDirectFormatter
          ? formatNotification(currentDirectFormatter, eventData)
          : null;
        const notification = { ...eventData, formatted };
        setNotifications((prev) => [notification, ...prev]);
        if (formatted) {
          toast.info(
            <div>
              <strong>{formatted.title}</strong>
              <p className="text-sm mt-1">{formatted.message}</p>
            </div>,
            { onClick: () => window.open(formatted.click, "_blank"), autoClose: 8000 }
          );
        }
      });

      listenerContract.on("BroadcastNotification", (from, subject, message, event) => {
        const eventData = {
          from,
          subject,
          message,
          transactionHash: event.log.transactionHash,
          type: "broadcast",
        };
        const currentBroadcastFormatter = broadcastFormatterRef.current;
        const formatted = currentBroadcastFormatter
          ? formatNotification(currentBroadcastFormatter, eventData)
          : null;
        const notification = { ...eventData, formatted };
        setNotifications((prev) => [notification, ...prev]);
        if (formatted) {
          toast.info(
            <div>
              <strong>{formatted.title}</strong>
              <p className="text-sm mt-1">{formatted.message}</p>
            </div>,
            { onClick: () => window.open(formatted.click, "_blank"), autoClose: 8000 }
          );
        }
      });
    }

    initListeners();

    return () => {
      if (listenerContract) {
        listenerContract.removeAllListeners();
      }
    };
  }, [notifierContract]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header account={account} chainId={chainId} onConnect={connectWallet} />
      <ToastContainer position="top-right" theme="dark" />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-800 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-800 text-white border-b-2 border-indigo-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "notifications" && (
          <NotificationFeed notifications={notifications} />
        )}
        {activeTab === "send" && (
          <SendNotificationForm notifierContract={notifierContract} />
        )}
        {activeTab === "demos" && (
          <UseCaseDemoPanel useCasesContract={useCasesContract} />
        )}
        {activeTab === "settings" && (
          <FormatterSettings notifierContract={notifierContract} />
        )}
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notification/:txHash" element={<NotificationDetails />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
