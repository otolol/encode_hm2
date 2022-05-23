import { ethers } from "ethers";
import { getSigner, getTokenContract } from "./helpers";
import { EXPOSED_KEY } from "./key";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  const signer = await getSigner(wallet);
  if (process.argv.length < 3) {
    throw new Error("Token address missing");
  }
  if(process.argv.length < 4) {
    throw new Error("Delegate adress missing");
  }

  const tokenAdress = process.argv[2];
  const delegateAdress = process.argv[3];
  const tokenContract = await getTokenContract(tokenAdress, signer);
  const delegateTx = await tokenContract.delegate(
    delegateAdress
  );
  await delegateTx.wait();
  console.log(`delegate: ${delegateTx.hash}`);
  console.log(
    `votes: ${await tokenContract.getVotes(
      delegateAdress
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
