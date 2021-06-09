# $validate

This scripts runs data validation to ensure data files match the schema.

There are two schemas, one for the source data (`data/source`) and one for the generated data (`data/generated`). Validation can be run on either set of data files. The first argument `target` specifies which data files to validate (source or generated). 

### Arguments 

| Name      | default | description                                    |
| --------- | ------- | ---------------------------------------------- |
| `<target>` | `source`     | `required` The data files to target: `source` or `generated` |
| `--verbose` `-v`   |    false     | Validation errors will also show the full object in which the error occurred |

### Usage

```SHELL
$ validate source -v
```
![](https://user-images.githubusercontent.com/8286271/120944850-a52e3e80-c704-11eb-97f9-82599286a8e5.jpg)

If you include the `--verbose` flag, it will also output the objects where validation errors occurred.

![](https://user-images.githubusercontent.com/8286271/120944767-410b7a80-c704-11eb-909f-2ced93f5884b.jpg)