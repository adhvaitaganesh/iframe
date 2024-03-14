import type { AppProps } from "next/app";
//import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import {
    ThirdwebProvider,
    rainbowWallet,
    metamaskWallet,
  } from "@thirdweb-dev/react";

const activeChain = "ethereum";

function ThirdwebWallet({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[rainbowWallet(), metamaskWallet()]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default ThirdwebWallet;
