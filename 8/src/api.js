import { request } from "./request.js";

/* 画像サイズを指定しない場合のコード*/
export const fetchArticle = async (slug) => {
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
                url
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

/*
export const fetchArticle = async (slug) => {
  const res = await request({
    query: `
      query GetArticle($slug: String!){
        article(where: {slug: $slug}) {
          slug
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

 */

/* 記事を絞り込まない場合のコード
export const fetchArticles = async () => {
  const res = await request({
    query: `
      query {
        articles {
          slug
          title
        }
      }
    `,
    variables: {}
  });

  return res.data;
};
*/

export const fetchArticles = async (count) => {
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
