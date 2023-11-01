
const puppeteer = require("puppeteer");

const getQuotes = async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto("https://apps.apple.com/us/story/id1535572612", {
        waitUntil: "domcontentloaded",
    });

    const quotes = await page.evaluate( () => {
        
        const quoteList = document.querySelectorAll(".we-product-collection__item");

        return Array.from(quoteList).map( (quote, index) => {
            const id = index + 1;
            const name = quote.querySelector(".we-product-collection__item__product-name").innerText;
            const description = quote.querySelector(".we-product-collection__item__category").innerText;
            const image = quote.querySelector(".we-artwork--ios-app-icon").querySelector("source").getAttribute("srcset").match(/(https:\/\/[^,\s]+)/)[0];
            const android_url = quote.querySelector(".we-product-collection__item__button").getAttribute("href");
            const ios_url = quote.querySelector(".we-product-collection__item__button").getAttribute("href");
            return { id, name, description, image, android_url, ios_url };
        } );

    });

    console.log(quotes);

    await browser.close();

}

function main(){

    getQuotes();

}

main();
