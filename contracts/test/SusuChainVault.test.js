const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SusuChainVault", function () {
    let SusuChainVault;
    let vault;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        SusuChainVault = await ethers.getContractFactory("SusuChainVault");
        vault = await SusuChainVault.deploy();
    });

    describe("Vault Creation", function () {
        it("Should allow user to create a vault", async function () {
            const targetAmount = ethers.parseEther("1.0");
            await expect(vault.connect(user1).createVault(targetAmount))
                .to.emit(vault, "VaultCreated")
                .withArgs(user1.address, targetAmount);

            const userVault = await vault.vaults(user1.address);
            expect(userVault.targetAmount).to.equal(targetAmount);
            expect(userVault.isLocked).to.be.true;
        });

        it("Should fail if target amount is 0", async function () {
            await expect(
                vault.connect(user1).createVault(0)
            ).to.be.revertedWith("Target amount must be greater than 0");
        });

        it("Should fail if vault already exists", async function () {
            const targetAmount = ethers.parseEther("1.0");
            await vault.connect(user1).createVault(targetAmount);
            await expect(
                vault.connect(user1).createVault(targetAmount)
            ).to.be.revertedWith("Vault already active");
        });
    });

    describe("Deposits", function () {
        beforeEach(async function () {
            await vault.connect(user1).createVault(ethers.parseEther("1.0"));
        });

        it("Should allow user to deposit ETH", async function () {
            const depositAmount = ethers.parseEther("0.1");
            await expect(vault.connect(user1).deposit({ value: depositAmount }))
                .to.emit(vault, "Deposited")
                .withArgs(user1.address, depositAmount, depositAmount);

            const userVault = await vault.vaults(user1.address);
            expect(userVault.balance).to.equal(depositAmount);
        });

        it("Should fail if no vault exists", async function () {
            await expect(
                vault.connect(user2).deposit({ value: ethers.parseEther("0.1") })
            ).to.be.revertedWith("No active vault");
        });
    });

    describe("Emergency Withdraw", function () {
        beforeEach(async function () {
            await vault.connect(user1).createVault(ethers.parseEther("1.0"));
            await vault.connect(user1).deposit({ value: ethers.parseEther("0.5") });
        });

        it("Should allow emergency withdrawal of all funds", async function () {
            const initialBalance = await ethers.provider.getBalance(user1.address);

            // Withdraw
            const tx = await vault.connect(user1).emergencyWithdraw();
            const receipt = await tx.wait();

            // Calculate gas cost
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            // Verify balance change
            const finalBalance = await ethers.provider.getBalance(user1.address);
            const withdrawnAmount = ethers.parseEther("0.5");

            // final = initial + withdrawn - gas
            expect(finalBalance).to.equal(initialBalance + withdrawnAmount - gasUsed);

            // Verify vault state
            const userVault = await vault.vaults(user1.address);
            expect(userVault.balance).to.equal(0);
            expect(userVault.isLocked).to.be.false;
            expect(userVault.emergencyWithdrawn).to.be.true;
        });

        it("Should block deposits after emergency withdrawal", async function () {
            await vault.connect(user1).emergencyWithdraw();
            await expect(
                vault.connect(user1).deposit({ value: ethers.parseEther("0.1") })
            ).to.be.revertedWith("No active vault");
        });

        it("Should fail second emergency withdrawal", async function () {
            await vault.connect(user1).emergencyWithdraw();
            await expect(
                vault.connect(user1).emergencyWithdraw()
            ).to.be.revertedWith("No funds to withdraw");
        });
    });
});
