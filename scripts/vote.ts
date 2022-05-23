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
  const ballotAddress = process.argv[2];
  const ballotContract: CustomBallot = await getBallotContract(
    ballotAddress,
    signer
  );
  const tokenAdress = "0x812F81c7f4bC0108a12415eE8f788a664E2b0E89";
  const tokenContract = await getTokenContract(tokenAdress, signer);

  console.log(
    `get votes: ${await tokenContract.getVotes(
      "0xdEd21B76F5B84e28eB3a13346A466d0eF1D21835"
    )}`
  );
  console.log(`get votingPower: ${await ballotContract.votingPower()}`);
  const BASE_VOTE_POWER = 10;
  const voteAmount = ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18));
  const voteTx = await ballotContract.vote(1, voteAmount);
  console.log(`voteTx: ${voteTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
