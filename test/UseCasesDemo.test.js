const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UseCasesDemo", function () {
  let notifier, useCases, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Notifier = await ethers.getContractFactory("NotifierMultiFormatter");
    notifier = await Notifier.deploy();
    await notifier.waitForDeployment();

    const UseCases = await ethers.getContractFactory("UseCasesDemo");
    useCases = await UseCases.deploy(await notifier.getAddress());
    await useCases.waitForDeployment();
  });

  it("should store the correct notifier address", async function () {
    expect(await useCases.notifier()).to.equal(await notifier.getAddress());
  });

  describe("1. CTA Notification", function () {
    it("should emit DirectNotification for CTA", async function () {
      await expect(useCases.triggerCTANotification(addr1.address))
        .to.emit(notifier, "DirectNotification")
        .withArgs(
          await useCases.getAddress(),
          addr1.address,
          "Action Required: Claim Certificate",
          "Please claim your certificate or respond to the collaboration request by visiting the provided link. https://www.um.edu.mt/dlt/claim-certificate/collaborate/1911706"
        );
    });
  });

  describe("2. DAO Governance Voting", function () {
    it("should emit BroadcastNotification for DAO vote", async function () {
      await expect(useCases.triggerDAOVoteNotification(42))
        .to.emit(notifier, "BroadcastNotification")
        .withArgs(
          await useCases.getAddress(),
          "DAO Governance: Vote Required",
          "A new DAO proposal (ID: 42) is open for voting. Your participation is essential."
        );
    });
  });

  describe("3. DEX Price Alert", function () {
    it("should emit BroadcastNotification for DEX alert", async function () {
      await expect(useCases.triggerDEXNotification(1500))
        .to.emit(notifier, "BroadcastNotification")
        .withArgs(
          await useCases.getAddress(),
          "DEX Alert: Price Limit Reached",
          "Price alert: Current price is 1500. Immediate action may be required to avoid losses."
        );
    });
  });

  describe("4. NFT Offer Notification", function () {
    it("should emit DirectNotification for NFT offer", async function () {
      await expect(useCases.triggerNFTOfferNotification(addr1.address, 7))
        .to.emit(notifier, "DirectNotification")
        .withArgs(
          await useCases.getAddress(),
          addr1.address,
          "NFT Offer Received",
          "You have received an offer for your NFT (ID: 7). Please review the offer."
        );
    });
  });

  describe("5. Metaverse Event", function () {
    it("should emit BroadcastNotification for metaverse event", async function () {
      await expect(useCases.triggerMetaverseEventNotification(99))
        .to.emit(notifier, "BroadcastNotification")
        .withArgs(
          await useCases.getAddress(),
          "Metaverse Event Announcement",
          "Join the event now! Event ID: 99 is happening in the metaverse."
        );
    });
  });

  describe("6. ENS Domain Expiration", function () {
    it("should emit DirectNotification for ENS expiration", async function () {
      await expect(useCases.triggerENSDomainExpiration(addr1.address, "waqasahmed.eth"))
        .to.emit(notifier, "DirectNotification")
        .withArgs(
          await useCases.getAddress(),
          addr1.address,
          "ENS Domain Expiration Warning",
          "Your ENS domain waqasahmed.eth is expiring soon. Please renew it to avoid losing it."
        );
    });
  });

  describe("7. Anonymous Collaboration", function () {
    it("should emit BroadcastNotification for anonymous collab", async function () {
      await expect(useCases.triggerAnonymousCollaboration())
        .to.emit(notifier, "BroadcastNotification")
        .withArgs(
          await useCases.getAddress(),
          "Anonymous Collaboration Request",
          "An anonymous user wishes to collaborate with you. Click the link for details."
        );
    });
  });

  describe("8. Social Recovery", function () {
    it("should emit DirectNotification for social recovery", async function () {
      await expect(useCases.triggerSocialRecoveryNotification(addr1.address))
        .to.emit(notifier, "DirectNotification")
        .withArgs(
          await useCases.getAddress(),
          addr1.address,
          "Social Recovery Contact",
          "A trusted contact wishes to initiate social recovery. Please check the details and take appropriate action."
        );
    });
  });
});
