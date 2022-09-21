import { Foobar } from "test-rename-bar";

function main() {
  console.log(Foobar() + "baz");
}

if (require.main === module) {
  main();
}
