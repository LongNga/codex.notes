'use strict';

const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

/**
 * Database class. neDB - https://github.com/louischatriot/nedb.
 */
class Database {

  constructor() {
  }

  /**
   * Create directory in user application folder and initialize collections USER and DIRECTORY.
   * Create root directory if not exists.
   * @returns {Promise.<void>}
   */
  async makeInitialSettings(appFolder) {

    this.appFolder = appFolder;

    if (!fs.existsSync(this.appFolder)) {
      fs.mkdirSync(this.appFolder);
    }

    this.USER = new Datastore({ filename: path.join(this.appFolder, 'user.db'), autoload: true });
    this.DIRECTORY = new Datastore({ filename: path.join(this.appFolder, 'dir.db'), autoload: true });
    this.NOTES = new Datastore({ filename: path.join(this.appFolder, 'notes.db'), autoload: true });

    let rootDirectory = await this.find(this.DIRECTORY, {'root': true });
    if (rootDirectory.length === 0) {
      await this.insert(this.DIRECTORY, {
        'root': true,
        'name': 'root',
        '_id': 0,
        'notes': []
      });
    }
  }
  
  find(collection, query) {
    return new Promise((resolve, reject) => {
      collection.find(query, function (err, docs) {
        if (err) {
          reject(err);
        }

        resolve(docs);
      });
    });
  }

  findOne(collection, query) {
    return new Promise((resolve, reject) => {
      collection.findOne(query, function (err, doc) {
        if (err) {
          reject(err);
        }

        resolve(doc);
      });
    });
  }

  insert(collection, data) {
    return new Promise((resolve, reject) => {
      collection.insert(data, function (err, insertedData) {
        if (err) {
          reject(err);
        }

        resolve(insertedData);
      });
    });
  }

  update(collection, query, data, options) {
    return new Promise((resolve, reject) => {
      collection.update(query, data, options, function (err, numReplaced) {
        if (err) {
          reject(err);
        }

        resolve(numReplaced);
      });
    });
  }

  remove(collection, query, options) {
    return new Promise((resolve, reject) => {
      collection.remove(query, options, function (err, numDeleted) {
        if (err) {
          reject(err);
        }

        resolve(numDeleted);
      });
    });
  }
}

module.exports = new Database();