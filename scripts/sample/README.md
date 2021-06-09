# $sampleData

Generates a random sample of the data with the specified number of quotes. The sample will include the specified number of quotes, as well the authors of the those quotes.

| Name          | default          | description                                                  |
| ------------- | ---------------- | ------------------------------------------------------------ |
| `--dest` `-d`  | NA               | `required` Directory where sample data files will be created |
| `--count` `-c` | 500              | the number of quotes to include in sample data               |
| `--src` `-s`   | `data/generated` | Directory containing complete data files                     |

```shell
$ sample -s data/generated -d ../api/data/sample
```
