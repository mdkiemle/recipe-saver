import { ipcMain, BrowserWindow } from "electron";

const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: "printableArea",
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: "Page header",
  footer: "Page footer",
};

ipcMain.on("previewComponent", async (event, url) => {
  let win = new BrowserWindow({
    title: "Print Preview",
    show: false,
    autoHideMenuBar: true,
  });

  console.log("Inside previewComponent ipcMain");

  win.webContents.once("did-finish-load", () => {
    win.webContents.printToPDF(printOptions).then((data) => {
      const buf = Buffer.from(data);
      var data2 = buf.toString("base64");
      const url = "data:application/pdf;base64," + data2;

      win.webContents.on("dom-ready", () => {
        win.once("page-title-updated", (e) => e.preventDefault());
        win.show();
      });
      win.loadURL(url);
    }).catch((error) => {
      console.log(error);
    });
  });
  await win.loadURL(url);
  return "shown preview window";
});