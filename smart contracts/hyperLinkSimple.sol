
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import "contracts/hyperconstruct.sol" ;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "hardhat/console.sol";  


contract MyToken is ERC721, ERC721URIStorage, ERC721Pausable, Ownable, ERC721Burnable, IERC5489 {
    
    struct hLinkStructure{
        string name;
        string typeOf; //typeOf the URI. Examples: asset, physical conterpart, story, article, social-links etc. basically anything which is related to the art
        string description; //describe briefly
        string link;

    }

    struct Links{
        address[] artOwner;
        hLinkStructure[] artProvanance;
    }

    struct managers{
        address slotManager;
        string name;
    }

    //let's define basic struture of our hyperlink hash values
    /*
    mapped from tokenId -> const address owner-> ;
        struct hlink:
        {
            name: "string"
            type: "string"
            description: "string"
            hLink: "string URI" 
        }

        retrieval function(tokenID) :
            m


            

        
    */
    //careful here
    //creator address is stored once and cannot be changed
    address immutable creatorAddress;
    /*function creator(address ca) internal {
        creatorAddress = ca ;
    }
    */
    uint256 private _nextTokenId;
    //address[] public all_owners;
    //Links[] allLinks;
    mapping (uint256 => Links) internal  allLinks;
    mapping( uint256 => managers) internal slotAuth ; // use internal private for more closed system
    //hash table for verified links. Must satisfy general structure of a decentral hash function
    mapping(uint256 => mapping(address => hLinkStructure[] )) internal hLinkArtist;
    mapping(uint256 => mapping(address => hLinkStructure[] )) internal hLinkOwners;

    function compareStrings(string memory a, string memory b) public view returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    constructor(address initialOwner)
        ERC721("HNFT Memory and Provanance Event", "MHMPE")
        Ownable(initialOwner)   //cannot implement in erc 404. 
        /* For this ERC to be inherited by ERC404, this must implement "Ownable" seperately. */ 
        //creatorAddress(tx.origin) 
        //The function should run inside the constructor
        //probalby looking at ERCs will give the answer

    {
        creatorAddress = msg.sender ;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
    //The function safeMint will intialize the slotManager = Minter =tx.origin 
    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        authorizeSlotTo(tokenId, "creator", tx.origin) ; //Creator/artist/minter gets default access to slot
        hLinkStructure memory hL = hLinkStructure("init", "web", "minted", "www.mrkd.art") ;
        addHyperLinkOwner( hL, tokenId, false, hL) ;
    }

    event addedProvanance(uint256 indexed tokenId, address indexed currentOwner, Links indexed hL) ;



    /**testing function
    This generates a special interface for #owner to set token URI explicitly.
    The operations performed will be hidden for rest. **/
    
    /*
    function setURI(uint256 tokenID, string memory uri) internal onlyOwner {
        _setTokenURI(tokenID, uri);
    }
    */

    function authorizeSlotTo(uint256 tokenId, string memory name, address slotManagerAddr) public onlyOwner virtual override{
        slotAuth[tokenId].name = name ;
        slotAuth[tokenId].slotManager = slotManagerAddr ;
        emit SlotAuthorizationCreated(tokenId, slotManagerAddr);
    }

    function revokeAuthorization(uint256 tokenId, address slotManagerAddr) public onlyOwner {
        if ( slotAuth[tokenId].slotManager == slotManagerAddr) {
            delete slotAuth[tokenId];
            emit SlotAuthorizationRevoked(tokenId, slotManagerAddr) ;
        }
        else {
            console.log("error, enter right pairs") ;
        }
    }

    function revokeAllAuthorizations(uint256 tokenId) public override {
        if(msg.sender == creatorAddress) {
            delete slotAuth[tokenId];
            emit SlotAuthorizationRevoked(tokenId, msg.sender) ;
        }
        else console.log("unauthorised");
    }

    function setSlotUri(
        uint256 tokenId,
        string calldata newUri
    ) public override {
        if(msg.sender == slotAuth[tokenId].slotManager) {
            _setTokenURI(tokenId, newUri) ;
            emit SlotUriUpdated(tokenId, msg.sender, newUri) ;
        }
        else console.log("unauthorised");
    }

    function getSlotUri(uint256 tokenId, address slotManagerAddr)
        public
        view
        override 
        returns (string memory){
            return tokenURI(tokenId);
        }
    
    function viewAuthorizedSlot(uint256 tokenId)public view returns(managers memory){
        //non restricted retreival
        return(slotAuth[tokenId]) ;

    }



    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _devide721 () external {
        //the function devides the existing 721s into erc 20s. the fractional number is in the input.
        //once the number is fixed it cannot be reverted
        //the owner of set of fractional nfts erc 20s can join them if owned_nuber >= scattered_number

    }

    function mint_721(address _minter) external
    {
        //this function mints the fractional ERCs into 1 721 nft.
        //In the process all the erc20 will be burned ammounting up to One-721, which was initially stated.
        //the combined NFT will be minted to the given address
    }

    //insertLinks performs insertion operation on the hash table
    //do not expose the function to public.
    function insertLink(hLinkStructure memory uri, address slotManagerAddr, uint256 tokenID) internal {
        //console.log("did nothing") ;

        hLinkArtist[tokenID][slotManagerAddr].push(uri);

        /*
        
        */
    }

    //delete link must be implemented with fast runtime
    function deleteLink(hLinkStructure memory uri, address slotManagerAddr, uint256 tokenID) internal {
        console.log("did nothing") ;
        delete hLinkArtist[tokenID][slotManagerAddr] ;
        hLinkArtist[tokenID][slotManagerAddr].push(uri) ;

        //This does not feel right. LOOK INTO IT!!!

    }

    //Implement hyperlink seperately
    //store hlinks on the chain itself
    function addHyperLinkArtist(hLinkStructure memory hURI, uint256 tokenID, bool update, hLinkStructure memory newURI) public {
        //check if slotManager is already present in the hash table
        
        //if slotManager or he is the artist perform ops
        if(slotAuth[tokenID].slotManager == msg.sender || creatorAddress == msg.sender  ) {
            //if update == false call add function
            if(!update) {
                insertLink(hURI, msg.sender, tokenID) ;
            }


            //else call delete + add 
            else {
                deleteLink(hURI, msg.sender, tokenID) ;
                insertLink (newURI, msg.sender, tokenID) ;
            }

        }
    }

    function addHyperLinkOwner(hLinkStructure memory hURI, uint256 tokenID, bool update, hLinkStructure memory newURI) public {
        //check if slotManager is already present in the hash table
        
        //if slotManager or he is the artist perform ops
        if(slotAuth[tokenID].slotManager == msg.sender || ownerOf(tokenID) == msg.sender  ) {
            //if update == false call add function
            if(!update) {
                insertLink(hURI, msg.sender, tokenID) ;
                //all_owners.push(msg.sender);
                allLinks[tokenID].artOwner.push(msg.sender) ;
                allLinks[tokenID].artProvanance.push(hURI) ;
                emit addedProvanance(tokenID, msg.sender, allLinks[tokenID]) ;

            }


            //else call delete + add 
            else {
                deleteLink(hURI, msg.sender, tokenID) ;
                allLinks[tokenID].artOwner.push(msg.sender) ;
                allLinks[tokenID].artProvanance.push(hURI) ;
                emit addedProvanance(tokenID, msg.sender, allLinks[tokenID]) ;
            }

        }
    }

    //Retrieve HLinks from the dtrorage
    //Must return all in general. Yet special cases are to be considered. Therefore "only" specific Links must also be retrieved
    function retreiveAssetLink(uint256 tokenID) public view returns(Links memory){
        return allLinks[tokenID] ;

    }



    function retreiveprovananceLink(uint256 tokenID) public view returns(hLinkStructure[] memory){
        
        return hLinkOwners[tokenID][creatorAddress] ;

    }

    function retrieveSimple(uint tokenID) public view returns(string memory){
        string memory simp;
        for (uint256 i=0; i < allLinks[tokenID].artProvanance.length; i++) 
        {
            //simp += allLinks[tokenID].artProvanance[i].link;
            simp = string.concat(simp, " ", allLinks[tokenID].artProvanance[i].link);
        }
        return simp;
    }

    /*

    function retrieveSpecific(uint256 tokenID, string memory _name) public view returns(string memory) {
        //string memory links;
        //string memory linkName;
        //linkName = hLinkOwners[tokenID][msg.sender].name ;
        if( compareStrings(hLinkOwners[tokenID][msg.sender][:].name, _name )) {
            return hLinkOwners[tokenID][msg.sender].name ;
        }
        else return "";



    }
    */

}



