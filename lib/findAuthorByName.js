import { toLower } from 'lodash-es'
/**
 * Finds an author by name.
 *
 * @param {string} name
 * @param {{quotes: any[], authors: any[], tags: any[]}} db
 */
export function findAuthorByName(name, db) {
  return db.authors.find(author => toLower(name) === toLower(author.name))
}
