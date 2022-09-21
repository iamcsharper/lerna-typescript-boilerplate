# lerna typescript boilerplate
Based on https://github.com/epfromer/typescript-monorepo

## Usage

### Initialization

```
yarn
yarn bootstrap
```

#### `yarn ts-node scripts/create -t app <app-name>`

- scaffolds new app in apps/ folder
- resolves local dependencies
- adds a new run script to package.json

If any errors occur, or you have to rename some of packages:

- rename
- `yarn resolve`
- `yarn bootstrap`

