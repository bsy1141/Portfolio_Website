import axios from "axios";
import cheerio from "cheerio";

//const axios = require("axios");
//const cheerio = require("cheerio");

// 한달
export const EXPIRE_DELAY_TIME = 30*86400*1000;

// 5분
export const EXPIRE_CODE_TIME = 1000 * 60 * 5;

export const randomString = () => {
    const chars = "0123456789";
    const stringLength = 6
    
    let randomstring = ''
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length)
      randomstring += chars.substring(rnum, rnum + 1)
    }
    return randomstring
}

export const getHTML = async (url) => {
  try {
      return await axios(`${url}`)
  } catch(e) {
      return null
  }
}

export const crawler = async (message) => {
    
  try {
      const html = await getHTML(message)
      if(html === null) {
          throw new Error("Error get html");
      }
      // todo
      // li를 배열로 받아서 하나씩 파싱

      const $ = cheerio.load(html.data);
      const $temp = $(".Layout-sidebar").children(".BorderGrid--spacious").children()
                    .last().children(".BorderGrid-cell").children().last().children()
      
      let language = {};

      $temp.each((i, d) => {
        language[d.children[1].children[3].children[0].data] = d.children[1].children[5].children[0].data
      })
      
      return language;

  } catch (e) {
      console.log(e.message)
  }
}

crawler("https://github.com/YeonSeok-Song/WEBSITE-CLONE-CODING")