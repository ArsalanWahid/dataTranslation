const fs = require('fs');


let BASE = 'dev_ref.json'
let ADDRESS_FILE = 'address_N.json'
let WRITE_FILE = 'TAD_N'

let latest_retailers = fs.readFileSync(`${BASE}`);
let addresses = fs.readFileSync(`./address_data/${ADDRESS_FILE}`);
let r = JSON.parse(latest_retailers);
let a = JSON.parse(addresses);

const intersection_addresses = a.filter(item1 => r.some(item2 => item1.reference === item2.reference))
const intersection_retailers = r.filter(item1 => a.some(item2 => item1.reference === item2.reference))
var address_to_add = [];

// make sure the address has retailer id

intersection_retailers.forEach(retailer => {
    intersection_addresses.forEach(address => {
        if (retailer.reference == address.reference) {
            let payload = {
                "retailer": {
                    $oid: retailer._id.$oid
                },
                "title": address.title,
                "addressLine1": address.addressLine1 || "",
                "addressLine2": address.addressLine2 || "",
                "city": address.city || "",
                "state": address.state || "",
                "zip": address.zip || "",
                "email": address.email || "",
                "isDeleted": 0
            }
            address_to_add.push(payload);
        }
    })
});

fs.appendFileSync(`./prepped_addresses/${WRITE_FILE}`, '[\n')

address_to_add.forEach(address => {
    fs.appendFileSync(`./prepped_addresses/${WRITE_FILE}`, JSON.stringify(address, null, 2))
    fs.appendFileSync(`./prepped_addresses/${WRITE_FILE}`, ',\n')
});

fs.appendFileSync(`./prepped_addresses/${WRITE_FILE}`, ']')