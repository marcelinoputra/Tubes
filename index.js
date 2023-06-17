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


app.get('/', authMember, async (req, res) => {
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

app.post('/applypremium', async (req, res) => {
    const fullname = req.body.fullName;
    const address = req.body.address;
    const carnumber = req.body.cardnumber;
    const paket = req.body.package;
    const tglBayar = getCurrentDate();
    const query = `INSERT INTO pembayaran (tgl_Bayar, isVerified, paket, username) VALUES (?, ?, ?, ?) `;
    console.log(req.session.username);
    console.log(paket);
    pool.query(query, [tglBayar, 1, paket, req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.redirect('/');
        }
    });
});

app.get('/discoverUser', authMember, async (req, res) => {
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
app.get('/subgenreUser', authMember, async (req, res) => {
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
            ON subgenre.idGenre = genre.idGenre;`
            conn.query(querySongs, (err, results2) => {
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
                        hasilQuery: results2,
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

app.get('/genreUser', authMember, async (req, res) => {
    const conn = await dbConnect();
    const query = `SELECT profilepic FROM pengguna WHERE username = ?`;
    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const querySongs =
                `SELECT * FROM genre;`
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
                        hasilQuery: results2,
                    });
                }
            });
        }
    });
});

app.get('/genre/:genreId', (req, res) => {
    const genreId = req.params.genreId;

    // Query database to retrieve songs from the specified genre
    pool.query(
        `SELECT musik.*, musik.cover AS music_cover, genre.cover AS genre_cover FROM musik JOIN subgenre on 
        musik.idSubGenre = subgenre.idSubGenre JOIN genre ON 
        subgenre.idGenre = genre.idGenre WHERE genre.idGenre = ?;
        SELECT nama FROM genre WHERE idGenre = ?`,
        [genreId, genreId],
        (error, results) => {
            if (error) {
                // If an error occurs while executing the query
                res.status(500).json({ error: "Database error" });
            } else if (results.length === 0) {
                // If no data is found based on the ID
                res.status(404).json({ error: "Path audio not found" });
            } else {
                // If data is found, send all the information
                const musicData = results[0].map((music) => {
                    return {
                        id: music.idMusik,
                        title: music.judul,
                        artist: music.artis,
                        path: music.audioPath,
                        cover: music.music_cover
                        // Add other music attributes as needed
                    };
                });
                const genreName = results[1][0].nama;
                res.json({
                    hasilQuery: musicData,
                    hasilQuery2: genreName
                });
            }
        }
    );
});




app.get('/mainAdmin', authAdmin, async (req, res) => {
    const conn = await dbConnect();
    const query = `
        SELECT profilepic FROM pengguna WHERE username = ?;
        SELECT COUNT(*) AS nTimes FROM daftarputarmusik;
        SELECT COUNT(*) AS nSongs FROM musik;
        SELECT COUNT(*) AS nUsers FROM pengguna WHERE isActive = 1;
        SELECT subgenre.nama, subgenre.cover, COUNT(subgenre.idSubGenre) AS countSubgenre
        FROM daftarputarmusik JOIN musik
        ON daftarputarmusik.idMusik = musik.idMusik JOIN subgenre
        ON musik.idSubGenre = subgenre.idSubGenre
        GROUP BY subgenre.idSubGenre
        ORDER BY COUNT(subgenre.idSubGenre) DESC
        LIMIT 3;
        SELECT genre.nama, genre.cover, COUNT(genre.idGenre) AS countGenre
        FROM daftarputarmusik JOIN musik
        ON daftarputarmusik.idMusik = musik.idMusik JOIN subgenre
        ON musik.idSubGenre = subgenre.idSubGenre JOIN genre
        ON subgenre.idGenre = genre.idGenre
        GROUP BY genre.idGenre
        ORDER BY COUNT(genre.idGenre) DESC
        LIMIT 3;
        SELECT DISTINCT musik.cover, musik.judul, musik.artis,
        subgenre.nama as subNama, genre.nama as genNama
        FROM daftarputarmusik JOIN musik
        ON daftarputarmusik.idMusik = musik.idMusik JOIN subgenre
        ON musik.idSubGenre = subgenre.idSubGenre JOIN genre
        ON subgenre.idGenre = genre.idGenre
        ORDER BY daftarputarmusik.tglPutar DESC LIMIT 20;
        SELECT musik.cover, musik.judul, musik.artis, 
        COUNT(daftarputarmusik.idMusik) as jumlah
        FROM musik JOIN daftarputarmusik
        ON musik.idMusik = daftarputarmusik.idMusik
        GROUP BY daftarputarmusik.idMusik
        ORDER BY COUNT(daftarputarmusik.idMusik) DESC LIMIT 20`;

    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            let image = null;
            if (results.length > 0 && results[0].profilepic) {
                image = Buffer.from(results[0].profilepic).toString('base64');
            }

            const nTimes = results[1][0].nTimes.toString();
            const nSongs = results[2][0].nSongs.toString();
            const nUsers = results[3][0].nUsers.toString();

            res.render('mainAdmin', {
                name: req.session.name,
                image: image,
                nTimes: nTimes,
                nSongs: nSongs,
                nUsers: nUsers,
                top3Subgenre: results[4],
                top3Genre: results[5],
                recentlyPlayed: results[6],
                mostListened: results[7]
            });
        }
    });
});

app.get('/songsAdmin', authAdmin, async (req, res) => {
    const conn = await dbConnect();
    const filterOption = req.query.optFilter;
    const filterValue = req.query.filterVal;
    const query = `SELECT profilepic FROM pengguna WHERE username = ?;
    SELECT nama FROM subgenre; SELECT COUNT(*) AS totalRows FROM musik`;

    conn.query(query, [req.session.username], (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            let querySongs = `SELECT musik.idMusik, musik.cover, musik.judul, musik.artis,
            musik.tglRilis, genre.nama AS genNama, subgenre.nama AS subNama
            FROM musik JOIN subgenre ON musik.idSubGenre = subgenre.idSubGenre
            JOIN genre ON subgenre.idGenre = genre.idGenre`;

            if (filterOption && filterValue) {
                // Add the filter conditions based on the selected option and filter value
                if (filterOption === "genre") {
                    querySongs += ` WHERE genre.nama = '${filterValue}'`;
                } else if (filterOption === "subgenre") {
                    querySongs += ` WHERE subgenre.nama = '${filterValue}'`;
                } else if (filterOption === "artist") {
                    querySongs += ` WHERE musik.artis = '${filterValue}'`;
                } else if (filterOption === "releaseDate") {
                    querySongs += ` WHERE musik.tglRIlis LIKE '%${filterValue}%'`;
                }
            }

            const page = req.query.page || 1;
            querySongs += ` ORDER BY musik.idMusik ASC LIMIT ?, ?`
            const totalRows = results[2][0].totalRows;
            const offset = (page - 1) * 15;
            const pageCount = Math.ceil(totalRows / 15);
            conn.query(querySongs, [offset, 15], (err, results2) => {
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
                        results: results2,
                        namaSubgenre: results[1],
                        pageCount: pageCount
                    });

                }
            });
        }
    });
});

app.post('/addSongs', upload.single('songscover'), (req, res) => {
    const songsTitle = req.body.songsTitle;
    const artist = req.body.artist;
    const createdAt = req.body['created-at'];
    const subgenre = req.body.subgenre;
    // Check if req.file exists before accessing its path property
    if (req.file && req.file.path) {
        // Mengambil ID subgenre berdasarkan nama subgenre
        const queryGetSubgenreId = 'SELECT idSubGenre FROM subgenre WHERE nama = ?';
        pool.query(queryGetSubgenreId, [subgenre], (err, results) => {
            if (err) {
                console.error('Error getting subgenre ID from database:', err);
                res.sendStatus(500);
                return;
            }

            if (results.length === 0) {
                console.error('Subgenre not found');
                res.sendStatus(404);
                return;
            }

            const subgenreId = results[0].idSubGenre;

            // Membaca isi file yang diunggah
            const fileData = fs.readFileSync(req.file.path);

            // Menyimpan data ke tabel songs
            const queryInsertSong = 'INSERT INTO musik (judul, artis, tglRilis, idSubGenre, cover) VALUES (?, ?, ?, ?, ?)';
            pool.query(queryInsertSong, [songsTitle, artist, createdAt, subgenreId, fileData], (err, result) => {
                if (err) {
                    console.error('Error saving song data to MySQL:', err);
                    res.sendStatus(500);
                    return;
                }

                // Mendapatkan ID songs yang baru saja di-insert
                const newSongId = result.insertId;

                // Menyimpan file ke sistem file dengan menggunakan ID songs sebagai nama file
                const filePath = `uploads/${newSongId}.jpg`;
                fs.writeFileSync(filePath, fileData);

                res.redirect('/songsAdmin');
            });
        });

    } else {
        // Handle the case when no file is uploaded
        console.log('No file uploaded');
        // ... any additional error handling or response as needed
    }
});

app.get('/searchAdmin', (req, res) => {
    const searchValue = req.query.query;

    // Query the database to get filtered results based on the search value
    pool.query(
        `SELECT musik.idMusik, musik.cover, musik.judul, musik.artis,
      musik.tglRilis, genre.nama AS genNama, subgenre.nama AS subNama
      FROM musik JOIN subgenre ON musik.idSubGenre = subgenre.idSubGenre
      JOIN genre ON subgenre.idGenre = genre.idGenre 
      WHERE musik.judul LIKE ? OR musik.artis LIKE ? ORDER BY musik.idMusik ASC`,
        [`%${searchValue}%`, `%${searchValue}%`],
        (error, results) => {
            if (error) {
                // If an error occurs during the query
                res.status(500).json({ error: 'Database error' });
            } else {
                // If the query is successful, send the filtered results to the client
                const filteredResults = results.map((music) => {
                    return {
                        idMusik: music.idMusik,
                        cover: music.cover,
                        judul: music.judul,
                        artis: music.artis,
                        tglRilis: music.tglRilis,
                        subNama: music.subNama,
                        genNama: music.genNama,
                        // Add more attributes as needed
                    };
                });
                res.json(filteredResults);
            }
        }
    );
});

app.delete('/songs/:id', (req, res) => {
    const songId = req.params.id;

    // Disable foreign key checks
    pool.query('SET FOREIGN_KEY_CHECKS = 0;', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting song');
        } else {
            // Delete the row from the tables
            pool.query('DELETE FROM musik WHERE idMusik = ?;', [songId], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error deleting song');
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

app.post('/updateSong', authAdmin, async (req, res) => {
    const conn = await dbConnect();

    // Mendapatkan nilai-nilai yang dikirimkan melalui formulir
    const idMusik = req.body.idMusik;
    const judul = req.body.songsTitle;
    const artis = req.body.artist;
    const tglRilis = req.body['created-at'];
    const subgenre = req.body.subgenre; // Nama subgenre yang dikirim dari formulir

    // Lakukan query untuk mendapatkan idSubGenre berdasarkan nama subgenre
    const getSubGenreQuery = 'SELECT * FROM subgenre WHERE nama = ?';
    conn.query(getSubGenreQuery, [subgenre], (err, result) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            console.log(result);
            const idSubGenre = result[0].idSubGenre; // Mengambil idSubGenre dari hasil query

            // Lakukan query untuk mendapatkan data lagu yang akan diupdate
            const getSongQuery = 'SELECT * FROM musik WHERE idMusik = ?';
            conn.query(getSongQuery, [idMusik], (err, songResult) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    const existingSong = songResult[0]; // Data lagu yang sudah ada

                    // Periksa jika nilai judul, artis, tglRilis, atau subgenre kosong atau tidak diubah
                    const updatedJudul = judul || existingSong.judul;
                    const updatedArtis = artis || existingSong.artis;
                    const updatedTglRilis = tglRilis || existingSong.tglRilis;
                    const updatedIdSubGenre = subgenre ? idSubGenre : existingSong.idSubGenre;

                    // Lakukan update data di MySQL
                    const updateQuery = 'UPDATE musik SET judul = ?, artis = ?, tglRilis = ?, idSubGenre = ? WHERE idMusik = ?';
                    conn.query(
                        updateQuery,
                        [updatedJudul, updatedArtis, updatedTglRilis, updatedIdSubGenre, idMusik],
                        (err, result) => {
                            if (err) {
                                console.error(err);
                                res.sendStatus(500);
                            } else {
                                console.log('Data berhasil diupdate');
                                res.redirect('/songsAdmin');
                            }
                        }
                    );
                }
            });
        }
    });
});





app.get('/subgenreAdmin', async (req, res) => {
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
                    res.render('subgenreAdmin', {
                        name: req.session.name,
                        image: image,
                        results: results2
                    });
                }
            });
        }
    });
});

app.get('/genreAdmin', async (req, res) => {
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
                    res.render('genreAdmin', {
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

app.get('/salesPimpinan', authPimpinan, async (req, res) => {
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
                    res.render('salesPimpinan', {
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

