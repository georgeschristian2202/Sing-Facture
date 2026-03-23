import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { TemplateService } from './templateService';

const prisma = new PrismaClient();
const templateService = new TemplateService();

interface DocumentData {
  numero: string;
  date: string;
  client: {
    nom: string;
    adresse?: string;
    tel?: string;
    email?: string;
  };
  representant?: {
    nom: string;
    fonction?: string;
    tel?: string;
    email?: string;
  };
  objet?: string;
  lignes: Array<{
    numero: string;
    designation: string;
    details?: string[];
    prixUnitaire: number;
    quantite: number;
    total: number;
  }>;
  totaux: {
    soldeHT: number;
    remise: number;
    sousTotal: number;
    tps: number;
    css: number;
    netAPayer: number;
  };
  modalites?: string[];
  conditions?: string;
  rib?: string;
}

interface EntrepriseInfo {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siteWeb?: string;
  rccm?: string;
  capital?: string;
  logo?: string;
}

export class PdfGenerationService {
  /**
   * Génère un PDF pour un document (devis, facture, etc.)
   */
  async generateDocumentPdf(
    documentId: number,
    organisationId: number,
    type: 'DEVIS' | 'FACTURE' | 'COMMANDE' | 'LIVRAISON'
  ): Promise<Buffer> {
    try {
      // Récupérer les données du document
      const documentData = await this.getDocumentData(documentId, type);
      
      // Récupérer les infos de l'entreprise
      const entrepriseInfo = await this.getEntrepriseInfo(organisationId);
      
      // Récupérer le template par défaut
      const template = await templateService.getDefaultTemplate(organisationId, type);
      
      // Générer le HTML avec les styles du template
      const html = this.generateHtml(documentData, entrepriseInfo, template, type);
      
      // Convertir en PDF avec Puppeteer
      const pdfBuffer = await this.htmlToPdf(html);
      
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Récupère les données d'un document
   */
  private async getDocumentData(documentId: number, type: string): Promise<DocumentData> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        client: {
          include: {
            representants: {
              where: { principal: true },
              take: 1
            }
          }
        },
        lignes: {
          include: {
            produit: true
          }
        }
      }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    return {
      numero: document.numero,
      date: document.date.toLocaleDateString('fr-FR'),
      client: {
        nom: document.client.nom,
        adresse: document.client.adresse || '',
        tel: document.client.tel || '',
        email: document.client.email || ''
      },
      representant: document.client.representants[0] ? {
        nom: document.client.representants[0].nom,
        fonction: document.client.representants[0].fonction || '',
        tel: document.client.representants[0].tel || '',
        email: document.client.representants[0].email || ''
      } : undefined,
      lignes: document.lignes.map(ligne => ({
        numero: ligne.produit.code,
        designation: ligne.designation,
        prixUnitaire: Number(ligne.prixUnitaire),
        quantite: ligne.quantite,
        total: Number(ligne.totalHt)
      })),
      totaux: {
        soldeHT: Number(document.soldeHt),
        remise: Number(document.remise),
        sousTotal: Number(document.sousTotal),
        tps: Number(document.tps),
        css: Number(document.css),
        netAPayer: Number(document.netAPayer)
      },
      conditions: document.conditionsPaiement || undefined
    };
  }

  /**
   * Récupère les infos de l'entreprise
   */
  private async getEntrepriseInfo(organisationId: number): Promise<EntrepriseInfo> {
    const parametres = await prisma.parametres.findUnique({
      where: { organisationId },
      include: {
        organisation: true
      }
    });

    if (!parametres) {
      throw new Error('Organisation parameters not found');
    }

    return {
      nom: parametres.nomEntreprise,
      adresse: parametres.adresse,
      telephone: parametres.telephone,
      email: parametres.email,
      siteWeb: parametres.siteWeb,
      rccm: parametres.rccm,
      capital: parametres.capital,
      logo: parametres.organisation.logo || undefined
    };
  }

  /**
   * Génère le HTML du document avec les styles du template
   */
  private generateHtml(
    data: DocumentData,
    entreprise: EntrepriseInfo,
    template: any,
    type: string
  ): string {
    const couleurPrimaire = template?.couleurPrimaire || '#003366';
    const couleurSecondaire = template?.couleurSecondaire || '#FDB913';
    const couleurTexte = template?.couleurTexte || '#000000';
    const police = template?.police || 'Arial, sans-serif';

    const typeLabel = {
      DEVIS: 'DEVIS',
      FACTURE: 'FACTURE',
      COMMANDE: 'BON DE COMMANDE',
      LIVRAISON: 'BON DE LIVRAISON'
    }[type] || type;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${police};
      color: ${couleurTexte};
      padding: 40px;
      font-size: 11pt;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid ${couleurPrimaire};
    }
    
