import { SmoothScrollProvider } from './lib/smooth-scroll'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import About from './sections/About'
import Contact from './sections/Contact'
import Portal from './components/Portal'

export default function App() {
  return (
    <SmoothScrollProvider>
      <Nav />
      <main>
        <Portal>
          <Hero />
          <Projects />
        </Portal>
        <About />
        <Contact />
      </main>
    </SmoothScrollProvider>
  )
}
