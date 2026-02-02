const { CreatorsApiClient } = require("@amzn/creatorsapi-nodejs-sdk");

/**
 * Amazon URL → ASIN 抽出
 */
function extractAsin(url) {
  const m = url.match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

const client = new CreatorsApiClient({
  region: "JP"
});

async function getItemByAsinFromUrl(url) {
  const asin = extractAsin(url);
  if (!asin) {
    throw new Error("ASINが見つかりません");
  }

  const res = await client.getItems({
    ItemIds: [asin],
    Resources: [
      "ItemInfo.Title",
      "ItemInfo.ByLineInfo",
      "Offers.Listings.Price",
      "Images.Primary.Medium"
    ]
  });

  const item = res.ItemsResult.Items[0];

  return {
    asin,
    title: item.ItemInfo.Title.DisplayValue,
    author: item.ItemInfo.ByLineInfo?.Contributors?.[0]?.Name,
    price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount,
    image: item.Images.Primary.Medium.URL
  };
}

module.exports = { getItemByAsinFromUrl };
