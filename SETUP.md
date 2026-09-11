# Guía para personalizarlo 💕

Todo lo que tienes que cambiar está en **dos archivos**. No necesitas tocar
nada más.

| Qué quieres cambiar | Archivo |
| --- | --- |
| Las 9 claves y sus pistas | `src/data/claves.js` |
| Todos los textos, fotos y audios | `src/data/minijuegos.js` |

Dentro de `minijuegos.js`, busca la palabra **`EDITA`** (Ctrl+F). Cada sitio
donde aparece es un texto de ejemplo esperando que lo cambies por lo tuyo.

---

## 1. Cambiar una clave

Abre `src/data/claves.js`:

```js
{ id: 3, clave: '18ENERO', pista: 'El día que dejamos de ser solo amigos (día + mes, sin espacios)' },
```

Cambia `clave` por lo que quieras y `pista` por la ayuda que verá si se atasca.

**Reglas de las claves:**

- No importan mayúsculas ni minúsculas: `18ENERO` = `18enero` = `18Enero`.
- Los espacios sobran: `TE AMO` y `TEAMO` valen lo mismo.
- Los acentos también se ignoran, pero **mejor no los uses** — escribir tildes
  en el teclado del celular es incómodo. Evita la `ñ` por lo mismo.
- Escríbelas en la carta **exactamente** como las pusiste aquí, en mayúsculas.

Las 9 claves que vienen puestas:

| Sobre | Minijuego | Clave |
| --- | --- | --- |
| 1 | Canciones 🎵 | `AZUL` |
| 2 | Promesas ✨ | `SIEMPRE` |
| 3 | Pasado 📸 | `18ENERO` |
| 4 | Presente ❤️ | `TEAMO` |
| 5 | Futuro 🌟 | `JUNTOS` |
| 6 | Noche Especial 🌙 | `ESTA_NOCHE` |
| 7 | 9 Razones 💕 | `TIAMO9` |
| 8 | Momentos 😄 | `RECUERDOS` |
| 9 | Confesiones 🤐 | `SECRETOS` |

> **Los nueve piden clave, incluido el #1.** Al escanear el QR, Laura llega al
> grid con los nueve sobres cerrados y un botón que le dice por dónde empezar.
> La carta del sobre #1 tiene que traer escrita su clave (`AZUL`) igual que
> las demás.
>
> Si algún día prefieres que el primero esté abierto de entrada, abre
> `src/utils/storage.js` y cambia `desbloqueados: []` por `desbloqueados: [1]`.

---

## 2. Cambiar los textos

Todo vive en `src/data/minijuegos.js`, ordenado por minijuego. Por ejemplo:

```js
const confesiones = [
  { numero: 1, emoji: '💭', titulo: 'Confesión #1', texto: 'EDITA: la primera vez que te vi...' },
  ...
]
```

Cambia solo lo que está entre comillas. **No borres las comas ni las llaves.**

Si un texto lleva un apóstrofo, escápalo o usa comillas dobles:

```js
texto: "El día que dijiste 'te amo' primero"   // ✅ bien
texto: 'El día que dijiste 'te amo' primero'   // ❌ rompe el archivo
```

### Puedes poner más o menos elementos

Las listas se adaptan solas. Si quieres 4 canciones en vez de 3, copia un
bloque `{ ... }` entero, pégalo debajo y cámbialo. Lo mismo con los momentos de
la línea de tiempo, las sorpresas, las confesiones, etc.

**Las dos excepciones:**

- **9 Razones** necesita exactamente **9** razones, con `posicion` del 0 al 8
  (es un tablero 3×3, si faltan piezas no se puede completar).
- **Promesas** funciona mejor con 4 promesas (8 tarjetas). Con más, el tablero
  de memoria se hace largo en el celular.

### Sopa de letras

```js
const palabrasSopa = ['HERMOSA', 'DULCE', 'LINDA', ...]
```

Reglas: **mayúsculas, sin acentos, sin ñ, sin espacios y máximo 8 letras.**
El tablero se genera solo a partir de las palabras que pongas — si alguna no
cabe en 8×8, el tablero crece automáticamente. No tienes que dibujar nada.

---

## 3. Poner las fotos y los audios

- **Fotos** → carpeta `public/fotos/`. La lista completa de nombres está en
  `public/fotos/LEEME.txt`.
- **Audios** → carpeta `public/audio/`. Instrucciones en
  `public/audio/LEEME.txt`.

Mientras una foto no exista, sale un cuadro con gradiente que dice qué archivo
falta. Así puedes probar la app desde ya e ir poniendo las fotos de a poco.

**Baja el peso de las fotos antes de subirlas** (máximo 1200px de ancho). Laura
va a abrir esto con datos móviles: una foto de 4 MB tarda una eternidad, la
misma a 1200px pesa 200 KB y se ve igual.

---

## 4. Probarlo en tu computador

```bash
npm install
npm run dev
```

Abre lo que te diga la terminal (algo como
`http://localhost:5173/laura-rompecabezas/`).

**Atajos para probar** — abre la consola del navegador (F12) y escribe:

```js
__laura.getState().reiniciarTodo()                       // borrar el progreso
__laura.setState({ desbloqueados: [1,2,3,4,5,6,7,8,9] }) // abrirlo todo de una
```

(Solo funcionan en `npm run dev`, no en la versión publicada.)

---

## 5. Publicar los cambios

Cada vez que cambies algo:

```bash
git add .
git commit -m "Textos de Laura"
git push
```

GitHub reconstruye y publica solo, en 1-2 minutos. La URL nunca cambia, así que
**el QR que imprimas sigue sirviendo** aunque edites los textos después.

Puedes ver cómo va el despliegue en la pestaña **Actions** de tu repositorio.

---

## 6. El QR

Cuando tengas la URL final, genera el QR en cualquiera de estos:

- <https://www.qr-code-generator.com>
- <https://qr.io>

**Antes de imprimir:**

1. Escanéalo tú con tu propio celular y navega un rato.
2. Imprímelo de **3 cm de lado como mínimo**. Más pequeño, algunas cámaras
   fallan.
3. Nada de fondos oscuros ni papel brillante: el reflejo arruina el escaneo.

---

## Cosas que conviene saber

**El progreso se guarda en el navegador de Laura**, no en un servidor. Si abre
el link en su celular y sigue en el mismo celular con el mismo navegador, todo
sigue ahí. Si cambia de teléfono, o abre el link en modo incógnito, empieza de
cero. Para este regalo está bien — pero avísale de que lo abra siempre desde el
mismo sitio.

**Cualquiera con el link puede verlo.** No hay contraseña de entrada: las
claves solo abren minijuegos, no protegen la página. Nadie va a encontrar la
URL por casualidad, pero no publiques el link en redes.

**Las claves están en el código.** Alguien que sepa mirar el código fuente
podría verlas. Para un regalo no importa: Laura las va a sacar de las cartas.
