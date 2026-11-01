import { els } from "./dom.js";
import { state } from "../core/state.js";
import { saveSettings, PROVIDER_CATALOG, providerById, emptyAccounts } from "../core/settings.js";
import { updateProviderStatusUI } from "./statusbar.js";
import { syncTimelineDivergenceUI } from "./toolbar.js";
import { hasValidCredentials } from "../providers/registry.js";
import { isTextArtEngine, isOpenCodeProvider } from "../providers/adapter.js";
import { OpenCodeAdapter, STATIC_OPENCODE_ZEN_MODELS, STATIC_OPENCODE_GO_MODELS } from "../providers/opencode/index.js";
import { GeminiAdapter, AgentPlatform, STATIC_VERTEX_GEMINI_MODELS, STATIC_GEMINI_IMAGE_MODELS } from "../providers/gemini/index.js";
import { OpenRouterAdapter, STATIC_OR_TEXT_MODELS, STATIC_OR_IMAGE_MODELS } from "../providers/openrouter/index.js";
import { CommandCodeAdapter, STATIC_COMMANDCODE_MODELS } from "../providers/commandcode/index.js";
import { LocalAdapter } from "../providers/local/index.js";
import { isStandaloneMode, canPromptInstall, promptInstall, syncStandaloneDOM } from "../features/pwa.js";
import { BUILD_TIME } from "build-stamp";

var OTHER = "__other__";
var draftAccounts = null;
var editingProviderId = "";
var editorKeyAtOpen = "";
var syncingPickers = false;

function cloneDraft(accounts) {
  var base = emptyAccounts();
  var source = accounts || {};
  for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
    var id = PROVIDER_CATALOG[i].id;
    base[id] = Object.assign({}, base[id], source[id] || {});
  }
  return base;
}

function maskKey(key) {
  var value = String(key || "").trim();
  if (!value) return "Not configured";
  var tail = value.length <= 4 ? value : value.slice(-4);
  return "••••" + tail;
}

function isAccountConfigured(provider, account) {
  if (!provider || !account) return false;
  if (provider.keyless) return !!account.enabled;
  return !!String(account.apiKey || "").trim();
}

function setEditStatus(text) {
  if (els.providerEditStatus) els.providerEditStatus.textContent = text || "";
}

export function syncPwaStatusInModal() {
  var standalone = isStandaloneMode();
  if (els.pwaStatusLine) {
    els.pwaStatusLine.textContent = standalone
      ? "Running as an installed app."
      : "Running in a browser tab. Use Install on the toolbar when the browser offers it.";
  }
  if (els.btnModalInstallApp) {
    els.btnModalInstallApp.hidden = standalone;
    els.btnModalInstallApp.disabled = standalone;
  }
}

export function getAvailableModelList(provider, isImage) {
  var settings = state.settings || {};
  var cm = settings.cachedModels || {};
  var p = provider === "aistudio" ? "gemini" : provider;

  if (p === "local") {
    return (cm.localChat && cm.localChat.length > 0) ? cm.localChat.slice() : [];
  }
  if (p === "openrouter") {
    if (isImage) {
      var orImgs = (cm.orImage && cm.orImage.length > 0) ? cm.orImage.slice() : STATIC_OR_IMAGE_MODELS.slice();
      if (orImgs.length <= 20) {
        for (var oi = 0; oi < STATIC_OR_IMAGE_MODELS.length; oi++) {
          if (orImgs.indexOf(STATIC_OR_IMAGE_MODELS[oi]) === -1) orImgs.push(STATIC_OR_IMAGE_MODELS[oi]);
        }
      }
      return orImgs;
    }
    return (cm.orChat && cm.orChat.length > 0) ? cm.orChat.slice() : STATIC_OR_TEXT_MODELS.slice();
  }
  if (p === "opencode-zen") {
    return (cm.opencodeZenChat && cm.opencodeZenChat.length > 0)
      ? cm.opencodeZenChat.slice()
      : STATIC_OPENCODE_ZEN_MODELS.slice();
  }
  if (p === "commandcode") {
    return (cm.commandcodeChat && cm.commandcodeChat.length > 0)
      ? cm.commandcodeChat.slice()
      : STATIC_COMMANDCODE_MODELS.slice();
  }
  if (p === "opencode-go") {
    return (cm.opencodeGoChat && cm.opencodeGoChat.length > 0)
      ? cm.opencodeGoChat.slice()
      : STATIC_OPENCODE_GO_MODELS.slice();
  }
  if (isImage) {
    return (cm.googleImage && cm.googleImage.length > 0)
      ? cm.googleImage.slice()
      : STATIC_GEMINI_IMAGE_MODELS.slice();
  }
  return (cm.googleChat && cm.googleChat.length > 0)
    ? cm.googleChat.slice()
    : STATIC_VERTEX_GEMINI_MODELS.slice();
}

