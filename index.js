import mysql from 'mysql';
import express from "express";
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
// Fungsi untuk mendapat tanggal hari ini
function getCurrentDate() {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; // Menggunakan indeks bulan 0-11, tambahkan 1 untuk mendapatkan bulan yang tepat
    const year = today.getFullYear();

    // Tambahkan leading zero jika tanggal atau bulan hanya satu digit
    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    const currentDate = `${year}-${month}-${day}`;

    return currentDate;
}

const pool = mysql.createPool({
    user: 'root',
    password: '',
    database: 'tubes',
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

const authMember = async (req, res, next) => {
    if (req.session.username) {
        const conn = await dbConnect();
        const query = `
            SELECT *
            FROM pengguna
            WHERE jabatan = "Member"
        `;
        conn.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                if (result.length > 0) {
                    console.log(result);
                    // Jika pengguna sudah login dan memiliki role admin, lanjutkan ke halaman yang diminta
                    next();
                } else {
                    // Jika pengguna tidak memiliki role admin, tampilkan halaman forbidden
                    res.status(403).send('forbidden');
                }
            }
        });
    } else {
        // Jika pengguna belum login, redirect ke halaman login
        res.redirect('/login');
    }
};

app.get('/', authMember, async (req, res) => {
    const conn = await dbConnect();
    res.render('mainUser');
});

app.get('/login', async (req, res) => {
    const conn = await dbConnect();
    res.render('login');
});

app.get('/signup', async (req, res) => {
    const conn = await dbConnect();
    res.render('signup');
});

app.get('/loginNotUser', async (req, res) => {
    const conn = await dbConnect();
    res.render('loginNotUser');
});

app.get('/loginAdmin', async (req, res) => {
    const conn = await dbConnect();
    res.render('loginAdmin');
});

app.get('/loginLeader', async (req, res) => {
    const conn = await dbConnect();
    res.render('loginLeader');
});

app.post('/login', async (req, res) => {
    try {
        const conn = await dbConnect();
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = hashPassword(password);
        //cek apakah username dan password kosong
        const query = `SELECT * FROM pengguna WHERE username = ? AND password = ?`;
        if (username && password) {
            conn.query(query, [username, hashedPassword], (err, results) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    if (results.length > 0) {
                        console.log('berhasil');
                        // Tambahkan session dengan nama pengguna
                        req.session.username = results[0].username;
                        req.session.name = results[0].name;
                        req.session.userID = results[0].userID;
                        // Redirect ke halaman utama (tabel users)
                        res.redirect('/');
                    } else {
                        // Jika akun tidak ditemukan, tetap berada di halaman login
                        res.redirect('/login');
                    }
                }
            });
        } else {
            // Jika username atau password kosong
            console.log('login gagal, username dan password harus diisi');
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/signup', async (req, res) => {
    try {
        const conn = await dbConnect();
        const username = req.body.username;
        const password = req.body.password;
        const rePassword = req.body.reconfirmpassword;
        const name = req.body.name;
        const tanggalBergabung = getCurrentDate();
        const hashedPassword = hashPassword(password);
        console.log(tanggalBergabung);
        //cek apakah username dan password kosong
        const query = `
            INSERT INTO pengguna (username, password, nama, 
            jabatan, isActive, tgl_Bergabung, tgl_Keluar) 
            VALUES (?, ?, ?, "Member",
            TRUE, ? , NULL)
        `;
        if (username && password && name && (password === rePassword)) {
            conn.query(query, [username, hashedPassword, name, tanggalBergabung], (err, results) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    res.redirect('/login');
                }
            });
        } else {
            // Jika username atau password atau nama kosong
            res.redirect('/signup');
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


app.listen(PORT, () => {
    console.log(`Server is ready, listening in port ${PORT}`);
});

