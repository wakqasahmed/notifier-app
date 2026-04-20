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

    function setDirectFormatterURI(string memory _uri) public {
        directFormatterURI = _uri;
        emit AttestDirectFormatter(_uri);
    }

    function setBroadcastFormatterURI(string memory _uri) public {
        broadcastFormatterURI = _uri;
        emit AttestBroadcastFormatter(_uri);
    }

    function sendDirectNotification(
        address to,
        string memory subject,
        string memory message
    ) public {
        emit DirectNotification(msg.sender, to, subject, message);
    }

    function broadcastNotification(
        string memory subject,
        string memory message
    ) public {
        emit BroadcastNotification(msg.sender, subject, message);
    }
}