function fillProviderSelect(selectEl, providers, current) {
  if (!selectEl) return "";
  selectEl.innerHTML = "";
  for (var i = 0; i < providers.length; i++) {
    var opt = document.createElement("option");
    opt.value = providers[i].id;
    opt.textContent = providers[i].name;
    selectEl.appendChild(opt);
  }
  var ids = providers.map(function(provider) { return provider.id; });
  selectEl.value = current && ids.indexOf(current) !== -1 ? current : providers[0].id;
  return selectEl.value;
}

function fillModelSelect(selectEl, models, current) {
  if (!selectEl) return;
  var active = String(current || "").trim();
  selectEl.innerHTML = "";
  for (var i = 0; i < models.length; i++) {
    var opt = document.createElement("option");
    opt.value = models[i];
    opt.textContent = models[i];
    selectEl.appendChild(opt);
  }
  var other = document.createElement("option");
  other.value = OTHER;
  other.textContent = "Other…";
  selectEl.appendChild(other);
  if (active && models.indexOf(active) !== -1) selectEl.value = active;
  else if (active) selectEl.value = OTHER;
  else if (models.length) selectEl.value = models[0];
  else selectEl.value = OTHER;
}

function applyCustomVisibility(selectEl, customEl, current) {
  if (!customEl) return;
  var show = !!(selectEl && selectEl.value === OTHER);
  customEl.hidden = !show;
  // Always assign while visible: a provider switch passes "", and leaving the
  // previous provider's id in the box would leak it into the new provider.
  if (show) customEl.value = current || "";
}

function readPickerModel(selectEl, customEl, providerId) {
  if (!selectEl) return "";
  var value = selectEl.value === OTHER
    ? (customEl ? customEl.value.trim() : "")
    : selectEl.value;
  if (providerId === "openrouter" || /^https?:\/\/(?:www\.)?openrouter\.ai\//i.test(value)) {
    value = OpenRouterAdapter.normalizeModelId(value);
  }
  if (providerId === "commandcode") {
    value = CommandCodeAdapter.normalizeModelId(value, getAvailableModelList("commandcode", false));
  }
  if (providerId === "local") {
    value = LocalAdapter.normalizeModelId(value);
  }
  return value;
}

function configuredProviders(predicate) {
  var found = [];
  for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
    var provider = PROVIDER_CATALOG[i];
    // Hide providers disabled in the catalog (OpenCode Zen/Go — CORS wall)
    if (provider.disabled) continue;
    if (predicate && !predicate(provider)) continue;
    if (hasValidCredentials(state.settings, provider.id)) found.push(provider);
  }
  return found;
}

function persistChoice() {
  saveSettings(state.settings);
  updateProviderStatusUI();
}

