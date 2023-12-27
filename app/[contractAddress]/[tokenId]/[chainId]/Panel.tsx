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
  Disclaimer,
} from "@/components/ui";
import { TbaOwnedNft } from "@/lib/types";
import useSWR from "swr";
import { getAlchemy } from "@/lib/clients";
import { ethers } from "ethers";
import { useGetTokenBalances } from "@/lib/hooks";
import { getEtherscanLink, shortenAddress } from "@/lib/utils";
import { chainIdToOpenseaAssetUrl } from "@/lib/constants";

export const TABS = {
  COLLECTIBLES: "Collectibles",
  ASSETS: "Assets",
  SOCIAL: "Socials",
};

interface CopyAddressProps {
  account: string;
  displayedAddress: string;
}

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
}

export const Panel = ({
  className,
  approvalTokensCount,
  account,
  accounts,
  handleAccountChange,
  tokens,
  title,
  chainId,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);

  const displayedAddress = account;

  const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
    const alchemy = getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(accountAddress, "latest");
    return ethers.utils.formatEther(balance);
  });

  const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, chainId);
  const etherscanLink = getEtherscanLink({ chainId, address: account });

  return (
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
      <TabPanel value={TABS.SOCIAL} currentTab={currentTab}>
        
        <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Another amazing event hosted by the inspiring <a href="https://twitter.com/hashtag/NFT?src=hash&amp;ref_src=twsrc%5Etfw">#NFT</a> <a href="https://twitter.com/hashtag/web3?src=hash&amp;ref_src=twsrc%5Etfw">#web3</a> badass <a href="https://twitter.com/emmajane1313?ref_src=twsrc%5Etfw">@emmajane1313</a> from <a href="https://twitter.com/DIGITALAX_?ref_src=twsrc%5Etfw">@DIGITALAX_</a>. Thank you @lume_studios for opening up your space to so many creatives. <a href="https://t.co/6qXLJl6vzy">pic.twitter.com/6qXLJl6vzy</a></p>&mdash; KEZI BAN (@kezi__ban) <a href="https://twitter.com/kezi__ban/status/1494747522367119361?ref_src=twsrc%5Etfw">February 18, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        
        
        <blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">Went to such an inspiring and 🤯🤯🤯meetup last night with the one and only <a href="https://twitter.com/emmajane1313?ref_src=twsrc%5Etfw">@emmajane1313</a> from <a href="https://twitter.com/DIGITALAX_?ref_src=twsrc%5Etfw">@DIGITALAX_</a> She is beyond knowledgeable about all things <a href="https://twitter.com/hashtag/web3?src=hash&amp;ref_src=twsrc%5Etfw">#web3</a> <a href="https://twitter.com/hashtag/nft?src=hash&amp;ref_src=twsrc%5Etfw">#nft</a> <a href="https://twitter.com/hashtag/crypto?src=hash&amp;ref_src=twsrc%5Etfw">#crypto</a> <a href="https://twitter.com/hashtag/Ethereum?src=hash&amp;ref_src=twsrc%5Etfw">#Ethereum</a> <br>Thank you for the education. I need to crawl inside your brain. <a href="https://t.co/ZGUP3sqiW6">pic.twitter.com/ZGUP3sqiW6</a></p>&mdash; KEZI BAN (@kezi__ban) <a href="https://twitter.com/kezi__ban/status/1492205338153697285?ref_src=twsrc%5Etfw">February 11, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        
      </TabPanel>
    </div>
  );
};
