module.exports = function (eleventyConfig) {
  const isPublished = (item) => !item.data.draft;

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ public: "." });

  eleventyConfig.addFilter("readableDate", (date) => {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric"
    }).format(new Date(date));
  });

  eleventyConfig.addFilter("htmlDateString", (date) => {
    return new Date(date).toISOString().slice(0, 10);
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/posts/*.md")
      .filter(isPublished)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("projects", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/projects/*.md")
      .filter(isPublished)
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
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
