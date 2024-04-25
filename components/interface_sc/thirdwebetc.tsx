import { getContract, prepareContractCall, toWei } from "thirdweb";
import { mrkdAbi } from "@/lib/abi";

import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const client = createThirdwebClient({ clientId: "af117edac9ee7c4bbc0bfdc81dc3eeb8" });
import { sendAndConfirmTransaction } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { Account } from "@thirdweb-dev/sdk";
//const wallet = useActiveWallet();



const metamask = createWallet("io.metamask"); // pass the wallet id

// if user has metamask installed, connect to it
if (injectedProvider("io.metamask")) {
  await metamask.connect({ client });
}

// open wallet connect modal so user can scan the QR code and connect
else {
  await metamask.connect({
    client,
    walletConnect: { showQrModal: true },
  });
} 



const contract = getContract({
  client,
	chain: sepolia,
  // The ABI for the contract is defined here
  address: "0x41016f9b0896b26911F7f45411ffbC143F21E848",
  abi: [
    {
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenID",
				"type": "uint256"
			}
		],
		"name": "retreiveprovananceLink",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "typeOf",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "link",
						"type": "string"
					}
				],
				"internalType": "struct MyToken.hLinkStructure",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
    {
		"inputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "typeOf",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "link",
						"type": "string"
					}
				],
				"internalType": "struct MyToken.hLinkStructure",
				"name": "hURI",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "tokenID",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "update",
				"type": "bool"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "typeOf",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "link",
						"type": "string"
					}
				],
				"internalType": "struct MyToken.hLinkStructure",
				"name": "newURI",
				"type": "tuple"
			}
		],
		"name": "addHyperLinkArtist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
],
});

const addHLinkArt =async () => {

	const metamask = createWallet("io.metamask"); // pass the wallet id

// if user has metamask installed, connect to it
	if (injectedProvider("io.metamask")) {
  	await metamask.connect({ client });
	}

// open wallet connect modal so user can scan the QR code and connect
	else {
  		await metamask.connect({
    		client,
    		walletConnect: { showQrModal: true },
  		});
	} 
	

	const wallet = useActiveAccount()


const tx = prepareContractCall({
  contract,
  // We get auto-completion for all the available functions on the contract ABI
  method: "addHyperLinkArtist",
  // including full type-safety for the params
  params: [ { name: "name", typeOf: "typeOf", description: "description", link: "link" }, 0, true, { name: "name", typeOf: "typeOf", description: "description", link: "link" } ],
});


const transactionReceipt = await sendAndConfirmTransaction({
  wallet,
  tx,
});

}

export default addHLinkArt;