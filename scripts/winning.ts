import { ethers } from "ethers";
import { getBallotContract, getSigner } from "./helpers";
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
  const ballotContract = await getBallotContract(ballotAddress, signer);
  const winningTx = await ballotContract.winnerName();
  const converted = ethers.utils.parseBytes32String(winningTx);
  console.log(`Winning Proposal is: ${converted}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
