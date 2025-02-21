const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static("public"));

app.post("/upload", upload.array("files"), (req, res) => {
    const lastName = req.body.lastName || "БезИмени"; 
    const userFolder = `./uploads/${lastName}`;

    if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
    }

    req.files.forEach(file => {
        fs.renameSync(file.path, `${userFolder}/${file.originalname}`);
    });

    exec(`git add uploads/* && git commit -m "Добавлен новый файл для ${lastName}" && git push`, 
    (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Ошибка при загрузке в GitHub.");
        }
        res.send(`Файлы загружены в GitHub в папку ${lastName}`);
    });
});

app.listen(3000, () => console.log("Сервер работает на порту 3000"));