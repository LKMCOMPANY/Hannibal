# Scripts d'Automatisation Hannibal

Scripts utilitaires pour automatiser la gestion des domaines, DNS et QStash.

---

## Scripts Disponibles

### **1. sync-dns-cloudflare.ts**

Synchronise les CNAME records dans Cloudflare pour tous les custom domains de la database, pointant vers Vercel (`cname.vercel-dns.com`).

```bash
# Simulation (dry-run)
pnpm tsx scripts/sync-dns-cloudflare.ts --dry-run

# Appliquer réellement
pnpm tsx scripts/sync-dns-cloudflare.ts

# Forcer la mise à jour même si déjà configuré
pnpm tsx scripts/sync-dns-cloudflare.ts --force
```

### **2. setup-autonomous-schedule.mjs**

Crée le schedule QStash horaire pour les publications autonomes (REST API).

```bash
QSTASH_TOKEN=xxx NEXT_PUBLIC_APP_URL=https://hannibal.media node scripts/setup-autonomous-schedule.mjs
```

### **3. create-qstash-schedule-sdk.mjs**

Même chose que le précédent mais via le SDK QStash.

```bash
QSTASH_TOKEN=xxx NEXT_PUBLIC_APP_URL=https://hannibal.media node scripts/create-qstash-schedule-sdk.mjs
```

### **4. setup-qstash-schedule.mjs**

Variante simplifiée pour setup QStash.

```bash
QSTASH_TOKEN=xxx NEXT_PUBLIC_APP_URL=https://hannibal.media node scripts/setup-qstash-schedule.mjs
```

---

## Configuration Requise

### **Variables d'Environnement**

```bash
# Database Neon
DATABASE_URL="postgresql://..."

# Cloudflare (pour sync-dns)
CLOUDFLARE_API_TOKEN="xxx"

# Optionnel : override du CNAME target (default: cname.vercel-dns.com)
CNAME_TARGET="cname.vercel-dns.com"

# QStash (pour les scripts de schedule)
QSTASH_TOKEN="xxx"

# URL de l'app (pour les scripts de schedule)
NEXT_PUBLIC_APP_URL="https://hannibal.media"
```

---

## Workflow Typique

### Ajouter un nouveau custom domain

1. Ajouter le domaine dans la DB (via dashboard)
2. Ajouter le domaine dans Vercel (Settings → Domains)
3. Lancer le script DNS :

```bash
pnpm tsx scripts/sync-dns-cloudflare.ts
```

4. Vérifier la propagation DNS : https://dnschecker.org

---

## Troubleshooting

### Erreur : "Database connection failed"

```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
pnpm tsx -e "import {neon} from '@neondatabase/serverless'; const sql=neon(process.env.DATABASE_URL); sql\`SELECT 1\`.then(() => console.log('OK'))"
```

### Le schedule QStash ne fonctionne pas

1. Vérifier dans https://console.upstash.com/qstash que le schedule existe
2. Vérifier que `NEXT_PUBLIC_APP_URL` pointe vers la bonne URL Vercel
3. Tester l'endpoint manuellement : `curl https://hannibal.media/api/cron/autonomous-scheduler`
