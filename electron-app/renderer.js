document.getElementById('fetch').onclick = async () => {

  const input = document.getElementById('input').value;
  const asin = normalizeAsinOrUrl(input);
  const result = await window.api.fetchItem(asin);
 const el = document.getElementById('item');
  const item=result
  el.innerHTML = `<div class="flex gap-4">
    <img src="${item.images.primary.medium.url}" class="w-32 rounded shadow" />
    <div>
      <h2 class="font-bold text-lg">${item.itemInfo.title.displayValue}</h2>
      <p class="text-red-600 font-semibold">${item.offersV2.listings[0].price.money.displayAmount ?? ''}</p>
      <a href="${item.detailPageURL}" class="text-blue-600 underline button" target="_blank">
        Amazonで見る
      </a>
    </div>
  </div>`;
 const textarea = document.getElementById('card');
const html = `<div class="flex gap-4">
    <img src="${item.images.primary.medium.url}" class="w-32 rounded shadow" />
    <div>
      <h2 class="font-bold text-lg">${item.itemInfo.title.displayValue}</h2>
      <p class="text-red-600 font-semibold">${item.offersV2.listings[0].price.money.displayAmount ?? ''}</p>
      <a href="${item.detailPageURL}" class="text-blue-600 underline" target="_blank">
        Amazonで見る
      </a>
    </div>
  </div>`;

textarea.value = html;
};

function normalizeAsinOrUrl(input) {
  if (!input) return null;

  const value = input.trim();

  // ① ASIN直入力
  if (/^[A-Z0-9]{10}$/i.test(value)) {
    return value.toUpperCase();
  }

  // ② Amazon URL → ASIN 抽出
  const patterns = [
    /\/dp\/([^/&\?\%]+)/,
    /\/obidos\/ASIN\/([^/&\?\%]+)/,
    /\/gp\/product\/([^/&\?\%]+)/,
    /\/o\/ASIN\/([^/&\?\%]+)/
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  // ③ どちらでもない
  return null;
}
async function loadConfig() {
  const config = await window.api.loadConfig();
  document.getElementById('cid').value = config.CredentialId;
  document.getElementById('secret').value = config.CredentialSecret;
  document.getElementById('partner').value = config.PartnerTag;
  document.getElementById('version').value = config.Version;
}

document.getElementById('save').onclick = async () => {
  const config = {
    CredentialId: document.getElementById('cid').value.trim(),
    CredentialSecret: document.getElementById('secret').value.trim(),
    PartnerTag: document.getElementById('partner').value.trim(),
    Version: document.getElementById('version').value
  };

  await window.api.saveConfig(config);
  alert('保存しました');
};

loadConfig();

ipcMain.handle('fetch-item', async (_, asin) => {
  const config = loadConfig();

  if (!config.CredentialId || !config.CredentialSecret) {
    throw new Error('API設定が未入力です');
  }

  const apiClient = new ApiClient();
  apiClient.credentialId = config.CredentialId;
  apiClient.credentialSecret = config.CredentialSecret;
  apiClient.version = config.Version;

  const api = new DefaultApi(apiClient);

  // GetItemsRequest を作って実行
});

