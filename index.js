import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import _ from "lodash";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { log } from "console";
import { title } from "process";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/Blog');
}
//mongodb+srv://harnooraulakh16:aulakh16@cluster0.2vpo7fm.mongodb.net
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

var blogs = [];

const blogSchema = new mongoose.Schema({
  title: String,
  post: String,
});

const Blog = new mongoose.model("post", blogSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/contact", (req, res) => {
  res.render(__dirname + "/views/contact.ejs", {
    name: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render(__dirname + "/views/compose.ejs");
});

app.post("/compose", (req, res) => {
  const st = new Blog({
    title: req.body["heading"],
    post: req.body["blog"],
  });
  st.save();
  //blogs.push(st);
  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render(__dirname + "/views/about.ejs", {
    name: aboutContent,
  });
});

app.get("/", (req, res) => {
  Blog.find()
    .then(data => {
      res.render(__dirname + "/views/home.ejs", {
        name: homeStartingContent,
        array: data,
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/posts/:id", (req, res) => {
  var temp = _.capitalize(req.params.id);
  // if (temp === _.lowerCase(blogs[i].title)) {
  //   res.render(__dirname + "/views/post.ejs", {
  //     heading: blogs[i].title,
  //     post: blogs[i].post,
  //   });
  // }
  // else if (i === blogs.length) {
  //   res.redirect("/");
  // }

  Blog.findOne({ title: temp })
    .then(data => {
      if (data) {
        res.render(__dirname + "/views/post.ejs", {
          heading: data.title,
          post: data.post,
        });
      }
      else {
        res.redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});
