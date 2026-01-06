# 🚀 Scripts d'Automatisation Hannibal V2

Scripts utilitaires pour automatiser la gestion des domaines et du déploiement.

---

## 📋 Scripts Disponibles

### **1. sync-domains-to-render.ts**

Synchronise automatiquement tous les domaines depuis votre database Neon vers Render.

**Usage :**
```bash
# Simulation (dry-run)
pnpm tsx scripts/sync-domains-to-render.ts --dry-run

# Ajouter les domaines réellement
pnpm tsx scripts/sync-domains-to-render.ts

# Forcer l'ajout même si déjà présent
pnpm tsx scripts/sync-domains-to-render.ts --force
```

**Ce que fait le script :**
1. ✅ Récupère tous les domaines `custom_domain` depuis la table `sites`
2. ✅ Récupère les domaines déjà configurés dans Render
3. ✅ Ajoute automatiquement les domaines manquants
4. ✅ Affiche un résumé détaillé

### **2. get-render-service-id.ts**

Helper pour récupérer l'ID de votre service Render.

**Usage :**
```bash
pnpm tsx scripts/get-render-service-id.ts
```

**Résultat :**
- Liste tous vos services Render
- Affiche les IDs (nécessaires pour les autres scripts)

---

## ⚙️ Configuration Requise

### **Variables d'Environnement**

Ajoutez ces variables dans votre `.env` :

```bash
# Database Neon (déjà configuré)
DATABASE_URL="postgresql://..."

# API Render
RENDER_API_KEY="rnd_hr4C9zvPWajoFFOZx0PgRd10ul7C"

# ID du service (récupéré via get-render-service-id.ts)
RENDER_SERVICE_ID="srv-xxxxxxxxxxxxx"
```

### **Comment obtenir RENDER_SERVICE_ID ?**

```bash
# 1. Exécuter le script helper
pnpm tsx scripts/get-render-service-id.ts

# 2. Copier l'ID du service "hannibalv2"
# Exemple: srv-ctabcd1234567890

# 3. Ajouter dans .env
echo 'RENDER_SERVICE_ID=srv-ctabcd1234567890' >> .env
```

---

## 🎯 Workflow Complet

### **Étape 1 : Configuration Initiale**

```bash
# 1. Récupérer l'ID du service
pnpm tsx scripts/get-render-service-id.ts

# 2. Ajouter RENDER_SERVICE_ID dans .env
echo 'RENDER_SERVICE_ID=srv-xxxxx' >> .env
```

### **Étape 2 : Test (Dry-Run)**

```bash
# Voir ce qui sera ajouté sans rien faire
pnpm tsx scripts/sync-domains-to-render.ts --dry-run
```

**Output attendu :**
```
🚀 Synchronisation des domaines vers Render
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Récupération des domaines depuis Neon Database...

✅ 3 domaine(s) trouvé(s) dans la database:

   1. italia-24.com (Italia 24)
   2. frenchpulse.fr (French Pulse)
   3. newsworld.io (News World)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Récupération des domaines existants dans Render...

✅ 1 domaine(s) déjà dans Render:

   1. admin.hannibal.com ✓ Vérifié

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 2 domaine(s) à ajouter:

🔍 Mode DRY-RUN (simulation uniquement)

   1. italia-24.com
   2. frenchpulse.fr

💡 Exécutez sans --dry-run pour ajouter les domaines
```

### **Étape 3 : Exécution Réelle**

```bash
# Ajouter tous les domaines
pnpm tsx scripts/sync-domains-to-render.ts
```

**Output attendu :**
```
📌 Ajout de italia-24.com...
   ✅ Domaine ajouté avec succès !

📌 Ajout de frenchpulse.fr...
   ✅ Domaine ajouté avec succès !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RÉSUMÉ

   Total domaines database  : 3
   Déjà dans Render         : 1
   Ajoutés avec succès      : 2
   Erreurs                  : 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Synchronisation terminée !

📝 Prochaines étapes:
   1. Aller dans Render Dashboard → Custom Domains
   2. Cliquer 'Verify' pour chaque domaine
   3. Configurer le DNS chez Cloudflare si pas déjà fait
```

### **Étape 4 : Vérification dans Render**

Après exécution du script :

1. Aller sur https://dashboard.render.com
2. Votre service → Settings → Custom Domains
3. Tous vos domaines devraient apparaître !
4. Cliquer "Verify" pour chacun (après config DNS)

---

## 🔧 Troubleshooting

### **Erreur : "RENDER_SERVICE_ID non défini"**

```bash
# Solution
pnpm tsx scripts/get-render-service-id.ts
# Puis ajouter l'ID dans .env
```

### **Erreur : "Database connection failed"**

```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
pnpm tsx -e "import {neon} from '@neondatabase/serverless'; const sql=neon(process.env.DATABASE_URL); sql\`SELECT 1\`.then(() => console.log('✅ Connected'))"
```

### **Erreur : "Render API Error 401"**

```bash
# Vérifier RENDER_API_KEY
echo $RENDER_API_KEY

# Regénérer la clé si nécessaire sur Render Dashboard
```

---

## 📚 Ressources

- [Render API Docs](https://api-docs.render.com/)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Documentation Hannibal](../MIGRATION_RENDER.md)

---

## 🎉 Avantages de l'Automatisation

✅ **Gain de temps** : Plus besoin d'ajouter manuellement chaque domaine  
✅ **Pas d'oubli** : Tous les domaines de la database sont synchronisés  
✅ **Idempotent** : Peut être réexécuté sans problème  
✅ **Safe** : Mode dry-run pour tester avant  
✅ **Logs détaillés** : Suivi complet de chaque action  

---

**Besoin d'aide ?** Consultez le guide de migration : [MIGRATION_RENDER.md](../MIGRATION_RENDER.md)

