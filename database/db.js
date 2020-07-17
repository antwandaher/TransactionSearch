/**
 * You do not need to modify this file unless you change the database. 
 * If you do end up changing it, please explain why and what did you modify.
 */

const db = require('./db.json');

function findTransaction(id) {
    return db.transactions.find(t => t.id == id);
}

function findProduct(id) {
    return db.products.find(p => p.id == id);
}

exports.findTransaction = findTransaction;
exports.findProduct = findProduct;
