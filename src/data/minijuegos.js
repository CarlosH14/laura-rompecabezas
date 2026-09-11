/**
 * ════════════════════════════════════════════════════════════
 *  TODO EL CONTENIDO DEL REGALO VIVE EN ESTE ARCHIVO
 * ════════════════════════════════════════════════════════════
 *  Los textos ya están escritos con las cosas de Carlos y Laura.
 *  Si algo no suena a ti, cámbialo: es texto normal entre comillas.
 *  Lo que todavía queda por decidir está marcado con "EDITA".
 *
 *  FOTOS   ->  ponlas en  public/fotos/            y referencia 'fotos/nombre.jpg'
 *  AUDIOS  ->  ponlos en  public/audio/canciones/  y referencia 'audio/canciones/x.mp3'
 *
 *  Si una foto todavía no existe, la app muestra un placeholder bonito
 *  con gradiente en vez de un icono roto. No se rompe nada.
 * ════════════════════════════════════════════════════════════
 */

/**
 * La noche especial.
 *
 * Ojo con esto: Laura abre un sobre por día, así que va a abrir el minijuego
 * #6 VARIOS DÍAS ANTES de la noche en cuestión. Por eso los textos hablan de
 * "el 19" y no de "esta noche" — si dijeran "esta noche" estarían mintiendo.
 *
 * EDITA: si cambia la fecha, cámbiala aquí y se actualiza en toda la app.
 */
export const NOCHE_ESPECIAL = 'el 19 de septiembre'

// ─── #1 CANCIONES ────────────────────────────────────────────
// `correcta` es la posición de la respuesta buena dentro de `opciones`
// (0 = la primera). Las opciones falsas son canciones reales de los mismos
// artistas, para que no se adivine por descarte.
const canciones = [
  {
    titulo: 'A dónde vamos',
    artista: 'Morat',
    opciones: ['A dónde vamos', 'Cómo te atreves', 'No se va'],
    correcta: 0,
    audio: 'audio/canciones/cancion-1.mp3',
    foto: 'fotos/cancion-1.jpg',
    historia:
      'Salíamos de clase de inglés y yo siempre te preguntaba lo mismo: ¿a dónde vamos? La verdad es que casi nunca importaba la respuesta. Lo bueno de la pregunta era el "vamos".',
  },
  {
    titulo: 'Jóvenes eternamente',
    artista: 'Pol 3.14',
    opciones: ['Jóvenes eternamente', 'Un amor para la historia', 'A dónde vamos'],
    correcta: 0,
    audio: 'audio/canciones/cancion-2.mp3',
    foto: 'fotos/cancion-2.jpg',
    historia:
      'Esta no la escogí yo: me la dedicaste tú, en una carta. Así que ya no es una canción de Pol 3.14, es tuya y punto. Cada vez que suena me acuerdo de tu letra, no de la de él.',
  },
  {
    titulo: 'Te quiero',
    artista: 'Ricardo Arjona',
    opciones: ['Te quiero', 'Fuiste tú', 'El problema'],
    correcta: 0,
    audio: 'audio/canciones/cancion-3.mp3',
    foto: 'fotos/cancion-3.jpg',
    historia:
      'Sonó en la radio y no lo pensé dos veces: te la mandé por WhatsApp ahí mismo. A veces mandar una canción es más fácil que decir la frase, y yo ese día tomé el camino fácil.',
  },
  {
    titulo: 'Azul',
    artista: 'Cristian Castro',
    opciones: ['Azul', 'Por amarte así', 'Lloviendo estrellas'],
    correcta: 0,
    audio: 'audio/canciones/cancion-4.mp3',
    foto: 'fotos/cancion-4.jpg',
    historia:
      'Esta es LA nuestra y tú lo sabes. Te gusta el azul, y un día hablando de lo que viene le pusimos nombre a alguien que todavía no existe: Azul. Así que esta canción ya no habla solo de nosotros dos.',
  },
  {
    titulo: 'Un amor para la historia',
    artista: 'Gilberto Santa Rosa',
    opciones: ['Un amor para la historia', 'Conciencia', 'Vivir sin ella'],
    correcta: 0,
    audio: 'audio/canciones/cancion-5.mp3',
    foto: 'fotos/cancion-5.jpg',
    historia:
      'Esta la puse porque me gusta y porque cada vez que la oigo pienso en nosotros. Con el título ya está dicho casi todo: es exactamente lo que quiero que seamos.',
  },
]

