(function () {
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const isHome = location.pathname === "/" || location.pathname.endsWith("/index.html");

  function setPathActiveLink() {
    const path = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
    navLinks.forEach((link) => {
      const match = link.dataset.match;
      link.classList.toggle("is-active", Boolean(match && path.startsWith(match)));
    });
  }

  function setSectionActiveLink() {
    const sectionLinks = navLinks.filter((link) => link.dataset.section);
    const sections = sectionLinks
      .map((link) => document.getElementById(link.dataset.section))
      .filter(Boolean);

    const activeSection = sections
      .slice()
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= 110);

    sectionLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        Boolean(activeSection && link.dataset.section === activeSection.id)
      );
    });
  }

  if (isHome) {
    setSectionActiveLink();
    window.addEventListener("scroll", setSectionActiveLink, { passive: true });
  } else {
    setPathActiveLink();
  }
})();
