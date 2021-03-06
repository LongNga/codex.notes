'use strict';

const random = require('../utils/random');
const db = require('../utils/database');

/**
 * Directory model
 */
class Directory {

  /**
   * Initialize params for the API
   */
  constructor() {
  }

  /**
   * Create new directory with the name specified.
   * @param name - directory name
   * @returns {Promise.<*>}
   */
  async create(name) {
    try {
      let dirId = random.generatePassword();
      let dir = await db.insert(db.DIRECTORY, { 'name': name, 'notes': [] } );
      return dir;
    }
    catch (err) {
      console.log("Directory create error: ", err);
      return false;
    }
  }

  /**
   * Get directory by ID in format:
   * {
   *   id - unique folder ID
   *   name - folder name (visible)
   *   notes: [] - array of notes
   * }
   * @param id - directory ID
   * @returns note object
   */
  async get(id) {
    try {
      let dir = await db.findOne(db.DIRECTORY, {'_id': id});
      if (dir) {
        return this.format(dir);
      }
      else {
        return false;
      }
    }
    catch (err) {
      console.log("Directory get error: ", err);
      return false;
    }
  }

  /**
   * Get list of directories in format:
   * [{
   *   id - unique folder ID
   *   name - folder name (visible)
   *   notes: [] - array of notes
   * }]
   * @returns {Promise.<boolean>}
   */
  async list() {
    try {
      let list = await db.find(db.DIRECTORY, {'_id': { $ne: 0 }});
      return list.map(this.format);
    }
    catch (err) {
      console.log("Directory list error: ", err);
      return false;
    }
  }

  /**
   * Delete directory with ID.
   * @param directoryId - directory ID
   * @returns Bool result
   */
  async delete(directoryId) {
    try {
      let deleteNotesResult = await db.remove(db.NOTES, {'folderId': directoryId}, {});
      let deleteDirectoryResult = await db.remove(db.DIRECTORY, {'_id': directoryId}, {});

      return deleteDirectoryResult & deleteNotesResult;
    }
    catch (err) {
      console.log("Directory delete error: ", err);
      return false;
    }
  }

  /**
   * Transform DB element into structure for frontend module.
   * @param element - DB structure: {{name, _id, notes: (Array|*|Notes)}}
   * @returns {{name, id, notes: (Array|*|Notes)}}
   */
  format (element) {
    return {
      'name': element.name,
      'id': element._id,
      'notes': element.notes
    };
  }

}

module.exports = Directory;