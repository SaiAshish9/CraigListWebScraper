const request = require("request-promise");
const cheerio = require("cheerio");
const express=require('express')
const app=express()
const ObjectsToCsv = require("objects-to-csv");


const url = "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof";

const scrapeSample = {
  title: "Back-End Engineering Manager",
  description:
    "We built Mode from the ground up as the best product for Analysts and Data Scientists.",
  datePosted: "2019-12-08T13:22:00.000Z",
  url:
    "https://sfbay.craigslist.org/sfc/sof/d/san-francisco-back-end-engineering/7034911834.html",
  employmenttype:" full-time"
};

const scrapeResults = [];

app.get('/',(req,res)=>{

  async function scrapeJobHeader() {
    try {
      const htmlResult = await request.get(url);
      const $ = await cheerio.load(htmlResult);

      $(".result-info").each((index, element) => {
        const resultTitle = $(element).children(".result-title");
        const title = resultTitle.text();
        const url = resultTitle.attr("href");
        const datePosted = new Date(
          $(element)
            .children("time")
            .attr("datetime")
        );
        const hood = $(element)
          .find(".result-hood")
          .text();
        const scrapeResult = { title, url, datePosted, hood };
        scrapeResults.push(scrapeResult);
      });
      // res.send(scrapeResults)
      return scrapeResults;
    } catch (err) {
      console.error(err);
    }
  }

  async function scrapeDescription(jobsWithHeaders) {
    return await Promise.all(
      jobsWithHeaders.map(async job => {
        try {
          const htmlResult = await request.get(job.url);
          const $ = await cheerio.load(htmlResult);
          $(".print-qrcode-container").remove();
          job.description = $("#postingbody").text();
          job.address = $("div.mapaddress").text();
          const compensationText = $(".attrgroup")
            .children()
            .first()
            .text();
          job.compensation = compensationText.replace("compensation: ", "");
          return job;
        } catch (error) {
          console.error(error);
        }
      })
    );
  }

  async function scrapeCraigslist() {
    const jobsWithHeaders = await scrapeJobHeader();
    const jobsFullData = await scrapeDescription(jobsWithHeaders);
    res.json(jobsFullData)
    // await createCsvFile(jobsFullData);

  }

  async function createCsvFile(data) {
  let csv = new ObjectsToCsv(data);

  await csv.toDisk("./test.csv");
}





  scrapeCraigslist()
})



app.listen(3000,()=>console.log("server started"))
