// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ElectoralSystem {

    struct Voter {
        bool isRegistered;
        uint256 registeredAt;
        string state;
        string constituency;
        string boothNumber;
    }

    struct Migration {
        bytes32 voterIdHash;
        string fromState;
        string toState;
        string fromConstituency;
        string toConstituency;
        string toBoothNumber;
        uint256 timestamp;
    }

    struct VerificationStep {
        bytes32 referenceIdHash;
        string officerRole;
        bool approved;
        string remarks;
        uint256 timestamp;
    }

    struct ElectionResult {
        bytes32 resultHash;
        uint256 storedAt;
        bool isStored;
    }

    address public immutable admin;

    mapping(bytes32 => Voter) public voters;
    mapping(bytes32 => Migration[]) public migrations;
    mapping(bytes32 => VerificationStep[]) public verificationSteps;
    mapping(bytes32 => ElectionResult) public electionResults;

    event VoterRegistered(
        bytes32 indexed voterIdHash,
        bytes32 indexed aadharHash,
        string state,
        string constituency,
        string boothNumber,
        uint256 timestamp
    );

    event VoterMigrated(
        bytes32 indexed voterIdHash,
        string fromState,
        string toState,
        string fromConstituency,
        string toConstituency,
        string toBoothNumber,
        uint256 timestamp
    );

    event VerificationStepRecorded(
        bytes32 indexed referenceIdHash,
        string officerRole,
        bool approved,
        string remarks,
        uint256 timestamp
    );

    event ElectionResultStored(
        bytes32 indexed constituencyId,
        bytes32 resultHash,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "ElectoralSystem: caller is not admin");
        _;
    }

    modifier voterMustExist(bytes32 voterIdHash) {
        require(voters[voterIdHash].isRegistered, "ElectoralSystem: voter not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerVoter(
        bytes32 voterIdHash,
        bytes32 aadharHash,
        string calldata state,
        string calldata constituency,
        string calldata boothNumber
    ) external onlyAdmin {
        require(voterIdHash != bytes32(0), "ElectoralSystem: invalid voter hash");
        require(aadharHash != bytes32(0), "ElectoralSystem: invalid aadhar hash");
        require(bytes(state).length > 0, "ElectoralSystem: state cannot be empty");
        require(bytes(constituency).length > 0, "ElectoralSystem: constituency cannot be empty");
        require(!voters[voterIdHash].isRegistered, "ElectoralSystem: voter already registered");

        voters[voterIdHash] = Voter({
            isRegistered: true,
            registeredAt: block.timestamp,
            state: state,
            constituency: constituency,
            boothNumber: boothNumber
        });

        emit VoterRegistered(voterIdHash, aadharHash, state, constituency, boothNumber, block.timestamp);
    }

    function recordVerificationStep(
        bytes32 referenceIdHash,
        string calldata officerRole,
        bool approved,
        string calldata remarks
    ) external onlyAdmin {
        require(referenceIdHash != bytes32(0), "ElectoralSystem: invalid referenceId hash");
        require(bytes(officerRole).length > 0, "ElectoralSystem: officerRole cannot be empty");

        verificationSteps[referenceIdHash].push(VerificationStep({
            referenceIdHash: referenceIdHash,
            officerRole: officerRole,
            approved: approved,
            remarks: remarks,
            timestamp: block.timestamp
        }));

        emit VerificationStepRecorded(referenceIdHash, officerRole, approved, remarks, block.timestamp);
    }

    function migrateVoter(
        bytes32 voterIdHash,
        string calldata toState,
        string calldata toConstituency,
        string calldata toBoothNumber
    ) external onlyAdmin voterMustExist(voterIdHash) {
        require(bytes(toState).length > 0, "ElectoralSystem: toState cannot be empty");
        require(bytes(toConstituency).length > 0, "ElectoralSystem: toConstituency cannot be empty");

        string memory fromState = voters[voterIdHash].state;
        string memory fromConstituency = voters[voterIdHash].constituency;

        require(
            keccak256(bytes(fromState)) != keccak256(bytes(toState)) ||
            keccak256(bytes(fromConstituency)) != keccak256(bytes(toConstituency)),
            "ElectoralSystem: no change in state or constituency"
        );

        migrations[voterIdHash].push(Migration({
            voterIdHash: voterIdHash,
            fromState: fromState,
            toState: toState,
            fromConstituency: fromConstituency,
            toConstituency: toConstituency,
            toBoothNumber: toBoothNumber,
            timestamp: block.timestamp
        }));

        voters[voterIdHash].state = toState;
        voters[voterIdHash].constituency = toConstituency;
        voters[voterIdHash].boothNumber = toBoothNumber;

        emit VoterMigrated(voterIdHash, fromState, toState, fromConstituency, toConstituency, toBoothNumber, block.timestamp);
    }

    function storeElectionResultHash(bytes32 constituencyId, bytes32 resultHash) external onlyAdmin {
        require(constituencyId != bytes32(0), "ElectoralSystem: invalid constituency ID");
        require(resultHash != bytes32(0), "ElectoralSystem: invalid result hash");
        require(
            !electionResults[constituencyId].isStored,
            "ElectoralSystem: result already stored for this constituency"
        );

        electionResults[constituencyId] = ElectionResult({
            resultHash: resultHash,
            storedAt: block.timestamp,
            isStored: true
        });

        emit ElectionResultStored(constituencyId, resultHash, block.timestamp);
    }

    function isVoterRegistered(bytes32 voterIdHash) external view returns (bool) {
        return voters[voterIdHash].isRegistered;
    }

    function getMigrations(bytes32 voterIdHash) external view returns (Migration[] memory) {
        return migrations[voterIdHash];
    }

    function getVerificationSteps(bytes32 referenceIdHash) external view returns (VerificationStep[] memory) {
        return verificationSteps[referenceIdHash];
    }

    function getVerificationStepsCount(bytes32 referenceIdHash) external view returns (uint256) {
        return verificationSteps[referenceIdHash].length;
    }
}