/**
 * @type {import("../../types.js").GetEnvVariable}
 */
export const getEnvVariable = (key, { locals }) => locals.runtime.env[key];
