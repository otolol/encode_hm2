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
    throw new Error("Mint address is missing");
  }
  if(process.argv.length < 5) {
    throw new Error("Mint amount is missing");
  }
  const tokenAdress = process.argv[2];
  const mintAdress = process.argv[3];
  const mintAm = Number(process.argv[4]);
  const tokenContract = await getTokenContract(tokenAdress, signer);

  const mintAmount = ethers.utils.parseEther(mintAm.toFixed(18));
  const mintTx = await tokenContract.mint(
    mintAdress,
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
