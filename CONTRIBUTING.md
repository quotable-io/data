# Contributing

There are two sets of data files. All changes should be made to the **source data**. The generated data files should never be edited. They are generated automatically by running the build command. 

- Source Data (`data/source`)
- Generated Data (`data/generated`)

## Content Guidelines 

- All new quotes should have appropriate tags
- All authors must have a wikipedia page 
- Quotes should not contain offensive language, especially anything that might be interpreted as racist, sexist, etc.


## Issues 

Feel free to create an issue to suggest content changes, or if you have questions about how to contribute directly. 

- suggest new quotes
- Report spelling/grammar/accuracy mistakes that should be corrected
- Report quotes that have been attributed to the wrong person
- Report quotes that are offensive/inappropriate.
  


## Pull Requests 

> You do not need to create an issue first when submitting a PR. 

**1. Fork and clone the repository**

**2. Install dependencies**

```shell
npm install
```

**3. Make changes**

Before submitting a PR, run the `build` command to update generated data files

```SHELL
node scripts/build
```

Run data validation to ensure data matching schema

```SHELL
$ node scripts/validate
```

Please keep pull requests small and focused. Don't add new content _and_ edit existing content in the same PR.
### Adding new content

The primary mechanism for adding new content (quotes, authors, and tags) is the [`addQuotes`](./scripts/addQuotes/README.md) script. **Do not manually add new content to the data files.** For more info see [scripts/addQuotes/README.md](./scripts/addQuotes/README.md)

### Editing quotes

To edit the `content` of existing quotes for grammar/spelling/accuracy, manually edit the the `quotes.json` file.

To add tags to existing quotes, manually edit the `quotes.json` file. 

Note: do not manually edit the `author` field in `quotes.json`. If a quote is attributed to the wrong person, create a issue. 

### Editing Authors

You can manually edit the `bio` and `description` fields on authors in `authors.json` to fix mistakes or improve quality.  

