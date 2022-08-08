// for all retailer and data version 

const fs = require('fs');

let raw_dev = fs.readFileSync('dev_retailers_data.json');
let raw_retailer = fs.readFileSync('retailer.json');
let dev = JSON.parse(raw_dev);
let retailer = JSON.parse(raw_retailer);

var counter = 0

dev.forEach(e => {
    retailer.forEach(r => {
        if(e.title == r.title) {
            counter += 1;
            e.reference = r.reference;
        }
    })
});

fs.appendFileSync("./temp.json", JSON.stringify(dev));
