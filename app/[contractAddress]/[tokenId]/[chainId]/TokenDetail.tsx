import { Variants, motion } from "framer-motion";
import { GalverseLogo, TokenboundLogo} from "@/components/icon";
import { MrkdLogo } from "@/components/icon/MrkdLogo";
import { signature } from "@/components/icon/signature";
import { signature2 } from "@/components/icon/signature2";
import { Panel } from "./Panel";
import { TbaOwnedNft } from "@/lib/types";
//import { ThirdwebWallet } from "@/components/ui/ThirdwebProvider" ;
//import { ConnectWallet } from "@thirdweb-dev/react";
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";
import { artino } from "@/components/icon/artino";
import {jm} from "@/components/icon/jm";
import { vg } from "@/components/icon/vg";


interface Props {
  className?: string;
  isOpen: boolean;
  handleOpenClose: (arg0: boolean) => void;
  approvalTokensCount?: number;
  account?: string;
  accounts?: string[];
  handleAccountChange: (arg0: string) => void;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
  logo?: string;
  contractAddress: string;
}

export default function App() {
  return (
    ""
  );
}

const variants = {
  closed: { y: "100%", transition: { duration: 0.75 } },
  open: { y: "0", transition: { duration: 0.75 }, height: "85%" },
} as Variants;

const iconVariant = {
  hover: {
    opacity: 1,
    boxShadow: "0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  unHovered: {
    opacity: 0.7,
    boxShadow: "none",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

type LogoType = {
  [logo: string]: any;
};

const Logo: LogoType = {
  DEFAULT: signature2,
  GALVERSE: GalverseLogo,
  MRKD : MrkdLogo,
  SIGN : signature,
  S2 : signature2,
  ARTINO : artino,
  JM : jm,
  VG: vg,
};

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
  accounts,
  handleAccountChange,
  tokens,
  title,
  chainId,
  logo,
  contractAddress,
}: Props) => {
  let currentAnimate = isOpen ? "open" : "closed";

  const CustomLogo = logo ? Logo[logo.toUpperCase()] : Logo["DEFAULT"];

  return (
    <div className={className}>
      <motion.div
        className="absolute left-1 top-1 z-10 rounded-full cursor-pointer"
        whileHover="hover"
        variants={iconVariant}
        initial="unHovered"
      >
        <CustomLogo onClick={() => handleOpenClose(!isOpen)} />
        
      </motion.div>


      {isOpen && (
        <motion.div
          className={`custom-scroll absolute bottom-0 z-10 w-full max-w-[1080px] overflow-y-auto`}
          animate={currentAnimate}
          variants={variants}
          initial="closed"
        >
          <Panel
            approvalTokensCount={approvalTokensCount}
            account={account}
            tokens={tokens}
            title={title}
            chainId={chainId}
            accounts={accounts}
            handleAccountChange={handleAccountChange}
            contractAddress={contractAddress}
          />
        </motion.div>
      )}
    </div>
  );
};


/*
<motion.div
        className="absolute right-4 top-4 z-10 rounded-full cursor-pointer"
        whileHover="hover"
        variants={iconVariant}
        initial="unHovered"
      >

      <ThirdwebProvider
      activeChain="sepolia"
      clientId="af117edac9ee7c4bbc0bfdc81dc3eeb8"
      //locale={en()}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        localWallet(),
        embeddedWallet({
          auth: {
            options: [
              "email",
              "google",
              "apple",
              "facebook",
            ],
          },
        }),
      ]}
      authConfig={{
        authUrl: "/api/auth",
        domain: "https://mrkd.art",
      }}
    >
      <ConnectWallet
        theme={"dark"}
        switchToActiveChain={true}
        auth={{ loginOptional: true }}
        modalSize={"wide"}
      />
    </ThirdwebProvider> 
  </motion.div>
*/