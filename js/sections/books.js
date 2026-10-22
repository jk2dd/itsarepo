const books = [
  {
    title: 'اعتذار',
    subtitle: 'A story for you',
    cover: 'assets/img/book-covers/apology.webp',
    file: 'assets/books/apology.pdf',
  },
  {
    title: 'شريكتي في الرواية',
    subtitle: 'A story for you',
    cover: 'assets/img/book-covers/partner-in-the-novel.webp',
    file: 'assets/books/partner-in-the-novel.pdf',
  },
];

export async function init(el) {
  el.innerHTML = `
    <section class="books-page" aria-labelledby="books-heading">
      <header class="books-intro">
        <span class="books-kicker">A little something written for you</span>
        <h1 id="books-heading">My books to you</h1>
        <p>Two stories, saved here for you to read whenever you like.</p>
      </header>
      <div class="books-list"></div>
    </section>
  `;
  const list = el.querySelector('.books-list');
  books.forEach((book, index) => {
    const article = document.createElement('article');
    article.className = 'book-card';
    const headingId = `book-title-${index + 1}`;
    article.innerHTML = `
      <img class="book-cover" src="${book.cover}" alt="Cover of ${book.title}" loading="lazy">
      <div class="book-copy">
        <span class="book-number">Book ${index + 1}</span>
        <h2 id="${headingId}" lang="ar" dir="rtl">${book.title}</h2>
        <p>${book.subtitle}</p>
        <div class="book-actions">
          <a class="book-open" href="${book.file}" target="_blank" rel="noopener">Read the book</a>
          <a class="book-download" href="${book.file}" download>Download PDF</a>
        </div>
      </div>
      <details class="book-reader">
        <summary>Read here</summary>
        <iframe title="${book.title}" src="${book.file}#view=FitH" loading="lazy"></iframe>
      </details>
    `;
    list.appendChild(article);
  });

  // Teaser shelf card: the next book, still being written.
  const soon = document.createElement('div');
  soon.className = 'book-card book-soon';
  soon.innerHTML = `
    <div class="book-soon-media" aria-hidden="true">
      <svg viewBox="0 0 90 120">
        <rect x="14" y="6" width="62" height="96" rx="6" fill="#FFFFFF" stroke="#533175" stroke-width="3" stroke-dasharray="7 5"/>
        <path d="M20 6 V102" stroke="#ECD9FF" stroke-width="6" stroke-linecap="round"/>
        <text x="45" y="62" text-anchor="middle" font-size="34" fill="#A453F5" font-weight="700">?</text>
        <path d="M30 86 h30" stroke="#A453F5" stroke-width="3" stroke-linecap="round" opacity=".6"/>
        <path d="M34 94 h22" stroke="#A453F5" stroke-width="3" stroke-linecap="round" opacity=".35"/>
      </svg>
      <span class="book-soon-sticker">Coming soon</span>
    </div>
    <div class="book-copy">
      <span class="book-number book-number-soon">Book 3</span>
      <h2 lang="en">Another story</h2>
      <p>A new little book is still being written for you. When it is ready, it will appear right here on this shelf.</p>
    </div>
  `;
  list.appendChild(soon);

  return { destroy() {} };
}