// ─── #2 PROMESAS ─────────────────────────────────────────────
// Cada promesa se parte en dos tarjetas: el texto y su emoji. Por eso los
// emojis tienen que ser bien distintos entre sí, para que se puedan emparejar.
const promesas = [
  { emoji: '🥇', promesa: 'Tratarte como mi prioridad en cada ocasión' },
  { emoji: '🧭', promesa: 'Liderar la relación y los planes que vienen' },
  { emoji: '💕', promesa: 'Amarte como tú quieres y tratarte con cariño siempre' },
  { emoji: '⏳', promesa: 'Ser paciente y nunca perder mis cosas buenas' },
]

// ─── #3 TIMELINE ─────────────────────────────────────────────
// Van en orden cronológico: así se lee como un camino y no como una lista.
const momentos = [
  {
    fecha: 'Hace tres años',
    titulo: 'El día que volvimos a aparecer',
    descripcion:
      'Nos conocíamos de la universidad, pero el covid nos mandó cada uno por su lado y pasaron años. Un día volvimos a hablar y quedamos en ir a clases de baile. Nos vimos en la entrada del sitio: yo llegué tarde, cómo no, y tú bajaste por mí. Visto desde aquí, todo empezó ahí.',
    foto: 'fotos/timeline-1.jpg',
  },
  {
    fecha: 'San Valentín del año pasado',
    titulo: 'Las flores que mandé sin saber nada',
    descripcion:
      'Todavía no éramos nada y yo no tenía ni idea de cómo las ibas a tomar. Te las mandé igual. De todas las cosas que he hecho por no quedarme con las ganas, esa es de lejos la que mejor me salió.',
    foto: 'fotos/timeline-2.jpg',
  },
  {
    fecha: '18 de enero',
    titulo: 'El día que dejamos de ser solo amigos',
    descripcion:
      'Hacía un calor insoportable y comimos por primera vez en Art Burguer. Ninguno de los dos sabía que ese sitio se nos iba a quedar de por vida — y mírate ahora, defendiéndolo como si lo hubiéramos inventado nosotros.',
    foto: 'fotos/timeline-3.jpg',
  },
  {
    fecha: 'Nuestra primera salida',
    titulo: 'La noche de Las Bailarinas',
    descripcion:
      'El primer plan de verdad: un día entero, sin relojes y sin tener que volver a ninguna parte. Fue también nuestra primera noche juntos. No hace falta que te cuente más, esa te la sabes igual de bien que yo.',
    foto: 'fotos/timeline-4.jpg',
  },
  {
    fecha: 'Nuestro primer viaje',
    titulo: 'El desierto de la Tatacoa',
    descripcion:
      'Nuestro primer viaje largo juntos. Volvimos con el celular lleno de fotos y con un montón de cosas que no se pueden explicar a alguien que no estuvo ahí. Repetimos cuando digas.',
    foto: 'fotos/timeline-5.jpg',
  },
  {
    fecha: 'Hoy',
    titulo: 'Ocho meses',
    descripcion:
      'Y hasta aquí llegamos, por ahora. Han sido los meses más felices de mi vida, así, sin adornos. He aprendido un montón contigo y a tu lado me siento increíble. Si esto es solo el principio, no me quiero ni imaginar lo que falta.',
    foto: 'fotos/timeline-6.jpg',
  },
]

// ─── #4 SOPA DE LETRAS ───────────────────────────────────────
// El tablero se genera solo a partir de esta lista: no hay que dibujarlo.
// Si cambias alguna palabra: MAYÚSCULAS, sin acentos, sin ñ, sin espacios
// y máximo 8 letras.
const palabrasSopa = [
  'LAURA',
  'AZUL',
  'AMOR',
  'ODISEO',
  'GAEL',
  'PRINCESA',
  'CIELO',
  'HERMOSA',
]

