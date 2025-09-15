/* Scrollspy for PaperMod TOC on blog posts.
 * - Highlights the link to the section currently in view
 * - Expands parent groups while collapsing unrelated ones
 * - Ensures the <details> is open even if front matter forgot TocOpen
 */
(function(){
  if (!document.querySelector('head link[rel="canonical"][href*="/blog/"]')) return;

  const article = document.querySelector('article.post-single');
  const toc = article && article.querySelector('.toc');
  if (!article || !toc) return;

  const details = toc.querySelector('details');
  if (details && !details.open) details.open = true;

  const anchors = Array.from(toc.querySelectorAll('.inner a[href^="#"]'));
  if (!anchors.length) return;
  const byId = new Map();
  anchors.forEach(a => {
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    byId.set(id, a);
  });

  const root = toc.querySelector('.inner > ul');
  const clearOpen = () => { if (!root) return; root.querySelectorAll('li').forEach(li => li.classList.remove('is-open')); };
  const openPath = (li) => {
    if (!li) return;
    clearOpen();
    let cur = li;
    while (cur && cur !== root) {
      cur.classList.add('is-open');
      cur = cur.parentElement && cur.parentElement.closest('li');
    }
  };
  const clearActive = () => anchors.forEach(a => a.classList.remove('is-active'));
  const markActive = (a) => { clearActive(); a.classList.add('is-active'); };

  // 1) Initial state: if URL has hash, open that section and underline it
  const initialId = decodeURIComponent((location.hash || '').replace('#',''));
  if (initialId && byId.has(initialId)) {
    const a = byId.get(initialId);
    markActive(a);
    openPath(a.closest('li'));
  }

  // 2) Click to underline and expand; keep last clicked highlighted
  const activateById = (id) => {
    const a = byId.get(id);
    if (!a) return;
    markActive(a);
    openPath(a.closest('li'));
  };

  anchors.forEach(a => a.addEventListener('click', (e) => {
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    // Let the browser jump, then mark active/expand to reflect last clicked
    setTimeout(() => activateById(id), 0);
  }));

  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent((location.hash || '').replace('#',''));
    if (id) activateById(id);
  });
})();
