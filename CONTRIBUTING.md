# Contributing

- [Content Guidelines](#content-guidelines)
- [Issue Contributions](#issue-contributions)
- [Pull Requests](#pull-requests)

## Content Guidelines

- **All quotes should be good quality: accurate, interesting, and fun to read.**
- Quotes should not contain any offensive language
- Quotes should not contain language or messages that may be interpreted as racist, sexist, xenophobic, or otherwise offensive. 
- We do not include any quotes by historical figures who are associated with violence, oppression, racism etc (ie Hitler, Stalin, etc), regardless of the content of the quote.
- Political quotes are fine, as long as they are **not partisan**. For example, quotes that promote human rights, democracy, social justice, equality, etc, are totally fine. However, quotes that refer to a specific political party or politician should not be included.  
 
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
### Remove Inappropriate Quotes

If you come across any quotes that violate the [content guidelines](#content-guidelines), please report them so they can be removed. 

Open a new issue. List the quotes you want to remove. Include the quote content or `_id`. 
### Suggesting Changes

You can open to an issue to suggest changes to existing quotes. For example, to fix spelling, grammar, or accuracy, etc.

- Please include the ids of object that needs to be fixed, along with the proposed changes. 

## Pull Requests

If you would like to contribute directly, feel free to submit a pull request. Please read the following documentation before submitting a PR. 
### Setup

1. Fork and clone this repository. 
2. Install dependencies 

The repository includes the following CLI scripts for managing the data files.  These require Node >= 18. Click on the link below to view documentation for each CLI script. 

- [`cli/addQuotes`](./cli/addQuotes/README.md)
- [`cli/addAuthors`](./cli/addAuthors/README.md)
- [`cli/addTags`](./cli/addTags/README.md)
- [`cli/validate`](./cli/validate/README.md)
- [`cli/build`](./cli/build/README.md)

### Adding new content

**Do not add new content to the JSON files directly**

The `addQuotes` script is the primary mechanism for adding new content (quotes, authors, and tags). It takes an array of quotes from an input file, checks it against the existing collection to filter out duplicates, then adds the new quotes to `quotes.json` collection. It also checks for any authors and tags that do not already exist, creates the necessary objects and adds them to their respective collections. It uses the wiki API to get `Author` details like `bio`, `description`, `link` etc.

**Refer to [`cli/addQuotes`](./cli/addQuotes/README.md) for detailed instructions**

1. create a JSON file (`input/quotes.json`) containing an array of quotes to add.
2. Run the following command to add the quotes from the input file 
```sh
node cli/addQuotes -v
```
3. Run data validation to check the data files for any errors.  If any errors are found, this script will provide detailed output including the location of the errors and what needs to be fixed. 
```sh 
node cli/validate -v
```
4. Open a pull request to submit your changes. 

### Editing Content

To edit existing quotes for spelling, grammar, and accuracy, you can edit the JSON files directly. Below is the list of the files and properties that can be edited.  **Other properties should not be changed manually**. 

- `data/quotes.json/`
  - `Quote.content`
  - `Quote.tags`
  - `Quote.author` *(see below)
- `data/authors.json/`
  - `Author.bio`
  - `Author.description`

\* If a quote is attributed to the wrong author, you _can_ manually change the `author` property. However, the new value **must be the exact name of an existing author** in the `data/authors.json` collection.  If the correct author is not already in the database, you can remove existing quote, and then use the addQuotes script to add it with the correct author name (this will automatically create the Author object and add it to the authors collection). 

After making changes, you can run the following command to check the data files for validation errors. 

```sh
node cli/validate -v
```
When you finish making changes, submit a pull request

### Adding Tags to Existing Quotes 

The goal of the tags feature was to organize the quotes into various overlapping categories or topics -- such as "civil rights", "business", "success", "happiness", "technology", etc. 

To make this feature more useful, we need to add appropriate tags to all the existing quotes. Currently less than half the quotes have tags. 

The only way to add tags to the existing quotes is by manually editing the `quotes.json` file. Each quote has a `tags` property which is an array of tag names. You can go through and manually add new tags to the quotes as you read through them. 