export function syncModelPickers() {
  if (!els.textProviderSelect) return;
  syncingPickers = true;
  var settings = state.settings;
  var changed = false;
  var textProviders = configuredProviders();

  if (textProviders.length === 0) {
    if (els.textModelPair) els.textModelPair.hidden = true;
    if (els.textModelEmpty) els.textModelEmpty.hidden = false;
    if (els.imageModelPair) els.imageModelPair.hidden = true;
    if (els.imageModelEmpty) els.imageModelEmpty.hidden = true;
  } else {
    if (els.textModelPair) els.textModelPair.hidden = false;
    if (els.textModelEmpty) els.textModelEmpty.hidden = true;
    var textProvider = fillProviderSelect(els.textProviderSelect, textProviders, settings.pageProvider);
    var providerChanged = textProvider !== settings.pageProvider;
    if (providerChanged) {
      settings.pageProvider = textProvider;
      changed = true;
    }
    var textModels = getAvailableModelList(textProvider, false);
    fillModelSelect(els.textModelSelect, textModels, providerChanged ? "" : settings.pageModel);
    applyCustomVisibility(els.textModelSelect, els.textModelCustom, providerChanged ? "" : settings.pageModel);
    var resolvedText = readPickerModel(els.textModelSelect, els.textModelCustom, textProvider) || textModels[0] || "";
    if (resolvedText && resolvedText !== settings.pageModel) {
      settings.pageModel = resolvedText;
      changed = true;
    } else if (!resolvedText && providerChanged && settings.pageModel) {
      // Keyless/hosted providers can have no known models yet (Local LLM
      // before a fetch). Clearing the id makes the provider report a missing
      // model instead of sending the previous provider's model name.
      settings.pageModel = "";
      changed = true;
    }
  }

  var showImage = textProviders.length > 0 && settings.imageMode !== "off" && !isTextArtEngine(settings.imageEngine || "image-model");
  var imageProviders = configuredProviders(function(provider) { return provider.raster; });
  if (!showImage) {
    if (els.imageModelPair) els.imageModelPair.hidden = true;
    if (els.imageModelEmpty) els.imageModelEmpty.hidden = true;
  } else if (imageProviders.length === 0) {
    if (els.imageModelPair) els.imageModelPair.hidden = true;
    if (els.imageModelEmpty) els.imageModelEmpty.hidden = false;
  } else {
    if (els.imageModelPair) els.imageModelPair.hidden = false;
    if (els.imageModelEmpty) els.imageModelEmpty.hidden = true;
    var imageProvider = fillProviderSelect(els.imageProviderSelect, imageProviders, settings.imageProvider);
    var imageProviderChanged = imageProvider !== settings.imageProvider;
    if (imageProviderChanged) {
      settings.imageProvider = imageProvider;
      changed = true;
    }
    var imageModels = getAvailableModelList(imageProvider, true);
    fillModelSelect(els.imageModelSelect, imageModels, imageProviderChanged ? "" : settings.imageModel);
    applyCustomVisibility(els.imageModelSelect, els.imageModelCustom, imageProviderChanged ? "" : settings.imageModel);
    var resolvedImage = readPickerModel(els.imageModelSelect, els.imageModelCustom, imageProvider) || imageModels[0] || "";
    if (resolvedImage && resolvedImage !== settings.imageModel) {
      settings.imageModel = resolvedImage;
      changed = true;
    }
  }

  syncingPickers = false;
  if (changed) persistChoice();
}

function syncImageEngineHint() {
  if (!els.imageEngineHint || !els.imageEngineSelect) return;
  var engine = els.imageEngineSelect.value;
  if (engine === "text-pixel") {
    els.imageEngineHint.textContent = "Pixel art is drawn by the text model. The Image pair stays hidden.";
  } else if (engine === "text-svg") {
    els.imageEngineHint.textContent = "Vector art is drawn by the text model. The Image pair stays hidden.";
  } else if (engine === "text-auto") {
    els.imageEngineHint.textContent = "Era-adaptive art is drawn by the text model. The Image pair stays hidden.";
  } else if (engine === "hybrid") {
    els.imageEngineHint.textContent = "Ads, icons, and graphics are drawn as vector SVG by the text model. Hero and article photos use the Image provider and model below.";
  } else {
    els.imageEngineHint.textContent = "Raster photos, ads, icons, and graphics use the Image provider and model in the bar below.";
  }
}

function renderProviderList() {
  var list = els.providerAccountList;
  if (!list || !draftAccounts) return;
  list.innerHTML = "";
  for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
    var provider = PROVIDER_CATALOG[i];
    // Do not offer key entry for providers disabled in the catalog
    if (provider.disabled) continue;
    var account = draftAccounts[provider.id];
    var configured = isAccountConfigured(provider, account);
    var row = document.createElement("li");
    row.className = "provider-account-row";

    var name = document.createElement("span");
    name.className = "provider-account-name";
    name.textContent = provider.name;

    var key = document.createElement("span");
    key.className = "provider-account-key";
    key.textContent = provider.keyless
      ? (configured ? (account.endpoint || provider.defaultEndpoint) : "Not configured")
      : maskKey(account && account.apiKey);

    var actions = document.createElement("span");
    actions.className = "provider-account-actions";

    function addButton(label, action) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "small-btn";
      button.textContent = label;
      button.dataset.providerAction = action;
      button.dataset.providerId = provider.id;
      actions.appendChild(button);
    }

    addButton(configured ? "Edit" : (provider.keyless ? "Save endpoint" : "Save key"), "edit");
    if (configured) {
      addButton("Remove", "remove");
      addButton("Fetch models", "fetch");
    }

    row.appendChild(name);
    row.appendChild(key);
    row.appendChild(actions);
    list.appendChild(row);
  }
}

