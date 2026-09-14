# Rompecabezas para Laura 🧩💕

**Publicado en:** <https://carlosh14.github.io/laura-rompecabezas/>

Un regalo en dos mitades: nueve sobres de papel y una página web.

Cada sobre trae una carta, una pieza física de rompecabezas y una clave. La
clave abre uno de los nueve minijuegos de esta página. Se juega sin prisa,
sobre físico a sobre físico, hasta llegar a la pantalla final.

---

## Los nueve minijuegos

| # | Nombre | Qué es |
| --- | --- | --- |
| 1 | Canciones 🎵 | Suena un fragmento, hay que adivinar la canción. Al acertar aparece la historia detrás |
| 2 | Promesas ✨ | Memoria: cada promesa está partida en dos tarjetas |
| 3 | Pasado 📸 | Carrusel con los momentos de la relación |
| 4 | Presente ❤️ | Sopa de letras con sus cualidades |
| 5 | Futuro 🌟 | Un paisaje nocturno; cada cosita esconde un sueño |
| 6 | Noche Especial 🌙 | Cinco botones-sorpresa para esa noche |
| 7 | 9 Razones 💕 | Una foto partida en 9 y revuelta; se intercambian piezas y cada una que encaja revela una razón |
| 8 | Momentos 😄 | Fotos borrosas: adivinar con el menor desenfoque posible da más puntos |
| 9 | El poema 📜 | Un poema en tres partes al que le faltan nueve palabras: una por sobre |

Al completar los nueve, se abre la pantalla final con el collage y el mensaje.

---

## Cómo personalizarlo

👉 **Todo está explicado en [SETUP.md](SETUP.md)** — qué archivo tocar para
cambiar las claves, los textos, las fotos y los audios.

Resumen de 10 segundos:

- Claves → `src/data/claves.js`
- Textos, fotos y audios → `src/data/minijuegos.js` (busca `EDITA`)
- Fotos → `public/fotos/` · Audios → `public/audio/`

---

## Arrancarlo en local

```bash
npm install
npm run dev
```

Otros comandos:

```bash
npm run build     # compila a dist/
npm run preview   # ver el build compilado antes de publicar
```

---

## Cómo está hecho

| | |
| --- | --- |
| Interfaz | React 18 |
| Build | Vite |
| Estado | Zustand |
| Animaciones | Framer Motion |
| Estilos | Tailwind CSS v4 |
| Confetti | canvas-confetti |
| Guardado | `localStorage` (sin servidor, sin cuentas) |
| Publicado en | GitHub Pages, vía GitHub Actions |

### Decisiones que igual te preguntas

**Sin router.** Solo hay tres vistas (grid, minijuego, final) y las controla el
estado de Zustand. Así el QR siempre apunta a la misma URL y no hay rutas que
se rompan en GitHub Pages.

**Sin backend.** El progreso vive en el `localStorage` del navegador de Laura.
Ventaja: no hay nada que mantener, nada que caducar, nada que pagar. Precio: si
cambia de teléfono, empieza de cero.

**La sopa de letras se genera sola.** No hay tablero escrito a mano: un
generador con semilla fija coloca las palabras que pongas y rellena el resto.
Cambias las palabras y el tablero se rehace solo, siempre igual entre recargas.

**El rompecabezas del #7 es la foto misma.** No hay números ni huecos: los
nueve pedazos de la foto empiezan revueltos (ninguno en su sitio) y se
intercambian de dos en dos, tocando uno y luego otro, o arrastrando uno encima
de otro. El arrastre lo hace Framer Motion, que sí funciona en móvil. Cada
pedazo que cae en su sitio se queda fijo y destapa su razón; hay tres pistas de
dos segundos y medio para ver la foto entera. La sopa de letras acepta tocar y
arrastrar.

**Todo aguanta que falten archivos.** Si una foto o un audio no existe todavía,
sale un placeholder que dice qué archivo falta en vez de un icono roto.

---

## Estructura

```
src/
├── components/
│   ├── Navbar.jsx           barra fija con el progreso
│   ├── Home.jsx             el grid 3×3
│   ├── JuegoCard.jsx        cada casilla del grid
│   ├── DesbloqueoModal.jsx  donde escribe la clave
│   ├── JuegoContainer.jsx   envoltura común de los 9 minijuegos
│   ├── Final.jsx            pantalla final
│   ├── Foto.jsx             imagen con placeholder si falta el archivo
│   └── minijuegos/          un archivo por minijuego
├── data/
│   ├── claves.js            ← las 9 claves
│   └── minijuegos.js        ← TODO el contenido
├── hooks/useGameStore.js    estado global (Zustand)
└── utils/
    ├── storage.js           guardar y leer el progreso
    ├── efectos.js           confetti, sonidos, rutas de archivos
    └── sopa.js              generador de la sopa de letras
```

---

Hecho a mano, para Laura 💕
