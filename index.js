const fs = require('fs');
const fetch = require('node-fetch');
const testFiles = require('./test');

async function download(url, filename, callback) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  await fs.writeFile(filename, buffer, () => { });
  callback()
}

let fileCount = 0
const promises = testFiles.map(async ({ node }, ind) => {
  const src = node?.image?.originalSrc
  if (src) {
    console.log(`Downloading File: ${ind}......`)
    const filename = (src.match(/.*\/files\/(.*)\?v=.*/) || [])[1]
    if (filename) {
      console.log(`==> File name: ${filename}`)
      await download(src, `./download/${filename}`, () => fileCount++)
    } else {
      console.warn(`Couldn't get filename of: ${src} at index ${ind}`)
    }
  } else {
    console.log(`No file at index: ${ind}`)
  }
})

console.time('FILE_DOWNLOAD')
Promise
  .all(promises)
  .then(() => {
    console.log('\n')
    console.timeEnd('FILE_DOWNLOAD')
    console.log(`Done: ${fileCount} files downloaded`)
  })

