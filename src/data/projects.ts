export interface Project {
  id: string
  number: string
  title: string
  description: string
  tags: string[]
  /** Optional image URL, e.g. /project-safepath.webp. Falls back to a gradient placeholder. */
  image?: string
  href?: string
}

export const projectsIntro = {
  eyebrow: 'Featured Projects',
  title: 'Selected ',
  titleAccent: 'Work',
  sub: 'Things built to solve real problems.',
  aside: 'A collection of projects at the intersection of AI, software and real world impact.',
}

export const projects: Project[] = [
  {
    id: 'safepath',
    number: '01',
    title: 'SafePath',
    description: 'Real-time personal safety app with AI-powered safe routes, SOS and wearable integration.',
    tags: ['Flutter', 'Firebase', 'ESP32', 'AI/ML'],
    href: '#',
  },
  {
    id: 'sentrix',
    number: '02',
    title: 'Sentrix',
    description: 'AI-powered platform for threat detection and risk analysis.',
    tags: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    href: '#',
  },
  {
    id: 'agentbattle',
    number: '03',
    title: 'AgentBattle',
    description: 'Multi-agent AI system for competitive task solving and evaluation.',
    tags: ['LangChain', 'OpenAI', 'Docker', 'React'],
    href: '#',
  },
]
