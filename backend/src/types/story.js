/**
 * @typedef {Object} StoryRequest
 * @property {string} nombre_nino
 * @property {number} edad - Entre 5 y 9
 * @property {string} tema
 * @property {string} personaje_principal
 * @property {'simple' | 'medio'} vocabulario
 */

/**
 * @typedef {Object} StoryResponse
 * @property {string} titulo
 * @property {string[]} frases
 * @property {string[]} parrafos
 */

/**
 * @typedef {Object} SessionSummary
 * @property {number} id
 * @property {string} created_at
 * @property {string} nombre_nino
 * @property {string} tema
 * @property {string} titulo
 */

/**
 * @typedef {Object} SessionDetail
 * @property {number} id
 * @property {string} created_at
 * @property {string} nombre_nino
 * @property {number} edad
 * @property {string} tema
 * @property {string} personaje_principal
 * @property {string} vocabulario
 * @property {string} titulo
 * @property {string[]} frases
 * @property {string[]} parrafos
 */

module.exports = {};
