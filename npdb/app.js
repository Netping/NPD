const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(bodyParser.json());
app.listen(3000)


app.post('/config/make', (req, res) => {
  if (req.body.content) {
    var jsonConfig = req.body.content;
    var fileName = 'download.json';
    // console.log(req.body.mode);
    if (req.body.mode == 'server') {
      fileName = 'default.json';
    }
    var jsonPath = path.join(__dirname, 'config', fileName);
    fs.writeFileSync(jsonPath, jsonConfig, function (err, data) {
      if (err) {
        console.log(err);
      }
    });
    res.send('made ' + req.body.mode + ' config');
  } else {
    res.send('no body')
  }
})

app.get('/config/download', (req, res) => {
  var jsonPath = path.join(__dirname, 'config', 'download.json');
  res.header("Content-Type", 'application/json');
  res.download(jsonPath, 'conf_' + Math.floor(Date.now() / 1000) + '.json');
})

app.get('/config/get', (req, res) => {
  if (req.query.profile) {
    var jsonPath = path.join(__dirname, 'config', req.query.profile + '.json');
    // console.log(jsonPath);
    if (fs.existsSync(jsonPath)) {
      res.header("Content-Type", 'application/json');
      res.sendFile(jsonPath);
    } else {
      res.send('no file')
    }
  } else {
    res.send('no query')
  }
})

app.get('/', (req, res) => {
  res.render('home', {
    name: 'John'
  })
})

app.get('/device', (req, res) => {
  let options = {
    layout: false
  };
  if (req.query) {
    for (var prop in req.query) {
      options[prop] = req.query[prop];
    }
  }
  res.render('partials/device', options)
})

app.get('/getinfo', (req, res) => {
  var options = {};
  if (req.query) {
    var data = req.query;
    // console.log(data);
    // visor43:ping43@tst.alentis.ru:8043/thermo.cgi?t8
    var cgi = {
      t: '/thermo.cgi?t'
    }
    var npUrl = data.nphost.replace(/(^\w+:|^)\/\//, '');
    var npHost = npUrl.split(':')[0];
    var npPort = npUrl.split(':')[1];
    var npPath = cgi[data.nptype];
    options = {
      host: npHost,
      port: npPort,
      auth: data.nplogin + ':' + data.nppassword,
      path: npPath + data.npnumber
    };
  }

  var http = require('http');
  var str = '';
  callback = (resp) => {
    resp.on('data', (chunk) => {
      str += chunk;
    });
    resp.on('end', () => {
      let currentTemp = '';
      if (str.length) currentTemp = str.split(',')[1].replace(/\s/g, '');
      res.json(currentTemp);
    });
  }
  var req = http.request(options, callback);
  req.on('error', (error) => {
    console.log(error);
  });
  req.end();

})
