# Contributing

- [Content Guidelines](#content-guidelines)
- [Issue Contributions](#issue-contributions)
- [Pull Requests](#pull-requests)

## Content Guidelines

- Quotes should be good quality: accurate, interesting, and fun to read. 
- Quotes should not contain any offensive language  
- All authors must have a wikipedia page (we use the wiki API for creating Author objects and various other things)

## Issue Contributions 

The easiest way to contribute is by opening an issue to propose changes. 

### Suggesting new quotes

You can open an issue to suggest new quotes. **You don't need to check if the quotes are already in the database.** Duplicates will be skipped automatically when we add the quotes. 

- Please proof reed quotes for spelling and grammar. 
- Please format the list of quotes as a JSON array.  Each quote should have the following properties. 

```ts
{
  // The quotation text
  content: string,
  // The author's full name 
  // ideally use the exact name on the person's wikipedia page
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

### Suggesting Changes

You can open to an issue to suggest changes to existing quotes. For example, to fix spelling, grammar, or accuracy, etc.

- Please include the ids of object that needs to be fixed, along with the proposed changes. 

## Pull Requests

If you would like to contribute directly, feel free to submit a pull request. 
### Setup

1. Fork and clone this repository. 
2. Install dependencies

The repository includes the following CLI scripts for making changes to the data:
These require Node >= 16. 

- [`addQuotes`](./cli/addQuotes/README.md)
- [`addAuthors`](./cli/addAuthors/README.md)
- [`addTags`](./cli/addTags/README.md)
- [`validate`](./cli/validate/README.md)
- [`build`](./cli/build/README.md)

### Adding new content

**Do not add new content to the JSON files directly**

The `addQuotes` script is the primary mechanism for adding new content (quotes, authors, and tags). It takes an array of quotes from an input file, checks it against the existing collection to filter out duplicates, then adds the new quotes to `quotes.json` collection. It also checks for any authors and tags that do not already exist, creates the necessary objects and adds them to their respective collections. It uses the wiki API to get `Author` details like `bio`, `description`, `link` etc.

See [`cli/addQuotes`](./cli/addQuotes/README.md) for details.

After adding your new quotes, open a pull request. 

```SHELL
❯ node cli/addQuotes input/quotes.json
```
### Editing Content

To edit existing quotes for spelling, grammar, and accuracy, you can edit the JSON files directlyBelow is the list of properties that can be manually edited. 

- `data/quotes.json`
  - content
  - tags
- `data/authors.json`
  - bio
  - description

After making changes, submit a pull request

### Adding Tags to Existing Quotes 

The goal of the tags feature was to organize the quotes into various overlapping categories or topics -- such as "civil rights", "business", "success", "happiness", "technology", etc. 

To make this feature more useful, we need to add appropriate tags to all the existing quotes. Currently less than half the quotes have tags. 

The only way to add tags to the existing quotes is by manually editing the `quotes.json` file. Each quote has a `tags` property which is an array of tag names. You can go through and manually add new tags to the quotes as you read through them. 






