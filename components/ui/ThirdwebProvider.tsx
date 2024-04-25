//import { createThirdwebClient, getContract } from "thirdweb";
//import { sepolia } from "thirdweb/chains";

// create the client with your clientId, or secretKey if in a server environment
//const client = createThirdwebClient({ 
 // clientId: "YOUR_CLIENT_ID"
 //});

// connect to your contract
//const contract = getContract({ 
//  client, 
//  chain: sepolia, 
//  address: "0x41016f9b0896b26911F7f45411ffbC143F21E848"
//});

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ABI } from "./we3_interface";
 
const sdk = new ThirdwebSDK("sepolia", {
  secretKey: "YOUR_SECRET_KEY",
});

(async () => {
    const contract = await sdk.getContract("0x41016f9b0896b26911F7f45411ffbC143F21E848", ABI);
    // Use the contract here...

    //prepare the signature
        
    const tx = await contract.prepare("addHLinkArtist", [args]);
      
      const encoded = await tx.encode(); // Encode the transaction
      const gasCost = await tx.estimateGasCost(); // Estimate the gas cost
      const simulatedTx = await tx.simulate(); // Simulate the transaction
      const signedTx = await tx.sign(); // Sign the transaction for later use
      
      // Submit the transaction, but don't wait for confirmations
      const sentTx = await tx.send();
      console.log("Submitted transaction:", sentTx.hash);
      


  })();

