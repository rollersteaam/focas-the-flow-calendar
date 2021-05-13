module.exports = {
  pages: {
    popup: {
      template: "public/browser-extension.html",
      entry: "./src/popup/main.js",
      title: "Popup",
    },
    standalone: {
      template: "public/index.html",
      entry: "./src/standalone/main.js",
      title: "Flowcas",
    },
    notification: {
      template: "public/index.html",
      entry: "./src/notification/main.js",
      title: "Flowcas Notification",
    },
  },
  pluginOptions: {
    browserExtension: {
      components: {
        background: true,
        popup: true,
        standalone: true,
      },
      componentOptions: {
        background: {
          entry: "src/background.js",
        },
      },
    },
  },
};
