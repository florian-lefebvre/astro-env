/**
 * @type {import("../../types.js").GetEnvVariable}
 */
export const getEnvVariable = (key) => Deno.env.get(key);