function openEditor(providerId) {
  var provider = providerById(providerId);
  var account = draftAccounts && draftAccounts[providerId];
  if (!provider || !account || !els.providerEditPanel) return;
  editingProviderId = providerId;
  editorKeyAtOpen = String(account.apiKey || "");
  els.providerEditPanel.hidden = false;
  if (els.providerEditTitle) els.providerEditTitle.textContent = provider.name;
  setEditStatus("");

  var isAgent = providerId === "agentplatform";
  var keyless = !!provider.keyless;
  var openCode = isOpenCodeProvider(providerId);
  if (els.editAuthRow) els.editAuthRow.hidden = !isAgent;
  if (els.editProjectRow) els.editProjectRow.hidden = !isAgent;
  if (els.editReasoningRow) els.editReasoningRow.hidden = false;
  if (els.editSitePlanReasoningRow) els.editSitePlanReasoningRow.hidden = false;
  if (els.editEndpointRow) els.editEndpointRow.hidden = !(isAgent || openCode || keyless);
  if (els.providerCorsNotice) els.providerCorsNotice.hidden = !openCode;
  if (els.editKeyLabel) {
    els.editKeyLabel.textContent = keyless
      ? "API Key (optional):"
      : (isAgent ? "API Key or Access Token:" : "API Key:");
  }
  if (els.editApiKey) {
    els.editApiKey.value = account.apiKey || "";
    els.editApiKey.type = "password";
    els.editApiKey.placeholder = keyless
      ? "Optional — leave empty unless your server requires a key"
      : "Paste API key";
  }
  if (els.providerEditSave) els.providerEditSave.textContent = keyless ? "Save endpoint" : "Save key";
  if (els.editEndpointHelp) {
    els.editEndpointHelp.hidden = !keyless;
    if (keyless) {
      els.editEndpointHelp.textContent =
        "OpenAI-compatible base URL. Examples: http://localhost:11434/v1 (Ollama), " +
        "http://localhost:1234/v1 (LM Studio), http://localhost:8080/v1 (llama.cpp). " +
        "Trailing /v1 is added when omitted. The server must allow this page's origin — for Ollama set OLLAMA_ORIGINS.";
    }
  }
  if (isAgent) {
    if (els.editAuthType) els.editAuthType.value = account.vertexAuthType || "apikey";
    if (els.editProjectId) {
      els.editProjectId.value = account.projectId || AgentPlatform.cachedProject(account.apiKey) || "";
    }
    if (els.editLocation) els.editLocation.value = account.location || "global";
    if (els.editEndpoint) els.editEndpoint.value = account.endpoint || provider.defaultEndpoint;
  } else if ((openCode || keyless) && els.editEndpoint) {
    els.editEndpoint.value = account.endpoint || provider.defaultEndpoint;
  }
  if (els.editReasoningEffort) {
    els.editReasoningEffort.value = account.reasoningEffort || "off";
  }
  if (els.editSitePlanReasoningEffort) {
    els.editSitePlanReasoningEffort.value = account.sitePlanReasoningEffort || "off";
  }
}

