# Contributing

- [Content Guidelines](#content-guidelines)
- [Issue Contributions](#issue-contributions)
- [Direct Contributions (pull requests)](#direct-contributions-pull-requests)

## Content Guidelines

- Quotes should be good quality: accurate, interesting, and fun to read. 
- Quotes should not contain any offensive language  
- All authors must have a wikipedia page (we use the wiki API for creating Author entries)

## Issue Contributions 

The easiest way to contribute is by opening an issue to propose changes. 

### Suggesting new quotes

You can open an issue to suggest new quotes. 

Please proof reed quotes for spelling and grammar

**You do not need to check if a quote is already in the collection.** Duplicates will be skipped automatically when importing new quotes.

#### Format for new quotes

Please format the list of quotes as a JSON array.  Each quote should have the following properties. 

```ts
{
  // The quotation text
  content: string,
  // The author's full name
  author: string,
  // Array of tags
  tags: string[]
}
```

**Example**

```json
[
  {
    "content": "A house divided against itself cannot stand.",
    "author": "Abraham Lincoln",
    "tags": ["history", "politics", "famous-quotes"]
  },
  {
    "content": "Any sufficiently advanced technology is indistinguishable from magic",
    "author": "Arthur C. Clarke",
    "tags": ["technology", "literature", "famous-quotes"]
  }
]
```

### Editing existing content

You can open to an issue to suggest changes to existing content, for example to fix spelling, grammar, or accuracy, etc.

Please include the `id` or `slug` of each object that needs to be fixed, along with the corrections. 

### Removing quotes

If you find any quotes that are inaccurate, offensive, or poor quality, please open an issue.
## Direct Contributions (pull requests)

If you would like to contribute directly, pull requests are welcome too.   
### Setup

Fork and clone the repository. Install dependencies.

Important: There are two sets of data files in the repository. All changes should also be made to the source data, not the generated data. 

- `data/source` - The source data
- `data/generated` - generated automatically by running the `build` command.

### CLI Scripts 

There are several CLI scripts for managing the data.  

- [`addQuotes`](./scripts/addQuotes/README.md)
- [`addAuthors`](./scripts/addAuthors/README.md)
- [`addTags`](./scripts/addTags/README.md)
- [`validate`](./scripts/validate/README.md)
- [`build`](./scripts/build/README.md)

### Submitting PR 

Before submitting a PR, run the `npm build` command to update the generated data files. 
```
$ npm build
```

If the build script fails due to a data validation error, see [data validation](#data-validation) 

### Data validation

The data is validated against a JSON schema using [ajv](https://ajv.js.org/). You can use [`scripts/validate`](./scripts/validate/README.md) to check the data files for validation errors. It will provide detailed output about any errors that need to be fixed. 

```SHELL
❯ node scripts/validate
```


### Adding new content

**Do not manually add new content to the data files**

The `addQuotes` script is the primary mechanism for adding new content (quotes, authors, and tags). It takes an array of quotes from an input file, fitters out any quotes duplicates, then adds the new quotes to `quotes.json` collection. It also checks for any authors and tags that do not already exist, creates the necessary objects and adds them to their respective collections. It uses the wiki API to get `Author` details like `bio`, `description`, `link` etc.

See [`scripts/addQuotes`](./scripts/addQuotes/README.md) for details.

```SHELL
❯ node scripts/addQuotes input/quotes.json
```

### Editing existing content

To edit existing content for spelling, grammar, and accuracy you can edit the JSON files directly and then submit a PR. Make sure to edit the source data (in `data/source/`). 

You can also add/remove tags on existing quotes by editing quotes.json file (at the moment this is the only way to edit tags on existing quotes). 

**The following properties can be edited manually in the JSON files** 

- `data/source/quotes.json`
  - content
  - tags
- `data/source/authors.json`
  - bio
  - description
