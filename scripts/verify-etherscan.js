async function main() {
  await hre.run("verify:verify", {
    // deployed contract address to veify here
    address: "0xEd4a531962528CF84c95D8dc2e9FAD41c172dcb5",
    constructorArguments: [],
  });
}
main()