// ─── #5 FUTURO ───────────────────────────────────────────────
// x / y van en PORCENTAJE del lienzo (0-100) para que se vea bien
// igual en un móvil de 375px y en un monitor grande.
//
// OJO CON LOS TÍTULOS: salen como etiqueta bajo cada emoji dentro de la
// escena, que recorta lo que se sale por los lados. Máximo ~18 caracteres,
// y a los que estén cerca de los bordes (x menor que 20 o mayor que 75)
// déjales títulos aún más cortos.
const suenos = [
  {
    x: 20, y: 20, emoji: '👶', titulo: 'Azul',
    sueno:
      'Ya le pusimos nombre y todo, sin tener apuro ni fecha: Azul. Y si resulta que es niño, Gael. Me parece una locura preciosa que dos personas se pongan de acuerdo en el nombre de alguien que todavía no existe.',
  },
  {
    x: 72, y: 17, emoji: '🐶', titulo: 'Odiseo',
    sueno:
      'Nuestro perro se va a llamar Odiseo y ese punto ya no se discute. Nombre tiene. Lo único que le falta es llegar.',
  },
  {
    x: 14, y: 58, emoji: '✈️', titulo: 'Viajes',
    sueno:
      'San Andrés el año que viene, que ya está hablado. Y algún día, cuando se pueda, Disney: más que por el parque, por verte a ti la cara cuando entremos. Esa es la foto que quiero.',
  },
  {
    x: 48, y: 42, emoji: '🏡', titulo: 'La casa',
    sueno:
      'Con una biblioteca grande, un jardín, una cocina con isla y un sofá enorme con su tele. Y un cuarto para trabajar los dos, cada uno en lo suyo: tú buscándole los errores a todo y yo poniéndolos. Eso también es amor.',
  },
  {
    x: 74, y: 60, emoji: '☕', titulo: 'Los días normales',
    sueno:
      'Todavía no vivimos juntos, y aun así los fines de semana contigo son lo mejor que tengo. Lo que más ganas tengo de que pase no es nada grande: es que dejen de ser solo fines de semana.',
  },
  {
    x: 44, y: 80, emoji: '♾️', titulo: 'Toda la vida',
    sueno:
      'Quiero amarte toda la vida. Y quiero que te quede clarísimo, por si alguna vez te entra la duda: no voy a amar a nadie más.',
  },
]

// ─── #6 CUENTA REGRESIVA ─────────────────────────────────────
const sorpresas = [
  {
    numero: 1, titulo: 'Nos vamos', emoji: '🧳', gradiente: 'from-[#667eea] to-[#764ba2]',
    contenido:
      'Hacemos maleta. No va a ser el viaje más largo que hagamos en la vida, pero es el próximo — y el próximo siempre es el que más ilusión hace.',
  },
  {
    numero: 2, titulo: 'El parque', emoji: '🎡', gradiente: 'from-[#f093fb] to-[#f5576c]',
    contenido:
      'Nos vamos al parque Los Quimbayas, a pasar el día entero. Volver a ser un poco niños un rato, que para eso también estamos.',
  },
  {
    numero: 3, titulo: 'El agua', emoji: '🏊', gradiente: 'from-[#4facfe] to-[#00c9c8]',
    contenido:
      'Piscina, sol y cero horarios. El bloqueador lo traes tú, porque a mí seguro se me olvida y los dos lo sabemos.',
  },
  {
    numero: 4, titulo: 'Comer rico', emoji: '🍽️', gradiente: 'from-[#fa709a] to-[#fee140]',
    contenido:
      'Vamos a comer bien, de lo que nos gusta, sin mirar el reloj y sin tener que volver a ninguna parte después.',
  },
  {
    numero: 5, titulo: 'Solo nosotros dos', emoji: '🫧', gradiente: 'from-[#f093fb] to-[#fee140]',
    contenido:
      'Y cuando ya no quede nadie alrededor, hay un sitio con agua caliente y burbujas esperándonos. Privado. Sin público. Eso es todo lo que voy a decir.',
  },
  {
    numero: 6, titulo: 'La última', emoji: '💋', gradiente: 'from-[#764ba2] to-[#fa709a]',
    contenido:
      'Esta no la pienso escribir. Solo te digo que la noche no se acaba cuando se acaba la comida, y que llevo días pensando en ella.',
  },
]

