# $ addAuthors

Adds one or more authors to the `authors` collection.

> You do not need to use this script when adding new quotes. The [`addQuotes`](../addQuotes/README.md) script will automatically create any new authors and tags from the list of quotes and add them to their respective collections.

## Arguments

| name            | default              | description                                                       |
| :-------------- | -------------------- | ----------------------------------------------------------------- |
| `<inputFile>`   | `input/authors.json` | The path to the input file (relative to project root)             |
| `--name, -n`    | NA                   | List of author names to add. Can be used instead of an input file |
| `--verbose, -v` | false                | Output details about each author that was added                   |
| `--dryRun, -d`  | false                | Will not save changes                                             |
| `--dataDir`     | `data/source`        | Only for testing purposes. Use default value                      |

## Usage

There are two ways to add authors:

**1. From an input file**

The default location for the input file is `input/authors.json`. If you use the default file location, you can omit the `<inputFile>` argument. See [input file](#input-file) for more details.

```SHELL
❯ node scripts/addAuthors <inputFile>
```

**2. With the `--name` argument**

Instead of creating an input file, you specify a list of author names via the `--name` argument.

```SHELL
❯ node scripts/addAuthors --name="pete seeger, bob dylan"
```

## Input File

The input file should be a `JSON` file containing an array of `AuthorInput` objects. Each object defines an author to add. The only _required_ property for each author is `name`. All other fields will be filled in automatically using the wiki API. However, any properties that are included in the input data will take priority over the values pulled from the wiki API.

~~This can be used as an escape hatch if you need to add an author who does not have a wikipedia page.~~

```ts
interface AuthorInput {
  name: string
  bio?: string
  description?: string
  link?: string
}
type inputFile = AuthorInput[]
```

## How is works

The scripts starts by matching each new author to a wikipedia page. If it does not find an exact match for a given author name, it will prompt the user to select the intended person from a list of suggestions. If the input name is different than than the name of the person's wikipedia page, it will use the name on the wikipedia page.

Then, it will determine if the author already exists. This prevents duplicate authors with different name variations (ie "john kennedy" and "john F. kennedy").

In this example, we misspelled the author's last name. The script will prompt us to choose the correct person, then create the author using the exact name on the person's wikipedia page (if the author does not already)

![addAuthors screenshot one](https://user-images.githubusercontent.com/8286271/120909240-12789b80-c641-11eb-99e8-4bfd960cd009.jpg)
![addAuthors screenshot two](https://user-images.githubusercontent.com/8286271/120909245-14daf580-c641-11eb-93de-1d9f0462e5ca.jpg)
