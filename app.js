const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });
const article_schema = new mongoose.Schema({
  title: String,
  content: String
})

const article_model = mongoose.model("articles", article_schema);

// article_model.insertMany([article1,article2,article3],function(err){
// if(err)throw err
// else{
// console.log("Sucessful");
// }
// })

//TODO

app.route("/articles")

  .get(function (req, res) {
    article_model.find(function (err, foundarticles) {
      if (err) throw err
      else {
        res.send(foundarticles);
      }
    })
  })




  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);
    const jack_article = new article_model({
      title: req.body.title,
      content: req.body.content
    });
    jack_article.save();
  })


  .delete(function (req, res) {
    article_model.deleteMany(function (err) {
      if (err) res.send(err)
      else {
        res.send("Sucessfully deleted all the articles !!!");
      }
    })
  });

app.route('/articles/:articleTitle')
  .get(function (req, res) {

    article_model.findOne({ title: req.params.articleTitle }, function (err, foundarticle) {
      if (foundarticle) res.send(foundarticle)
      else {
        res.send("Article Not Found !!");
      }
    });
  })

  .put(function (req, res) {
    article_model.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) res.send("Sucessfully Updated !!");
        else {
          res.send("NOT UPDATED !!")
        }
      }
    )
  })

  .patch(function (req, res) {
    article_model.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err, result) {
        if (err) res.send(err)
        else {
          res.send("Successfully Updated !! ")
        }
      }
    )
  })

  .delete(function (req, res) {
    article_model.deleteOne(
      { title: req.params.articleTitle },
      function (err) {
        if (err) res.send(err)
        else {
          res.send("Successfully Deleted !!")
        }
      }
    )
  })


app.listen(3000, function () {
  console.log("Server started on port 3000");
});