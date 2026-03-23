import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// Dossier de stockage des PDFs générés
const OUTPUT_DIR = path.join(process.cwd(), 'uploads', 'documents');

async function ensureOutputDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('Erreur création dossier output:', error);
  }
}

/**
 * Générer le HTML d'un document basé sur un template
 */
function generateDocumentHTML(
  template: any,
  documentData: any,
  parametres: any
): string {
  const {
    couleurPrimaire = '#003366',
    couleurSecondaire = '#FFD700',
    couleurTexte = '#333333',
    police = 'Arial, sans-serif',
    marges = { top: 50, right: 50, bottom: 50, left: 50 }
  } = template;

  const {
    numero,
    date,
    client,
    representant,
    objet,
    lignes = [],
    totaux,
    modalites = [],
    conditionsPaiement,
    rib
  } = documentData;

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
      padding: ${marges.top}px ${marges.right}px ${marges.bottom}px ${marges.left}px;
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
      font-size: 24pt;
      font-weight: bold;
      color: ${couleurPrimaire};
    }
    
    .company-info {
      text-align: right;
      font-size: 9pt;
      line-height: 1.4;
    }
    
    .document-title {
      text-align: center;
      font-size: 20pt;
      font-weight: bold;
      color: ${couleurPrimaire};
      margin: 20px 0;
      text-transform: upperca