const express = require("express")
const fs = require("fs")
const { middlewareVerification } = require("./utils")
const PORT = 3000
const app = express()
app.use(express.static("./static"))
app.use("/jokes", express.json())
let jokes = require("./database/jokes.json");


app.get("/jokes", (req, res) => {
    fs.readFile('./database/jokes.json', (err, data) => {
        if (err)
            res.status(500).json({ status: "error", message: "Something went wrong" });
        else {
            jokes = JSON.parse(data.toString()).jokes;
            res.status(200).json(jokes);
        }
    });
});

app.post("/jokes", middlewareVerification, (req, res) => {
    let { author, joke } = req.body

    fs.readFile("./database/jokes.json", (err, data) => {
        if (err)
            return res.status(500).json({ status: "error", msg: "Something went wrong" })

        jokes = JSON.parse(data.toString()).jokes;
        id = JSON.parse(data.toString()).jid;

        let newJoke = {
            id: id,
            author: author,
            joke: joke,
            likeCount: 0
        }
        jokes.push(newJoke)
        id++
        let dataFile = {
            jokes: jokes,
            jid: id
        }
        fs.writeFile("./database/jokes.json", JSON.stringify(dataFile, null, 3), (err) => {
            if (err)
                return res.status(500).json({ status: "error", msg: "Something went wrong" })
            res.status(200).json({ status: "success", msg: "joke is added with success", joke: newJoke })
        });
    });
});

app.delete("/jokes/:id", (req, res) => {
    let id = parseInt(req.params.id);

    fs.readFile("./database/jokes.json", (err, data) => {

        if (err)
            return res.status(500).json({ status: "error", msg: "Something went wrong" })

        let dataFile = JSON.parse(data.toString());
        jokes = dataFile.jokes;
        let joke = jokes.find(j => j.id == id);

        if (!joke)
            return res.status(404).json({ status: "error", msg: "joke not found" })

        jokes = jokes.filter(j => j.id != id);
        dataFile.jokes = jokes;

        fs.writeFile("./database/jokes.json", JSON.stringify(dataFile, null, 3), (err) => {
            if (err)
                return res.status(500).json({ status: "error", msg: "Something went wrong" })

            res.status(200).json({ status: "success", msg: "joke is deleted with success", joke: joke })
        });
    });
});

app.put("/jokes/:id", middlewareVerification, (req, res) => {
    let id = parseInt(req.params.id);
    let { author, joke, likeCount, click } = req.body

    if (click != "like")
        return res.status(400).json({ status: "error", msg: "click must be like" })

    fs.readFile("./database/jokes.json", (err, data) => {
        if (err)
            return res.status(500).json({ status: "error", msg: "Something went wrong" })

        let dataFile = JSON.parse(data.toString());
        jokes = dataFile.jokes;
        let jokeToLike = jokes.find(j => j.id == id);

        if (!jokeToLike)
            return res.status(404).json({ status: "error", msg: "task not found" })

        if (jokeToLike.author != author || jokeToLike.joke != joke || jokeToLike.likeCount != likeCount)
            return res.status(400).json({ status: "error", msg: "author, joke and likeCount must be the same" })

        jokeToLike.author = author;
        jokeToLike.joke = joke;
        jokeToLike.likeCount = likeCount + 1;

        dataFile.jokes = jokes;
        fs.writeFile("./database/jokes.json", JSON.stringify(dataFile, null, 3), (err) => {
            if (err)
                return res.status(500).json({ status: "error", msg: "Something went wrong" })

            res.status(200).json({ status: "success", msg: "joke is liked with success", joke: jokeToLike })
        });
    });
});

app.use("*", (req, res) => {
    res.status(404).json({ status: "error", message: "Page not found" });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