// ─── #7 NUEVE RAZONES ────────────────────────────────────────
// `posicion` es el hueco del tablero 3x3 al que pertenece la pieza:
//   0 1 2
//   3 4 5
//   6 7 8
// Tienen que ser NUEVE exactas: es un tablero 3x3 y con menos no se puede
// terminar. Van saliendo de una en una según encaja cada pieza, así que
// cuanto más cortas, mejor se leen.
const razones = [
  {
    posicion: 0, emoji: '🔥',
    razon: 'Que lo sientes todo al máximo: la alegría, la rabia, el cariño. Nada a medias. Me encanta que seas así.',
  },
  {
    posicion: 1, emoji: '🫂',
    razon: 'Cómo me haces sentir amado. No es un piropo, es un hecho: nunca me había sentido así de querido.',
  },
  {
    posicion: 2, emoji: '👁️',
    razon: 'Tus ojos. Llevo meses buscando una forma original de decirlo y no me sale ninguna: me encantan y ya.',
  },
  {
    posicion: 3, emoji: '😂',
    razon: 'Que te pedí que me pasaras los pañitos húmedos y entendiste "malditos hombres". Me sigo riendo. No pienso dejar de contarlo nunca.',
  },
  {
    posicion: 4, emoji: '🤲',
    razon: 'Que me enseñaste a querer con las manos: abrazar, tocar, quedarme cerca. Eso yo no lo sabía hacer antes de ti.',
  },
  {
    posicion: 5, emoji: '👑',
    razon: 'Lo mimada que eres. Y lo bien que se me da consentirte, que en el fondo también es mérito tuyo.',
  },
  // Estas tres las escribí yo con cosas que me contaste. EDITA: cámbialas por
  // las tuyas si no suenan a ti.
  {
    posicion: 6, emoji: '🚪',
    razon: 'Que aquel día llegué tarde a las clases de baile y tú bajaste por mí. Ahí, sin saberlo todavía, ya me habías dicho que sí.',
  },
  {
    posicion: 7, emoji: '✉️',
    razon: 'Que me dedicaste una canción en una carta. La tengo guardada, por si algún día te entra la duda.',
  },
  {
    posicion: 8, emoji: '📢',
    razon: 'Que se nos sale un gallo hablando y gritamos "¡atención!" o "¡última hora!". Tenemos un idioma entero y no lo habla nadie más.',
  },
]

// ─── #8 ADIVINA EL MOMENTO ───────────────────────────────────
// La respuesta correcta va cambiando de sitio a propósito (`correcta` no es
// siempre el mismo número): si no, se adivina por costumbre y no por memoria.
const adivinanzas = [
  {
    foto: 'fotos/adivina-1.jpg',
    pregunta: '¿En qué mes fuimos al desierto de la Tatacoa?',
    respuestas: ['Julio', 'Mayo', 'Octubre'],
    correcta: 0,
    historia:
      'Julio. Nuestro primer viaje largo juntos, y el primero de una lista que pienso hacer bien larga.',
  },
  {
    foto: 'fotos/adivina-2.jpg',
    pregunta: 'En Las Bailarinas, ¿cuántas veces te tiraste del tobogán?',
    respuestas: ['Una', 'Dos', 'Tres'],
    correcta: 1,
    historia: 'Dos. Y me acuerdo del número porque me quedé mirando las dos.',
  },
  {
    foto: 'fotos/adivina-3.jpg',
    pregunta: 'En Villa Italia, ¿cuál es tu plato favorito?',
    respuestas: ['Lasaña', 'Risotto', 'Pollo parmigiana'],
    correcta: 2,
    historia:
      'Pollo parmigiana, siempre. A estas alturas ya no me hace falta ni mirar la carta para saber qué vas a pedir.',
  },
  {
    foto: 'fotos/adivina-4.jpg',
    pregunta: 'En tu primera presentación, ¿cuántos carteles me gané?',
    respuestas: ['Dos', 'Uno', 'Tres'],
    correcta: 0,
    historia: 'Dos carteles. Aunque lo mejor de ese día no fueron los carteles, fue verte ahí arriba.',
  },
  {
    foto: 'fotos/adivina-5.jpg',
    pregunta: '¿Cuántos girasoles tenía el último ramo que te mandé?',
    respuestas: ['Tres', 'Dos', 'Cinco'],
    correcta: 1,
    historia: 'Dos girasoles. Pequeño detalle que seguro tú tenías contado mejor que yo.',
  },
]

