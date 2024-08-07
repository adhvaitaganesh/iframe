/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useState } from "react";
import { Check } from "@/components/icon";
import {
  Tabs,
  TabPanel,
  MediaViewer,
  ExternalLink,
  DropdownMenu,
  Disclaimer
} from "@/components/ui";
import Page from "@/components/ui/twitter";
import { TbaOwnedNft } from "@/lib/types";
import useSWR from "swr";
import { getAlchemy } from "@/lib/clients";
import { ethers } from "ethers";
import { useGetTokenBalances } from "@/lib/hooks";
import { getEtherscanLink, shortenAddress } from "@/lib/utils";
import { chainIdToOpenseaAssetUrl } from "@/lib/constants";
import { Tweet } from 'react-tweet' ;
//import {myContract} from "@/components/ui/we3_interface"
import Web3 from "web3";
import { useAddress, ConnectWallet,ThirdwebProvider, useContract, useContractRead } from "@thirdweb-dev/react";
import { useActiveAccount, ConnectButton, ThirdwebProvider as ThirdwebV5 } from "thirdweb/react";
import {addManager, retreiveAssetLink, Retrieve, Managers, addProvanance} from "@/components/interface_sc/addManagers";
import { add } from "lodash";
import styles from "@/styles/Home.module.css";
import {mrkdAbilite} from "@/lib/abi";
import sdk from '@thirdweb-dev/sdk';
import Example, { Embed } from "@/components/ui/connectButton";
import {createWallet, inAppWallet} from 'thirdweb/wallets'
import { createThirdwebClient } from "thirdweb";
import Links from "@/components/interface_sc/retrieveLink";
import SignIn from "@/components/test-jaime/testhtml";

//import { sepolia } from "thirdweb/chains";

//call add hLinkArtist from we3_interface
//myContract.methods.hLinkArtist().call().then(console.log);

//call add hLinkOwner from we3_interface
//myContract.methods.hLinkOwner().call().then(console.log);

//read the wallet address from the the thirdweb provider

//const address = useAddress();
 

export const TABS = {
  COLLECTIBLES: "Collectibles",
  ASSETS: "Assets",
  TEST : "Test Tab",
  LINKS: "Provenance",
  MANAGE: "Manage",
  //MANAGE2: "Manage2",
};

interface CopyAddressProps {
  account: string;
  displayedAddress: string;
}

//const address = useAddress();

const CopyAddress = ({ account, displayedAddress }: CopyAddressProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="inline-block rounded-2xl bg-[#F6F8FA] px-4 py-2 text-xs font-bold text-[#666D74] hover:cursor-pointer"
      onClick={() => {
        const textarea = document.createElement("textarea");
        textarea.textContent = account;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();

        try {
          document.execCommand("copy"); // Security exception may be thrown by some browsers.
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);

          return;
        } catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }}
    >
      {copied ? (
        <span>
          <Check />
        </span>
      ) : (
        shortenAddress(displayedAddress)
      )}
    </div>
  );
};

interface Props {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
  accounts?: string[];
  handleAccountChange?: (account: string) => void;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
  contractAddress: string;
}


