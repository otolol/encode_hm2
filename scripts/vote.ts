import { ethers } from "ethers";
import { CustomBallot } from "../typechain";
import { getBallotContract, getSigner, getTokenContract } from "./helpers";
import { EXPOSED_KEY } from "./key";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  const signer = await getSigner(wallet);

  if (process.argv.length < 3) {
    throw new Error("Ballot address missing");
  }

  if(process.argv.length < 4) {
    throw new Error("Vote weight is missing");
  }

  const ballotAddress = process.argv[2];
  const voteWeight = Number(process.argv[3])
  const ballotContract: CustomBallot = await getBallotContract(
    ballotAddress,
    signer
  );
  
  console.log(`get votingPower: ${await ballotContract.votingPower()}`);
  const voteAmount = ethers.utils.parseEther(voteWeight.toFixed(18));
  const voteTx = await ballotContract.connect(signer).vote(1, voteAmount);
  await voteTx.wait()
  console.log(`voteTx: ${voteTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
