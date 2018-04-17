/**
 * @module SyncQueueObserver
 * Manipulates with entity Queue
 * Resolves problem with syncing the updated entities — which Note or Folder was changed and need to be updated in the cloud
 */

'use strict';

const SyncQueue = require('../models/syncQueue');

/**
 * @class SeenStateObserver
 * Class creates pull of entity queue to send to the cloud
 */
class syncQueueObserver {

  /**
   * @constructor
   */
  constructor() {

  }

  /**
   * Push to the queue
   * @param {SyncQueueData} queueData
   */
  async push( queueData ) {

    let queueObject = new SyncQueue( queueData );
    return await queueObject.save();
  }

  /**
   * @param entityType
   * @return {Promise.<Array, SyncQueueData[]>}
   */
  getEntityQueue( entityType ) {
    return SyncQueue.getAll( entityType )
  }
}

module.exports = syncQueueObserver;
