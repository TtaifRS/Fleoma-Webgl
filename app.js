require("dotenv").config();

const express = require("express");
var errorhandler = require("errorhandler");
const path = require("path");
const app = express();
const port = 3000;

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

// Link Resolver
const linkResolver = (doc) => {
  // // Define the url depending on the document type
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }

  // // Default to homepage
  return "/";
};

app.use(errorhandler());

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/collection", (req, res) => {
  res.render("pages/collection");
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);

  const about = await api.getSingle("about");
  const meta = await api.getSingle("meta");

  res.render("pages/about", {
    about,
    meta,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req);

  const meta = await api.getSingle("meta");
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  console.log(product.data);
  res.render("pages/detail", {
    meta,
    product,
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});