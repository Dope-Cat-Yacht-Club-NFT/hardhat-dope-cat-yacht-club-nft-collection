// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error DopeCatYachtClubNft__InsufficientFunds();
error DopeCatYachtClubNft__TransferFailed();
error DopeCatYachtClubNft__BackgroundIndexOutOfRange();
error DopeCatYachtClubNft__CatTypeIndexOutOfRange();
error DopeCatYachtClubNft__PlanetIndexOutOfRange();
error DopeCatYachtClubNft__CombinationAlreadyExists();

contract DopeCatYachtClubNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    enum Background {
        DESERT,
        ICE,
        JUNGLE,
        SAVANNAH
    }

    enum CatType {
        JAGUAR,
        LION,
        PUMA,
        TIGER,
        WHITE_TIGER
    }

    enum Planet {
        EARTH,
        JUPITER,
        MARS,
        MERCURY,
        NEPTUNE,
        SATURN,
        THE_MOON,
        THE_SUN,
        URANUS,
        VENUS
    }

    using Counters for Counters.Counter;
    Counters.Counter private s_tokenIds;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinatorV2;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint256 private immutable i_mintFee;
    uint256 private immutable i_interval;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;
    uint256 private constant MAX_CHANCE_VALUE = 100;
    uint256 private constant COLLECTION_SIZE = 200;
    string[COLLECTION_SIZE] internal s_nftTokenUris;
    mapping(uint256 => address) s_requestIdToSender;
    mapping(uint16 => bool) s_nftMintCombo;
    mapping(uint16 => uint8) s_nftMintComboToNftUriIndex;

    event NftRequested(uint256 indexed _requestId, address _requester);

    event NftMinted(
        Background _background,
        CatType _catType,
        Planet _planet,
        address _nftOwner
    );

    constructor(
        address _vrfCoordinatorV2,
        uint64 _subscriptionId,
        bytes32 _gasLane,
        uint32 _callbackGasLimit,
        uint256 _interval,
        uint256 _mintFee,
        string[COLLECTION_SIZE] memory _nftTokenUris
    )
        VRFConsumerBaseV2(_vrfCoordinatorV2)
        ERC721("Dope Cat Yacht Club", "DCYC")
    {
        i_vrfCoordinatorV2 = VRFCoordinatorV2Interface(_vrfCoordinatorV2);
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        i_interval = _interval;
        i_mintFee = _mintFee;
        s_nftTokenUris = _nftTokenUris;
        generateNftCombo();
    }

    function generateNftCombo() private {
        uint8 count = 0;
        for (uint16 i = 0; i <= uint16(Background.SAVANNAH); i++) {
            for (uint16 j = 0; j <= uint16(CatType.WHITE_TIGER); j++) {
                for (uint16 k = 0; k <= uint16(Planet.VENUS); k++) {
                    s_nftMintCombo[i * 100 + j * 10 + k] = false;
                    s_nftMintComboToNftUriIndex[i * 100 + j * 10 + k] = count;
                    count += 1;
                }
            }
        }
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert DopeCatYachtClubNft__InsufficientFunds();
        }
        requestId = i_vrfCoordinatorV2.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        address nftOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenIds.current();
        uint256 moddedBackgroundRng = randomWords[0] % MAX_CHANCE_VALUE;
        uint256 moddedCatTypeRng = randomWords[1] % MAX_CHANCE_VALUE;
        uint256 moddedPlanetRng = randomWords[2] % MAX_CHANCE_VALUE;

        Background background = getBackgroundFromModdedRng(moddedBackgroundRng);
        CatType catType = getCatTypeFromModdedRng(moddedCatTypeRng);
        Planet planet = getPlanetFromModdedRng(moddedPlanetRng);

        uint16 comboKey = 100 *
            uint16(background) +
            10 *
            uint16(catType) +
            uint16(planet);
        if (s_nftMintCombo[comboKey] == true) {
            revert DopeCatYachtClubNft__CombinationAlreadyExists();
        }
        _safeMint(nftOwner, newTokenId);
        uint8 tokenUriIndex = s_nftMintComboToNftUriIndex[comboKey];
        _setTokenURI(newTokenId, s_nftTokenUris[tokenUriIndex]);
        s_tokenIds.increment();
        s_nftMintCombo[comboKey] = true;
        emit NftMinted(background, catType, planet, nftOwner);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");

        if (!success) {
            revert DopeCatYachtClubNft__TransferFailed();
        }
    }

    function getBackgroundFromModdedRng(uint256 _moddedRng)
        public
        pure
        returns (Background)
    {
        uint256 cumulativeSum = 0;
        uint256[4] memory chanceArray = getBackgroundChanceArray();

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (_moddedRng >= cumulativeSum && _moddedRng < chanceArray[i]) {
                return Background(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert DopeCatYachtClubNft__BackgroundIndexOutOfRange();
    }

    function getCatTypeFromModdedRng(uint256 _moddedRng)
        public
        pure
        returns (CatType)
    {
        uint256 cumulativeSum = 0;
        uint256[5] memory chanceArray = getCatTypeChanceArray();

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (_moddedRng >= cumulativeSum && _moddedRng < chanceArray[i]) {
                return CatType(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert DopeCatYachtClubNft__CatTypeIndexOutOfRange();
    }

    function getPlanetFromModdedRng(uint256 _moddedRng)
        public
        pure
        returns (Planet)
    {
        uint256 cumulativeSum = 0;
        uint256[10] memory chanceArray = getPlanetChanceArray();

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (_moddedRng >= cumulativeSum && _moddedRng < chanceArray[i]) {
                return Planet(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert DopeCatYachtClubNft__PlanetIndexOutOfRange();
    }

    function getBackgroundChanceArray()
        public
        pure
        returns (uint256[4] memory)
    {
        return [10, 25, 50, MAX_CHANCE_VALUE];
    }

    function getCatTypeChanceArray() public pure returns (uint256[5] memory) {
        return [5, 15, 35, 60, MAX_CHANCE_VALUE];
    }

    function getPlanetChanceArray() public pure returns (uint256[10] memory) {
        return [10, 20, 30, 40, 50, 60, 70, 80, 90, MAX_CHANCE_VALUE];
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getCallbackGasLimit() public view returns (uint256) {
        return i_callbackGasLimit;
    }

    function getGasLane() public view returns (bytes32) {
        return i_gasLane;
    }

    function getSubscriptionId() public view returns (uint64) {
        return i_subscriptionId;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getTokenUri(uint256 _index) public view returns (string memory) {
        return s_nftTokenUris[_index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenIds.current();
    }
}
