import fs from 'fs/promises'

const slugify = name => name.toLowerCase().replace(/[^a-zA-Z]/g, '-')
const lookup = {
  '&': '&amp;',
  '"': '&quot;',
  '\'': '&apos;',
  '<': '&lt;',
  '>': '&gt;',
  '\\': '&#92;'
}
const escapeCode = s =>  {
  return s.replace( /[&"'<>\\]/g, c => lookup[c] );
}

;(async () => {

  const kaomojiCategories = JSON.parse(await fs.readFile('./kaomoji.json'))

  await fs.writeFile('./readme.md', `
# Kaomoji

A collection of ${kaomojiCategories.reduce((total, category) => {
  total += category.subcategories.reduce((total, subcategory) => {
    total += subcategory.kaomojis.length
    return total
  }, 0)
  return total
}, 0)} emoticons.

[https://en.wikipedia.org/wiki/Emoticon#Japanese_(kaomoji)](https://en.wikipedia.org/wiki/Emoticon#Japanese_(kaomoji))

#### Table of contents

${kaomojiCategories.map(category => `- [${category.name}](#${
  category.slug = slugify(category.name)
})
${category.subcategories.map(subcategory =>
  `  - [${subcategory.name}](#${
    subcategory.slug = category.slug + '--' + slugify(subcategory.name)
  })`).join('\n')
}`).join('\n')}

${kaomojiCategories.map(category => `
<a name="${ category.slug }"></a>
## ${category.name}
${category.subcategories.map(subcategory =>
  `
<a name="${ subcategory.slug }"></a>
### ${subcategory.name}

${subcategory.kaomojis.map(kaomoji => `<code>${escapeCode(kaomoji)}</code>`).join('\n\n')}
`).join('')
}`).join('')}

`
  )

})().catch(console.error)