const express = require("express");
const multer = require("multer");
const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: "temp_uploads/" });

const FTP_HOST = "ftpupload.net";
const FTP_USER = "if0_38371683";
const FTP_PASS = "prostoypassword";
const FTP_FOLDER = "/htdocs/uploads/";

// Обработчик загрузки
app.post("/upload", upload.array("input-file"), async (req, res) => {
    if (!req.files) return res.status(400).send("Файлы не получены.");

    const client = new ftp.Client();
    client.ftp.verbose = true; // Лог загрузки

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASS,
            secure: false
        });

        // Создаем папку с фамилией
        const lastName = req.body["last-name"] || "БезИмени";
        const userFolder = path.join(FTP_FOLDER, lastName);
        await client.ensureDir(userFolder);

        // Загружаем файлы
        for (const file of req.files) {
            await client.uploadFrom(file.path, path.join(userFolder, file.originalname));
            fs.unlinkSync(file.path); // Удаляем временный файл
        }

        res.send(`Файлы загружены в папку ${userFolder} на FTP`);
    } catch (err) {
        res.status(500).send("Ошибка загрузки: " + err.message);
    } finally {
        client.close();
    }
});

app.listen(port, () => console.log(`Сервер работает на порту ${port}`));
