import electronUpdater, { type AppUpdater } from 'electron-updater';
import log from 'electron-log/main';

export default class VersionManager {

    updaterManager: AppUpdater;

    constructor() {
        const { autoUpdater } = electronUpdater;
        this.updaterManager = autoUpdater;

        log.transports.file.level = "debug";
        this.updaterManager.logger = log;
        this.updaterManager.checkForUpdatesAndNotify().then(r => log.log(r));
    }
}