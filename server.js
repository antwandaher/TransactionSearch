const express = require('express');
const path = require('path');
const db = require('./database/db');
const { EWOULDBLOCK } = require('constants');

// const cors = require('cors');

const app = express();

const validateTransactionID = (transID) => {
    return true;
};
  
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // TODO: For testing purposes.
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    next();
  });
  
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Fetch eligible returns
app.get('/eligiblereturns', (req, res) => {
    let returnable;
    let successful;
    const transactionRegex = new RegExp(/^[0-9]+/);
    if (req.query.transactionID === undefined || req.query.transactionID === '' || req.query.tdStamp === undefined ) {
        returnable = 'Missing query values.';
        successful = false;
    } else if(!transactionRegex.test(req.query.transactionID)) {
        returnable = 'Bad transaction ID.';
        successful = false;
    } else {
        const transID = req.query.transactionID;
        const todaysDate = new Date(parseInt(req.query.tdStamp));
        const transaction = db.findTransaction(transID);
        if (transaction && transaction.transaction_date &&  transaction.prods && transaction.prods.length > 0) {
            returnable = [];
            successful = true;
            const purchaseDate = new Date(transaction.transaction_date.replace('T', ' ')); 
            const returnableDate = new Date(purchaseDate);
            returnableDate.setDate(returnableDate.getDate() + 30);
            if (todaysDate.getTime() < returnableDate.getTime()) {
                for (var productIndex in transaction.prods) {
                    let product = transaction.prods[productIndex];
                    if (product.onsale === false) {
                        let product_details = db.findProduct(product.id);
                        if (product_details.returnable) {
                            const returned = Object.assign(product_details, product);
                            returnable.push(returned);
                        }
                    }
                }
            }
        } else {
            successful = false;
            returnable = 'No matching transaction.';
        }
    }
    res.status(200).send({data: returnable, successful: successful});
});


// Handles any requests that don't match the ones above
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
