const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("article", articleSchema);

app.route("/articles")

    .get(function (req, res) {
        Article.find({}, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        });
    })

    .post(function (req, res) {
        const articleTitle = req.body.title;
        const articleContent = req.body.content;
        const article = new Article({
            title: articleTitle,
            content: articleContent
        });
        article.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successful")
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successful");
            }
        });
    });

app.route("/articles/:articleTitle")

    .get(function (req, res) {
        const postTitleLower = lodash.lowerCase(req.params.articleTitle);
        const postTitleUpper = lodash.upperCase(req.params.articleTitle);
        Article.findOne(
            { $or: [{ title: postTitleLower }, { title: postTitleUpper }] },
            function (err, result) {
                if (result) {
                    res.send(result);
                } else {
                    res.sendStatus(404);
                }
            });
    })

    .put(function (req, res) {
        const postTitleLower = lodash.lowerCase(req.params.articleTitle);
        const postTitleUpper = lodash.upperCase(req.params.articleTitle);
        Article.update(
            { $or: [{ title: postTitleLower }, { title: postTitleUpper }] },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successfully updated");
                }
            });
    })

    .patch(function (req, res) {
        const postTitleLower = lodash.lowerCase(req.params.articleTitle);
        const postTitleUpper = lodash.upperCase(req.params.articleTitle);

        Article.update(
            { $or: [{ title: postTitleLower }, { title: postTitleUpper }] },
            { $set: req.body },
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successfully updated");
                }
            }
        );
    })

    .delete(function (req, res) {
        const postTitleLower = lodash.lowerCase(req.params.articleTitle);
        const postTitleUpper = lodash.upperCase(req.params.articleTitle);

        Article.deleteOne(
            { $or: [{ title: postTitleLower }, { title: postTitleUpper }] },
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successfully deleted");
                }
            }
        );
    });



app.listen(3000, function () {
    console.log("Server started succesfully");
});