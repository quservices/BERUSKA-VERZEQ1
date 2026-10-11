import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { Gallery } from '../components/sections/Gallery';
import { Hero } from '../components/sections/Hero';
import { HowToOrder } from '../components/sections/HowToOrder';
import { Offer } from '../components/sections/Offer';
import { Weddings } from '../components/sections/Weddings';

export function HomePage() {
  return (
    <>
      <title>Cukrárna Beruška Paskov – koláče, dorty a výslužky od roku 1997</title>
      <Hero />
      <Offer />
      <Weddings />
      <About />
      <Gallery />
      <HowToOrder />
      <Contact />
    </>
  );
}
