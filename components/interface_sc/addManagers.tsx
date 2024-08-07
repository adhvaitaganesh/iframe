import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { Web3Button, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { TransactionButton, useReadContract } from 'thirdweb/react';
import { CONTRACT_ADDRESS } from '@/lib/constants/hnft';
import { link } from 'fs';
import { mrkdAbi, mrkdAbilite } from '@/lib/abi';
import Web3 from 'web3';
import contractInstance from '../ui/ThirdwebProvider';
import getWeb3 from '../ui/we3_interface';
// Remove the duplicate import statement
// import {addHLinkArt}  from './thirdwebetc';
//import { ThirdwebSDK } from "@thirdweb-dev/sdk";
//import { ABI } from "../ui/we3_interface" ;
 
/*const sdk = new ThirdwebSDK("sepolia", {
  secretKey: "_ElbDd0SJdQytq0vn39ZRXgRATmzOk3JEmt0vM-tFzxf9-uTnAmWF65nM7IFwV3bGC8-Xtyjay4SrLJofrOcjQ",

});*/

import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { getContract } from 'thirdweb';
//import { addHLinkArt } from './thirdwebetc';

//const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/13a7a20ef13c4250846a6d038df8df36'));



export function addManager(contractAdd: string ) {
    const [addManagers, setAddManagers] = useState(true);
    const [managers, setManagers] = useState("");
    const [tokenID, setTokenID] = useState("");
    const [name, setName] = useState("");

    function resetForm() {
        //setAddManagers(false);
        setManagers("");
        setTokenID("0");
        setName("");
    }

    const contract = contractInstance(contractAdd) ;

    
    return (
        <div>
            {addManagers ? (
                <button
                    className= {styles.buttonClass}
                    onClick={() => setAddManagers(false)}
                >Add managers</button>

            ):(
                <div className={styles.addContactContainer}>
                    <div className= {styles.addContactCard}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setAddManagers(true)}
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
                                const tx = prepareContractCall({
                                    contract,
                                    method: "authorizeSlotTo",
                                    params: [BigInt(tokenID), name, managers],
                                })
                                return tx;
                            }}

                            onClick={() => console.log('clicked')}

                            onTransactionSent={(result) =>
                                console.log("Transaction submitted", result.transactionHash)
                            }
                            onTransactionConfirmed={(receipt) =>
                                {console.log("Transaction confirmed", receipt.transactionHash);
                                resetForm();
                                setAddManagers(false);
                                alert(receipt.transactionHash);}
                            }
                            onError={(error) =>
                                console.error("Transaction error", error)
                            }





                        >
                            Add manager
                        </TransactionButton>
                    </div>
                </div>

            )}


        </div>
    );
    }
    export function retreiveAssetLink(contractAdd: string) {

        const [retrieved, setretrieved] = useState(false);
        const [tokenId, settokenId] = useState("") ;

        function resetForm() {
            settokenId("")
        }

        const contract = contractInstance(contractAdd) ;

        const MyComponent = (tokenId: string) => {
            const { data, isLoading } = useReadContract({
              contract,
              method: "retreiveprovananceLink",
              params: [BigInt(tokenId)],
            });
          };


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

                        <button
                            onClick={() => {
                                const {data, isLoading} = useReadContract({
                                    contract,
                                    method: "retreiveprovananceLink",
                                    params: [BigInt(tokenId)]
                                });
                                { data? alert(data) : alert(data)}
                            }}
                        >
                            retieve provanancce    
                        </button>    

                    
                    </div>
                </div>
            )}
    </div>


    );}


    type RetrieveProps = {
        tokenId: string;
        contractAdd: string;
      };

    
    
        type ArtProvananceType = [string, string, string, string];

        type DataType = {
        [key: string]: [
            string[], // array of addresses
            ArtProvananceType[] // array of ArtProvananceType tuples
        ];
        };
      


    export const Retrieve = ({tokenId, contractAdd} : RetrieveProps) => {

        /*const contract = contractInstance(contractAdd)

        const { data, isLoading } = useReadContract({
            contract,
            method: "retreiveAssetLink",
            params: [BigInt(tokenId)],
        });
        */

        const contract = getWeb3(contractAdd);

        /*const d = async () => {
            const data = await contract.methods.retreiveAssetLink(tokenId).call();
            return data;
        }

        const data = d();

        

        //create a button when clicked shoud execute the below statements
        const [isButtonClicked, setIsButtonClicked] = useState(false);

        const handleClick = () => {
            setIsButtonClicked(true);
            //alert(isLoading);
            alert(data);
        };

        return (
            <div className='text3xl'>
            <button className= {styles.buttonClass} onClick={handleClick}>Display Data</button>
            {isButtonClicked && data && Array.isArray(data) && data.map((item, index) => (
                <div key={index} className={styles.dataClass}>
                 {JSON.stringify(item)}
                </div>
            ))}
            {isButtonClicked && data (
                <div className={styles.dataClass}>
                 {JSON.stringify(data.artProvanance)}
                </div>
            )} 
            </div>
        ); */
        /*
        <p>Name: {item.artProvanance.name}</p>
                <p>Type: {item.artProvanance.typeOf}</p>
                <p>Description: {item.artProvanance.description}</p>
                <p>Link: {item.artProvanance.link}</p>*/ 
        
        
        
        
        /*async() => {

        return (
            <div className='text3xl'>
              {Array.isArray(data) && data.map((item, index) => (
                <div key={index}>
                  <p>Name: {item.name}</p>
                  <p>Type: {item.typeOf}</p>
                  <p>Description: {item.description}</p>
                  <p>Link: {item.link}</p>
                </div>
              ))}
            </div>
          );

        };
        */


        const [data, setData] = useState<DataType[]>([]);
        const [isButtonClicked, setIsButtonClicked] = useState(false);
      
        useEffect(() => {
          async function fetchData() {
            const result = await contract.methods.retreiveAssetLink(BigInt(tokenId)).call();
            if (Array.isArray(result)) {
                setData(result as DataType[]);
              } else {
                setData([]);
              }
          }
      
          fetchData();
        }, [tokenId]);
      
        const handleClick = () => {
          setIsButtonClicked(true);
          alert(data);
        };
      
        return (
            <div className='text3xl'>
            <button className={styles.buttonClass} onClick={handleClick}>Display Data</button>
            {isButtonClicked && data && data.map((item, index) => (
              <div key={index} className={styles.dataClass}>
                <div>{item.name}</div>
                <div>{JSON.stringify(item.artProvanance)}</div>
              </div>
            ))}
          </div>
        );

    };

    


    export const Managers = ({tokenId, contractAdd} : RetrieveProps) => {

        const contract = contractInstance(contractAdd)

        const { data, isLoading } = useReadContract({
            contract,
            method: "viewAuthorizedSlot",
            params: [BigInt(tokenId)],
        });

        //create a button when clicked shoud execute the below statements
        const [isButtonClicked, setIsButtonClicked] = useState(false);

        const handleClick = () => {
            setIsButtonClicked(true);
            //alert(isLoading);
            //alert(data);
        };

        return (
            <div className='text3xl'>
            <button className= {styles.buttonClass} onClick={handleClick}>Display Data</button>
            {isButtonClicked && 
                <div className={styles.dataClass}>
                {data?.name} : {data?.slotManager}
                </div>
            }
            </div>
        );

    };

        
    





