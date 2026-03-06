const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(error.error || 'Erreur serveur');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(email: string, password: string, nom: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nom }),
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Clients
  async getClients() {
    return this.request('/clients');
  }

  async getClient(id: number) {
    return this.request(`/clients/${id}`);
  }

  async createClient(client: any) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async updateClient(id: number, client: any) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  }

  async deleteClient(id: number) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Produits
  async getProduits(params?: { categorie?: string; actif?: boolean }) {
    const query = new URLSearchParams();
    if (params?.categorie) query.append('categorie', params.categorie);
    if (params?.actif !== undefined) query.append('actif', String(params.actif));
    
    const queryString = query.toString();
    return this.request(`/produits${queryString ? `?${queryString}` : ''}`);
  }

  async getCategories() {
    return this.request('/produits/categories');
  }

  async getProduit(id: number) {
    return this.request(`/produits/${id}`);
  }

  async createProduit(produit: any) {
    return this.request('/produits', {
      method: 'POST',
      body: JSON.stringify(produit),
    });
  }

  async updateProduit(id: number, produit: any) {
    return this.request(`/produits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produit),
    });
  }

  async deleteProduit(id: number) {
    return this.request(`/produits/${id}`, {
      method: 'DELETE',
    });
  }

  // Documents
  async getDocuments(params?: { type?: string; statut?: string; client_id?: number }) {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.statut) query.append('statut', params.statut);
    if (params?.client_id) query.append('client_id', String(params.client_id));
    
    const queryString = query.toString();
    return this.request(`/documents${queryString ? `?${queryString}` : ''}`);
  }

  async getDocument(id: number) {
    return this.request(`/documents/${id}`);
  }

  async createDocument(document: any) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    });
  }

  async updateDocument(id: number, document: any) {
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(document),
    });
  }

  async deleteDocument(id: number) {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats() {
    return this.request('/documents/stats/summary');
  }

  // Paramètres
  async getParametres() {
    return this.request('/parametres');
  }

  async updateParametres(parametres: any) {
    return this.request('/parametres', {
      method: 'PUT',
      body: JSON.stringify(parametres),
    });
  }
}

export const api = new ApiService();
