#!/usr/bin/env node
import yargs from "yargs";

import * as fs from "fs";
import * as path from "path";
import { update } from "./update-package-tsconfig";
import { updateInDir } from "./update-package-json";

const GET_PACKAGE_JSON = (name: string) => `{
  "name": "${name}",
  "version": "0.1.0",
  "dependencies": {},
  "devDependencies": {}
}`;

const TSCONFIG = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src",
    "composite": true
  },
  "include": [
    "src"
  ],
  "exclude": [
    "tests",
    "lib"
  ]
}`;

yargs(process.argv.slice(2))
  .options({
    t: { choices: ["app", "package"], demandOption: true },
    name: { type: "string", demandOption: true },
  })
  .command(
    "$0 [t] <name>",
    false,
    (yargs) => {
      return yargs.positional("name", {
        type: "string",
        demandOption: true,
        describe: "name of the app/package",
      });
    },
    (argv) => {
      const dir = argv.t + "s";
      const chosen = path.join(__dirname, "..", dir);
      const moduleDir = path.join(chosen, argv.name!);

      fs.mkdirSync(moduleDir);
      fs.mkdirSync(path.join(moduleDir, "src"));
      fs.writeFileSync(
        path.join(moduleDir, "src", "index.ts"),
        "console.log('Hello, world');"
      );
      fs.writeFileSync(
        path.join(moduleDir, "package.json"),
        GET_PACKAGE_JSON(argv.name!)
      );
      fs.writeFileSync(path.join(moduleDir, "tsconfig.package.json"), TSCONFIG);

      update();
      updateInDir();
    }
  )
  .demandCommand(1)
  .help()
  .parse();
