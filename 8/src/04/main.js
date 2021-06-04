import { html, render } from "https://unpkg.com/lit-html?module";
import { renderArticles, renderDetail, renderSearchBox } from "../renderer.js";
import { request } from "../request.js";
import debounce from "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/debounce.min.js";

// 記事一覧をGraphCMSから取得
const fetchArticles = async (keyword) => {
  const res = await request({
    query: `
      query Articles($keyword: String!){
        articles(where: { title_contains: $keyword }) {
          slug
          title
        }
      }
    `,
    variables: {
      keyword,
    },
  });

  return res.data;
};

// 記事詳細をGraphCMSから取得
const fetchArticle = async (slug) => {
  const res = await request({
    query: `
      query GetArticle($slug: String!){
        article(where: {slug: $slug}) {
          title
          body
          authors {
            name
            icon {
              url(transformation: {
                image: {
                  resize: {
                    width: 100
                    height: 100
                  }
                }
              })
            }
          }
        }
      }
    `,
    variables: {
      slug,
    },
  });

  return res.data;
};

// 画面全体のレンダリング
const renderPage = (state = {}) => {
  // イベントハンドラの用意

  // 詳細画面を開いたとき
  const showDetail = async (slug) => {
    const { article } = await fetchArticle(slug);
    refresh({
      ...state,
      currentArticle: article,
    });
  };

  // 検索ボックスに入力したとき
  const search = debounce(async (keyword) => {
    const { articles } = await fetchArticles(keyword);
    refresh({
      ...state,
      articles,
      keyword,
    });
  }, 300);

  // 初回描画のとき
  const onMount = async () => {
    // 初回描画なので検索ワードは空
    const keyword = "";
    const { articles } = await fetchArticles(keyword);
    refresh({
      ...state,
      articles,
      keyword,
    });
  };

  // 初期データ取得とローディング描画
  if (state.articles === undefined) {
    onMount();
    return html`Loading...`;
  }

  // 子コンポーネントのマウント
  return html`
    <div class="container">
      <div class="list-container">
        ${renderSearchBox({
          keyword: state.keyword,
          search,
        })}
        ${renderArticles({
          articles: state.articles,
          showDetail,
        })}
      </div>
      ${renderDetail({
        article: state.currentArticle,
      })}
    </div>
  `;
};

const container = document.getElementById("app");

const refresh = (state) => {
  render(renderPage(state), container);
};

render(await renderPage(), container);
