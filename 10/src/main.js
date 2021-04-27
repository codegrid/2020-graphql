const request = async ({ query, variables }) => {
  const res = await fetch(
    "https://api-ap-northeast-1.graphcms.com/v2/cki8biu3885qw01z94eogghe9/master",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GRAPHCMS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!res.ok) {
    throw new Error("failed to fetch.");
  }

  return res.json();
};

const createAuthor = async (slug, name) => {
  const {
    data: { createdAuthor },
  } = await request({
    query: `
      mutation ($slug: String! $name: String!){
        createdAuthor: createAuthor(data: {
          slug: $slug
          name: $name
        }) {
          slug
          name
        }
      }
    `,
    variables: {
      slug,
      name,
    },
  });

  return createdAuthor;
};

const fetchAuthors = async () => {
  const {
    data: { authors },
  } = await request({
    query: `
      query {
        authors(stage: DRAFT){
          name
        }
      }
    `,
  });

  return authors;
};

const renderList = (list) => {
  return list.map((item) => `<li>${item.name}</li>`).join("");
};

const main = async () => {
  const $form = document.querySelector(".form");
  const $result = document.querySelector(".result");
  const $list = document.querySelector(".list");

  $form.addEventListener(
    "submit",
    async (ev) => {
      ev.preventDefault();
      const author = await createAuthor(
        ev.currentTarget.slug.value,
        ev.currentTarget.name.value
      );
      const authors = await fetchAuthors();

      $result.innerHTML = JSON.stringify(author, null, 2);
      $list.innerHTML = renderList(authors);
    },
    false
  );

  $list.innerHTML = renderList(await fetchAuthors());
};

main();