    .logo {
      max-width: 200px;
      max-height: 80px;
    }
    
    .entreprise-info {
      text-align: right;
      font-size: 10pt;
      line-height: 1.6;
    }
    
    .entreprise-nom {
      font-size: 16pt;
      font-weight: bold;
      color: ${couleurPrimaire};
      margin-bottom: 5px;
    }
    
    .document-title {
      text-align: center;
      font-size: 20pt;
      font-weight: bold;
      color: ${couleurPrimaire};
      margin: 30px 0;
      padding: 15px;
      background-color: ${couleurSecondaire}22;
      border-left: 5px solid ${couleurSecondaire};
    }
    
    .document-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    
    .info-block {
      flex: 1;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 5px;
      margin: 0 10px;
    }
    
    .info-block:first-child {
      margin-left: 0;
    }
    
    .info-block:last-child {
      margin-right: 0;
    }
    
    .info-block h3 {
      color: ${couleurPrimaire};
      font-size: 12pt;
      margin-bottom: 10px;
      border-bottom: 2px solid ${couleurSecondaire};
      padding-bottom: 5px;
    }
    
    .info-block p {
      margin: 5px 0;
      font-size: 10pt;
    }
    
    .objet {
      margin: 20px 0;
      padding: 15px;
      background-color: #f0f0f0;
      border-left: 4px solid ${couleurPrimaire};
    }
    
    .objet strong {
      color: ${couleurPrimaire};
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    thead {
      background-color: ${couleurPrimaire};
      color: white;
    }
    
    th {
      padding: 12px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 10pt;
    }
    
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #ddd;
      font-size: 10pt;
    }
    
    tbody tr:hover {
      background-color: #f5f5f5;
    }
    
    .ligne-details {
      font-size: 9pt;
      color: #666;
      padding-left: 20px;
      font-style: italic;
    }
    
    .text-right {
      text-align: right;
    }
    
    .totaux {
      margin-top: 30px;
      float: right;
      width: 400px;
    }
    
    .totaux table {
      margin: 0;
    }
    
    .totaux td {
      padding: 8px 15px;
    }
    
    .totaux .label {
      font-weight: bold;
      text-align: right;
    }
    
    .totaux .montant {
      text-align: right;
      font-weight: bold;
    }
    
    .totaux .total-final {
      background-color: ${couleurPrimaire};
      color: white;
      font-size: 12pt;
    }
    
    .modalites {
      clear: both;
      margin-top: 40px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }
    
