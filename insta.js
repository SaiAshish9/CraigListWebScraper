const request = require("request-promise");
const cheerio = require("cheerio");
const express=require('express')
const app=express()

const url = "https://www.instagram.com/explore/tags/womenempowerment/";


app.get('/', async (req,res)=>{
  const htmlResult = await request.get(url);
  const $ = await cheerio.load(htmlResult);
  const scrapeResults = [];

console.log($);



res.json($('#react-root').html())
})

app.listen(3000,()=>console.log("server started"))
