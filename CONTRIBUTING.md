# Contributing

## Issues

Feel free to create an issue to suggest content changes, or if you have questions about how to contribute directly.

- suggest new quotes
- Report spelling/grammar/accuracy mistakes that should be corrected.
- Report quotes that have been attributed to the wrong person
- Report quotes that are offensive/inappropriate or poor quality.

## Pull Requests

### Setup

Fork and clone the repository. Install dependencies.

There are two sets of data files. **All changes should be made to the source data (`data/source`)**.

- `data/source` - source data
- `data/generated` - generated automatically by running the `build` command.

### Adding new content

**Do not manually add new content to the data files**

The `addQuotes` script is the primary mechanism for adding new content (quotes, authors, and tags). It takes an array of quotes from an input file, filters out the duplicates, then adds the new quotes to the `quotes.json` collection. It also identifies any authors and tags that do not already exist, creates the necessary objects and adds them to their respective collections. It uses the wiki API to get `Author` details like `bio`, `description`, `link` etc.

See [`scripts/addQuotes`](./scripts/addQuotes/README.md) for details.

```SHELL
❯ node scripts/addQuotes input/quotes.json
```

### Editing quotes

To edit the `content` of existing quotes for grammar/spelling/accuracy, manually edit the [`quotes.json`](./data/source/quotes.json) file in `data/source/`.

Do not edit other properties in `quotes.json`, such as `author`. If a quote is attributed to the wrong person, create a issue.

### Editing Authors

You can manually edit the `bio` and `description` fields on authors in `authors.json` to fix mistakes or improve quality.

### Data validation

The data is validated against a JSON schema using [ajv](https://ajv.js.org/). See [scripts/validate](./scripts/validate/README.md) for more info.

```SHELL
❯ node scripts/validate
```

### Submitting a PR

After making changes, run the `build` command before submitting a PR. This updates the generated data files in `data/generated`.

```SHELL
❯ npm run build
```

If you get an error that says data validation failed, run [scripts/validate](./scripts/validate/README.md) to see details about the validation errors that need to be corrected.
