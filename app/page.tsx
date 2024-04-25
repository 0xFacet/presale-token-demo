import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BuyShares } from "./buy-shares";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <ConnectButton />
      <BuyShares />
    </main>
  );
}
