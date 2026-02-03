const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {
      CredentialId: '',
      CredentialSecret: '',
      Version: '2.3',
      PartnerTag: ''
    };
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

ipcMain.handle('load-config', () => {
  return loadConfig();
});

ipcMain.handle('save-config', (_, newConfig) => {
  const oldConfig = loadConfig();
  saveConfig({ ...oldConfig, ...newConfig });
  return true;
});

/* ===== Creators API SDK（ローカル） ===== */
const {
  ApiClient,
  DefaultApi,
  GetItemsRequestContent
} = require('../dist/index');

/* ===== key.json ===== */



/* ===== Window ===== */
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

/* ===== IPC ===== */
ipcMain.handle('fetch-item', async (_event, asin) => {
  console.log('ASIN:', asin);

  // ★ 保存された設定を毎回読む
  const config = loadConfig();

  // 入力チェック（超重要）
  if (
    !config.CredentialId ||
    !config.CredentialSecret ||
    !config.PartnerTag
  ) {
    throw new Error('Creators API の設定が未入力です');
  }

  /* --- ApiClient 初期化 --- */
  const apiClient = new ApiClient();
  apiClient.credentialId = config.CredentialId;
  apiClient.credentialSecret = config.CredentialSecret;
  apiClient.version = config.Version || '2.3';

  const api = new DefaultApi(apiClient);

  /* --- GetItemsRequest --- */
  const req = new GetItemsRequestContent();
  req.partnerTag = config.PartnerTag;
  req.itemIds = [asin];
  req.condition = 'New';
  req.resources = [
    'itemInfo.title',
    'images.primary.medium',
    'offersV2.listings.price'
  ];

  const marketplace = 'www.amazon.co.jp';

  try {
    const res = await api.getItems(marketplace, req);
    return res.itemsResult?.items?.[0] ?? null;
  } catch (err) {
    console.dir(err, { depth: null });
    throw err;
  }
});


app.whenReady().then(createWindow);
