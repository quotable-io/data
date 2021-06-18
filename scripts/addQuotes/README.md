# $ addQuotes

This script is the primary mechanism for adding new content (quotes, authors and tags). It takes a list of quotes from an input file, filters out any duplicates, then adds the new quotes to the collection. It will also identify any authors and tags that do not already exist, create them and add them to their respective collections.

## Usage

The default location for the input file is `input/quotes.json`. If you use the default location you can omit the `<inputFile>` argument.

```SHELL
$ node scripts/addQuotes <inputFile>
```

### Arguments

| name            | default       | description                                             |
| :-------------- | ------------- | ------------------------------------------------------- |
| `<inputFile>`   | `quotes.json` | Path to input file (relative to `<projectRoot>/input/`) |
| `--dryRun, -d`  | `false`       | If true, script will run without modifying files        |
| `--verbose, -v` | `false`       | Script will output details about the data being added   |
| `--cleanup, -c` | `false`       | If true, deletes input file after operation is complete |
| `--dataDir`     | `data/source` | Only for testing purposes. Use the default value        |

### Input File

The input file should be a `JSON` file containing an array of quotes that you want to add. Each item should be an object with the following properties. All other fields will be added automatically.

```ts
interface QuoteInput {
  // The quote content
  content: string
  // The author's name (as it appears on their wikipedia page)
  author: string
  // A list of tag names
  tags?: string[]
}
type inputFile = QuoteInput[]
```

## How it Works

### Checking for duplicates

It starts by filtering out any duplicate quotes that already exist. When comparing quotes, it ignores punctuation, case, and stopwords to avoid multiple variations of the same quote.

### Creating new authors

It starts by matching each author name in the input data to a wikipedia page. If it does not find an exact match for a given author name, the script will prompt the user to select the intended person from a list of suggestions. If the author name in the input data is different than the name on the person's wikipedia page, it will use the name on the wikipedia page. This avoids duplicate authors caused by different name variations ("John Kennedy" and "John F. Kennedy") or misspellings.

The script will create the necessary `Author` objects, using data from the wiki API to get the values for `bio`, `description`, `link`, etc.

TODO: this does not currently handle author profile images

### Creating new tags

Any new tags will be created and added to the `tags` collection. Please try to avoid creating duplicate tags (ie "inspiration" and "inspirational").

## Example

```json
// input/quotes.json
[
  {
    "content": "If you're changing the world, you're working on important things. You're excited to get up in the morning.",
    "author": "Larry Page",
    "tags": ["famous-quotes", "inspirational"]
  }
]
```

```shell
$ node scripts/addQuotes input/quotes.json -v
```

In this example, there are two people on wikipedia named "Larry Page", so the script will prompt us to choose the correct person.

![](https://user-images.githubusercontent.com/8286271/120941761-858e1a80-c6f2-11eb-8ad7-48d6e093e03c.jpg)

![](https://user-images.githubusercontent.com/8286271/120941762-8626b100-c6f2-11eb-86a8-a72a26cc3dc7.jpg)