    .modalites h3 {
      color: ${couleurPrimaire};
      margin-bottom: 10px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid ${couleurPrimaire};
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
    
    .signature-zone {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
    
    .signature-block {
      width: 45%;
      text-align: center;
    }
    
    .signature-line {
      margin-top: 60px;
      border-top: 1px solid #000;
      padding-top: 5px;
      font-size: 10pt;
    }
  </style>
</head>
<body>
  <!-- En-tête -->
  <div class="header">
    <div>
      ${entreprise.logo ? `<img src="${entreprise.logo}" class="logo" alt="Logo">` : ''}
    </div>
    <div class="entreprise-info">
      <div class="entreprise-nom">${entreprise.nom}</div>
      <div>${entreprise.adresse}</div>
      <div>Tél: ${entreprise.telephone}</div>
      <div>Email: ${entreprise.email}</div>
      ${entreprise.siteWeb ? `<div>Web: ${entreprise.siteWeb}</div>` : ''}
      ${entreprise.rccm ? `<div>RCCM: ${entreprise.rccm}</div>` : ''}
      ${entreprise.capital ? `<div>Capital: ${entreprise.capital}</div>` : ''}
    </div>
  </div>

  <!-- Titre du document -->
  <div class="document-title">
    ${typeLabel} N° ${data.numero}
  </div>

  <!-- Informations document -->
  <div class="document-info">
    <div class="info-block">
      <h3>CLIENT</h3>
      <p><strong>${data.client.nom}</strong></p>
      ${data.client.adresse ? `<p>${data.client.adresse}</p>` : ''}
      ${data.client.tel ? `<p>Tél: ${data.client.tel}</p>` : ''}
      ${data.client.email ? `<p>Email: ${data.client.email}</p>` : ''}
    </div>
    
    ${data.representant ? `
    <div class="info-block">
      <h3>REPRÉSENTANT</h3>
      <p><strong>${data.representant.nom}</strong></p>
      ${data.representant.fonction ? `<p>${data.representant.fonction}</p>` : ''}
      ${data.representant.tel ? `<p>Tél: ${data.representant.tel}</p>` : ''}
      ${data.representant.email ? `<p>Email: ${data.representant.email}</p>` : ''}
    </div>
    ` : ''}
    
    <div class="info-block">
      <h3>INFORMATIONS</h3>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>N°:</strong> ${data.numero}</p>
    </div>
  </div>

  ${data.objet ? `
  <div class="objet">
    <strong>Objet:</strong> ${data.objet}
  </div>
  ` : ''}

  <!-- Lignes du document -->
  <table>
    <thead>
      <tr>
        <th style="width: 10%">N°</th>
        <th style="width: 40%">DÉSIGNATION</th>
        <th style="width: 15%" class="text-right">P.U (FCFA)</th>
        <th style="width: 10%" class="text-right">QTÉ</th>
        <th style="width: 15%" class="text-right">TOTAL (FCFA)</th>
      </tr>
    </thead>
    <tbody>
      ${data.lignes.map(ligne => `
        <tr>
          <td>${ligne.numero}</td>
          <td>
            <strong>${ligne.designation}</strong>
            ${ligne.details ? ligne.details.map(d => `<div class="ligne-details">• ${d}</div>`).join('') : ''}
          </td>
          <td class="text-right">${this.formatNumber(ligne.prixUnitaire)}</td>
          <td class="text-right">${ligne.quantite}</td>
          <td class="text-right">${this.formatNumber(ligne.total)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- Totaux -->
  <div class="totaux">
    <table>
      <tr>
        <td class="label">Solde HT:</td>
        <td class="montant">${this.formatNumber(data.totaux.soldeHT)} FCFA</td>
      </tr>
      <tr>
        <td class="label">Remise:</td>
        <td class="montant">${this.formatNumber(data.totaux.remise)} FCFA</td>
      </tr>
      <tr>
        <td class="label">Sous-total:</td>
        <td class="montant">${this.formatNumber(data.totaux.sousTotal)} FCFA</td>
      </tr>
      <tr>
        <td class="label">TPS (9.5%):</td>
        <td class="montant">${this.formatNumber(data.totaux.tps)} FCFA</td>
      </tr>
      <tr>
        <td class="label">CSS (1%):</td>
        <td class="montant">${this.formatNumber(data.totaux.css)} FCFA</td>
      </tr>
      <tr class="total-final">
        <td class="label">NET À PAYER:</td>
        <td class="montant">${this.formatNumber(data.totaux.netAPayer)} FCFA</td>
      </tr>
    </table>
  </div>

  <!-- Modalités et conditions -->
  ${data.modalites || data.conditions || data.rib ? `
  <div class="modalites">
    ${data.modalites ? `
      <h3>Modalités de Paiement</h3>
      <p>${data.modalites.join(', ')}</p>
    ` : ''}
    
    ${data.conditions ? `
      <h3>Conditions de Paiement</h3>
      <p>${data.conditions}</p>
    ` : ''}
    
    ${data.rib ? `
      <h3>RIB</h3>
      <p>${data.rib}</p>
    ` : ''}
  </div>
  ` : ''}

  <!-- Zone de signature -->
  <div class="signature-zone">
    <div class="signature-block">
      <div><strong>Le Client</strong></div>
      <div class="signature-line">Signature et cachet</div>
    </div>
    <div class="signature-block">
      <div><strong>${entreprise.nom}</strong></div>
      <div class="signature-line">Signature et cachet</div>
    </div>
  </div>

  <!-- Pied de page -->
  <div class="footer">
    <p>${entreprise.nom} - ${entreprise.adresse}</p>
    <p>Tél: ${entreprise.telephone} - Email: ${entreprise.email}</p>
    ${entreprise.siteWeb ? `<p>${entreprise.siteWeb}</p>` : ''}
  </div>
</body>
</html>
    `;
  }

  /**
   * Convertit le HTML en PDF avec Puppeteer
   */
  private async htmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  /**
   * Formate un nombre avec séparateurs de milliers
   */
  private formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  }
}
