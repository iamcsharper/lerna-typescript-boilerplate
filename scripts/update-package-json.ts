import * as fs from "fs";
import * as path from "path";

export const updateInDir = () => {
  const root = path.join(__dirname, "..");
  const packagesDir = path.join(__dirname, "..", "packages");
  const appsDir = path.join(__dirname, "..", "apps");

  const getNormalizedDirs = (dir: string) => {
    return fs
      .readdirSync(dir)
      .map((e) => path.join(dir, e))
      .filter((item) => fs.lstatSync(item).isDirectory())
      .map((item) => path.relative(root, item).replace(/\\/g, "/"));
  };

  const packages = [
    ...getNormalizedDirs(packagesDir),
    ...getNormalizedDirs(appsDir),
  ];

  const appScripts: { name: string; value: string; app: string }[] = [];

  packages.forEach((packageName) => {
    const packageJSONPath = path.join(root, packageName, "package.json");

    const isApp = packageName.startsWith("apps/");
    const appName = packageName.replace("apps/", "");
    const runScript = { name: `run:${appName}`, value: "node ." };

    if (isApp) {
      appScripts.push({
        app: appName,
        name: runScript.name,
        value: `node ./${packageName}/`,
      });
    }

    const packageJSONData = JSON.parse(
      fs.readFileSync(packageJSONPath).toString()
    );
    packageJSONData.main = "./lib/index.js";
    packageJSONData.types = "./lib/index.d.ts";
    packageJSONData.files = ["lib", "src"];
    packageJSONData.scripts = {
      ...(packageJSONData.scripts || {}),
      build: "tsc -b ./tsconfig.package.json",
      prepublish: "yarn run build",
      ...(isApp && { ...runScript }),
    };
    packageJSONData.publishConfig = {
      access: "public",
    };
    fs.writeFileSync(
      packageJSONPath,
      JSON.stringify(packageJSONData, null, "  ")
    );
  });

  const rootPackage = path.join(root, "package.json");
  const packageJSONData = JSON.parse(fs.readFileSync(rootPackage).toString());

  appScripts.forEach((script) => {
    packageJSONData.scripts[script.name] = script.value;
  });

  fs.writeFileSync(rootPackage, JSON.stringify(packageJSONData, null, "  "));
};

if (require.main === module) {
  updateInDir();

  console.log("package.json resolved");
}
