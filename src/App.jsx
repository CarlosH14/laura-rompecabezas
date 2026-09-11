import { AnimatePresence } from 'framer-motion'
import { useGameStore } from './hooks/useGameStore'
import Navbar from './components/Navbar'
import Home from './components/Home'
import JuegoContainer from './components/JuegoContainer'
import Final from './components/Final'
import DesbloqueoModal from './components/DesbloqueoModal'
import FondoAnimado from './components/FondoAnimado'

/**
 * Una sola pantalla, tres vistas. El estado manda: no hay rutas ni URLs
 * distintas — así el QR siempre apunta al mismo sitio y Laura cae donde
 * dejó las cosas.
 */
export default function App() {
  const pantalla = useGameStore((s) => s.pantalla)

  return (
    <div className="relative min-h-dvh">
      <FondoAnimado />
      <Navbar />

      {/* mode="wait": una pantalla termina de salir antes de que entre la otra,
          para que no se solapen a mitad de camino. */}
      <AnimatePresence mode="wait">
        {pantalla === 'home' && <Home key="home" />}
        {pantalla === 'juego' && <JuegoContainer key="juego" />}
        {pantalla === 'final' && <Final key="final" />}
      </AnimatePresence>

      {/* El modal de la clave vive fuera de las vistas: puede abrirse desde
          cualquiera de ellas. */}
      <DesbloqueoModal />

      <footer className="pb-6 text-center text-[11px] text-muted">Hecho a mano, para Laura 💕</footer>
    </div>
  )
}
