import { html, render } from "https://unpkg.com/lit-html?module";
import { request } from "../request.js";
import { renderArticles } from "../renderer.js";

// 記事一覧をGraphCMSから取得
const fetchArticles = async () => {
  const res = await request({
    query: `
      query {
        articles {
          slug
          title
        }
      }
    `,
    variables: {},
  });

  return res.data;
};

// 画面全体のレンダリング
const renderPage = async () => {
  // イベントハンドラの用意

  // 詳細画面を開いたとき
  const showDetail = (slug) => {
    console.log(slug);
  };

  // 子コンポーネントのマウント
  const { articles } = await fetchArticles();

  return html`
    <div class="container">
      <div class="list-container">
        ${renderArticles({
          articles,
          showDetail,
        })}
      </div>
    </div>
  `;
};

const container = document.getElementById("app");

render(await renderPage(), container);