export function addProvanance(contractAdd: string) {
    const [addHLink, setAddHLink] = useState(true);
    const [tokenID, setTokenID] = useState("");
    const [_name, set_Name] = useState("");
    const [typeOf, setTypeOf] = useState("");
    const [description, setDescription] = useState("");
    const [uri, setUri] = useState("");

    const contract = contractInstance(contractAdd) ;


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
                    className= {styles.buttonClass}
                    onClick={() => setAddHLink(false)}
                >Add Your Provanance</button>

            ):(
                <div className={styles.addContactContainer}>
                    <div className= {styles.addContactCard}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setAddHLink(true)}
                        >Close</button>
                        <div className={styles.addContactForm}>
                            <h3>Add Provanance:</h3>
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


                        <TransactionButton
                            transaction={() => {
                                //prepare contract call
                                const tx = prepareContractCall({
                                    contract,
                                    method: "addHyperLinkOwner",
                                    params: [
                                        {
                                          name: _name,
                                          typeOf: typeOf,
                                          description: description,
                                          link: uri
                                        },
                                        BigInt(tokenID),
                                        false,
                                        {
                                          name: _name,
                                          typeOf: typeOf,
                                          description: description,
                                          link: uri
                                        }
                                      ],
                                })
                                return tx;
                            }}

                            onClick={() => console.log('clicked')}

                            onTransactionSent={(result) =>
                                console.log("Transaction submitted", result.transactionHash)
                            }
                            onTransactionConfirmed={(receipt) =>
                                {console.log("Transaction confirmed", receipt.transactionHash);
                                resetForm();
                                setAddHLink(false);
                                alert(receipt.transactionHash);}
                            }
                            onError={(error) =>
                                console.error("Transaction error", error)
                            }





                        >
                            Add Provenance
                        </TransactionButton>
                    
                    
                    </div>
                </div>
            )}
    </div>
    );
}


//export default AddHLinkArtist;

