/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  MxmindIframeView: () => MxmindIframeView,
  VIEW_TYPE_EXAMPLE: () => VIEW_TYPE_EXAMPLE,
  default: () => MxmindPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var iframe = null;
var ready = false;
var VIEW_TYPE_EXAMPLE = "mxmind-view";
function getTheme() {
  return document.body.hasClass("theme-dark") ? "dark" : "light";
}
function getLanguage() {
  const locale = import_obsidian.moment.locale();
  const arr = locale.split("-");
  if (arr[1]) {
    arr[1] = arr[1].toString().toUpperCase();
  }
  return arr.join("-");
}
var getUrl = () => {
  return "https://mxmind.com/mindmap/new?utm_source=obsidian&theme=" + getTheme() + "&lng=" + getLanguage();
};
var MxmindPlugin = class extends import_obsidian.Plugin {
  //settings: MyPluginSettings;
  async onload() {
    this.registerView(
      VIEW_TYPE_EXAMPLE,
      (leaf) => new MxmindIframeView(leaf)
    );
    const ribbonIconEl = this.addRibbonIcon(
      "network",
      "Mxmind",
      (evt) => {
        this.toggleView();
      }
    );
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        const extension = file.extension;
        if (!extension || extension != "md")
          return;
        if (!(file instanceof import_obsidian.TFile))
          return;
        menu.addItem((item) => {
          item.setTitle("Open as mindmap").setIcon("document").onClick(async () => {
            const content = await this.app.vault.cachedRead(
              file
            );
            const post = async () => {
              postIframeMessage("loadFromMd", [content]);
            };
            await this.activateView();
            waitEditor().then(post).catch(post);
          });
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("css-change", () => {
        postIframeMessage("setTheme", [getTheme()]);
      })
    );
  }
  onunload() {
  }
  // async loadSettings() {
  // 	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  // }
  // async saveSettings() {
  // 	await this.saveData(this.settings);
  // }
  async toggleView() {
    var _a;
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);
    if (leaves.length > 0) {
      leaf = leaves[0];
      this.toggleCollapseRight();
    } else {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
    }
    if (leaf.getViewState().active) {
      (_a = iframe == null ? void 0 : iframe.contentWindow) == null ? void 0 : _a.postMessage(
        {
          method: "fullScreen",
          params: []
        },
        "*"
      );
    }
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
    }
    await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
    workspace.revealLeaf(leaf);
    return leaf;
  }
  toggleCollapseRight() {
    const rightSplit = this.app.workspace.rightSplit;
    rightSplit.collapsed ? rightSplit.expand() : rightSplit.collapse();
  }
};
var MxmindIframeView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
    this.navigation = true;
  }
  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }
  getDisplayText() {
    return "Mxmind";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    const int = setInterval(() => {
      if (this.leaf.tabHeaderEl && this.leaf.tabHeaderEl.parentElement) {
        clearInterval(int);
        this.leaf.tabHeaderEl.parentElement.style.display = "none";
      }
    }, 100);
    container.setAttribute(
      "style",
      import_obsidian.Platform.isMobile ? "padding:0;overflow:hidden;" : "padding:0;padding-bottom:30px;overflow:hidden;"
    );
    container.createEl(
      "iframe",
      {
        cls: "mxmind-iframe",
        attr: {
          style: "width:100%;height:100%;",
          src: getUrl(),
          frameborder: "0"
        }
      },
      (el) => {
        iframe = el;
      }
    );
    container.win.onmessage = (event) => {
      if (event.data.event && event.data.event == "editor-ready") {
        ready = true;
      }
    };
  }
  async onClose() {
  }
};
function waitEditor() {
  return new Promise((resolve, reject) => {
    if (ready) {
      resolve(true);
    } else {
      const t = new Date().getTime();
      const int = setInterval(() => {
        if (ready) {
          clearInterval(int);
          resolve(true);
        } else {
          if (new Date().getTime() - t > 10 * 1e3) {
            clearInterval(int);
            reject(false);
          }
        }
      }, 100);
    }
  });
}
function postIframeMessage(method, params) {
  var _a;
  if (!iframe)
    return;
  (_a = iframe == null ? void 0 : iframe.contentWindow) == null ? void 0 : _a.postMessage(
    {
      method,
      params
    },
    "*"
  );
}
