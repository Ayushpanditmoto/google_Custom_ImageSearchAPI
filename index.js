// Create post search using cheerio to get google images for a search term

const express = require('express')
const app = express()
const request = require('request')
const cheerio = require('cheerio')
const port = 3000

app.get('/', (req, res) => {
  res.status(200).json({
    API: 'https://google-custom-image-search-api.vercel.app/search/[Yoursearchterm]',
    Example: 'https://google-custom-image-search-api.vercel.app/search/cheese',
    Post: 'https://google-custom-image-search-api.vercel.app/search',
    search: 'cheese',
  })
})
app.post('/search', (req, res) => {
  const search = req.body
  const url = `https://www.google.com/search?q=${search}&tbm=isch`
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html)
      const images = []
      $('img').each((i, el) => {
        const src = $(el).attr('src')
        images.push(src)
      })
      images.shift()
      res.status(200).json(images)
    }
  })
})
app.get('/search/:name', (req, res) => {
  let name = req.params.name
  let url = `https://www.google.com/search?q=${name}&source=lnms&tbm=isch`
  request(url, (error, response, html) => {
    if (!error) {
      let $ = cheerio.load(html)
      let images = []
      // Get all images
      $('img').each((i, image) => {
        images.push($(image).attr('src'))
      })
      //pop the first image as it is the google logo
      images.shift()
      //print in json
      res.status(200).json({
        images,
      })
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
