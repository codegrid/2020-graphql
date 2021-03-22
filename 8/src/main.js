import {
  fetchPrevArticles,
  fetchNextArticles,
  fetchArticle,
  fetchArticles,
} from "./api.js";

import {
  renderArticles,
  renderDetail,
  renderPager,
} from "./renderer.js";
import { html, render } from "../node_modules/lit-html/lit-html.js";

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
    ${renderArticles({
      articles: state.articles,
      showDetail,
    })}
    ${renderPager({
      pageInfo: state.pageInfo,
      getPrev,
      getNext,
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

render(renderPage(), container);
