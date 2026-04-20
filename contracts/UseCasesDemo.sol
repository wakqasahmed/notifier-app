// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

interface INotifierMultiFormatter {
    function sendDirectNotification(address to, string calldata subject, string calldata message) external;
    function broadcastNotification(string calldata subject, string calldata message) external;
}

contract UseCasesDemo {
    using Strings for uint256;
    INotifierMultiFormatter public notifier;

    constructor(address _notifierAddress) {
        notifier = INotifierMultiFormatter(_notifierAddress);
    }

    // 1. CTA Notification for claiming certificates or collaborating
    function triggerCTANotification(address recipient) external {
        notifier.sendDirectNotification(
            recipient,
            "Action Required: Claim Certificate",
            "Please claim your certificate or respond to the collaboration request by visiting the provided link. https://www.um.edu.mt/dlt/claim-certificate/collaborate/1911706"
        );
    }

    // 2. DAO Governance Voting Notification
    function triggerDAOVoteNotification(uint256 proposalId) external {
        string memory message = string(
            abi.encodePacked(
                "A new DAO proposal (ID: ", 
                proposalId.toString(), 
                ") is open for voting. Your participation is essential."
            )
        );
        notifier.broadcastNotification("DAO Governance: Vote Required", message);
    }

    // 3. DEX Price Limit / Stop-Loss Notification
    function triggerDEXNotification(uint256 currentPrice) external {
        string memory message = string(
            abi.encodePacked(
                "Price alert: Current price is ", 
                currentPrice.toString(), 
                ". Immediate action may be required to avoid losses."
            )
        );
        notifier.broadcastNotification("DEX Alert: Price Limit Reached", message);
    }

    // 4. NFT Marketplace Offer Notification
    function triggerNFTOfferNotification(address nftOwner, uint256 nftId) external {
        string memory message = string(
            abi.encodePacked(
                "You have received an offer for your NFT (ID: ", 
                nftId.toString(), 
                "). Please review the offer."
            )
        );
        notifier.sendDirectNotification(nftOwner, "NFT Offer Received", message);
    }

    // 5. Metaverse Event Announcement Notification
    function triggerMetaverseEventNotification(uint256 eventId) external {
        string memory message = string(
            abi.encodePacked(
                "Join the event now! Event ID: ", 
                eventId.toString(), 
                " is happening in the metaverse."
            )
        );
        notifier.broadcastNotification("Metaverse Event Announcement", message);
    }

    // 6. ENS Domain Expiration Warning Notification
    function triggerENSDomainExpiration(address domainOwner, string calldata domainName) external {
        string memory message = string(
            abi.encodePacked(
                "Your ENS domain ", 
                domainName, 
                " is expiring soon. Please renew it to avoid losing it."
            )
        );
        notifier.sendDirectNotification(domainOwner, "ENS Domain Expiration Warning", message);
    }

    // 7. Anonymous Collaboration Request Notification
    function triggerAnonymousCollaboration() external {
        notifier.broadcastNotification(
            "Anonymous Collaboration Request", 
            "An anonymous user wishes to collaborate with you. Click the link for details."
        );
    }

    // 8. Social Recovery Contact Notification
    function triggerSocialRecoveryNotification(address recipient) external {
        string memory message = "A trusted contact wishes to initiate social recovery. Please check the details and take appropriate action.";
        notifier.sendDirectNotification(recipient, "Social Recovery Contact", message);
    }
}