/**
 * ─── #9 EL POEMA ─────────────────────────────────────────────
 *
 * Un poema en tres partes al que le faltan NUEVE palabras: una por sobre.
 * Laura las va eligiendo entre tres opciones y el poema se arma solo.
 *
 * CÓMO SE ESCRIBE UN VERSO
 *   'Un verso normal'                              -> texto y ya
 *   ''                                             -> línea en blanco (separa estrofas)
 *   { texto: 'Con un ___ en medio',                -> verso con hueco
 *     respuesta: 'hueco',
 *     opciones: ['hueco', 'falsa', 'falsa'] }
 *
 * El '___' marca dónde va la palabra. La primera opción es la correcta, pero
 * en pantalla salen barajadas, así que da igual el orden en que las escribas.
 */
const poema = [
  {
    titulo: 'Azul',
    versos: [
      'Antes de ti yo no sabía',
      'que un color pudiera ser un plan.',
      '',
      { texto: 'Que alguien dijera ___', respuesta: 'azul', opciones: ['azul', 'verde', 'blanco'] },
      'y en esa palabra cupieran',
      'una canción,',
      'una casa con biblioteca,',
      'un perro que todavía no ladra',
      'y una niña que todavía no existe',
      'pero que ya tiene nombre.',
      '',
      { texto: 'Yo llegué ___ aquel día.', respuesta: 'tarde', opciones: ['tarde', 'temprano', 'justo'] },
      'Tú bajaste por mí.',
      'Desde entonces llego tarde a todas partes',
      'menos a ti.',
      '',
      'Y si alguna vez te preguntan',
      'de qué color es quererme,',
      { texto: 'diles que del ___.', respuesta: 'tuyo', opciones: ['tuyo', 'mío', 'nuestro'] },
    ],
  },
  {
    titulo: 'Inventario',
    versos: [
      { texto: 'Dos ___ que contaste mejor que yo.', respuesta: 'girasoles', opciones: ['girasoles', 'rosas', 'tulipanes'] },
      { texto: 'Una mesa en ___ que ya es nuestra', respuesta: 'Art Burguer', opciones: ['Art Burguer', 'Villa Italia', 'Las Bailarinas'] },
      'aunque nadie nos la haya dado.',
      'Un idioma de dos palabras:',
      { texto: 'atención, ___.', respuesta: 'última hora', opciones: ['última hora', 'buenas noches', 'otra vez'] },
      '',
      'Unos pañitos húmedos',
      'que alguien entendió como una queja',
      'contra todos los hombres del mundo,',
      'y una risa que no se me ha quitado desde entonces.',
      '',
      'Un 18 de enero.',
      'Un desierto en julio.',
      'Una carta con una canción adentro.',
      '',
      'Dicen que el amor son las cosas grandes.',
      'A mí me salió de esto:',
      'de una lista tonta',
      'que no cambio por nada.',
    ],
  },
  {
    titulo: 'Lo que no te he dicho',
    versos: [
      'No te he dicho que ensayo las frases',
      'antes de decírtelas,',
      'y que igual me salen mal.',
      '',
      'No te he dicho que cuando no estás',
      { texto: 'te pienso en ___,', respuesta: 'presente', opciones: ['presente', 'silencio', 'secreto'] },
      'como si estuvieras a punto de entrar.',
      '',
      'No te he dicho que me enseñaste',
      { texto: 'a querer con las ___,', respuesta: 'manos', opciones: ['manos', 'palabras', 'ojos'] },
      'que yo antes quería de lejos',
      'y creía que eso era querer.',
      '',
      'No te he dicho que me da miedo',
      'que esto se acabe,',
      { texto: 'y que por eso lo ___ tanto.', respuesta: 'cuido', opciones: ['cuido', 'escondo', 'repito'] },
      '',
      'Ahora ya te lo dije.',
      'Y no pienso decírtelo una sola vez.',
    ],
  },
]

