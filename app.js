const express = require("express");
const mongoose = require('mongoose');
const config = require('config');
let cors = require('cors')

const app = express();

app.use(express.json({ extended: true }));

// let corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(cors())
app.use('/static', express.static('static'));
// app.use(express.static('../static'));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/songs', require('./routes/songs.routes'));
app.use('/api/albums', require('./routes/albums.routes'));
app.use('/api/changes', require('./routes/changes.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

app.get('/', (req, res) => {
    res.end(`<h1>Now path ${req.path}</h1>`)
})

const PORT = process.env.PORT || config.get("port") || 5050;

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log('server started on port: ', PORT));
    }
    catch (e) { 
        console.log(e.message);
        process.exit(1);
    }
}
start();

