/**
 * Gets author details from a wikipedia page returned by the API
 */
export function extractAuthorDetails(page) {
  if (!page) return null
  const {
    extract,
    title,
    pageid,
    canonicalurl,
    pageimage,
    images,
    description: originalDescription = '',
    categories = [],
  } = page

  // The `extract` is a brief summary of the page, usually taken from the first
  // paragraph. We use this the for author's `bio` field.
  // NOTE: The length and content of the `extract` can be customized via API
  // parameters when requesting a page (see lib/wiki/api). Currently it is set
  // to two sentences.
  const bio = extract
    // clean up the extract...
    // In most cases, the extract starts with the person's full legal name,
    // followed by "(date of birth [- date of death])". Sometimes there is
    // additional text inside the parenthesis, such as alternate names,
    // pronunciations and spellings in different languages, etc, each separated
    // by a `;`. We try to remove everything from inside the parenthesis
    // except the birth and death dates. Example:
    //   Before: "( ; (listen); 15 October 1931 – 27 July 2015)"
    //   After:  "(15 October 1931 – 27 July 2015)"
    .replace(/\(\s*listen\s*\)/g, ' ')
    .replace(/\(([^;)]+;\s*)+/, '(')
    .replace(/\[.*\]/g, ' ')
    .replace(/\([;\s]+/, '(')
    // Remove newlines and double spaces from the extract
    .replace(/(\s+)|(\n)/g, ' ')

  // The `description` is a short, one line description of the person.
  // It's usually their primary occupation or what they are known for.
  // For example: "Theoretical Physicist"  or "American Author"
  // In some cases, the description also includes birth/death dates inside
  // parenthesis. We remove those if present.
  const description = originalDescription.replace(/\(.+\)/, '').trim() || null

  // Get a list of category names that the person belongs to. In the future,
  // we could use this to add tags/categories to authors.
  const categoryNames = categories.map(category => {
    return category.title.replace(/category:/i, '').trim()
  })

  // This only includes fields we need for Authors.
  return {
    name: title,
    pageId: pageid,
    link: canonicalurl,
    bio,
    description,
    imagePath: pageimage,
    categories: categoryNames,
    images,
  }
}
