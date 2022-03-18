# Quotable Data

[quotable](https://github.com/lukePeavey/quotable) is a free, open source API that provides access to a large collection of famous quotes.  Both the API and the data — the collection of quotes, authors, and other info — are open source projects. 

This repository contains the data for the quotable API. All changes to the database are made in this repository and then synced to the MongoDB database. It was set up this way to allow community contributions to the data.  

# Contributing 

If you are interesting in contributing to the Quotable database, please check out the [contributors guide](CONTRIBUTING.md).

## Project Structure

- `/data` Contains the source data for each of the database collections. 
- `/translations` Contains translations 
- `/config` Configuration values
- `/cli` CLI scripts for managing the data
- `/lib` Helper functions that are used by the CLI scripts

## CLI Scripts

- [`addQuotes`](./cli/addQuotes/README.md)
- [`addAuthors`](./cli/addAuthors/README.md)
- [`addTags`](./cli/addTags/README.md)
- [`validate`](./cli/validate/README.md)
- [`build`](./cli/build/README.md)
