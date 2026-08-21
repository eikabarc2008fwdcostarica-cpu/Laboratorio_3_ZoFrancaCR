(function () {
  const API_BASE_URL = 'http://localhost:3005';

  async function request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });

      if (!response.ok) {
        throw new Error(`La API respondió con el estado ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error al consultar ${endpoint}:`, error);
      throw error;
    }
  }

  window.ZoFrancaAPI = Object.freeze({
    baseUrl: API_BASE_URL,
    get: endpoint => request(endpoint),
    post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) })
  });
})();
