# Quotable Data
[quotable](https://github.com/lukePeavey/quotable) is a free, open source API that provides access to a large collection of famous quotes. This repository contains the data — the collection of quotes and authors — for the Quotable API. The data is stored as JSON files which are syced to a MongoDB database. 


# Contributing 

If you are interesting in contributing to the Quotable database, please check out the [contributors guide](CONTRIBUTING.md).

## Project Structure

- `/data/source` source data
- `/data/generated` Generated data (should not be edited)
- `/schema` schema for data validation
- `/config` global config values
- `/scripts` CLI scripts for managing the data
- `/lib` Helper functions that are used by the CLI scripts
- `/input` Some of the CLI scripts (such as `$addQuotes` and `$addAuthors`) accept input data from a JSON file. This is the default directory for input files. It is ignored by git. 

## CLI Scripts

- [`addQuotes`](./scripts/addQuotes/README.md)
- [`addAuthors`](./scripts/addAuthors/README.md)
- [`addTags`](./scripts/addTags/README.md)
- [`validate`](./scripts/validate/README.md)
- [`build`](./scripts/build/README.md)
