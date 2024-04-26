"use client";

import { useCallMethod } from "@/hooks/useCallMethod";
import { usePoll } from "@/hooks/usePoll";
import { sendStaticCall } from "@/utils/facet/contracts";
import {
  formatTimestamp,
  formatTokenValue,
  truncateMiddle,
} from "@/utils/formatter";
import { Button } from "@0xfacet/component-library";
import { Input, Label } from "@0xfacet/component-library/ui";
import { useCallback, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Timer } from "./timer";
import Link from "next/link";

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS!;

export const BuyShares = () => {
  const { isConnected, address } = useAccount();
  const { callMethod } = useCallMethod();
  const [maxSupply, setMaxSupply] = useState(BigInt(0));
  const [tokensForPresale, setTokensForPresale] = useState(BigInt(0));
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [ownedShares, setOwnedShares] = useState(BigInt(0));
  const [totalShares, setTotalShares] = useState(BigInt(0));
  const [presaleEndTime, setPresaleEndTime] = useState(0);

  const getOwnedShares = useCallback(async () => {
    const [
      ownedSharesRes,
      totalSharesRes,
      presaleEndTimeRes,
      maxSupplyRes,
      tokensForPresaleRes,
    ] = await Promise.all([
      sendStaticCall(tokenAddress, "shares", [address]),
      sendStaticCall(tokenAddress, "totalShares"),
      sendStaticCall(tokenAddress, "presaleEndTime"),
      sendStaticCall(tokenAddress, "maxSupply"),
      sendStaticCall(tokenAddress, "tokensForPresale"),
    ]);
    setOwnedShares(BigInt(ownedSharesRes));
    setTotalShares(BigInt(totalSharesRes));
    setPresaleEndTime(
      presaleEndTimeRes !== "0" ? Number(presaleEndTimeRes) * 1000 : 0
    );
    setMaxSupply(BigInt(maxSupplyRes));
    setTokensForPresale(BigInt(tokensForPresaleRes));
  }, [address]);

  usePoll(getOwnedShares, 5000);

  const getCountdownString = useCallback(() => {
    const endDate = new Date(presaleEndTime);
    let countdownString = null;
    if (Date.now() < endDate.getTime()) {
      countdownString = (
        <div className="border border-green-500 bg-green-950 px-2 py-1 rounded-md">
          Ends {formatTimestamp(endDate.toISOString())}
        </div>
      );
    } else if (endDate.getTime() > 0) {
      countdownString = (
        <div className="border border-red-500 bg-red-950 px-2 py-1 rounded-md">
          Ended {formatTimestamp(endDate.toISOString())}
        </div>
      );
    }
    return countdownString;
  }, [presaleEndTime]);

  const buyShares = async () => {
    const parsedEthAmount = parseEther(buyAmount);
    // this will do two things
    // 1) it will wrap enough ETH to FETH
    // 2) it will then call the token contract
    await callMethod(
      tokenAddress,
      "buyShares",
      [
        // args sent to buyShares after wrapped
        address, // recipient of shares
        parsedEthAmount.toString(), // amount of shares to buy with FETH
      ],
      parsedEthAmount // amount to wrap to FETH
    );
  };

  const sellShares = async () => {
    const parsedEthAmount = parseEther(sellAmount);
    // this will sell their shares for FETH
    // they will need to manually unwrap FETH to ETH
    await callMethod(
      tokenAddress,
      "sellShares",
      [parsedEthAmount.toString()]
      // no value here since no wrapping is needed
    );
  };

  const claimTokens = async () => {
    await callMethod(
      tokenAddress,
      "claimTokens"
      // no value here since no args are needed
    );
  };

  if (!tokenAddress) {
    return (
      <div className="border border-red-500 bg-red-950 px-2 py-1 rounded-md">
        Missing process.env.NEXT_PUBLIC_TOKEN_ADDRESS
      </div>
    );
  }
  if (!isConnected) return null;
  if (!presaleEndTime) {
    return <div>Presale has not started</div>;
  }

  const presalePercentage = Math.round(
    (Number(formatEther(tokensForPresale)) / Number(formatEther(maxSupply))) *
      100
  );
  const teamSupply = maxSupply - tokensForPresale * BigInt(2);
  const teamPercentage = 100 - presalePercentage * 2;

  const tokensPerShare =
    totalShares > 0 ? tokensForPresale / totalShares : BigInt(0);
  const tokensToClaim = ownedShares * tokensPerShare;

  return (
    <div className="flex flex-col gap-4">
      <Timer render={getCountdownString} />
      <div>
        {"Token Contract: "}
        <Link
          target="_blank"
          href={`https://sepolia.facetscan.com/address/${tokenAddress}`}
          className="text-white"
        >
          {truncateMiddle(tokenAddress, 8, 8)}
        </Link>
      </div>
      <div>
        <div>Max Supply: {formatTokenValue(maxSupply, 18, true)}</div>
        <div>
          For Presale: {formatTokenValue(tokensForPresale, 18, true)} (
          {presalePercentage}%)
        </div>
        <div>
          For LP: {formatTokenValue(tokensForPresale, 18, true)} (
          {presalePercentage}%)
        </div>
        <div>
          For Team: {formatTokenValue(teamSupply, 18, true)} ({teamPercentage}%)
        </div>
      </div>
      <div>
        <div>Shares = ETH Contributed</div>
        <div>Owned: {formatTokenValue(ownedShares, 18, true)} Shares</div>
        <div>Total: {formatTokenValue(totalShares, 18, true)} Shares</div>
      </div>
      {presaleEndTime > Date.now() ? (
        <>
          <div className="flex flex-col gap-2">
            <Label>Amount in ETH:</Label>
            <div className="flex flex-row gap-2">
              <Input onChange={(e) => setBuyAmount(e.target.value)} />
              <Button onClick={buyShares}>Buy Shares</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Amount in ETH:</Label>
            <div className="flex flex-row gap-2">
              <Input onChange={(e) => setSellAmount(e.target.value)} />
              <Button onClick={sellShares}>Sell Shares</Button>
            </div>
            <div className="text-gray-500 text-xs">
              You will receive FETH after selling your shares.{" "}
              <Link
                target="_blank"
                href="https://sepolia.facetswap.com/wrap"
                className="text-white"
              >
                Click here
              </Link>{" "}
              to unwrap your FETH to ETH.
            </div>
          </div>
        </>
      ) : (
        <div>
          <Button onClick={claimTokens}>
            Claim {formatTokenValue(tokensToClaim, 18, true)} Tokens
          </Button>
        </div>
      )}
    </div>
  );
};
