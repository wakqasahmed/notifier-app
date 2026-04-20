// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NotifierMultiFormatter
 * @notice Emits notifications with separate formatter URIs for direct and broadcast events.
 */
contract NotifierMultiFormatter {
    event AttestDirectFormatter(string uri);
    event AttestBroadcastFormatter(string uri);

    event DirectNotification(
        address indexed from,
        address indexed to,
        string subject,
        string message
    );
    event BroadcastNotification(
        address indexed from,
        string subject,
        string message
    );

    string public directFormatterURI;
    string public broadcastFormatterURI;

    /**
     * @notice Sets the direct notification formatter URI.
     * @param _uri The URI for direct notifications (e.g., "ipfs://<CID>/directFormatter.json").
     */
    function setDirectFormatterURI(string memory _uri) public {
        directFormatterURI = _uri;
        emit AttestDirectFormatter(_uri);
    }

    /**
     * @notice Sets the broadcast notification formatter URI.
     * @param _uri The URI for broadcast notifications (e.g., "ipfs://<CID>/broadcastFormatter.json").
     */
    function setBroadcastFormatterURI(string memory _uri) public {
        broadcastFormatterURI = _uri;
        emit AttestBroadcastFormatter(_uri);
    }

    /**
     * @notice Sends a direct notification.
     * @param to The recipient address.
     * @param subject The notification subject.
     * @param message The notification message.
     */
    function sendDirectNotification(
        address to,
        string memory subject,
        string memory message
    ) public {
        emit DirectNotification(msg.sender, to, subject, message);
    }

    /**
     * @notice Broadcasts a notification.
     * @param subject The notification subject.
     * @param message The notification message.
     */
    function broadcastNotification(
        string memory subject,
        string memory message
    ) public {
        emit BroadcastNotification(msg.sender, subject, message);
    }
}
