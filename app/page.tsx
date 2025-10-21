import { Hero } from '@/components/home/Hero';
import { ProjectsPreview } from '@/components/home/ProjectsPreview';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { Process } from '@/components/home/Process';
import { TechStack } from '@/components/home/TechStack';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <ProjectsPreview />
      <Process />
      <TechStack />
      <FinalCTA />
    </>
  );
}
