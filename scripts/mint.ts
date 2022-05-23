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
  const tokenAdress = process.argv[2];
  const tokenContract = await getTokenContract(tokenAdress, signer);

  const BASE_VOTE_POWER = 10;
  const mintAmount = ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18));
  const mintTx = await tokenContract.mint(
    "0xdEd21B76F5B84e28eB3a13346A466d0eF1D21835",
    mintAmount
  );
  await mintTx.wait();
  console.log(`mint: ${mintTx.hash}`);
  console.log(`total supply ${await tokenContract.totalSupply()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
