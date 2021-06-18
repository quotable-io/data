# $ build

```shell
❯ node scripts/build
```

The `build` script creates the generated data files (`data/generated`) from the source data. This should be run before submitting a PR or pushing changes to the main branch.

Performs data validation on the source data (using ajv) to ensure it matching the schema (see `schema/`). If validation is successful, the script will updated the generated data files.

## Usage

```
npm run build
```
