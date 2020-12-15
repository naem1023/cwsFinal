var express = require('express');
var http = require('http');
const MongoClient = require('mongodb').MongoClient;

var router = express.Router();

// lambda function url
var lambda_good = "https://64ukpcl22m.execute-api.ap-northeast-2.amazonaws.com/v1/good_invest";
var lambda_bad = "https://7e5v2dhqsh.execute-api.ap-northeast-2.amazonaws.com/v1/bad_invest"

const https = require('https');
var good_json_data = {};
var bad_json_data = {};

function handleGet (url, target) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (target == "good") {
          console.log("good");
          good_json_data = JSON.parse(data);  
        }
        else if (target == "bad"){
          console.log("bad");
          bad_json_data = JSON.parse(data);
        }
        resolve();
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(error)
    });
  })
}

async function save_db(data1, data2) {
  var client = null;
  var col_invest;
  var col_bad;
  
  try {
    const url = 'mongodb://172.31.6.146:27017';
    client = await MongoClient.connect(url);

    const database = client.db('investing');
    col_invest = database.collection('investing_list');
    col_bad = database.collection('bad_list');

    for (var i = 0; i < data1.length; i++) {
      await col_invest.insertOne(data1[i]);
    }
    
    for (var i = 0; i < data2.length; i++) {
      await col_bad.insertOne(data2[i]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    // console.log(col_invest.find());
    // console.log(col_bad.find());
    await client.close();
  }
}

reduce_good_json = [];
reduce_bad_json = [];

// Get json data from lambda function
Promise.all([
  handleGet(lambda_good, "good"),
  handleGet(lambda_bad, "bad")
]).then( () => {
  for (var i = 0; i < 10; i++) {
    reduce_good_json.push(good_json_data[i]);
    reduce_bad_json.push(bad_json_data[i]);
  }

  console.log(reduce_good_json);

  save_db(reduce_good_json, reduce_bad_json);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CWS:::Which one is best?', 
    good_data : reduce_good_json, bad_data : reduce_bad_json});
});

module.exports = router;