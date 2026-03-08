import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SING_COLORS, SING_THEME } from '../config/colors';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  Building2,
  User,
  Package,
  DollarSign,
  X,
  Save,
  ArrowRight
} from 'lucide-react';

interface Client {
  id: number;
  nom: string;
  adresse?: string;
  tel?: string;
  email?: string;
  pays: string;
  representants?: Representant[];
}

interface Representant {
  id: number;
  nom: string;
  fonction?: string;
  tel?: string;
  email?: string;
  principal: boolean;
}

interface Pack {
  id: number;
  code: string;
  descCourte: string;
  prixUnitaire: number;
  sousService: string;
  details: PackDetail[];
}

interface PackDetail {
  id: number;
  ordre: number;
  descriptionLongue: string;
}

interface LigneDevis {
  packId?: number;
  code: string;
  designation: string;
  prixUnitaire: number;
  quantite: number;
  total: number;
  details?: string[];
}

interface Devis {
  id?: number;
  numero: string;
  date: string;
  clientId: number;
  client?: Client;
  representantId?: number;
  reference?: string;
  lignes: LigneDevis[];
  soldeHt: number;
  remise: number;
  sousTotal: number;
  tps: number;
  css: number;
  netAPayer: number;
  conditionsPaiement?: string;
  statut: string;
}

export default function DevisModule() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDevis, setEditingDevis] = useState<Devis | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
