const https = require('https');
const retailers = require('./retailer.json')
const address = require('./address.json')
const sampleA = require('./sampleA.json')
const sampleR = require('./sampleR.json')
const qs = require('qs');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// use node basic http lib 

async function populateAddressData() {
    sampleR.forEach(retailer => {
        var options = {
            'method': 'POST',
            'hostname': 'dickies.dev',
            'path': '/api/retailer',
            'headers': {
                'Content-Type': 'application/json'
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log("retailer added --->",JSON.parse(body));
                let data = JSON.parse(body);
                console.log(data.id);
                address.forEach(address => {
                    if(address.reference == retailer.reference) {
                        var options = {
                            'method': 'POST',
                            'hostname': 'dickies.dev',
                            'path': '/api/address',
                            'headers': {
                                'Content-Type': 'application/json'
                            },
                            'maxRedirects': 20
                        };
                
                        var req = https.request(options, function (res) {
                            var chunks = [];
                
                            res.on("data", function (chunk) {
                                chunks.push(chunk);
                            });
                
                            res.on("end", function (chunk) {
                                var body = Buffer.concat(chunks);
                                console.log("address added --->",body.toString());
                            });
                
                            res.on("error", function (error) {
                                console.error(error);
                            });
                        });
                
                        var postData = JSON.stringify({
                            retailer: `${data.id}`,
                            title: address.title,
                            addressLine1: address.addressLine1 || "",
                            addressLine2: address.addressLine2 || "",
                            city: address.city || "",
                            state: address.city || "",
                            zip: address.zip || "",
                            email: address.email || "",
                        });
                        console.log(postData);
                        req.write(postData);
                
                        req.end();
                    }else {
                        console.log("address not added");
                    }
                })
            });

            res.on("error", function (error) {
                console.error(error);
            });
        });

        var postData = JSON.stringify({
            "title": retailer.title,
            "account_directors": [retailer.account_directors]
        });

        req.write(postData);

        req.end();
    })
}

populateAddressData();