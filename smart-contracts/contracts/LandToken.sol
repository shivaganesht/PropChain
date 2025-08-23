// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract LandToken is 
    ERC1155, 
    Ownable, 
    ReentrancyGuard, 
    VRFConsumerBaseV2, 
    AutomationCompatibleInterface 
{
    using Counters for Counters.Counter;
    
    // Land structure
    struct Land {
        uint256 id;
        address seller;
        string metadataHash; // IPFS hash for documents
        uint256 totalTokens;
        uint256 availableTokens;
        uint256 pricePerTokenInUSD; // Price in USD cents (e.g., 10000 = $100)
        bool isActive;
        uint256 lastRentDistribution;
        uint256 rentPerTokenPerMonth; // Rent in USD cents
    }
    
    // Purchase request for VRF allocation
    struct PurchaseRequest {
        uint256 landId;
        address buyer;
        uint256 tokenAmount;
        uint256 paymentAmount;
    }
    
    // State variables
    Counters.Counter private _landIds;
    mapping(uint256 => Land) public lands;
    mapping(uint256 => address[]) public landOwners;
    mapping(uint256 => mapping(address => uint256)) public ownershipPercentage;
    mapping(uint256 => uint256) public totalRentCollected;
    mapping(uint256 => PurchaseRequest) public purchaseRequests;
    
    // Chainlink Price Feed
    AggregatorV3Interface public priceFeed;
    
    // Chainlink VRF
    VRFCoordinatorV2Interface public vrfCoordinator;
    uint64 public subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;
    
    // Events
    event LandTokenized(uint256 indexed landId, address indexed seller, uint256 totalTokens);
    event TokensPurchased(uint256 indexed landId, address indexed buyer, uint256 amount);
    event RentDistributed(uint256 indexed landId, uint256 totalAmount);
    event RandomnessRequested(uint256 requestId, uint256 landId);
    event TokensAllocated(uint256 indexed landId, address indexed buyer, uint256 amount);
    
    constructor(
        address _priceFeedAddress,
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash
    ) 
        ERC1155("https://propchain.com/api/token/{id}.json") 
        VRFConsumerBaseV2(_vrfCoordinator)
        Ownable(msg.sender)
    {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }
    
    // Tokenize land into fractional ownership
    function tokenizeLand(
        string memory _metadataHash,
        uint256 _totalTokens,
        uint256 _pricePerTokenInUSD,
        uint256 _rentPerTokenPerMonth
    ) external {
        require(_totalTokens > 0, "Total tokens must be greater than 0");
        require(_pricePerTokenInUSD > 0, "Price must be greater than 0");
        
        _landIds.increment();
        uint256 newLandId = _landIds.current();
        
        lands[newLandId] = Land({
            id: newLandId,
            seller: msg.sender,
            metadataHash: _metadataHash,
            totalTokens: _totalTokens,
            availableTokens: _totalTokens,
            pricePerTokenInUSD: _pricePerTokenInUSD,
            isActive: true,
            lastRentDistribution: block.timestamp,
            rentPerTokenPerMonth: _rentPerTokenPerMonth
        });
        
        // Mint all tokens to the seller initially
        _mint(msg.sender, newLandId, _totalTokens, "");
        landOwners[newLandId].push(msg.sender);
        ownershipPercentage[newLandId][msg.sender] = 100;
        
        emit LandTokenized(newLandId, msg.sender, _totalTokens);
    }
    
    // Get current AVAX price in USD
    function getAvaxPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price); // Price with 8 decimals
    }
    
    // Calculate token price in AVAX
    function calculateTokenPriceInAvax(uint256 _landId, uint256 _tokenAmount) 
        public 
        view 
        returns (uint256) 
    {
        Land memory land = lands[_landId];
        uint256 totalPriceInUSD = land.pricePerTokenInUSD * _tokenAmount;
        uint256 avaxPrice = getAvaxPrice();
        
        // Convert USD cents to AVAX (considering decimals)
        // totalPriceInUSD is in cents, avaxPrice has 8 decimals
        uint256 priceInAvax = (totalPriceInUSD * 1e18 * 1e8) / (avaxPrice * 100);
        return priceInAvax;
    }
    
    // Purchase tokens with AVAX
    function purchaseTokens(uint256 _landId, uint256 _tokenAmount) 
        external 
        payable 
        nonReentrant 
    {
        Land storage land = lands[_landId];
        require(land.isActive, "Land is not active");
        require(_tokenAmount > 0, "Must purchase at least 1 token");
        require(_tokenAmount <= land.availableTokens, "Not enough tokens available");
        
        uint256 requiredAvax = calculateTokenPriceInAvax(_landId, _tokenAmount);
        require(msg.value >= requiredAvax, "Insufficient AVAX sent");
        
        // If multiple buyers compete (simplified version - in production, implement queue)
        if (land.availableTokens == _tokenAmount) {
            // Direct purchase
            _processPurchase(_landId, msg.sender, _tokenAmount);
        } else {
            // Request randomness for fair allocation
            uint256 requestId = vrfCoordinator.requestRandomWords(
                keyHash,
                subscriptionId,
                requestConfirmations,
                callbackGasLimit,
                numWords
            );
            
            purchaseRequests[requestId] = PurchaseRequest({
                landId: _landId,
                buyer: msg.sender,
                tokenAmount: _tokenAmount,
                paymentAmount: msg.value
            });
            
            emit RandomnessRequested(requestId, _landId);
        }
        
        // Refund excess AVAX
        if (msg.value > requiredAvax) {
            payable(msg.sender).transfer(msg.value - requiredAvax);
        }
    }
    
    // Process purchase after VRF or directly
    function _processPurchase(uint256 _landId, address _buyer, uint256 _tokenAmount) internal {
        Land storage land = lands[_landId];
        address seller = land.seller;
        
        // Transfer tokens
        _safeTransferFrom(seller, _buyer, _landId, _tokenAmount, "");
        
        // Update land state
        land.availableTokens -= _tokenAmount;
        
        // Update ownership tracking
        if (ownershipPercentage[_landId][_buyer] == 0) {
            landOwners[_landId].push(_buyer);
        }
        
        // Calculate new ownership percentages
        uint256 buyerCurrentTokens = balanceOf(_buyer, _landId);
        ownershipPercentage[_landId][_buyer] = (buyerCurrentTokens * 100) / land.totalTokens;
        
        uint256 sellerCurrentTokens = balanceOf(seller, _landId);
        ownershipPercentage[_landId][seller] = (sellerCurrentTokens * 100) / land.totalTokens;
        
        // Transfer payment to seller
        uint256 requiredAvax = calculateTokenPriceInAvax(_landId, _tokenAmount);
        payable(seller).transfer(requiredAvax);
        
        emit TokensPurchased(_landId, _buyer, _tokenAmount);
    }
    
    // VRF Callback
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) 
        internal 
        override 
    {
        PurchaseRequest memory request = purchaseRequests[requestId];
        
        // Use randomness to fairly allocate tokens (simplified)
        // In production, implement more sophisticated allocation logic
        _processPurchase(request.landId, request.buyer, request.tokenAmount);
        
        emit TokensAllocated(request.landId, request.buyer, request.tokenAmount);
        
        delete purchaseRequests[requestId];
    }
    
    // Chainlink Automation - Check if rent distribution is needed
    function checkUpkeep(bytes calldata /* checkData */) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        for (uint256 i = 1; i <= _landIds.current(); i++) {
            Land memory land = lands[i];
            if (land.isActive && 
                land.rentPerTokenPerMonth > 0 &&
                block.timestamp >= land.lastRentDistribution + 30 days) {
                return (true, abi.encode(i));
            }
        }
        return (false, "");
    }
    
    // Chainlink Automation - Perform rent distribution
    function performUpkeep(bytes calldata performData) external override {
        uint256 landId = abi.decode(performData, (uint256));
        distributeRent(landId);
    }
    
    // Distribute rent to token holders
    function distributeRent(uint256 _landId) public nonReentrant {
        Land storage land = lands[_landId];
        require(land.isActive, "Land is not active");
        require(block.timestamp >= land.lastRentDistribution + 30 days, "Too early for distribution");
        
        uint256 totalRent = land.rentPerTokenPerMonth * land.totalTokens;
        
        // Distribute to all owners proportionally
        for (uint256 i = 0; i < landOwners[_landId].length; i++) {
            address owner = landOwners[_landId][i];
            uint256 ownerTokens = balanceOf(owner, _landId);
            if (ownerTokens > 0) {
                uint256 ownerShare = (totalRent * ownerTokens) / land.totalTokens;
                // In production, implement actual payment mechanism
                // For now, just track it
                totalRentCollected[_landId] += ownerShare;
            }
        }
        
        land.lastRentDistribution = block.timestamp;
        emit RentDistributed(_landId, totalRent);
    }
    
    // Get land details
    function getLandDetails(uint256 _landId) 
        external 
        view 
        returns (
            address seller,
            string memory metadataHash,
            uint256 totalTokens,
            uint256 availableTokens,
            uint256 pricePerTokenInUSD,
            bool isActive
        ) 
    {
        Land memory land = lands[_landId];
        return (
            land.seller,
            land.metadataHash,
            land.totalTokens,
            land.availableTokens,
            land.pricePerTokenInUSD,
            land.isActive
        );
    }
    
    // Get ownership distribution for a land
    function getOwnershipDistribution(uint256 _landId) 
        external 
        view 
        returns (address[] memory owners, uint256[] memory percentages) 
    {
        owners = landOwners[_landId];
        percentages = new uint256[](owners.length);
        
        for (uint256 i = 0; i < owners.length; i++) {
            percentages[i] = ownershipPercentage[_landId][owners[i]];
        }
        
        return (owners, percentages);
    }
    
    // Override URI for metadata
    function uri(uint256 _tokenId) public view override returns (string memory) {
        Land memory land = lands[_tokenId];
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", land.metadataHash));
    }
}
