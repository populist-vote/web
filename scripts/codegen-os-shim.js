/* eslint-disable -- plain Node script, not in tsconfig */
/**
 * Preload shim so graphql-codegen works when os.cpus().length is 0 (e.g. CI/sandbox).
 * Use: node -r ./scripts/codegen-os-shim.js $(which graphql-codegen)
 */
const os = require('os');
const originalCpus = os.cpus;
os.cpus = function cpus() {
  const cpus = originalCpus.call(this);
  return cpus.length > 0 ? cpus : [{ model: 'unknown', speed: 0, times: {} }];
};
