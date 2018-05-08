module.exports = (app)=>{
    var quotes = require("../controllers/quotes")()
    console.log(quotes);
    app.get("/", (req, res)=>{
        quotes.index(req, res);
    });
    app.get("/quotes", (req, res)=>{
        quotes.quotes(req, res);
    });
    app.post('/quotes', (req, res)=> {
        quotes.addquotes(req, res);
    });
}