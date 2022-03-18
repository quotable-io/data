# Contributing

- [Content Guidelines](#content-guidelines)
- [Issue Contributions](#issue-contributions)
- [Direct Contributions (pull requests)](#direct-contributions-pull-requests)

## Content Guidelines

- Quotes should be good quality: accurate, interesting, and fun to read. 
- Quotes should not contain any offensive language  
- All authors must have a wikipedia page (we use the wiki API for creating Author objects and various other things)

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

### CLI Scripts 

There are several CLI scripts for managing the data.  

- [`addQuotes`](./cli/addQuotes/README.md)
- [`addAuthors`](./cli/addAuthors/README.md)
- [`addTags`](./cli/addTags/README.md)
- [`validate`](./cli/validate/README.md)
- [`build`](./cli/build/README.md)

### Submitting PR 
### Data validation

Before submitting a PR, please run the data validation script to ensure there are no validation errors in the data files. We use [ajv](https://ajv.js.org/) to validate the data against a JSON schema. For more info about the validation script see  [`cli/validate/README.md`](./cli/validate/README.md)

```SHELL
❯ node cli/validate
```


### Adding new content

**Do not manually add new content to the data files**

The `addQuotes` script is the primary mechanism for adding new content (quotes, authors, and tags). It takes an array of quotes from an input file, fitters out any quotes duplicates, then adds the new quotes to `quotes.json` collection. It also checks for any authors and tags that do not already exist, creates the necessary objects and adds them to their respective collections. It uses the wiki API to get `Author` details like `bio`, `description`, `link` etc.

See [`cli/addQuotes`](./cli/addQuotes/README.md) for details.

```SHELL
❯ node cli/addQuotes input/quotes.json
```

### Editing existing content

To edit existing content for spelling, grammar, and accuracy you can edit the JSON files directly and then submit a PR. Below is the list of properties that can be manually edited. 

- `data/quotes.json`
  - content
  - tags
- `data/authors.json`
  - bio
  - description

You can also add/remove tags to existing quotes by editing the `data/quotes.json` file (for the moment, this is the only way to edit tags on existing quotes). 


