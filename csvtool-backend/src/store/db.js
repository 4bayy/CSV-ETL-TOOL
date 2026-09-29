/**
 * In-memory store for this prototype backend.
 *
 * Every collection is exposed through a tiny repository-style API
 * (list/get/create/update/remove) so this file is the *only* place
 * that needs to change when you swap it for a real database
 * (Postgres, SQL Server, Mongo, etc). Nothing in routes/ or services/
 * should reach into these Maps directly.
 */
const { nanoid } = require("nanoid");

function makeCollection(prefix) {
  const map = new Map();
  return {
    list: (predicate) => [...map.values()].filter(predicate || (() => true)),
    get: (id) => map.get(id) || null,
    create: (data) => {
      const id = `${prefix}_${nanoid(10)}`;
      const record = { id, createdAt: new Date().toISOString(), ...data };
      map.set(id, record);
      return record;
    },
    update: (id, patch) => {
      const existing = map.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...patch, id, updatedAt: new Date().toISOString() };
      map.set(id, updated);
      return updated;
    },
    remove: (id) => map.delete(id),
  };
}

module.exports = {
  files: makeCollection("file"),       // uploaded source / reference files + detected schema + parsed rows
  workflows: makeCollection("wf"),     // workflow configs: mapping, transform rules, validation rules
  versions: makeCollection("wfv"),     // published snapshots of a workflow config
  runs: makeCollection("run"),         // executions of a workflow version against a file
};
