# 📡 Exemples d'Utilisation de l'API Templates PDF

## Authentification

Toutes les requêtes nécessitent un token JWT dans le header :

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Pour obtenir un token :

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sing.com",
    "password": "votre_mot_de_passe"
  }'
```

Réponse :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@sing.com",
    "nom": "Admin SING"
  }
}
```

---

## 1. Upload d'un Template

### Requête

```bash
curl -X POST http://localhost:5000/api/templates/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "template=@/path/to/facture.pdf" \
  -F "nom=Facture SING Standard" \
  -F "type=FACTURE"
```

### Paramètres

- `template` (file) - Fichier PDF (max 10 MB)
- `nom` (string) - Nom du template
- `type` (string) - Type de document : `DEVIS`, `FACTURE`, `COMMANDE`, `LIVRAISON`

### Réponse Succès (200)

```json
{
  "message": "Template uploaded successfully",
  "template": {
    "id": 1,
    "nom": "Facture SING Standard",
    "type": "FACTURE",
    "couleurPrimaire": "#003366",
    "couleurSecondaire": "#FDB913",
    "couleurTexte": "#000000",
    "police": "Helvetica",
    "actif": true,
    "parDefaut": false,
    "createdAt": "2026-03-23T10:30:00.000Z"
  }
}
```

### Erreurs Possibles

```json
// 400 - Fichier manquant
{
  "error": "No file uploaded"
}

// 400 - Type invalide
{
  "error": "Invalid type. Must be one of: DEVIS, FACTURE, COMMANDE, LIVRAISON"
}

// 400 - Fichier trop gros
{
  "error": "File too large"
}

// 401 - Non authentifié
{
  "error": "Unauthorized"
}
```

---

## 2. Liste des Templates

### Requête - Tous les templates

```bash
curl -X GET http://localhost:5000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Requête - Filtrer par type

```bash
curl -X GET "http://localhost:5000/api/templates?type=DEVIS" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Réponse Succès (200)

```json
[
  {
    "id": 1,
    "nom": "Facture SING Standard",
    "type": "FACTURE",
    "couleurPrimaire": "#003366",
    "couleurSecondaire": "#FDB913",
    "couleurTexte": "#000000",
    "police": "Helvetica",
    "actif": true,
    "parDefaut": true,
    "createdAt": "2026-03-23T10:30:00.000Z",
    "updatedAt": "2026-03-23T10:30:00.000Z"
  },
  {
    "id": 2,
    "nom": "Devis Moderne",
    "type": "DEVIS",
    "couleurPrimaire": "#1E40AF",
    "couleurSecondaire": "#FBBF24",
    "couleurTexte": "#111827",
    "police": "Arial",
    "actif": true,
    "parDefaut": false,
    "createdAt": "2026-03-23T11:00:00.000Z",
    "updatedAt": "2026-03-23T11:00:00.000Z"
  }
]
```

---

## 3. Définir un Template comme Par Défaut

### Requête

```bash
curl -X PUT http://localhost:5000/api/templates/1/default \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Réponse Succès (200)

```json
{
  "message": "Template set as default",
  "template": {
    "id": 1,
    "nom": "Facture SING Standard",
    "type": "FACTURE",
    "parDefaut": true,
    ...
  }
}
```

### Note

Cette action désactive automatiquement tous les autres templates par défaut du même type.

---

## 4. Mettre à Jour un Template

### Requête

```bash
curl -X PUT http://localhost:5000/api/templates/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Facture SING Premium",
    "couleurPrimaire": "#1E3A8A",
    "couleurSecondaire": "#F59E0B",
    "couleurTexte": "#1F2937",
    "police": "Times New Roman",
    "actif": true
  }'
```

### Paramètres (tous optionnels)

- `nom` (string) - Nouveau nom
- `couleurPrimaire` (string) - Couleur hex (#RRGGBB)
- `couleurSecondaire` (string) - Couleur hex
- `couleurTexte` (string) - Couleur hex
- `police` (string) - Nom de la police
- `actif` (boolean) - Actif ou non

### Réponse Succès (200)

```json
{
  "message": "Template updated successfully",
  "template": {
    "id": 1,
    "nom": "Facture SING Premium",
    "couleurPrimaire": "#1E3A8A",
    ...
  }
}
```

---

## 5. Supprimer un Template

### Requête

```bash
curl -X DELETE http://localhost:5000/api/templates/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Réponse Succès (200)

```json
{
  "message": "Template deleted successfully"
}
```

### Erreurs Possibles

```json
// 404 - Template non trouvé
{
  "error": "Template not found"
}

// 403 - Pas les permissions
{
  "error": "Forbidden"
}
```

---

## 6. Générer un PDF

### Requête - Téléchargement

```bash
curl -X POST http://localhost:5000/api/pdf/generate/DEVIS/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output devis-1.pdf
```

### Requête - Prévisualisation

