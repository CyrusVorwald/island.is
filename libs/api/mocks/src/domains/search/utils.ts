import sortBy from 'lodash/sortBy'

import {
  Article,
  Items,
  LifeEventPage,
  News,
  SearcherInput,
  TagCount,
} from '../../types'

export function getTagCounts(filteredItems: Items[]) {
  const tagMap = filteredItems.reduce<{ [key: string]: TagCount }>(
    (tagResult, item) => {
      if (!('category' in item) || !item.category) {
        // Not all items have categories.
        return tagResult
      }
      const { title, slug } = item.category
      if (!title || !slug) {
        return tagResult
      }
      const tag = tagResult[slug] || { key: slug, value: title, count: 0 }
      tag.count++
      tagResult[slug] = tag
      return tagResult
    },
    {},
  )

  return sortBy(Object.values(tagMap), 'value')
}

export function filterItem(
  item: Article | LifeEventPage | News,
  query: SearcherInput,
) {
  if (!item.title.includes(query.queryString)) {
    return false
  }

  const tags = query.tags || []
  for (const tag of tags) {
    switch (tag.type) {
      case 'category':
        if (!('category' in item)) {
          return false
        }
        if (!item.category || item.category.slug !== tag.key) {
          return false
        }
        break
      default:
        return false
    }
  }
  return true
}
