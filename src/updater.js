const {app} = require('electron');

/**
 * Read more about auto-updater events on this page
 * https://www.electron.build/auto-update
 */
const {autoUpdater} = require('electron-updater');

/**
 * Log wrapper
 *
 * @param message
 */
const showLog = (message) => {
  global.logger.debug('[updater] %s', JSON.stringify(message));
};

/**
 * @typedef {object} info
 * @property {string} version - "2.0.1"
 * @param {installer[]} files
 * @param {string} path - "codex.notes-2.0.1-mac.zip"
 * @param {string} sha512 - "vxFl4T...AAvakk/w=="
 * @param {string} releaseDate - "2018-04-19T17:32:22.107Z"
 * @param {string} releaseName - "CodeX Notes 2"
 * @param {string} releaseNotes - "<p>We have fixed a few bugs</p>"
 */

/**
 * @typedef {object} installer
 * @property {string} url - "codex.notes-2.0.1-mac.zip"
 * @property {string} sha512 - "vxFl4T...AAvakk/w=="
 * @property {string} size - "62008014"
 */

/**
 * @typedef {object} progressObj
 * @property {number} bytesPerSecond - 317345
 * @property {number} percent - 1.125174126639946
 * @property {number} transferred - 665155
 * @property {number} total - 59115739
 * @property {number} delta - 174080 (?)
 */

/**
 * Checking for update handler
 */
autoUpdater.on('checking-for-update', () => {
  showLog('Checking for update');
});

autoUpdater.on('update-available', (info) => {
  showLog('New version of the app is available');
  showLog(info);
});

autoUpdater.on('update-not-available', (info) => {
  showLog('No updates are available');
  showLog(info);
});

/**
 * Error handler
 */
autoUpdater.on('error', (err) => {
  showLog('Error while checking for updates');
  showLog(err.message);

  global.catchException(err);
});

/**
 * Download progress
 */
autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;

  logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
  logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';

  showLog(logMessage);
});

/**
 * Update was downloaded
 */
autoUpdater.on('update-downloaded', (info) => {
  showLog('Update is downloaded');
  showLog(info);

  /**
   * Restart app
   */
  autoUpdater.quitAndInstall();
});

/**
 * Call "check for updates" function
 */
app.on('ready', () => {
  autoUpdater.checkForUpdates();
});
