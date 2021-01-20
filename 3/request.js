export const request = async () => {
  const res = await fetch('https://api-ap-northeast-1.graphcms.com/v2/cki8biu3885qw01z94eogghe9/master', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query GetAuthor($slug: String!){
          author(where: {slug: $slug}) {
            name
            affiliation
            title
            icon {
              url
            }
            articles(first: 1000) {
              id
            }
            slug
          }
        }
      `,
      variables: {
        slug: "cancer",
      },
    })
  });

  if (!res.ok) {
    throw new Error('failed to fetch.');
  }

  return res.json();
}
