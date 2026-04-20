const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NotifierMultiFormatter", function () {
  let notifier, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Notifier = await ethers.getContractFactory("NotifierMultiFormatter");
    notifier = await Notifier.deploy();
    await notifier.waitForDeployment();
  });

  describe("Direct Notifications", function () {
    it("should emit DirectNotification with correct parameters", async function () {
      await expect(
        notifier.sendDirectNotification(addr1.address, "Test Subject", "Test Message")
      )
        .to.emit(notifier, "DirectNotification")
        .withArgs(owner.address, addr1.address, "Test Subject", "Test Message");
    });

    it("should set msg.sender as the from address", async function () {
      await expect(
        notifier.connect(addr1).sendDirectNotification(addr2.address, "Hello", "World")
      )
        .to.emit(notifier, "DirectNotification")
        .withArgs(addr1.address, addr2.address, "Hello", "World");
    });
  });

  describe("Broadcast Notifications", function () {
    it("should emit BroadcastNotification with correct parameters", async function () {
      await expect(
        notifier.broadcastNotification("Broadcast Subject", "Broadcast Message")
      )
        .to.emit(notifier, "BroadcastNotification")
        .withArgs(owner.address, "Broadcast Subject", "Broadcast Message");
    });

    it("should set msg.sender as the from address", async function () {
      await expect(
        notifier.connect(addr1).broadcastNotification("From Addr1", "Content")
      )
        .to.emit(notifier, "BroadcastNotification")
        .withArgs(addr1.address, "From Addr1", "Content");
    });
  });

  describe("Formatter URIs", function () {
    const directURI = "ipfs://QmDirectFormatterHash";
    const broadcastURI = "ipfs://QmBroadcastFormatterHash";

    it("should set and get direct formatter URI", async function () {
      await notifier.setDirectFormatterURI(directURI);
      expect(await notifier.directFormatterURI()).to.equal(directURI);
    });

    it("should set and get broadcast formatter URI", async function () {
      await notifier.setBroadcastFormatterURI(broadcastURI);
      expect(await notifier.broadcastFormatterURI()).to.equal(broadcastURI);
    });

    it("should emit AttestDirectFormatter when setting direct URI", async function () {
      await expect(notifier.setDirectFormatterURI(directURI))
        .to.emit(notifier, "AttestDirectFormatter")
        .withArgs(directURI);
    });

    it("should emit AttestBroadcastFormatter when setting broadcast URI", async function () {
      await expect(notifier.setBroadcastFormatterURI(broadcastURI))
        .to.emit(notifier, "AttestBroadcastFormatter")
        .withArgs(broadcastURI);
    });

    it("should allow updating formatter URIs", async function () {
      await notifier.setDirectFormatterURI(directURI);
      const newURI = "ipfs://QmNewDirectHash";
      await notifier.setDirectFormatterURI(newURI);
      expect(await notifier.directFormatterURI()).to.equal(newURI);
    });

    it("should allow any address to set formatter URIs", async function () {
      await notifier.connect(addr1).setDirectFormatterURI(directURI);
      expect(await notifier.directFormatterURI()).to.equal(directURI);
    });
  });

  describe("Initial State", function () {
    it("should have empty formatter URIs initially", async function () {
      expect(await notifier.directFormatterURI()).to.equal("");
      expect(await notifier.broadcastFormatterURI()).to.equal("");
    });
  });
});
