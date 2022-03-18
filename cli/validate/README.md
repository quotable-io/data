# $validate

The validate script runs data validation to ensure the data files match the schema. 

Note: There are two schemas, one for the source data (located in the `data/` directory of this repository), and one for the generated data files (not included in repository). The generated data files are created by running the build command and are stored outside the root of this repository. 

The script will provide detailed output about any validation errors, including a link the exact the exact location of the error in the JSON file. This make is easy to quickly find and address any validation errors in the source data. 

### Usage

```SHELL
$ node cli/validate [<target>] [--verbose, -v]
```

### Arguments 

| Name      | default | description                                    |
| --------- | ------- | ---------------------------------------------- |
| `<target>` | `source`     | The data files to target: `source` or `generated` |
| `--verbose` `-v`   |    false     | Validation errors will also show the full object in which the error occurred |

### Examples

⚠️ To run CLI scripts as executables, you need to run `npm link` from the project root during initial setup. Otherwise, replace `validate` with `node cli/validate`. 

![](https://user-images.githubusercontent.com/8286271/120944850-a52e3e80-c704-11eb-97f9-82599286a8e5.jpg)

If you include the `--verbose` flag, it will also output the objects where validation errors occurred.

![](https://user-images.githubusercontent.com/8286271/120944767-410b7a80-c704-11eb-909f-2ced93f5884b.jpg)