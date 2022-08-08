const fs = require('fs');

let raw_prod_retailer = fs.readFileSync('prod_retailers.json');
let raw_retailer = fs.readFileSync('retailer.json');
let prod_retailer = JSON.parse(raw_prod_retailer);
let retailer = JSON.parse(raw_retailer);

function getDifference(array1, array2) {
    return array1.filter(object1 => {
        return !array2.some(object2 => {
            return object1.title === object2.title;
        });
    });
}

let result = getDifference(retailer, prod_retailer);


fs.appendFileSync("./new_retailer.json", '[\n')

result.forEach(element => {
    let dataTransform = {
        "title": element.title,
        "account_director": element.account_directors,
        "account_directors": []
    }
    fs.appendFileSync("./new_retailer.json", JSON.stringify(dataTransform, null, 2))
    fs.appendFileSync("./new_retailer.json", ',\n')
});

fs.appendFileSync("./new_retailer.json", ']')