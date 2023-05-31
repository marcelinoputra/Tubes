import mysql from 'mysql';
import express, { response } from "express";
import path from "path";
import bodyParser from "body-parser";
import crypto from 'crypto';
import session from 'express-session';

const PORT = 8050;
const app = express();

const staticPath = path.resolve('public');
app.use(express.static(staticPath));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


// Fungsi untuk menghasilkan hash password menggunakan algoritma SHA256
function hashPassword(password) {
    const hashed_pass = crypto.createHash('sha256').update(password).digest('base64');
    return hashed_pass;
}

const pool = mysql.createPool({
    user: 'root',
    password: '',
    database: 'ide',
    host: 'localhost'
});

const dbConnect = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        })
    })
}

app.get('/login', async(req, res) =>{
    const conn = await dbConnect();
    res.render('login');
});

app.get('/signup', async(req, res) =>{
    const conn = await dbConnect();
    res.render('signup');
});

app.get('/loginNotUser', async(req, res) =>{
    const conn = await dbConnect();
    res.render('loginNotUser');
});

app.get('/loginAdmin', async(req, res) =>{
    const conn = await dbConnect();
    res.render('loginAdmin');
});

app.get('/loginLeader', async(req, res) =>{
    const conn = await dbConnect();
    res.render('loginLeader');
});


app.listen(PORT, () => {
    console.log(`Server is ready, listening in port ${PORT}`);
});

