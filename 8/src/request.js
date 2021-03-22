export const request = async ({query, variables}) => {
  const res = await fetch(
    "https://api-ap-northeast-1.graphcms.com/v2/cki8biu3885qw01z94eogghe9/master",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({query, variables}),
    }
  );

  if (!res.ok) {
    throw new Error("failed to fetch.");
  }

  return res.json();
};
