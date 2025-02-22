const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");
const app = express();
const port = process.env.PORT || 3000;
const FileUpload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static("public"));

app.post("/upload", FileUpload.array("input-file"), (req, res) => {
    const lastName = req.body["last-name"] || "БезИмени"; 
    const userFolder = `./uploads/${lastName}`;

    if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
    }

    req.files.forEach(file => {
        fs.renameSync(file.path, path.join(userFolder, file.originalname));
    });
        res.send(`Файлы загружены в GitHub в папку ${lastName}`);
    });


app.get("/", (req, res) => {
    res.send("Сервер работает! Используйте /upload для загрузки файлов.");
});

app.listen(port, () => console.log(`Сервер работает на порту ${port}`));
