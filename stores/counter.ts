import { defineStore } from "pinia";

export interface ApplicationItem {
  cover: string;
  appName: string;
  description: string;
  path: string;
  password?: string;
  type: string;
}

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    isActive: false,
    showWechatQRCode: false,
    showIFramePages: false,
    showGuideQRCode: false,
    showSettings: false,
    currentApplication: null as ApplicationItem | null,
    currentGuideAppName: "",
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    statusText: (state) => (state.isActive ? "激活" : "未激活"),
  },

  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    toggleStatus() {
      this.isActive = !this.isActive;
    },
    reset() {
      this.count = 0;
      this.isActive = false;
    },
    toggleWechatQRCode() {
      this.showWechatQRCode = !this.showWechatQRCode;
    },
    showWechatQRCodeModal() {
      this.showWechatQRCode = true;
    },
    hideWechatQRCodeModal() {
      this.showWechatQRCode = false;
    },
    toggleIFramePages() {
      this.showIFramePages = !this.showIFramePages;
    },
    showIFramePagesModal(application: ApplicationItem | null = null) {
      this.currentApplication = application;
      this.showIFramePages = true;
    },
    hideIFramePagesModal() {
      this.currentApplication = null;
      this.showIFramePages = false;
    },
    setCurrentApplication(application: ApplicationItem | null) {
      this.currentApplication = application;
    },
    showGuideQRCodeModal(appName: string) {
      this.currentGuideAppName = appName;
      this.showGuideQRCode = true;
    },
    hideGuideQRCodeModal() {
      this.currentGuideAppName = "";
      this.showGuideQRCode = false;
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    showSettingsModal() {
      this.showSettings = true;
    },
    hideSettingsModal() {
      this.showSettings = false;
    },
  },
});
