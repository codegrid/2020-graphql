import { request } from "./request.js";
import {
  renderArticles,
  renderDetail,
  renderPager,
  renderSearchBox,
} from "./renderer.js";
import { html, render } from "https://unpkg.com/lit-html?module";
import debounce from "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/debounce.min.js";

// 記事一覧をGraphCMSから取得
const fetchArticles = async (variables) => {
  const res = await request({
    query: `
      query Articles($keyword: String! $first: Int $last: Int $after: String $before: String){
        articlesConnection(
          where: { title_contains: $keyword }
          first: $first
          last: $last
          after: $after
          before: $before
        ) {
          edges {
            node {
              slug
              title
            }
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
    variables,
  });

  return {
    articles: res.data.articlesConnection.edges.map((edge) => edge.node),
    pageInfo: res.data.articlesConnection.pageInfo,
  };
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
  const pageCount = 5;

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
    const { articles, pageInfo } = await fetchArticles({
      keyword,
      first: pageCount,
    });
    refresh({
      ...state,
      articles,
      pageInfo,
      keyword,
    });
  }, 300);

  // Prevボタンをクリックしたとき
  const getPrev = async () => {
    const { articles, pageInfo } = await fetchArticles({
      keyword: state.keyword,
      last: pageCount,
      before: state.pageInfo.startCursor,
    });
    refresh({
      ...state,
      articles,
      pageInfo,
    });
  };

  // Nextボタンをクリックしたとき
  const getNext = async () => {
    const { articles, pageInfo } = await fetchArticles({
      keyword: state.keyword,
      first: pageCount,
      after: state.pageInfo.endCursor,
    });
    refresh({
      ...state,
      articles,
      pageInfo,
    });
  };

  // 初回描画のとき
  const onMount = async () => {
    // 初回描画なので検索ワードは空
    const keyword = "";
    const { articles, pageInfo } = await fetchArticles({
      keyword,
      first: pageCount,
    });
    refresh({
      ...state,
      articles,
      pageInfo,
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
        ${renderPager({
          pageInfo: state.pageInfo,
          getPrev,
          getNext,
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

render(renderPage(), container);
