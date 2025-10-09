const isBrowser = typeof window !== "undefined";
const browserAPI = isBrowser ? window.browser || window.chrome : null;

export const getBrowser = () => browserAPI;