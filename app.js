require("dotenv").config();

const express = require("express");
const errorhandler = require("errorhandler");
const logger = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const port = 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride());
app.use(errorhandler());

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

// Link Resolver
const linkResolver = (doc) => {
  if (doc.type === "product") {
    return `/detail/${doc.slug}`;
  }

  if (doc.type === "collections") {
    return "/collections";
  }

  if (doc.type === "about") {
    return "/about";
  }

  return "/";
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.Link = linkResolver;
  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "";
  };
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

const handleReq = async (api) => {
  const meta = await api.getSingle("meta");
  const navigation = await api.getSingle("navigation");
  const preLoader = await api.getSingle("preloader");

  return { meta, navigation, preLoader };
};

//routes

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const home = await api.getSingle("home");
  const defaults = await handleReq(api);
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  res.render("pages/home", {
    ...defaults,
    home,
    collections,
  });
});

app.get("/collections", async (req, res) => {
  const api = await initApi(req);
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );
  const defaults = await handleReq(api);
  const home = await api.getSingle("home");

  res.render("pages/collections", {
    ...defaults,
    home,
    collections,
  });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);

  const about = await api.getSingle("about");
  const defaults = await handleReq(api);

  res.render("pages/about", {
    about,
    ...defaults,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req);

  const defaults = await handleReq(api);
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  res.render("pages/detail", {
    ...defaults,
    product,
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
