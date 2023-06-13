import mysql from 'mysql';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';

const PORT = 8050;
const app = express();

const staticPath = path.resolve('public');
const assetsPath = path.resolve('assets');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage });


app.use(express.static(staticPath));
app.use('/assets', express.static(assetsPath));

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
    multipleStatements: true,
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
    if (req.session.jabatan === "Member") {
        next();
    } else {
        // Jika pengguna belum login, redirect ke halaman login
        res.redirect('/login');
    }
};

const authAdmin = async (req, res, next) => {
    if (req.session.jabatan === "Admin") {
        next();
    } else {
        // Jika pengguna belum login, redirect ke halaman login
        res.redirect('/login');
    }
};

const authPimpinan = async (req, res, next) => {
    if (req.session.jabatan === "Pimpinan") {
        next();
    } else {
        // Jika pengguna belum login, redirect ke halaman login
        res.redirect('/login');
    }
};


app.get('/', async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs = `SELECT * FROM musik ORDER BY RAND() LIMIT 7; SELECT * FROM musik ORDER BY RAND() LIMIT 7`;
            conn.query(querySongs, [1, 2], (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('mainUser', {
                        name: req.session.name,
                        image: image,
                        hasilQuery: results2[0],
                        hasilQuery2: results2[1]
                    });
                }
            });
        }
    });
});

app.get('/discoverUser', async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs = `SELECT * FROM musik ORDER BY RAND() LIMIT 7; SELECT * FROM musik ORDER BY RAND() LIMIT 7`;
            conn.query(querySongs, [1, 2], (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('discoverUser', {
                        name: req.session.name,
                        image: image,
                        hasilQuery: results2[0],
                        hasilQuery2: results2[1]
                    });
                }
            });
        }
    });
});
app.get('/subgenreUser', async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs =
                `SELECT subgenre.idSubGenre as id, subgenre.nama as nama, 
            genre.nama as namaG, subgenre.cover FROM subgenre JOIN genre 
            ON subgenre.idGenre = genre.idGenre ORDER BY RAND() LIMIT 7;
            SELECT subgenre.idSubGenre as id, subgenre.nama as nama, 
            genre.nama as namaG, subgenre.cover FROM subgenre JOIN genre 
            ON subgenre.idGenre = genre.idGenre ORDER BY RAND() LIMIT 7`;
            conn.query(querySongs, [1, 2], (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('subgenreUser', {
                        name: req.session.name,
                        image: image,
                        hasilQuery: results2[0],
                        hasilQuery2: results2[1]
                    });
                }
            });
        }
    });
});

app.get('/subgenre/:subgenreId', (req, res) => {
    const subgenreId = req.params.subgenreId;

    // Query database untuk mendapatkan lagu dari subgenre dengan subgenreId yang diberikan
    // Contoh menggunakan SQL
    pool.query(
        `SELECT * FROM musik WHERE idSubGenre = ?;
        SELECT nama FROM subgenre WHERE idSubGenre = ?`,
        [subgenreId, subgenreId],
        (error, results) => {
            if (error) {
                // Jika terjadi error saat menjalankan query
                res.status(500).json({ error: "Database error" });
            } else if (results.length === 0) {
                // Jika data tidak ditemukan berdasarkan ID
                res.status(404).json({ error: "Path audio not found" });
            } else {
                // Jika data ditemukan, kirim semua informasi
                const musicData = results[0].map((music) => {
                    return {
                        id: music.idMusik,
                        title: music.judul,
                        artist: music.artis,
                        path: music.audioPath,
                        cover: music.cover
                        // tambahkan atribut musik lainnya sesuai kebutuhan
                    };
                });
                res.json({
                    hasilQuery: musicData,
                    hasilQuery2: results[1][0].nama
                });
            }
        }
    );
});



app.get('/genreUser', async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs = `SELECT * FROM musik LIMIT 7`;
            conn.query(querySongs, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('genreUser', {
                        name: req.session.name,
                        image: image,
                        results: results2
                    });
                }
            });
        }
    });
});