export const Panel1 = ({
  className,
  approvalTokensCount,
  account,
  accounts,
  handleAccountChange,
  tokens,
  title,
  chainId,
  contractAddress,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);

  const displayedAddress = account;

  const address = useActiveAccount();

  
  //const contract = await sdk.getContract(contractAddress, mrkdAbilite);



  const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
    const alchemy = getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(accountAddress, "latest");
    return ethers.utils.formatEther(balance);
  });

  const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, chainId);
  const etherscanLink = getEtherscanLink({ chainId, address: account });
  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];
  const client = createThirdwebClient({ clientId : "af117edac9ee7c4bbc0bfdc81dc3eeb8" });

  return (
    <>
    <div
      className={clsx(
        className,
        "custom-scroll h-full space-y-3 overflow-y-auto rounded-t-xl border-t-0 bg-white px-5 pt-5"
      )}
    >
      <div className="mb-4 flex w-full items-center justify-center">
        <div className="h-[2.5px] w-[34px] bg-[#E4E4E4]"></div>
      </div>
      <h1 className="text-base font-bold uppercase text-black">{title}</h1>
      {account && displayedAddress && (
        <div className="flex items-center justify-start space-x-2">
          <DropdownMenu
            options={accounts}
            currentOption={account}
            setCurrentOption={handleAccountChange}
          >
            <CopyAddress account={account} displayedAddress={displayedAddress} />
          </DropdownMenu>
          <ExternalLink className="h-[20px] w-[20px]" link={etherscanLink} />
          <ExternalLink className="h-[20px] w-[20px]" link= "https://www.kezi-ban.com/" />
          <ExternalLink className="h-[20px] w-[20px]" link={etherscanLink} />
        </div>
      )}
      {approvalTokensCount ? (
        <Disclaimer
          message={`There are existing approvals on (${approvalTokensCount}) tokens owned by this account. Check approval status on tokenbound.org before purchasing.`}
        />
      ) : null}
      {typeof account === "string" && accounts && account === accounts[1] && (
        <Disclaimer message="Migrate your assets to V3 account for latest features." />
      )}
      <Tabs 
        tabs={Object.values(TABS)}
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />
      <TabPanel value={TABS.COLLECTIBLES} currentTab={currentTab}>
        {tokens && tokens.length ? (
          <ul className="custom-scroll grid grid-cols-3 gap-2 overflow-y-auto">
            {tokens.map((t, i) => {
              let media = t?.media[0]?.gateway || t?.media[0]?.raw;
              const isVideo = t?.media[0]?.format === "mp4";
              if (isVideo) {
                media = t?.media[0]?.raw;
              }

              const openseaUrl = `${chainIdToOpenseaAssetUrl[chainId]}/${t.contract.address}/${t.tokenId}`;

              return (
                <li key={`${t.contract.address}-${t.tokenId}-${i}`} className="list-none">
                  <a href={openseaUrl} target="_blank" className="cursor-pointer">
                    <MediaViewer url={media} isVideo={isVideo} />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-center text-sm text-gray-500">No collectibles found</p>
          </div>
        )}
      </TabPanel>
      <TabPanel value={TABS.ASSETS} currentTab={currentTab}>
        <div className="flex w-full flex-col space-y-3">
          <div className="flex w-full items-center justify-between ">
            <div className="flex items-center space-x-4">
              <img src="/ethereum-logo.png" alt="ethereum logo" className="h-[30px] w-[30px]" />
              <div className="text-base font-medium text-black">Ethereum</div>
            </div>
            <div className="text-base text-[#979797]">
              {ethBalance ? Number(ethBalance).toFixed(2) : "0.00"}
            </div>
          </div>
          {tokenBalanceData?.map((tokenData, i) => (
            <div className="flex items-center justify-between" key={i}>
              <div className="flex items-center space-x-4">
                {tokenData.logo ? (
                  <img src={tokenData.logo} alt="coin logo" className="h-[30px] w-[30px]" />
                ) : (
                  <div className="text-3xl">💰</div>
                )}
                <div className="text-base font-medium text-black">{tokenData.name || ""}</div>
              </div>
              <div className="text-base text-[#979797]">{tokenData.balance}</div>
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel value={TABS.LINKS} currentTab={currentTab}>
      <ConnectButton client={client} wallets={wallets} />

        <div className="container">
          <div className="flexx-left">
            <h1>Artist Provanance:</h1>
            <div>{addProvanance(contractAddress)}</div>
          </div>
        </div>

      <Links tokenId= {"1"} contractAdd = {contractAddress} /> 
      
      </TabPanel>

      <TabPanel value={TABS.MANAGE} currentTab={currentTab}>
        
      <ConnectButton client={client} wallets={wallets} />

          
      <div className="container">
        <div className="flexx-left">
          <h1>Your Managers:</h1>
          <div>{addManager(contractAddress)}</div>
        </div>
      </div>

      <Managers tokenId={'1'} contractAdd={contractAddress}/>

      </TabPanel>

      <TabPanel value={TABS.TEST} currentTab={currentTab}>
        <SignIn>
        </SignIn> 
      </TabPanel>




    </div>
    </>
  );
};


export const Panel = (props: Props) => {
  return (
    <ThirdwebProvider
          clientId="af117edac9ee7c4bbc0bfdc81dc3eeb8"
          activeChain="sepolia"
        >
          <ThirdwebV5>
      <Panel1 {...props}/>
          </ThirdwebV5>

    </ThirdwebProvider>
  );
};

