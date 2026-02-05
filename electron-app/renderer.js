let currentConfig = {};

document.getElementById('fetch').onclick = async () => {
  const input = document.getElementById('input').value;
  const asin = normalizeAsinOrUrl(input);
  if (!asin) return alert('ASINまたはAmazon URLを入力してください');

  const item = await window.api.fetchItem(asin);
  if (!item) return alert('商品が取得できませんでした');

  document.getElementById('item').innerHTML = `
    <div class="flex gap-4">
      <img src="${item.images.primary.medium.url}" class="w-32 rounded shadow" />
      <div>
        <h2 class="font-bold text-lg">
          ${item.itemInfo.title.displayValue}
        </h2>
        <p class="text-red-600 font-semibold">
          ${item.offersV2.listings[0]?.price?.displayAmount ?? ''}
        </p>
        <a href="${item.detailPageURL}" target="_blank"
          class="text-blue-600 underline">
          Amazonで見る
        </a>
      </div>
    </div>
  `;

  const html = renderBlogHTML(currentConfig.blogTemplate, item);
  document.getElementById('card').value = html;
  navigator.clipboard.writeText(html);
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
  currentConfig = await window.api.loadConfig();

  document.getElementById('cid').value = currentConfig.CredentialId;
  document.getElementById('secret').value = currentConfig.CredentialSecret;
  document.getElementById('partner').value = currentConfig.PartnerTag;
  document.getElementById('version').value = currentConfig.Version;
  document.getElementById('blogTemplate').value =
    currentConfig.blogTemplate || '';
}

loadConfig();

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
const toggleBtn = document.getElementById('toggleConfig');
const panel = document.getElementById('configPanel');

toggleBtn.addEventListener('click', () => {
  const isOpen = !panel.classList.contains('hidden');
  panel.classList.toggle('hidden');

  toggleBtn.textContent = isOpen
    ? '▶ Creators API 設定'
    : '▼ Creators API 設定';
});

const toggleSetBtn = document.getElementById('toggleSettings');
const panelset = document.getElementById('settingsPanel');

toggleSetBtn.onclick = () => {
  panelset.classList.toggle('hidden');
};


// 保存
document.getElementById('saveConfig').onclick = async () => {
  await window.api.saveConfig({
    CredentialId: document.getElementById('cid').value.trim(),
    CredentialSecret: document.getElementById('secret').value.trim(),
    PartnerTag: document.getElementById('partner').value.trim(),
    Version: document.getElementById('version').value,
    blogTemplate: document.getElementById('blogTemplate').value
  });

  alert('保存しました');
  loadConfig();
};


function renderBlogHTML(template, item) {
  return template
    .replaceAll('{title}', item.itemInfo?.title?.displayValue ?? '')
    .replaceAll('{image}', item.images?.primary?.medium?.url ?? '')
    .replaceAll('{image-s}', item.images?.primary?.small?.url ?? '')
    .replaceAll('{image-l}', item.images?.primary?.large?.url ?? '')
    .replaceAll('{price}',
      item.offersV2?.listings?.[0]?.price?.displayAmount ?? '')
    .replaceAll('{url}', item.detailPageURL ?? '');
}