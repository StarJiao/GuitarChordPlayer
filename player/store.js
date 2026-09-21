/* ============================================================
 * 和弦播放器 —— 状态持久化模块（GcpStore）
 * 纯前端、无网络依赖，适配小红书 webview。
 * 仅持久化两类数据：和弦序列(selected) + 设置(settings)。
 * 播放运行时态(active/paused/curRow/beatIndex…)不落盘。
 * ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'gcp:v1';          // 版本化命名空间，改结构时升 v2
  var VERSION = 1;

  /* 默认值必须与 app.js 中 state 的初始值保持一致 */
  var DEFAULTS = {
    v: VERSION,
    selected: ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
    settings: {
      bpm: 60,
      beats: 4,
      preview: true,
      random: false,
      multi: false,
      autoHideList: true,
      autoHideSet: false
    }
  };

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* 读时合并：用 DEFAULTS 兜底，旧数据缺字段自动补默认；
     丢弃 DEFAULTS 中不存在的未知字段，避免历史脏数据污染。 */
  function merge(base, over) {
    var out = clone(base);
    if (!isObj(over)) return out;
    Object.keys(over).forEach(function (k) {
      if (!(k in base)) return;
      if (isObj(base[k]) && isObj(over[k])) out[k] = merge(base[k], over[k]);
      else if (over[k] !== undefined) out[k] = over[k];
    });
    return out;
  }

  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULTS);
      var parsed = JSON.parse(raw);
      if (!isObj(parsed)) return clone(DEFAULTS);
      return merge(DEFAULTS, parsed);
    } catch (e) {
      return clone(DEFAULTS);   // 解析失败 / 隐私模式 / 配额异常：退回默认
    }
  }

  var timer = null;
  function save(model) {
    try {
      if (timer) { clearTimeout(timer); timer = null; }
      timer = setTimeout(function () {
        try {
          global.localStorage.setItem(KEY, JSON.stringify(model));
        } catch (e) { /* 配额满 / 隐私模式：静默降级，不影响使用 */ }
        timer = null;
      }, 250);
    } catch (e) { /* 极端环境：直接忽略 */ }
  }

  global.GcpStore = {
    KEY: KEY,
    VERSION: VERSION,
    DEFAULTS: DEFAULTS,
    load: load,
    save: save,
    merge: merge,
    clone: clone
  };
})(window);
