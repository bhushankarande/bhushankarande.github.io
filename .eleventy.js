const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTOC = require("eleventy-plugin-toc");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItKatex = require("markdown-it-katex");

const isPublished = (item) => !item.data.draft;

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateTime(date) {
  if (date instanceof Date) {
    return DateTime.fromJSDate(date, { zone: "utc" });
  }

  return DateTime.fromISO(String(date), { zone: "utc" });
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ");
}

function wordCount(value = "") {
  return stripHtml(value).split(/\s+/).filter(Boolean).length;
}

function readTime(value = "") {
  const words = Number.isFinite(value) ? value : wordCount(value);
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function getPublishedPosts(collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/content/posts/*.md")
    .filter(isPublished)
    .sort((a, b) => b.date - a.date);
}

function groupPostsByTag(posts) {
  const tagMap = new Map();

  posts.forEach((post) => {
    (post.data.tags || []).forEach((tag) => {
      const name = String(tag);
      const slug = slugify(name);

      if (!slug) {
        return;
      }

      if (!tagMap.has(slug)) {
        tagMap.set(slug, { name, slug, posts: [] });
      }

      tagMap.get(slug).posts.push(post);
    });
  });

  return [...tagMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function groupPostsByYear(posts) {
  const yearMap = new Map();

  posts.forEach((post) => {
    const year = toDateTime(post.date).toFormat("yyyy");

    if (!yearMap.has(year)) {
      yearMap.set(year, { year, posts: [] });
    }

    yearMap.get(year).posts.push(post);
  });

  return [...yearMap.values()].sort((a, b) => Number(b.year) - Number(a.year));
}

function getPublishedProjects(collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/content/projects/*.md")
    .filter(isPublished);
}

module.exports = function (eleventyConfig) {
  const markdownLibrary = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  })
    .use(markdownItAnchor, {
      level: [2, 3],
      slugify
    })
    .use(markdownItKatex);

  const defaultImageRenderer = markdownLibrary.renderer.rules.image;

  markdownLibrary.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const title = token.attrGet("title");
    const renderedImage = defaultImageRenderer(tokens, idx, options, env, self);

    if (!title) {
      return renderedImage;
    }

    return `<figure class="post-figure">${renderedImage}<figcaption>${markdownLibrary.utils.escapeHtml(title)}</figcaption></figure>`;
  };

  eleventyConfig.setLibrary("md", markdownLibrary);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ["h2", "h3"],
    wrapper: "nav",
    wrapperClass: "toc__nav",
    ul: false
  });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ public: "." });

  eleventyConfig.addFilter("readableDate", (date) => {
    return toDateTime(date).toFormat("LLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (date) => {
    return toDateTime(date).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("dateDisplay", (date) => {
    return toDateTime(date).toFormat("LLLL d, yyyy");
  });

  eleventyConfig.addFilter("dateISO", (date) => {
    return toDateTime(date).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("year", (date) => {
    return toDateTime(date).toFormat("yyyy");
  });

  eleventyConfig.addFilter("monthName", (date) => {
    return toDateTime(date).toFormat("LLL");
  });

  eleventyConfig.addFilter("slug", slugify);

  eleventyConfig.addFilter("wordcount", wordCount);

  eleventyConfig.addFilter("readTime", readTime);

  eleventyConfig.addFilter("cleanTitle", (title = "") => {
    return String(title).replace(/^\[|\]$/g, "");
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return getPublishedPosts(collectionApi);
  });

  eleventyConfig.addCollection("blogTags", (collectionApi) => {
    return groupPostsByTag(getPublishedPosts(collectionApi));
  });

  eleventyConfig.addCollection("blogYears", (collectionApi) => {
    return groupPostsByYear(getPublishedPosts(collectionApi));
  });

  eleventyConfig.addCollection("projects", (collectionApi) => {
    return getPublishedProjects(collectionApi)
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
  });

  eleventyConfig.addCollection("recentProjects", (collectionApi) => {
    return getPublishedProjects(collectionApi).sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