function readEditorIntoDraft() {
  if (!editingProviderId || !draftAccounts) return;
  var id = editingProviderId;
  var account = draftAccounts[id];
  var provider = providerById(id);
  account.apiKey = els.editApiKey ? els.editApiKey.value.trim() : account.apiKey;
  if (id === "agentplatform") {
    account.vertexAuthType = els.editAuthType ? els.editAuthType.value : account.vertexAuthType;
    account.projectId = els.editProjectId ? els.editProjectId.value.trim() : account.projectId;
    account.location = els.editLocation ? (els.editLocation.value.trim() || "global") : account.location;
    account.endpoint = els.editEndpoint ? (els.editEndpoint.value.trim() || provider.defaultEndpoint) : account.endpoint;
  } else if (isOpenCodeProvider(id) && els.editEndpoint) {
    account.endpoint = els.editEndpoint.value.trim() || provider.defaultEndpoint;
  } else if (provider && provider.keyless) {
    if (els.editEndpoint) account.endpoint = LocalAdapter.normalizeEndpoint(els.editEndpoint.value);
    account.enabled = true;
  }
  if (els.editReasoningEffort) {
    account.reasoningEffort = els.editReasoningEffort.value || "off";
  }
  if (els.editSitePlanReasoningEffort) {
    account.sitePlanReasoningEffort = els.editSitePlanReasoningEffort.value || "off";
  }
}

function maybeCopySiblingKey() {
  var provider = providerById(editingProviderId);
  if (!provider || !provider.sibling) return;
  var key = draftAccounts[editingProviderId].apiKey;
  var sibling = draftAccounts[provider.sibling];
  if (!key || key === editorKeyAtOpen || String(sibling.apiKey || "").trim()) return;
  var siblingInfo = providerById(provider.sibling);
  var copy = typeof window !== "undefined" && typeof window.confirm === "function"
    ? window.confirm("Use this key for " + siblingInfo.name + " too?")
    : false;
  if (copy) sibling.apiKey = key;
}

function commitEditor(askCopy) {
  if (!editingProviderId) return;
  readEditorIntoDraft();
  if (askCopy) maybeCopySiblingKey();
  editorKeyAtOpen = draftAccounts[editingProviderId].apiKey || "";
  renderProviderList();
}

function removeProviderKey(providerId) {
  if (!draftAccounts || !draftAccounts[providerId]) return;
  var provider = providerById(providerId);
  if (provider && provider.keyless) {
    draftAccounts[providerId].enabled = false;
    draftAccounts[providerId].endpoint = provider.defaultEndpoint;
  } else {
    draftAccounts[providerId].apiKey = "";
  }
  if (editingProviderId === providerId) {
    // Drop the open editor so a later Save Settings cannot re-enable the
    // account from the editor fields.
    editingProviderId = "";
    if (els.providerEditPanel) els.providerEditPanel.hidden = true;
  }
  renderProviderList();
  if (provider && provider.keyless) {
    setEditStatus(provider.name + " endpoint disabled. Choose Save Settings to keep this.");
  } else {
    setEditStatus(providerById(providerId).name + " key removed. Choose Save Settings to keep this.");
  }
}

function cacheAndRefresh(note) {
  state.settings.cachedModels = state.settings.cachedModels || {};
  saveSettings(state.settings);
  syncModelPickers();
  setEditStatus(note);
}

