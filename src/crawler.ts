import * as rp from 'request-promise'
import * as cheerio from 'cheerio'
import config from './config'

export default function init() {
    console.log('Starting crawler')
    crawl()
}

function crawl() {
    rp(config.baseUrl)
        .then(function(html) {
            const elements = cheerio('strong > span > a', html)
            const archives = elements.toArray().filter((it: any) => it.attribs && it.attribs.title && it.attribs.title.indexOf('All Capoeira Corridos Songs – ') !== -1)
            const urls = archives.map(it => it.attribs.href)
            crawlArchive(urls[getRandomIndex(urls)])
        })
}

function crawlArchive(archive: string) {
    console.log(`
        Checking for songs which start with the letter ${archive.split('')[archive.split('').length - 2].toUpperCase()}
    `)
    rp(archive)
        .then(function(html) {
            const elements = cheerio('.page_item > a', html)
            const songs = elements.toArray().map(it => {
                return {
                    name: it.children[0].data,
                    url: it.attribs.href
                }
            })
            
            let randomSong = songs[getRandomIndex(songs)]
            console.log(`Check out this song: ${randomSong.name}`)
            console.log(randomSong.url)
        })
}

function getRandomIndex(array): number {
    return Math.floor(Math.random() * (array.length - 1))
}