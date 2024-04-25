import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { Web3Button, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { TransactionButton } from 'thirdweb/react';
import { CONTRACT_ADDRESS } from '@/lib/constants/hnft';
import { link } from 'fs';
import { mrkdAbi, mrkdAbilite } from '@/lib/abi';
import Web3 from 'web3';
// Remove the duplicate import statement
// import {addHLinkArt}  from './thirdwebetc';
//import { ThirdwebSDK } from "@thirdweb-dev/sdk";
//import { ABI } from "../ui/we3_interface" ;
 
/*const sdk = new ThirdwebSDK("sepolia", {
  secretKey: "_ElbDd0SJdQytq0vn39ZRXgRATmzOk3JEmt0vM-tFzxf9-uTnAmWF65nM7IFwV3bGC8-Xtyjay4SrLJofrOcjQ",

});*/

import { prepareContractCall } from "thirdweb";
import { getContract } from 'thirdweb';
//import { addHLinkArt } from './thirdwebetc';

//const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/13a7a20ef13c4250846a6d038df8df36'));



export function addManager(contractAdd: string ) {
    const [addManagers, setAddManagers] = useState(false);
    const [managers, setManagers] = useState("");
    const [tokenID, setTokenID] = useState("");
    const [name, setName] = useState("");

    function resetForm() {
        //setAddManagers(false);
        setManagers("");
        setTokenID("");
        setName("");
    }

    const contract = getContract()

    
    return (
        <div>
            {addManagers ? (
                <button
                    className= {styles.addContactTriggerbutton}
                    onClick={() => setAddManagers(true)}
                >Add managers</button>

            ):(
                <div className={styles.assContactContainer}>
                    <div className= {styles.addContactCard}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setAddManagers(false)}
                        >Close</button>
                        <div className={styles.addContactForm}>
                            <h3>Add Managers:</h3>
                            <input
                                type="text"
                                placeholder="Token ID"
                                value={tokenID}
                                onChange={(e) => setTokenID(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="0x00000"
                                value={managers}
                                onChange={(e) => setManagers(e.target.value)}
                            />

                        </div>
                        <TransactionButton
                            transaction={() => {
                                //prepare contract call

                            }}




                        >
                            Add manager
                        </TransactionButton>
                    </div>
                </div>

            )}


        </div>
    );
    }
    export function retreiveAssetLink(data: any) {

        const [retrieved, setretrieved] = useState(false);
        const [tokenId, settokenId] = useState("") ;

        function resetForm() {
            settokenId("")
        }


        return(
        <div>
            {retrieved ? (
                <button
                    className= {styles.addContactTriggerbutton}
                    onClick={() => setretrieved(true)}
                >Add hLinkArtist</button>

            ):(
                <div className={styles.assContactContainer}>
                    <div className= {styles.addContactCard}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setretrieved(false)}
                        >Close</button>
                        <div className={styles.addContactForm}>
                            <h3>Add hLinkArtist:</h3>
                            <input
                                type="text"
                                placeholder="Token ID"
                                value={tokenId}
                                onChange={(e) => settokenId(e.target.value)}
                            />
                        </div>
                        <Web3Button
                            contractAddress= {CONTRACT_ADDRESS}
                             
                            action = { () => data( {args: [tokenId]})}
                            
                            onSubmit={() => console.log("Transaction submitted")}
                            onSuccess={() => {
                                resetForm();
                                alert("hLinkArtist added successfully");
                                setretrieved(false);

                            }}
                            onError={(error) => alert("Something went wrong!")}

                        >Add hLinkArtist</Web3Button>
                    
                    
                    </div>
                </div>
            )}
    </div>


    );}

        
    





export function addHLinkArtist(contractAdd: string) {
    const [addHLink, setAddHLink] = useState(false);
    const [tokenID, setTokenID] = useState("");
    const [_name, set_Name] = useState("");
    const [typeOf, setTypeOf] = useState("");
    const [description, setDescription] = useState("");
    const [uri, setUri] = useState("");


    //

    function resetForm() {
        //setAddManagers(false);
        setTokenID("");
        set_Name("");
        setTypeOf("");
        setDescription("");
        setUri("");

        //setName("");
    }

    return (
        <div>
            {addHLink ? (
                <button
                    className= {styles.addContactTriggerbutton}
                    onClick={() => setAddHLink(true)}
                >Add hLinkArtist</button>

            ):(
                <div className={styles.assContactContainer}>
                    <div className= {styles.addContactCard}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setAddHLink(false)}
                        >Close</button>
                        <div className={styles.addContactForm}>
                            <h3>Add hLinkArtist:</h3>
                            <input
                                type="text"
                                placeholder="Token ID"
                                value={tokenID}
                                onChange={(e) => setTokenID(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                value={_name}
                                onChange={(e) => set_Name(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Type"
                                value={typeOf}
                                onChange={(e) => setTypeOf(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="URI"
                                value={uri}
                                onChange={(e) => setUri(e.target.value)}
                            />

                        </div>


                        <Web3Button
                            contractAddress= {contractAdd}
                            contractAbi={mrkdAbi}
                             
                            action = { async () => {await addHLinkArt()}}
                            
                            onSubmit={() => console.log("Transaction submitted")}
                            onSuccess={() => {
                                resetForm();
                                alert("hLinkArtist added successfully");
                                setAddHLink(false);

                            }}
                            onError={(error) => alert(error)}

                        >Add hLinkArtist</Web3Button>
                    
                    
                    </div>
                </div>
            )}
    </div>
    );
}


//export default AddHLinkArtist;