```bash
curl -X GET http://localhost:5000/api/pdf/preview/FACTURE/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output facture-5.pdf
```

### Paramètres URL

- `type` - Type de document : `DEVIS`, `FACTURE`, `COMMANDE`, `LIVRAISON`
- `id` - ID du document

### Réponse Succès (200)

Le serveur retourne directement le fichier PDF avec les headers :

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="DEVIS_1.pdf"
Content-Length: 45678
```

### Erreurs Possibles

```json
// 400 - Type invalide
{
  "error": "Invalid document type. Must be one of: DEVIS, FACTURE, COMMANDE, LIVRAISON"
}

// 404 - Document non trouvé
{
  "error": "Document not found"
}

// 500 - Erreur de génération
{
  "error": "Failed to generate PDF"
}
```

---

## Exemples JavaScript/TypeScript

### Upload avec Fetch

```typescript
async function uploadTemplate(file: File, nom: string, type: string) {
  const formData = new FormData();
  formData.append('template', file);
  formData.append('nom', nom);
  formData.append('type', type);

  const response = await fetch('http://localhost:5000/api/templates/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

// Usage
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files[0];
const result = await uploadTemplate(file, 'Mon Template', 'FACTURE');
console.log('Template uploadé:', result.template);
```

### Liste des Templates

```typescript
async function getTemplates(type?: string) {
  const url = type 
    ? `http://localhost:5000/api/templates?type=${type}`
    : 'http://localhost:5000/api/templates';

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return response.json();
}

// Usage
const templates = await getTemplates('DEVIS');
console.log('Templates de devis:', templates);
```

### Générer et Télécharger un PDF

```typescript
async function downloadPdf(type: string, documentId: number) {
  const response = await fetch(
    `http://localhost:5000/api/pdf/generate/${type}/${documentId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  // Télécharger le fichier
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}_${documentId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Usage
await downloadPdf('FACTURE', 123);
```

### Mettre à Jour les Couleurs

```typescript
async function updateTemplateColors(
  templateId: number,
  couleurPrimaire: string,
  couleurSecondaire: string
) {
  const response = await fetch(
    `http://localhost:5000/api/templates/${templateId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        couleurPrimaire,
        couleurSecondaire
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update template');
  }

  return response.json();
}

// Usage
await updateTemplateColors(1, '#1E40AF', '#FBBF24');
```

---

## Exemples Python

### Upload avec Requests

```python
import requests

def upload_template(file_path, nom, type, token):
    url = 'http://localhost:5000/api/templates/upload'
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    files = {
        'template': open(file_path, 'rb')
    }
    
    data = {
        'nom': nom,
        'type': type
    }
    
    response = requests.post(url, headers=headers, files=files, data=data)
    response.raise_for_status()
    
    return response.json()

# Usage
result = upload_template(
    'facture.pdf',
    'Facture SING',
    'FACTURE',
    'your_token_here'
)
print('Template uploadé:', result['template'])
```

### Générer un PDF

```python
def generate_pdf(type, document_id, token, output_path):
    url = f'http://localhost:5000/api/pdf/generate/{type}/{document_id}'
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.post(url, headers=headers)
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        f.write(response.content)
    
    print(f'PDF sauvegardé: {output_path}')

# Usage
generate_pdf('DEVIS', 1, 'your_token_here', 'devis-1.pdf')
```

---

## Tests avec Postman

### Collection Postman

Créez une collection avec ces requêtes :

1. **Login**
   - Method: POST
   - URL: `{{baseUrl}}/auth/login`
   - Body: `{"email": "admin@sing.com", "password": "password"}`
   - Tests: `pm.environment.set("token", pm.response.json().token);`

2. **Upload Template**
   - Method: POST
   - URL: `{{baseUrl}}/templates/upload`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: form-data avec `template` (file), `nom`, `type`

3. **List Templates**
   - Method: GET
   - URL: `{{baseUrl}}/templates`
   - Headers: `Authorization: Bearer {{token}}`

4. **Generate PDF**
   - Method: POST
   - URL: `{{baseUrl}}/pdf/generate/DEVIS/1`
   - Headers: `Authorization: Bearer {{token}}`

### Variables d'Environnement

```json
{
  "baseUrl": "http://localhost:5000/api",
  "token": ""
}
```

---

## Codes de Statut HTTP

- `200` - Succès
- `400` - Requête invalide (paramètres manquants, type invalide, etc.)
- `401` - Non authentifié (token manquant ou invalide)
- `403` - Interdit (pas les permissions)
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## Limites

- Taille max des fichiers : **10 MB**
- Types de fichiers acceptés : **PDF uniquement**
- Rate limiting : Aucun (à implémenter si nécessaire)

---

**Documentation complète** : PDF_TEMPLATE_SYSTEM.md  
**Guide d'installation** : INSTALLATION_PDF_SYSTEM.md
