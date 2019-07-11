async function main() {
  await Deno.readFile(
    "~/.ssh/id_ed25519");
}

main();
