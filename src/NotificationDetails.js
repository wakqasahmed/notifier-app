// NotificationDetails.js
import React from "react";
import { useParams, useLocation } from "react-router-dom";

function NotificationDetails() {
  // Get the dynamic parameter (txHash) from the route
  const { txHash } = useParams();
  // Parse any query parameters (e.g., type)
  const query = new URLSearchParams(useLocation().search);
  const type = query.get("type");

  // We can use txHash and type to fetch further details
  return (
    <div style={{ padding: "20px" }}>
      <h2>Notification Details</h2>
      <p><strong>Transaction Hash:</strong> {txHash}</p>
      <p><strong>Notification Type:</strong> {type || "N/A"}</p>
      <p>
        Here you can fetch and display additional information from the blockchain or your backend,
        such as more details about the event that triggered the notification.
      </p>
    </div>
  );
}

export default NotificationDetails;