app.get('/mainAdmin', authAdmin, async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs = `SELECT * FROM musik LIMIT 7`;
            conn.query(querySongs, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('mainAdmin', {
                        name: req.session.name,
                        image: image,
                        results: results2
                    });
                }
            });
        }
    });
});
app.get('/songsAdmin', authAdmin, async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs = `SELECT * FROM musik LIMIT 7`;
            conn.query(querySongs, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('songsAdmin', {
                        name: req.session.name,
                        image: image,
                        results: results2
                    });
                }
            });
        }
    });
});

app.get('/mainPimpinan', authPimpinan, async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs = `SELECT * FROM musik LIMIT 7`;
            conn.query(querySongs, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    let image = null;
                    if (results.length > 0 && results[0].profilepic) {
                        image = Buffer.from(results[0].profilepic).toString('base64');
                    }
                    res.render('mainPimpinan', {
                        name: req.session.name,
                        image: image,
                        results: results2
                    });
                }
            });
        }
    });
});

app.get('/login', async (req, res) => {
    const conn = await dbConnect();
    res.render('login');
});

app.get('/signup', async (req, res) => {
    const conn = await dbConnect();
    res.render('signup');
});


app.get('/homePage', async (req, res) => {
    const conn = await dbConnect();
    res.render('homePage');
});


// Rute untuk handle pencarian lagu
app.get('/search', (req, res) => {
    const query = req.query.query;
    const sql = `SELECT * FROM musik WHERE judul LIKE '%${query}%' OR artis LIKE '%${query}%' LIMIT 5`;

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json(results);
        }
    });
});

app.get("/api/get-audio-path", async (req, res) => {
    // Ambil ID lagu dari parameter URL
    const id = req.query.id;
    // Jalankan query MySQL untuk mengambil audioPath berdasarkan ID
    pool.query(
        "SELECT * FROM musik WHERE idMusik = ?",
        [id],
        (error, results) => {
            if (error) {
                // Jika terjadi error saat menjalankan query
                res.status(500).json({ error: "Database error" });
            } else if (results.length === 0) {
                // Jika data tidak ditemukan berdasarkan ID
                res.status(404).json({ error: "Path audio not found" });
            } else {
                // Jika data ditemukan, kirim semua informasi
                const audioPath = results[0].pathAudio;
                const title = results[0].judul;
                const artist = results[0].artis;
                const cover = results[0].cover
                res.json({
                    title: title,
                    artist: artist,
                    path: audioPath,
                    cover: cover
                });
            }
        }
    );
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
                        req.session.name = results[0].nama;
                        req.session.jabatan = results[0].jabatan;
                        // Redirect ke halaman utama (tabel users)
                        if (req.session.jabatan === "Member") {
                            res.redirect('/');
                        } else if (req.session.jabatan === "Admin") {
                            res.redirect('/mainAdmin');
                        } else if (req.session.jabatan === "Pimpinan") {
                            res.redirect('/mainPimpinan');
                        }
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


app.post('/logout', (req, res) => {
    // Hapus session
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        // Redirect ke halaman login setelah logout
        res.redirect('/login');
    });
});

app.post('/signup', upload.single('profilepic'), async (req, res) => {
    try {
        const conn = await dbConnect();
        const username = req.body.username;
        const password = req.body.password;
        const rePassword = req.body.reconfirmpassword;
        const name = req.body.name;
        const tanggalBergabung = getCurrentDate();
        const hashedPassword = hashPassword(password);
        console.log(req.file);
        console.log(req.body.profilepic);
        let buffer = null;
        if (req.file) {
            buffer = fs.readFileSync(req.file.path);
        }
        //cek apakah username dan password kosong
        const query = `
            INSERT INTO pengguna (username, password, nama, 
            jabatan, isActive, tgl_Bergabung, tgl_Keluar, profilepic) 
            VALUES (?, ?, ?, "Member",
            TRUE, ? , NULL, ?)
        `;
        if (username && password && name && (password === rePassword)) {
            conn.query(query, [username, hashedPassword, name, tanggalBergabung, buffer], (err, results) => {
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

