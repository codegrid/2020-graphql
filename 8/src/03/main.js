import { html, render } from "../../node_modules/lit-html/lit-html.js";
import { renderArticles, renderDetail } from "../renderer.js";
import { request } from "../request.js";

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

// 記事詳細をGraphCMSから取得
const fetchArticle = async (slug) => {
  const res = await request({
    query: `
      query GetArticle($slug: String!){
        article(where: {slug: $slug}) {
          title
          body
          authors {
            ...on Author {
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

  // 初回描画のとき
  const onMount = async () => {
    const { articles } = await fetchArticles();
    refresh({
      ...state,
      articles,
    });
  };

  // 初期データ取得とローディング描画
  if (state.articles === undefined) {
    onMount();
    return html`Loading...`;
  }

  // 子コンポーネントのマウント
  return html`
    ${renderArticles({
      articles: state.articles,
      showDetail,
    })}
    ${renderDetail({
      article: state.currentArticle,
    })}
  `;
};

const container = document.getElementById("app");

const refresh = (state) => {
  render(renderPage(state), container);
};

render(await renderPage(), container);
