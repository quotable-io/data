# Quotable Data

This repository serves as a content management system for the [quotable API](https://github.com/lukePeavey/quotable). The data is stored as JSON files which are synced with a MongoDB database.

If you are interested in contributing to the data, please read the [contributors guide](CONTRIBUTING.md).

## Structure

- `/data/source` source data
- `/data/generated` Generated data (should not be edited)
- `/schema` schema for data validation
- `/config` global config values
- `/scripts` CLI scripts for managing the data
- `/lib` Helper functions for managing the data
- `/input` Various scripts pull data from user provided input files, such as `addQuotes` and `addAuthors`. This is the default directory for input files used by these scripts. It is ignored by git

## CLI Scripts

- [`addQuotes`](./scripts/addQuotes/README.md)
- [`addAuthors`](./scripts/addAuthors/README.md)
- [`addTags`](./scripts/addTags/README.md)
- [`validate`](./scripts/validate/README.md)
- [`build`](./scripts/build/README.md)