function fetchEditingProvider() {
  if (!editingProviderId) return;
  readEditorIntoDraft();
  var id = editingProviderId;
  var account = draftAccounts[id];
  var provider = providerById(id);
  var key = String(account.apiKey || "").trim();
  if (!key && !(provider && provider.keyless)) {
    setEditStatus("Paste a key before fetching models.");
    return;
  }
  if (provider && provider.keyless && !String(account.endpoint || "").trim()) {
    setEditStatus("Enter an endpoint URL before fetching models.");
    return;
  }
  setEditStatus("Fetching " + provider.name + " models…");

  if (id === "local") {
    LocalAdapter.fetchModels(account.endpoint, key, function(err, models) {
      if (err || !models) {
        setEditStatus("⚠️ " + (err || "Failed to fetch models"));
        return;
      }
      state.settings.cachedModels = state.settings.cachedModels || {};
      var cached = models.slice(0, 200);
      state.settings.cachedModels.localChat = cached;
      cacheAndRefresh("✓ Loaded " + cached.length + " local model(s).");
    });
    return;
  }

  if (id === "commandcode") {
    var ccEndpoint = account.endpoint || provider.defaultEndpoint;
    CommandCodeAdapter.fetchModels(ccEndpoint, key, function(err, models) {
      if (err || !models) {
        setEditStatus("⚠️ " + (err || "Failed to fetch models"));
        return;
      }
      state.settings.cachedModels = state.settings.cachedModels || {};
      var cached = models.slice(0, 200);
      state.settings.cachedModels.commandcodeChat = cached;
      cacheAndRefresh("✓ Loaded " + cached.length + " Command Code models.");
    });
    return;
  }

  if (id === "openrouter") {
    OpenRouterAdapter.fetchModels(key, function(err, result) {
      if (err || !result) {
        setEditStatus("⚠️ " + (err || "Failed"));
        return;
      }
      var cached = state.settings.cachedModels || {};
      state.settings.cachedModels = cached;
      if (result.textModels && result.textModels.length > 0) cached.orChat = result.textModels.slice(0, 120);
      if (result.imageModels && result.imageModels.length > 0) cached.orImage = result.imageModels.slice();
      cacheAndRefresh("✓ Loaded " + (result.textModels ? result.textModels.length : 0) + " text and " +
        (result.imageModels ? result.imageModels.length : 0) + " image models.");
    });
    return;
  }

  if (isOpenCodeProvider(id)) {
    var endpoint = account.endpoint || provider.defaultEndpoint;
    OpenCodeAdapter.fetchModels(endpoint, key, function(err, models) {
      if (err || !models) {
        setEditStatus("⚠️ " + (err || "Failed to fetch models"));
        return;
      }
      state.settings.cachedModels = state.settings.cachedModels || {};
      if (id === "opencode-go") state.settings.cachedModels.opencodeGoChat = models.slice();
      else state.settings.cachedModels.opencodeZenChat = models.slice();
      cacheAndRefresh("✓ Loaded " + models.length + " " + provider.name + " models.");
    });
    return;
  }

  var endpoint = id === "agentplatform"
    ? (account.endpoint || provider.defaultEndpoint)
    : provider.defaultEndpoint;
  GeminiAdapter.fetchModels(endpoint, key, {
    geminiAuthMethod: id === "agentplatform" ? "agentplatform" : "gemini",
    geminiVertexAuthType: account.vertexAuthType || "apikey",
    geminiProjectId: account.projectId || "",
    geminiLocation: account.location || "global",
    includeImageModels: true
  }, function(err, chatModels, _status, imageModels) {
    var discovered = AgentPlatform.cachedProject(key);
    if (discovered && els.editProjectId && !els.editProjectId.value.trim() && id === "agentplatform") {
      els.editProjectId.value = discovered;
      account.projectId = discovered;
    }
    if (err) {
      setEditStatus("⚠️ " + err);
      return;
    }
    state.settings.cachedModels = state.settings.cachedModels || {};
    if (chatModels && chatModels.length > 0) state.settings.cachedModels.googleChat = chatModels.slice();
    if (imageModels && imageModels.length > 0) state.settings.cachedModels.googleImage = imageModels.slice();
    var chatCount = (chatModels && chatModels.length) || 0;
    var imageCount = (imageModels && imageModels.length) || 0;
    cacheAndRefresh("✓ Verified " + chatCount + " chat and " + imageCount + " image model(s)" +
      (discovered ? " (Project #" + discovered + ")" : "") + ".");
  });
}

function syncBuildStamp() {
  var el = document.getElementById("build-stamp");
  if (!el || !BUILD_TIME) return;
  var when = new Date(BUILD_TIME);
  var label = isNaN(when.getTime()) ? BUILD_TIME : when.toLocaleString();
  el.textContent = "Build " + label;
}

export function openSettingsModal() {
  if (!els.settingsModal) return;
  var settings = state.settings;
  draftAccounts = cloneDraft(settings.accounts);
  editingProviderId = "";
  if (els.providerEditPanel) els.providerEditPanel.hidden = true;
  setEditStatus("");
  renderProviderList();

  if (els.temperatureSlider) els.temperatureSlider.value = settings.temperature;
  if (els.tempValLabel) els.tempValLabel.textContent = settings.temperature;
  syncTimelineDivergenceUI(settings.timelineDivergence || 0);
  if (els.imageModeSelect) els.imageModeSelect.value = settings.imageMode;
  if (els.imageEngineSelect) els.imageEngineSelect.value = settings.imageEngine || "image-model";
  syncImageEngineHint();
  if (els.maxImagesSlider) els.maxImagesSlider.value = settings.maxImagesPerPage;
  if (els.maxImagesLabel) els.maxImagesLabel.textContent = settings.maxImagesPerPage;
  if (els.chkShowStandaloneTitlebar) {
    els.chkShowStandaloneTitlebar.checked = Boolean(settings.showStandaloneTitlebar);
  }
  syncPwaStatusInModal();
  syncBuildStamp();
  els.settingsModal.hidden = false;
}

