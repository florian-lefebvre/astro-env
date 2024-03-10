/**
 * @type {import("../../types.js").GetEnvVariable}
 */
export const getEnvVariable = (key) => Bun.env[key];
