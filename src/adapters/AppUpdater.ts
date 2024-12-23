import { autoUpdater } from "electron-updater";
import log from 'electron-log/main';

export default class AppUpdater {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        log.transports.file.level = "debug";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}