export function closeSettingsModal() {
  draftAccounts = null;
  editingProviderId = "";
  if (els.settingsModal) els.settingsModal.hidden = true;
}

function onTextProviderChanged() {
  if (syncingPickers) return;
  state.settings.pageProvider = els.textProviderSelect.value;
  var models = getAvailableModelList(state.settings.pageProvider, false);
  fillModelSelect(els.textModelSelect, models, "");
  applyCustomVisibility(els.textModelSelect, els.textModelCustom, "");
  state.settings.pageModel = readPickerModel(els.textModelSelect, els.textModelCustom, state.settings.pageProvider) || models[0] || "";
  persistChoice();
}

function onTextModelChanged() {
  if (syncingPickers) return;
  applyCustomVisibility(els.textModelSelect, els.textModelCustom, els.textModelCustom ? els.textModelCustom.value : "");
  if (els.textModelSelect.value === OTHER) {
    if (els.textModelCustom) els.textModelCustom.focus();
    return;
  }
  state.settings.pageModel = readPickerModel(els.textModelSelect, els.textModelCustom, state.settings.pageProvider);
  persistChoice();
}

function onTextCustomChanged() {
  if (syncingPickers) return;
  var model = readPickerModel(els.textModelSelect, els.textModelCustom, state.settings.pageProvider);
  if (!model) return;
  state.settings.pageModel = model;
  persistChoice();
}

function onImageProviderChanged() {
  if (syncingPickers) return;
  state.settings.imageProvider = els.imageProviderSelect.value;
  var models = getAvailableModelList(state.settings.imageProvider, true);
  fillModelSelect(els.imageModelSelect, models, "");
  applyCustomVisibility(els.imageModelSelect, els.imageModelCustom, "");
  state.settings.imageModel = readPickerModel(els.imageModelSelect, els.imageModelCustom, state.settings.imageProvider) || models[0] || "";
  persistChoice();
}

function onImageModelChanged() {
  if (syncingPickers) return;
  applyCustomVisibility(els.imageModelSelect, els.imageModelCustom, els.imageModelCustom ? els.imageModelCustom.value : "");
  if (els.imageModelSelect.value === OTHER) {
    if (els.imageModelCustom) els.imageModelCustom.focus();
    return;
  }
  state.settings.imageModel = readPickerModel(els.imageModelSelect, els.imageModelCustom, state.settings.imageProvider);
  persistChoice();
}

function onImageCustomChanged() {
  if (syncingPickers) return;
  var model = readPickerModel(els.imageModelSelect, els.imageModelCustom, state.settings.imageProvider);
  if (!model) return;
  state.settings.imageModel = model;
  persistChoice();
}

