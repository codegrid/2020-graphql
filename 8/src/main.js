import { request } from "./request.js";
import { renderArticles, renderDetail, renderPager } from "./renderer.js";
import { html, render } from "../node_modules/lit-html/lit-html.js";

// 初期描画用の記事一覧をGraphCMSから取得
const fetchArticles = async (count) => {
  const res = await request({
    query: `
      query InitialArticles($count: Int!){
        articlesConnection(first: $count) {
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
    },
  });

  return {
    articles: res.data.articlesConnection.edges.map((edge) => edge.node),
    pageInfo: res.data.articlesConnection.pageInfo,
  };
};

// 前の記事一覧をGraphCMSから取得
export const fetchPrevArticles = async (count, cursor) => {
  const res = await request({
    query: `
      query BackwardArticles($count: Int! $cursor: String!) {
        articlesConnection(last: $count before: $cursor) {
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
    },
  });

  return {
    articles: res.data.articlesConnection.edges.map((edge) => edge.node),
    pageInfo: res.data.articlesConnection.pageInfo,
  };
};

// 次の記事一覧をGraphCMSから取得
export const fetchNextArticles = async (count, cursor) => {
  const res = await request({
    query: `
      query ForwardArticles($count: Int! $cursor: String!) {
        articlesConnection(first: $count after: $cursor) {
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

  // Prevボタンをクリックしたとき
  const getPrev = async () => {
    const { articles, pageInfo } = await fetchPrevArticles(
      pageCount,
      state.pageInfo.startCursor
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
      state.pageInfo.endCursor
    );
    refresh({
      ...state,
      articles,
      pageInfo,
    });
  };

  // 初回描画のとき
  const onMount = async () => {
    // const { articles } = await fetchArticles();
    const { articles, pageInfo } = await fetchArticles(pageCount);
    refresh({
      ...state,
      articles,
      pageInfo,
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
