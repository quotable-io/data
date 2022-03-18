# cli/findDuplicates

Checks the `quotes` collection for possible duplicates quotes. It does not modify the data files, it just outputs a list of possible duplicates to the console so they can be manually checked and removed.  

### Usage 
```shell
❯ node cli/findDuplicates 
```

### Output
```shell
Found 4 possible duplicates.

┌──────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
│ B9ssb1gZ0LnN │ Whoever is happy will make others happy too.                                          │
├──────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ _ZVJWv9HJsBe │ Whoever is happy will make others happy, too.                                         │
└──────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
│ FI5mThj-syB4 │ We are what we repeatedly do. Excellence, then, is not an act, but a habit.           │
├──────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ zjULM0EKmwKH │ We are what we repeatedly do. Excellence, then, is not an act but a habit.            │
└──────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
│ wNdaJpR3m0lK │ Action may not always bring happiness; but there is no happiness without action.      │
├──────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ MUARorcdLeDg │ Action may not always bring happiness, but there is no happiness without action.      │
└──────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
│ NZ2RbZuB0-bw │ The greatest good you can do for another is not just to share your riches but to      │
│              │ reveal to him his own.                                                                │
├──────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 0PnL1GPc2muX │ The greatest good you can do for another is not just share your riches, but           │
│              │ reveal to them their own.                                                             │
└──────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```