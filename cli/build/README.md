# $ build

```shell
❯ node cli/build
```

The `build` script creates the generated data files from the source data. It adds computed properties, (such as `quoteCount`, `length`, etc) as well as timestamp (`dateAdded` and `dateModified`). The generated data files are then synced with the MongoDB database. 

**⚠️ Keep in Mind**

The data files generated by the build command are not included in this repository.  The default directory for the generated data files is outside the root of this repository. 

It it is not necessary to run the build command when submitting changes to the upstream repository. 

## Usage

```
npm run build
```