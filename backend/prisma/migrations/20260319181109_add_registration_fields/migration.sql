-- CreateEnum
CREATE TYPE "plan" AS ENUM ('STARTER', 'PRO', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "type_document" AS ENUM ('DEVIS', 'COMMANDE', 'LIVRAISON', 'FACTURE', 'AVOIR');

-- CreateEnum
CREATE TYPE "statut_document" AS ENUM ('ACTIVE', 'PAYEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "organisations" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'Gabon',
    "rccm" TEXT,
    "num_statistique" TEXT,
    "num_impot" TEXT,
    "capital" TEXT,
    "forme_juridique" TEXT,
    "secteur_activite" TEXT,
    "site_web" TEXT,
    "logo" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "date_expiration" TIMESTAMP(3),
    "plan" "plan" NOT NULL DEFAULT 'STARTER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "role" NOT NULL DEFAULT 'ADMIN',
    "organisation_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "tel" TEXT,
    "email" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'Gabon',
    "organisation_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representants" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "fonction" TEXT,
    "tel" TEXT,
    "email" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "representants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produits" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "prix" DECIMAL(15,2) NOT NULL,
    "categorie" TEXT NOT NULL,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "organisation_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "type" "type_document" NOT NULL,
    "numero" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "organisation_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "reference" TEXT,
    "solde_ht" DECIMAL(15,2) NOT NULL,
    "remise" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "sous_total" DECIMAL(15,2) NOT NULL,
    "tps" DECIMAL(15,2) NOT NULL,
    "css" DECIMAL(15,2) NOT NULL,
    "net_a_payer" DECIMAL(15,2) NOT NULL,
    "solde_du" DECIMAL(15,2) NOT NULL,
    "statut" "statut_document" NOT NULL DEFAULT 'ACTIVE',
    "conditions_paiement" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_document" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "produit_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(15,2) NOT NULL,
    "total_ht" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "lignes_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametres" (
    "id" SERIAL NOT NULL,
    "organisation_id" INTEGER NOT NULL,
    "nom_entreprise" TEXT NOT NULL DEFAULT 'Mon Entreprise',
    "adresse" TEXT NOT NULL DEFAULT '',
    "telephone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "site_web" TEXT NOT NULL DEFAULT '',
    "rccm" TEXT NOT NULL DEFAULT '',
    "capital" TEXT NOT NULL DEFAULT '',
    "taux_tps" DECIMAL(5,4) NOT NULL DEFAULT 0.095,
    "taux_css" DECIMAL(5,4) NOT NULL DEFAULT 0.01,
    "taux_tva" DECIMAL(5,4) NOT NULL DEFAULT 0.18,
    "taux_remise" DECIMAL(5,4) NOT NULL DEFAULT 0.095,
    "rib_uba" TEXT NOT NULL DEFAULT '',
    "rib_afg" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "parametres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packs" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "desc_courte" TEXT NOT NULL,
    "prix_unitaire" DECIMAL(15,2) NOT NULL,
    "sous_service" TEXT NOT NULL,
    "organisation_id" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pack_details" (
    "id" SERIAL NOT NULL,
    "pack_id" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "description_longue" TEXT NOT NULL,

    CONSTRAINT "pack_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recapitulatif" (
    "id" SERIAL NOT NULL,
    "organisation_id" INTEGER NOT NULL,
    "document_id" INTEGER,
    "date_facture" DATE NOT NULL,
    "designation" TEXT NOT NULL,
    "numero_facture" TEXT NOT NULL,
    "numero_bc" TEXT,
    "montant_services" JSONB NOT NULL,
    "solde_ht" DECIMAL(15,2) NOT NULL,
    "remise" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "sous_total_2" DECIMAL(15,2) NOT NULL,
    "tps" DECIMAL(15,2) NOT NULL,
    "css" DECIMAL(15,2) NOT NULL,
    "net_a_payer" DECIMAL(15,2) NOT NULL,
    "reglement" DECIMAL(15,2),
    "solde_du" DECIMAL(15,2),
    "date_reglement" DATE,
    "etat" "statut_document" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recapitulatif_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organisations_email_key" ON "organisations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organisation_id_idx" ON "users"("organisation_id");

-- CreateIndex
CREATE INDEX "clients_organisation_id_idx" ON "clients"("organisation_id");

-- CreateIndex
CREATE INDEX "representants_client_id_idx" ON "representants"("client_id");

-- CreateIndex
CREATE INDEX "produits_organisation_id_idx" ON "produits"("organisation_id");

-- CreateIndex
CREATE INDEX "produits_categorie_idx" ON "produits"("categorie");

-- CreateIndex
CREATE UNIQUE INDEX "produits_code_organisation_id_key" ON "produits"("code", "organisation_id");

-- CreateIndex
CREATE INDEX "documents_client_id_idx" ON "documents"("client_id");

-- CreateIndex
CREATE INDEX "documents_organisation_id_idx" ON "documents"("organisation_id");

-- CreateIndex
CREATE INDEX "documents_date_idx" ON "documents"("date");

-- CreateIndex
CREATE INDEX "documents_type_idx" ON "documents"("type");

-- CreateIndex
CREATE UNIQUE INDEX "documents_numero_organisation_id_key" ON "documents"("numero", "organisation_id");

-- CreateIndex
CREATE INDEX "lignes_document_document_id_idx" ON "lignes_document"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "parametres_organisation_id_key" ON "parametres"("organisation_id");

-- CreateIndex
CREATE INDEX "packs_organisation_id_idx" ON "packs"("organisation_id");

-- CreateIndex
CREATE INDEX "packs_sous_service_idx" ON "packs"("sous_service");

-- CreateIndex
CREATE UNIQUE INDEX "packs_code_organisation_id_key" ON "packs"("code", "organisation_id");

-- CreateIndex
CREATE INDEX "pack_details_pack_id_idx" ON "pack_details"("pack_id");

-- CreateIndex
CREATE INDEX "recapitulatif_organisation_id_idx" ON "recapitulatif"("organisation_id");

-- CreateIndex
CREATE INDEX "recapitulatif_date_facture_idx" ON "recapitulatif"("date_facture");

-- CreateIndex
CREATE INDEX "recapitulatif_numero_facture_idx" ON "recapitulatif"("numero_facture");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "representants" ADD CONSTRAINT "representants_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produits" ADD CONSTRAINT "produits_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_document" ADD CONSTRAINT "lignes_document_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_document" ADD CONSTRAINT "lignes_document_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametres" ADD CONSTRAINT "parametres_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pack_details" ADD CONSTRAINT "pack_details_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "packs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