export function initSettingsModalEvents(onSettingsSaved) {
  if (!els.settingsModal) return;

  if (els.settingsCloseBtn) els.settingsCloseBtn.addEventListener("click", closeSettingsModal);
  if (els.settingsCancelBtn) els.settingsCancelBtn.addEventListener("click", closeSettingsModal);

  if (els.btnModalInstallApp) {
    els.btnModalInstallApp.addEventListener("click", async function() {
      if (canPromptInstall()) {
        var res = await promptInstall();
        if (res && res.outcome === "accepted") {
          syncPwaStatusInModal();
          closeSettingsModal();
        }
      } else {
        alert("To install Browser of Dreams as a Web App:\n\n• Google Chrome / Chromium / Edge (Desktop): Click the Install icon in the address bar.\n• Apple Safari (iOS / iPadOS): Tap the Share button (square with arrow up) ➔ 'Add to Home Screen'.\n• Android Chrome: Tap the three dots (⋮) menu ➔ 'Install app'.");
      }
    });
  }

  if (els.chkShowStandaloneTitlebar) {
    els.chkShowStandaloneTitlebar.addEventListener("change", function() {
      syncStandaloneDOM(els.chkShowStandaloneTitlebar.checked);
    });
  }

  if (els.providerAccountList) {
    els.providerAccountList.addEventListener("click", function(event) {
      var button = event.target.closest ? event.target.closest("[data-provider-action]") : null;
      if (!button) return;
      var id = button.dataset.providerId;
      var action = button.dataset.providerAction;
      if (action === "edit") openEditor(id);
      else if (action === "remove") removeProviderKey(id);
      else if (action === "fetch") {
        openEditor(id);
        fetchEditingProvider();
      }
    });
  }

  if (els.providerEditSave) {
    els.providerEditSave.addEventListener("click", function() {
      commitEditor(true);
      var provider = providerById(editingProviderId);
      if (provider && provider.keyless) {
        setEditStatus(provider.name + " endpoint saved. Choose Save Settings to keep it.");
        var cachedLocal = state.settings.cachedModels && state.settings.cachedModels.localChat;
        if (!cachedLocal || cachedLocal.length === 0) fetchEditingProvider();
        return;
      }
      setEditStatus("Key saved for " + (provider ? provider.name : "provider") + ". Choose Save Settings to keep it.");
    });
  }
  if (els.providerEditFetch) {
    els.providerEditFetch.addEventListener("click", fetchEditingProvider);
  }
  if (els.providerEditClose) {
    els.providerEditClose.addEventListener("click", function() {
      editingProviderId = "";
      if (els.providerEditPanel) els.providerEditPanel.hidden = true;
    });
  }
  if (els.editToggleKeyVis && els.editApiKey) {
    els.editToggleKeyVis.addEventListener("click", function() {
      els.editApiKey.type = els.editApiKey.type === "password" ? "text" : "password";
    });
  }

  if (els.temperatureSlider) {
    els.temperatureSlider.addEventListener("input", function() {
      if (els.tempValLabel) els.tempValLabel.textContent = els.temperatureSlider.value;
    });
  }
  if (els.settingsTimelineSlider) {
    els.settingsTimelineSlider.addEventListener("input", function() {
      syncTimelineDivergenceUI(els.settingsTimelineSlider.value);
    });
  }
  if (els.maxImagesSlider) {
    els.maxImagesSlider.addEventListener("input", function() {
      if (els.maxImagesLabel) els.maxImagesLabel.textContent = els.maxImagesSlider.value;
    });
  }
  if (els.imageEngineSelect) {
    els.imageEngineSelect.addEventListener("change", syncImageEngineHint);
  }

  if (els.textProviderSelect) els.textProviderSelect.addEventListener("change", onTextProviderChanged);
  if (els.textModelSelect) els.textModelSelect.addEventListener("change", onTextModelChanged);
  if (els.textModelCustom) els.textModelCustom.addEventListener("change", onTextCustomChanged);
  if (els.imageProviderSelect) els.imageProviderSelect.addEventListener("change", onImageProviderChanged);
  if (els.imageModelSelect) els.imageModelSelect.addEventListener("change", onImageModelChanged);
  if (els.imageModelCustom) els.imageModelCustom.addEventListener("change", onImageCustomChanged);

  if (els.settingsSaveBtn) {
    els.settingsSaveBtn.addEventListener("click", function() {
      var s = state.settings;
      if (editingProviderId) commitEditor(true);
      s.accounts = cloneDraft(draftAccounts || s.accounts);
      s.temperature = els.temperatureSlider ? (parseFloat(els.temperatureSlider.value) || 0.7) : s.temperature;
      if (els.settingsTimelineSlider) {
        s.timelineDivergence = parseInt(els.settingsTimelineSlider.value, 10) || 0;
      }
      syncTimelineDivergenceUI(s.timelineDivergence);
      if (els.imageModeSelect) s.imageMode = els.imageModeSelect.value;
      if (els.imageEngineSelect) s.imageEngine = els.imageEngineSelect.value;
      if (els.maxImagesSlider) s.maxImagesPerPage = parseInt(els.maxImagesSlider.value, 10) || 12;
      s.showStandaloneTitlebar = Boolean(els.chkShowStandaloneTitlebar && els.chkShowStandaloneTitlebar.checked);
      syncStandaloneDOM(s.showStandaloneTitlebar);
      saveSettings(s);
      syncModelPickers();
      updateProviderStatusUI();
      closeSettingsModal();
      if (onSettingsSaved) onSettingsSaved(s);
    });
  }
}