// ─── PANTALLA FINAL ──────────────────────────────────────────
export const FINAL = {
  titulo: 'Y hasta aquí llegó el rompecabezas',
  mensaje:
    'Nueve sobres, nueve piezas, nueve días. Y al final resulta que el rompecabezas no era el de la mesa: era esto. Gracias por armarlo conmigo, mi amor. Te amo.',
  firma: '— Carlos',
  // EDITA: fotos del collage final (pon las que quieras, mínimo 3)
  fotos: [
    'fotos/final-1.jpg',
    'fotos/final-2.jpg',
    'fotos/final-3.jpg',
    'fotos/final-4.jpg',
    'fotos/final-5.jpg',
    'fotos/final-6.jpg',
  ],
}

/**
 * ════════════════════════════════════════════════════════════
 *  ÍNDICE DE LOS 9 MINIJUEGOS
 *  (el orden aquí = el orden del grid 3x3)
 * ════════════════════════════════════════════════════════════
 */
export const MINIJUEGOS = [
  { id: 1, titulo: 'Canciones',      emoji: '🎵', tipo: 'quiz',      gradiente: 'from-[#667eea] to-[#764ba2]', intro: 'Tres canciones que son nuestras. ¿Las reconoces?',            contenido: canciones },
  { id: 2, titulo: 'Promesas',       emoji: '✨', tipo: 'memoria',   gradiente: 'from-[#f093fb] to-[#f5576c]', intro: 'Encuentra los pares y encontrarás mis promesas.',             contenido: promesas },
  { id: 3, titulo: 'Pasado',         emoji: '📸', tipo: 'timeline',  gradiente: 'from-[#f093fb] to-[#f5576c]', intro: 'Nuestro camino, desde el primer día.',                        contenido: momentos },
  { id: 4, titulo: 'Presente',       emoji: '❤️', tipo: 'sopa',      gradiente: 'from-[#fa709a] to-[#fee140]', intro: 'Ocho palabras escondidas. Todas hablan de ti.',               contenido: palabrasSopa },
  { id: 5, titulo: 'Futuro',         emoji: '🌟', tipo: 'revelar',   gradiente: 'from-[#667eea] to-[#764ba2]', intro: 'Toca cada cosita para ver lo que quiero contigo.',            contenido: suenos },
  { id: 6, titulo: 'Noche Especial', emoji: '🌙', tipo: 'sorpresas', gradiente: 'from-[#f093fb] to-[#fee140]', intro: `${sorpresas.length} sorpresas para ${NOCHE_ESPECIAL}. Ábrelas en el orden que quieras.`, contenido: sorpresas },
  { id: 7, titulo: '9 Razones',      emoji: '💕', tipo: 'puzzle',    gradiente: 'from-[#fa709a] to-[#fee140]', intro: 'Arma el rompecabezas y aparecen mis nueve razones.',          contenido: razones },
  { id: 8, titulo: 'Momentos',       emoji: '😄', tipo: 'adivina',   gradiente: 'from-[#667eea] to-[#764ba2]', intro: 'Fotos borrosas. Adivina con el menor desenfoque posible.',    contenido: adivinanzas },
  { id: 9, titulo: 'El poema',       emoji: '📜', tipo: 'poema',     gradiente: 'from-[#764ba2] to-[#fa709a]', intro: 'Le faltan nueve palabras: una por cada sobre. Ponlas y se arma solo.', contenido: poema },
]

export const TOTAL_JUEGOS = MINIJUEGOS.length

export function juegoPorId(id) {
  return MINIJUEGOS.find((j) => j.id === id) ?? null
}
