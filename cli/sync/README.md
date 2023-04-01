
# $cli/sync

Syncs the data from the JSON files in this repository to a MongoDB database. 

**This performs a one-way sync from JSON files --> MongoDB database.**

Note: this uses the generated data files, not the source data. The generated data is files are created by running the build command. This adds various computed properties to the data that are not included in the source data.  The generated data is stored outside the root of this repository. You can change the location where generated data files are stored via the `config.dataDir.generated`.   

Before running this command, make sure you run the build command to create / update the generated data files. 



## Usage 

```sh
$ node cli/syncData [<dataDir>] [..options]
```

## Options 
| Argument | Description | 
|:-----|:-----|
| --help, -h | Show command documentation |
| `<dataDir>` | The directory containing the generated data files that will synced to the database. Default = `config.dataDir.generated`  |
| --overwrite, -o | If this flag is included, the command removes all existing documents from the MongoDB collections, and then populated them with the data from the JSON files. Otherwise, the command  will only add, update, and remove the documents that have been modified since the last sync |
| --verbose, -v | If this flag is included, the command will show more detailed output about the operation. This includes the full list of objects that will be added, updated, and removed for each |collection. |
