const request = require("request-promise");
const cheerio = require("cheerio");
const express=require('express')
const app=express()

const url = "https://www.empowerwomen.org/en/who-we-are/news";


app.get('/', async (req,res)=>{
  const htmlResult = await request.get(url);
  const $ = await cheerio.load(htmlResult);
  const scrapeResults = [];

$('.title').each((i,x)=>{
  scrapeResults.push($(x).html())
})


res.send(scrapeResults)
})

app.listen(3000,()=>console.log("server started"))
