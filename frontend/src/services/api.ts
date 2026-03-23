const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
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

  async register(userData: {
    nom: string;
    email: string;
    password: string;
    companyName: string;
    companyEmail?: string;
    telephone?: string;
    adresse?: string;
    rccm?: string;
    capital?: string;
    plan?: string;
  }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.clearToken();
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

  // Packs
  async getPacks(params?: { actif?: boolean; sousService?: string }) {
    const query = new URLSearchParams();
    if (params?.actif !== undefined) query.append('actif', String(params.actif));
    if (params?.sousService) query.append('sousService', params.sousService);
    
    const queryString = query.toString();
    return this.request(`/packs${queryString ? `?${queryString}` : ''}`);
  }

  async getSousServices() {
    return this.request('/packs/sous-services');
  }

  async getPack(id: number) {
    return this.request(`/packs/${id}`);
  }

  async createPack(pack: any) {
    return this.request('/packs', {
      method: 'POST',
      body: JSON.stringify(pack),
    });
  }

  async updatePack(id: number, pack: any) {
    return this.request(`/packs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pack),
    });
  }

  async deletePack(id: number) {
    return this.request(`/packs/${id}`, {
      method: 'DELETE',
    });
  }

  // Devis
  async getDevis(params?: { statut?: string; clientId?: number; dateDebut?: string; dateFin?: string }) {
    const query = new URLSearchParams();
    if (params?.statut) query.append('statut', params.statut);
    if (params?.clientId) query.append('clientId', String(params.clientId));
    if (params?.dateDebut) query.append('dateDebut', params.dateDebut);
    if (params?.dateFin) query.append('dateFin', params.dateFin);
    
    const queryString = query.toString();
    return this.request(`/devis${queryString ? `?${queryString}` : ''}`);
  }

  async getDevisById(id: number) {
    return this.request(`/devis/${id}`);
  }

  async getNumeroSuivantDevis(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request(`/devis/numero-suivant${query}`);
  }

  async createDevis(devis: any) {
    return this.request('/devis', {
      method: 'POST',
      body: JSON.stringify(devis),
    });
  }

  async updateDevis(id: number, devis: any) {
    return this.request(`/devis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(devis),
    });
  }

  async deleteDevis(id: number) {
    return this.request(`/devis/${id}`, {
      method: 'DELETE',
    });
  }

  async convertirDevisEnBC(id: number) {
    return this.request(`/devis/${id}/convertir-bc`, {
      method: 'POST',
    });
  }

  // Templates PDF
  async uploadTemplate(file: File, nom: string, type: string) {
    const formData = new FormData();
    formData.append('template', file);
    formData.append('nom', nom);
    formData.append('type', type);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/templates/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(error.error || 'Erreur serveur');
    }

    return response.json();
  }

  async updateTemplate(id: number, data: any) {
    return this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getTemplates(params?: { type?: string }) {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    
    const queryString = query.toString();
    return this.request(`/templates${queryString ? `?${queryString}` : ''}`);
  }

  async getTemplate(id: number) {
    return this.request(`/templates/${id}`);
  }

  async setDefaultTemplate(id: number) {
    return this.request(`/templates/${id}/default`, {
      method: 'PUT',
    });
  }

  async deleteTemplate(id: number) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // Génération PDF
  async generateDevisPdf(id: number, templateId?: number) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/pdf/devis/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ templateId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(error.error || 'Erreur serveur');
    }

    // Télécharge le fichier PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devis-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async generateFacturePdf(id: number, templateId?: number) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/pdf/facture/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ templateId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(error.error || 'Erreur serveur');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async generateCommandePdf(id: number, templateId?: number) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/pdf/commande/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ templateId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(error.error || 'Erreur serveur');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commande-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const api = new ApiService();
