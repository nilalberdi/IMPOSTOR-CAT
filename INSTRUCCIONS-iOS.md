# Com instal·lar "El Impostor" a iOS

## Pas 1: Generar les icones
1. Obre el fitxer `create-icons.html` al navegador
2. Descarrega les dues icones (192x192 i 512x512)
3. Guarda-les a la mateixa carpeta que l'app

## Pas 2: Pujar l'app a un servidor
Per poder instal·lar-la a iOS, necessites que l'app estigui en un servidor HTTPS.

**Opcions ràpides i gratuïtes:**

### Opció A: GitHub Pages (Recomanat)
1. Crea un repositori a GitHub
2. Puja tots els fitxers
3. Activa GitHub Pages a Settings → Pages
4. La teva app estarà a: `https://usuari.github.io/nom-repo`

### Opció B: Netlify Drop
1. Ves a https://app.netlify.com/drop
2. Arrossega la carpeta amb tots els fitxers
3. Obtindràs una URL automàticament

### Opció C: Vercel
1. Instal·la Vercel CLI: `npm i -g vercel`
2. A la carpeta de l'app: `vercel`
3. Segueix les instruccions

## Pas 3: Instal·lar a iOS
1. Obre Safari a l'iPhone/iPad
2. Ves a la URL de la teva app
3. Toca el botó de **Compartir** (quadrat amb fletxa cap amunt)
4. Desplaça't cap avall i toca **"Afegir a l'inici"**
5. Toca **"Afegir"**

## Pas 4: Jugar!
- L'app ara apareix a la pantalla d'inici com qualsevol altra app
- Funciona offline després de la primera càrrega
- Pantalla completa sense la barra de Safari
- Experiència nativa d'iOS

## Proves en local (desenvolupament)
Si vols provar-la localment abans de pujar-la:

1. Instal·la un servidor local amb HTTPS:
   ```bash
   npx http-server -S -C cert.pem -K key.pem
   ```

2. O utilitza Python:
   ```bash
   python -m http.server 8000
   ```

3. Accedeix des del teu iPhone a: `http://IP-DEL-TEU-PC:8000`
   (Assegura't que l'iPhone i el PC estan a la mateixa xarxa WiFi)

## Característiques iOS implementades
✅ Meta tags específics per a iOS
✅ Icones per a la pantalla d'inici
✅ Barra d'estat translúcida
✅ Safe area per a iPhone amb notch
✅ Prevenir zoom accidental
✅ Gestos tàctils optimitzats
✅ Funciona offline (PWA)
✅ Pantalla completa
✅ Font del sistema iOS
✅ Animacions suaves amb GPU
