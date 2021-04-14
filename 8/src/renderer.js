import { html } from "../node_modules/lit-html/lit-html.js";
import { unsafeHTML } from "../node_modules/lit-html/directives/unsafe-html.js";

// 記事リストのレンダリング
export const renderArticles = ({ articles, showDetail }) => {
  return html`
    <ul>
      ${articles.map(
        ({ title, slug }) => html`
          <li class="list-item">
            <a
              href="#"
              @click="${(ev) => {
                ev.preventDefault();
                showDetail(slug);
              }}"
              class="list-link"
              >${title}</a
            >
          </li>
        `
      )}
    </ul>
  `;
};

// 記事詳細のレンダリング
export const renderDetail = ({ article }) => {
  if (!article) {
    return html` <div class="detail-container nocontent">リストから記事を選択してください。</div> `
  }

  return html`
    <div class="detail-container">
      <h1>${article.title}</h1>
      ${article.authors.map(
        ({ name, icon: { url } }) => html`
          <div>
            <img src="${url}" alt="" />
            <span>${name}</span>
          </div>
        `
      )}
      <div>${unsafeHTML(article.body)}</div>
    </div>
  `;
};

// ページャのレンダリング
export const renderPager = ({
  pageInfo: { hasPreviousPage, hasNextPage },
  getPrev,
  getNext,
}) => {
  return html`
    <div class="pager-container">
      <button class="pager-button" type="button" @click="${getPrev}" ?disabled="${!hasPreviousPage}">
        Prev
      </button>
      <button class="pager-button" type="button" @click="${getNext}" ?disabled="${!hasNextPage}">
        Next
      </button>
    </div>
  `;
};
