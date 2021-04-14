import { request } from "./request.js";
import {
  renderArticles,
  renderDetail,
  renderPager,
  renderSearchBox,
} from "./renderer.js";
import { html, render } from "https://unpkg.com/lit-html?module";

// 初期描画用の記事一覧をGraphCMSから取得
const fetchArticles = async (count, keyword) => {
  const res = await request({
    query: `
      query InitialArticles($count: Int! $keyword: String!){
        articlesConnection(where: { title_contains: $keyword } first: $count) {
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
    variables: {
      count,
      keyword,
    },
  });

  return {
    articles: res.data.articlesConnection.edges.map((edge) => edge.node),
    pageInfo: res.data.articlesConnection.pageInfo,
  };
};

// 前の記事一覧をGraphCMSから取得
export const fetchPrevArticles = async (count, cursor, keyword) => {
  const res = await request({
    query: `
      query BackwardArticles($count: Int! $cursor: String! $keyword: String!) {
        articlesConnection(where: { title_contains: $keyword } last: $count before: $cursor) {
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
    variables: {
      count,
      cursor,
      keyword,
    },
  });

  return {
    articles: res.data.articlesConnection.edges.map((edge) => edge.node),
    pageInfo: res.data.articlesConnection.pageInfo,
  };
};

// 次の記事一覧をGraphCMSから取得
export const fetchNextArticles = async (count, cursor, keyword) => {
  const res = await request({
    query: `
      query ForwardArticles($count: Int! $cursor: String! $keyword: String!) {
        articlesConnection(where: { title_contains: $keyword } first: $count after: $cursor) {
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
    variables: {
      count,
      cursor,
      keyword,
    },
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

const debounce = (duration, callback) => {
  let timer = null;
  return (...args) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, duration);
  };
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
  const search = debounce(300, async (keyword) => {
    const { articles, pageInfo } = await fetchArticles(pageCount, keyword);
    refresh({
      ...state,
      articles,
      pageInfo,
      keyword,
    });
  });

  // Prevボタンをクリックしたとき
  const getPrev = async () => {
    const { articles, pageInfo } = await fetchPrevArticles(
      pageCount,
      state.pageInfo.startCursor,
      state.keyword
    );
    refresh({
      ...state,
      articles,
      pageInfo,
    });
  };

  // Nextボタンをクリックしたとき
  const getNext = async () => {
    const { articles, pageInfo } = await fetchNextArticles(
      pageCount,
      state.pageInfo.endCursor,
      state.keyword
    );
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
    const { articles, pageInfo } = await fetchArticles(pageCount, keyword);
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
