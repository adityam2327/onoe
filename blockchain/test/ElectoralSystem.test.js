const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require("crypto");

function sha256ToBytes32(input) {
    const hash = crypto.createHash("sha256").update(input).digest("hex");
    return "0x" + hash;
}

describe("ElectoralSystem", function () {
    let electoral;
    let admin, other;

    const UNIQUE_VOTER_ID = "UP123456789";
    const AADHAR = "123456789012";
    const voterIdHash = sha256ToBytes32(UNIQUE_VOTER_ID);
    const aadharHash = sha256ToBytes32(AADHAR);
    const REFERENCE_ID = "REF-UP-2024-00001";
    const referenceIdHash = sha256ToBytes32(REFERENCE_ID);

    const STATE_A = "Uttar Pradesh";
    const STATE_B = "Maharashtra";
    const CONSTITUENCY_A = "Lucknow";
    const CONSTITUENCY_B = "Mumbai North";
    const BOOTH_A = "BOOTH-001";
    const BOOTH_B = "BOOTH-042";

    beforeEach(async function () {
        [admin, other] = await ethers.getSigners();
        const ElectoralSystem = await ethers.getContractFactory("ElectoralSystem");
        electoral = await ElectoralSystem.deploy();
        await electoral.waitForDeployment();
    });

    describe("Admin", function () {
        it("should set deployer as admin", async function () {
            expect(await electoral.admin()).to.equal(admin.address);
        });

        it("should reject non-admin calls", async function () {
            await expect(
                electoral.connect(other).registerVoter(voterIdHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A)
            ).to.be.revertedWith("ElectoralSystem: caller is not admin");
        });
    });

    describe("registerVoter", function () {
        it("should register a voter with full electoral details", async function () {
            await expect(
                electoral.registerVoter(voterIdHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A)
            ).to.emit(electoral, "VoterRegistered")
             .withArgs(voterIdHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A, await latestTs());

            const v = await electoral.voters(voterIdHash);
            expect(v.isRegistered).to.be.true;
            expect(v.state).to.equal(STATE_A);
            expect(v.constituency).to.equal(CONSTITUENCY_A);
            expect(v.boothNumber).to.equal(BOOTH_A);
        });

        it("should prevent duplicate registration", async function () {
            await electoral.registerVoter(voterIdHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A);
            await expect(
                electoral.registerVoter(voterIdHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A)
            ).to.be.revertedWith("ElectoralSystem: voter already registered");
        });

        it("should reject zero-value voter hash", async function () {
            await expect(
                electoral.registerVoter(ethers.ZeroHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A)
            ).to.be.revertedWith("ElectoralSystem: invalid voter hash");
        });

        it("should reject zero-value aadhar hash", async function () {
            await expect(
                electoral.registerVoter(voterIdHash, ethers.ZeroHash, STATE_A, CONSTITUENCY_A, BOOTH_A)
            ).to.be.revertedWith("ElectoralSystem: invalid aadhar hash");
        });
    });

    describe("recordVerificationStep", function () {
        it("should record a BLO verification step", async function () {
            await expect(
                electoral.recordVerificationStep(referenceIdHash, "BLO", true, "Identity confirmed at booth")
            ).to.emit(electoral, "VerificationStepRecorded")
             .withArgs(referenceIdHash, "BLO", true, "Identity confirmed at booth", await latestTs());

            expect(await electoral.getVerificationStepsCount(referenceIdHash)).to.equal(1);
        });

        it("should record full BLO -> ERO -> DEO -> AI chain", async function () {
            const steps = [
                { role: "BLO", approved: true, remarks: "BLO verified" },
                { role: "ERO", approved: true, remarks: "ERO verified" },
                { role: "DEO", approved: true, remarks: "DEO verified" },
                { role: "AI",  approved: true, remarks: "AI face match passed" }
            ];

            for (const s of steps) {
                await electoral.recordVerificationStep(referenceIdHash, s.role, s.approved, s.remarks);
            }

            const logged = await electoral.getVerificationSteps(referenceIdHash);
            expect(logged.length).to.equal(4);
            expect(logged[0].officerRole).to.equal("BLO");
            expect(logged[3].officerRole).to.equal("AI");
            expect(logged[3].approved).to.be.true;
        });

        it("should record a rejection", async function () {
            await electoral.recordVerificationStep(referenceIdHash, "ERO", false, "Documents mismatch");
            const steps = await electoral.getVerificationSteps(referenceIdHash);
            expect(steps[0].approved).to.be.false;
            expect(steps[0].remarks).to.equal("Documents mismatch");
        });

        it("should reject zero referenceIdHash", async function () {
            await expect(
                electoral.recordVerificationStep(ethers.ZeroHash, "BLO", true, "test")
            ).to.be.revertedWith("ElectoralSystem: invalid referenceId hash");
        });
    });

    describe("migrateVoter", function () {
        beforeEach(async function () {
            await electoral.registerVoter(voterIdHash, aadharHash, STATE_A, CONSTITUENCY_A, BOOTH_A);
        });

        it("should log migration with constituency and booth details", async function () {
            await expect(
                electoral.migrateVoter(voterIdHash, STATE_B, CONSTITUENCY_B, BOOTH_B)
            ).to.emit(electoral, "VoterMigrated")
             .withArgs(voterIdHash, STATE_A, STATE_B, CONSTITUENCY_A, CONSTITUENCY_B, BOOTH_B, await latestTs());

            const voter = await electoral.voters(voterIdHash);
            expect(voter.state).to.equal(STATE_B);
            expect(voter.constituency).to.equal(CONSTITUENCY_B);
            expect(voter.boothNumber).to.equal(BOOTH_B);
        });

        it("should reject migration with no actual change", async function () {
            await expect(
                electoral.migrateVoter(voterIdHash, STATE_A, CONSTITUENCY_A, BOOTH_A)
            ).to.be.revertedWith("ElectoralSystem: no change in state or constituency");
        });

        it("should allow same-state constituency change", async function () {
            await expect(
                electoral.migrateVoter(voterIdHash, STATE_A, CONSTITUENCY_B, BOOTH_B)
            ).to.emit(electoral, "VoterMigrated");
        });

        it("should reject migration of unregistered voter", async function () {
            const unknownHash = sha256ToBytes32("UNKNOWN");
            await expect(
                electoral.migrateVoter(unknownHash, STATE_B, CONSTITUENCY_B, BOOTH_B)
            ).to.be.revertedWith("ElectoralSystem: voter not registered");
        });
    });

    describe("storeElectionResultHash", function () {
        const constituencyId = sha256ToBytes32("UP-01-LUCKNOW");
        const resultHash = sha256ToBytes32("EVM-RESULT-UP-01");

        it("should store election result hash", async function () {
            await expect(
                electoral.storeElectionResultHash(constituencyId, resultHash)
            ).to.emit(electoral, "ElectionResultStored")
             .withArgs(constituencyId, resultHash, await latestTs());

            const stored = await electoral.electionResults(constituencyId);
            expect(stored.isStored).to.be.true;
            expect(stored.resultHash).to.equal(resultHash);
        });

        it("should prevent overwriting (tamper-proof)", async function () {
            await electoral.storeElectionResultHash(constituencyId, resultHash);
            await expect(
                electoral.storeElectionResultHash(constituencyId, sha256ToBytes32("tampered"))
            ).to.be.revertedWith("ElectoralSystem: result already stored for this constituency");
        });
    });
});

async function latestTs() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp + 1;
}