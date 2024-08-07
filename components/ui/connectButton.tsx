import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { ConnectEmbed } from "thirdweb/react";
const client = createThirdwebClient({ clientId : "af117edac9ee7c4bbc0bfdc81dc3eeb8" });
import { inAppWallet } from "thirdweb/wallets";

const Example = () => {
  const { connect, isConnecting, error } = useConnect();
  return (
    <button
      onClick={() =>
        connect(async () => {
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

          // return the wallet
          return metamask;
        })
      }
    >
      Connect
    </button>
  );
}

export const Embed = () => {

    const wallets = [
        inAppWallet(),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
      ];

      return (
        <div>
          <ConnectEmbed client={client} wallets={wallets} />
        </div>
      );

}

export const connectB = () => {

    const wallets = [
        inAppWallet(),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
      ];

      return (
        <div>
          <ConnectButton client={client} wallets={wallets} />
        </div>
      );

}

export default Example;
