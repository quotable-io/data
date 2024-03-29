import { identity } from 'lodash-es'
import slugify from '@lukepeavey/slugify'
import { findQuotesByTag } from '../../lib/findQuotesByTag.js'
import { log } from '../../lib/log.js'

/**
 * Adds computed fields to author
 * - quoteCount
 * - slug
 */
function addAuthorFields({ authors, ...collections }) {
  const { quotes } = collections
  return {
    ...collections,
    authors: authors.map(author => ({
      ...author,
      quoteCount: quotes.filter(quote => quote.author === author.name).length,
      slug: slugify(author.name),
    })),
  }
}

/**
 * Adds computed fields to quotes:
 * - length
 * - authorSlug
 * - authorId (soon to be removed)
 */
function addQuoteFields({ quotes, ...collections }) {
  const { authors } = collections
  return {
    ...collections,
    quotes: quotes
      .map(quote => {
        const author = authors.find(({ name }) => name === quote.author)
        if (!author) {
          log.warn(`[warn] Invalid quote: ${quote._id}`)
          log.dim(`Author "${quote.author}" does not exist`)
        } else {
          return {
            ...quote,
            authorId: author._id,
            authorSlug: author.slug,
            length: quote.content.length,
          }
        }
      })
      .filter(identity),
  }
}

function addTagFields({ tags, ...collections }) {
  return {
    ...collections,
    tags: tags.map(tag => {
      const quotesWithTag = findQuotesByTag(tag.name, collections)
      return {
        ...tag,
        slug: slugify(tag.name),
        quoteCount: quotesWithTag.length,
      }
    }),
  }
}

export const transforms = [addAuthorFields, addQuoteFields, addTagFields]
