import {
  CreateWebWorkerMLCEngine,
  ModelType,
  prebuiltAppConfig
} from "https://esm.run/@mlc-ai/web-llm@0.2.87";
import { buildTextArtPrompts } from "../../src/prompts/text-art-prompt.js";
import { extractOrBuildSvgDataUrl } from "../../src/features/text-art.js";

// Standalone quality probe: same prompt builder and same SVG extraction the app
// uses, so whatever this draws is what production would draw.

const DEFAULT_MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

// Every prebuilt chat/vision build the runtime ships, smallest first. Embedding
// models are excluded: they cannot generate. Sizes are the runtime's own
// weights+KV estimate at the build's context window, so a model far above the
// device budget is still listed — select it and it will fail loudly.
const MODELS = (prebuiltAppConfig.model_list || [])
  .filter(function (model) {
    return model && model.model_id && model.model_type !== ModelType.embedding;
  })
  .map(function (model) {
    var overrides = model.overrides || {};
    return {
      id: model.model_id,
      vramMB: Math.round(model.vram_required_MB || 0),
      ctx: overrides.context_window_size || 4096,
      vision: model.model_type === ModelType.VLM
    };
  })
  .sort(function (a, b) {
    return a.vramMB - b.vramMB || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  });

function modelLabel(model) {
  return model.id + " — " + model.vramMB + " MB" + (model.vision ? " · vision" : "");
}

const SIZES = {
  photo: [360, 240],
  ad: [468, 60],
  icon: [32, 32],
  graphic: [240, 180]
};

const els = {
  subject: document.getElementById("subject"),
  role: document.getElementById("role"),
  style: document.getElementById("style"),
  date: document.getElementById("date"),
  divergence: document.getElementById("divergence"),
  divergenceLabel: document.getElementById("divergence-label"),
  width: document.getElementById("width"),
  height: document.getElementById("height"),
  model: document.getElementById("model"),
  modelHint: document.getElementById("model-hint"),
  loadBtn: document.getElementById("load"),
  generateBtn: document.getElementById("generate"),
  stopBtn: document.getElementById("stop"),
  saveBtn: document.getElementById("save"),
  status: document.getElementById("status"),
  metrics: document.getElementById("metrics"),
  stage: document.getElementById("stage"),
  img: document.getElementById("result"),
  raw: document.getElementById("raw"),
  sysText: document.getElementById("sys-text"),
  userText: document.getElementById("user-text"),
  useCustom: document.getElementById("use-custom"),
  gpuNotice: document.getElementById("gpu-notice")
};

let worker = null;
let engine = null;
let loadedModel = "";
let streaming = false;
let lastBuilt = null;

MODELS.forEach((model) => {
  const option = document.createElement("option");
  option.value = model.id;
  option.textContent = modelLabel(model);
  els.model.appendChild(option);
});

if (MODELS.some((model) => model.id === DEFAULT_MODEL_ID)) {
  els.model.value = DEFAULT_MODEL_ID;
}

function syncModelHint() {
  const picked = MODELS.find((model) => model.id === els.model.value);
  if (!picked) {
    els.modelHint.textContent = "";
    return;
  }
  els.modelHint.textContent =
    picked.vramMB + " MB of GPU memory · " + picked.ctx + "-token context" +
    (picked.vision ? " · vision model, text prompts still work" : "") +
    (picked.vramMB > 7000 ? " — more than most laptops can give a tab; expect a device-lost error" : "");
}

function getWorker() {
  if (!worker) worker = new Worker("./worker.js", { type: "module" });
  return worker;
}

function setStatus(text) {
  els.status.textContent = text;
}

async function loadModel() {
  if (!navigator.gpu) return;
  const id = els.model.value;
  if (engine && loadedModel === id) {
    setStatus("Model ready (" + id + ")");
    return;
  }

  els.loadBtn.disabled = true;
  els.generateBtn.disabled = true;
  setStatus("Preparing " + id + "…");

  try {
    if (engine) {
      await engine.unload();
      engine = null;
      loadedModel = "";
    }
    engine = await CreateWebWorkerMLCEngine(getWorker(), id, {
      initProgressCallback: (report) => {
        const pct = Math.round((report && report.progress ? report.progress : 0) * 100);
        setStatus((report && report.text ? report.text : "loading") + " — " + pct + "%");
      }
    });
    loadedModel = id;
    setStatus("Model ready (" + id + ")");
    els.generateBtn.disabled = false;
  } catch (err) {
    setStatus("Model failed: " + (err && err.message ? err.message : String(err)));
  } finally {
    els.loadBtn.disabled = false;
  }
}

