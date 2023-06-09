// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title SignatureChangingHash
/// @author Lokesh Kumar (lokeshkumar636@yahoo.com) [https://github.com/codeTIT4N]
/// @notice This contract is to verify signatures with changing hash every 2 minutes
/// @dev The Hash which will be signed will be generated by this contract.
/// @dev The hash will be changing every 2 minutes making it impossible to use the same signature again.
contract SignatureChangingHash {

    using ECDSA for bytes32;

    /// @notice The signer/owner of the contract
    address public signerAddress;

    /// @notice The timestamp using which the hash timestamp will be generated
    uint256 public referenceTimestamp;

    /// @notice The nonce to be used for generating hash
    /// @dev This nonce should be incremented every time a transaction is executed with the signature
    uint256 public nonce;

    /// @notice The chainId of the network on which the contract is deployed
    uint256 immutable public chainId;

    /// @notice The mapping to keep track of the executed hashes
    /// @dev This mapping is not really required but it is good to keep track of additional security
    mapping(bytes32 => bool) public executed;

    /// @notice The constructor which sets the signer, referenceTimestamp, nonce and chainId
    constructor() {
        signerAddress = msg.sender;
        referenceTimestamp = block.timestamp;
        nonce = 0;
        uint256 _chainid;
        assembly {
            _chainid := chainid()
        }
        chainId = _chainid;
    }

    /// @notice The function to get the hashTimestamp
    /// @dev The hashTimestamp is the timestamp which is used to generate the hash
    /// @dev This timestamp will be changing every 2 minutes
    function getHashTimestamp() public view returns (uint256 hashTimestamp) {
        uint256 difference = (block.timestamp - referenceTimestamp);
        uint256 lapses = (difference / 2 minutes); // floor division
        hashTimestamp = (lapses * 2 minutes) + referenceTimestamp;
    }
    
    /// @notice The function to get the hash which will be signed by the signer
    /// @dev The hash will be generated using the address of the contract, chainId, nonce and hashTimestamp
    /// @dev The hash will change every 2 minutes because the hashTimestamp will change every 2 minutes
    function getHash() public view returns (bytes32 hash) {
        hash = keccak256(abi.encodePacked(address(this), chainId, nonce, getHashTimestamp()));
    }

    /// @notice The function simulates a transaction with the signature
    /// @dev This function is just to simulate a transaction
    /// @dev The referenceTimestamp will be updated to the last hashTimestamp
    /// @dev The change in referenceTimestamp is not required but it makes the next hash timestamp calculation faster
    function simulateTxn(bytes calldata sig) public {
        require(verifySigner(sig), "SignatureChangingHash: Invalid Signature"); 
        require(!executed[getHash()], "SignatureChangingHash: Hash already executed");
        executed[getHash()] = true;
        nonce += 1; // increment nonce to make the hash different
        referenceTimestamp = getHashTimestamp(); // update the referenceTimestamp to the last hashTimestamp
    }

    /// @notice The function to get the signer of the hash from the signature
    function getSigner(bytes calldata sig) public view returns (address theSigner){
        bytes32 ethSignedHash = getHash().toEthSignedMessageHash();
        theSigner = ethSignedHash.recover(sig);
    }

    /// @notice The function to verify the signer of the hash from the signature
    function verifySigner(bytes calldata sig) public view returns (bool isSigner) {
        isSigner = (getSigner(sig) == signerAddress);
    }
}
