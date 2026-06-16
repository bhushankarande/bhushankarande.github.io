(function () {
  const headings = Array.from(document.querySelectorAll(".post-body h2[id], .post-body h3[id]"));
  const tocLinks = Array.from(document.querySelectorAll(".toc a[href^='#']"));

  if (!headings.length || !tocLinks.length || !("IntersectionObserver" in window)) {
    return;
  }

  const linksById = new Map(
    tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link])
  );

  function setActiveLink(id) {
    tocLinks.forEach((link) => link.classList.remove("toc__link--active"));

    const activeLink = linksById.get(id);
    if (activeLink) {
      activeLink.classList.add("toc__link--active");
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-18% 0px -72% 0px",
      threshold: 0
    }
  );

  headings.forEach((heading) => observer.observe(heading));
})();
