import fs from 'fs/promises'

const slugify = name => name.toLowerCase().replace(/[^a-zA-Z]/g, '-')

;(async () => {

  const kaomojiCategories = JSON.parse(await fs.readFile('./kaomoji.json'))

  await fs.writeFile('./readme.md', `
# Kaomoji

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

${subcategory.kaomojis.map(kaomoji => `<code>${kaomoji}</code>`).join('\n\n')}
`).join('')
}`).join('')}

`
  )

})().catch(console.error)