function buildBundle() {
  const role = els.role.value;
  return buildTextArtPrompts({
    prompt: els.subject.value.trim(),
    role: role,
    width: parseInt(els.width.value, 10) || SIZES[role][0],
    height: parseInt(els.height.value, 10) || SIZES[role][1],
    aspectRatio: "",
    dateStr: els.date.value || "1999-12-31",
    timelineDivergence: Number(els.divergence.value) || 0,
    styleMode: els.style.value
  });
}

function syncPromptPreview() {
  if (els.useCustom.checked) return;
  const bundle = buildBundle();
  els.sysText.value = bundle.systemPrompt;
  els.userText.value = bundle.userPrompt;
}

async function generate() {
  if (!engine || streaming) return;

  const subject = els.subject.value.trim();
  const role = els.role.value;
  const style = els.style.value;
  const width = parseInt(els.width.value, 10) || SIZES[role][0];
  const height = parseInt(els.height.value, 10) || SIZES[role][1];

  const bundle = buildBundle();
  const custom = els.useCustom.checked;
  const systemPrompt = custom ? els.sysText.value : bundle.systemPrompt;
  const userPrompt = custom ? els.userText.value : bundle.userPrompt;
  if (!custom) syncPromptPreview();

  streaming = true;
  els.generateBtn.disabled = true;
  els.stopBtn.disabled = false;
  els.saveBtn.disabled = true;
  els.raw.textContent = "";
  setStatus("Generating…");

  let text = "";
  let failure = "";
  const started = performance.now();

  try {
    const stream = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: true,
      temperature: 0.65,
      max_tokens: 2048
    });

    for await (const chunk of stream) {
      const choice = chunk && chunk.choices && chunk.choices[0];
      const delta = (choice && choice.delta && choice.delta.content) || "";
      if (!delta) continue;
      text += delta;
      els.raw.textContent = text;
      els.raw.scrollTop = els.raw.scrollHeight;
      setStatus("Generating… " + text.length + " chars");
    }
  } catch (err) {
    failure = err && err.message ? err.message : String(err);
  }

  const elapsed = performance.now() - started;
  const built = extractOrBuildSvgDataUrl(text, {
    prompt: subject,
    role: role,
    width: width,
    height: height,
    aspectRatio: "",
    styleMode: style
  });

  lastBuilt = built;
  els.img.src = built.dataUrl;
  els.img.style.imageRendering = built.isPixelArt ? "pixelated" : "";
  els.stage.hidden = false;

  const approxTokens = Math.round(text.length / 3.6);
  const rate = elapsed > 0 ? approxTokens / (elapsed / 1000) : 0;
  els.metrics.textContent =
    Math.round(elapsed) + " ms · ~" + approxTokens + " tok · " +
    rate.toFixed(1) + " tok/s · " + (built.isPixelArt ? "pixel" : "svg");

  streaming = false;
  if (failure) {
    setStatus("Generation failed: " + failure);
  } else if (!/<svg/i.test(text)) {
    setStatus("Done (" + Math.round(elapsed) + " ms) — model returned no <svg>; placeholder shown");
  } else {
    setStatus("Done (" + Math.round(elapsed) + " ms)");
  }
  els.generateBtn.disabled = false;
  els.stopBtn.disabled = true;
  els.saveBtn.disabled = false;
}

function stop() {
  if (engine && streaming) engine.interruptGenerate();
}

function save() {
  if (!lastBuilt) return;
  const url = URL.createObjectURL(new Blob([lastBuilt.svg], { type: "image/svg+xml" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "probe.svg";
  link.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

els.loadBtn.addEventListener("click", loadModel);
els.generateBtn.addEventListener("click", generate);
els.stopBtn.addEventListener("click", stop);
els.saveBtn.addEventListener("click", save);

els.role.addEventListener("change", function () {
  const size = SIZES[els.role.value] || SIZES.photo;
  els.width.value = size[0];
  els.height.value = size[1];
  syncPromptPreview();
});

els.style.addEventListener("change", syncPromptPreview);
els.model.addEventListener("change", syncModelHint);
els.subject.addEventListener("input", syncPromptPreview);
els.date.addEventListener("change", syncPromptPreview);
els.width.addEventListener("input", syncPromptPreview);
els.height.addEventListener("input", syncPromptPreview);
els.useCustom.addEventListener("change", function () {
  if (!els.useCustom.checked) syncPromptPreview();
});

els.divergence.addEventListener("input", function () {
  els.divergenceLabel.textContent = els.divergence.value + "%";
  syncPromptPreview();
});

syncPromptPreview();
syncModelHint();

if (!navigator.gpu) {
  els.gpuNotice.hidden = false;
  els.loadBtn.disabled = true;
}
