export const PROFILE = {
  email: 'igzjobs@gmail.com',
  resumeUrl: 'https://gutierrezivan.netlify.app/resume.pdf',
  githubUrl: 'https://www.github.com/ivanharvard',
  linkedinUrl: 'https://www.linkedin.com/in/-ivan-gutierrez/',
} as const;

export const ABOUT_LEDE =
  'Curiosity got me into computer science. A desire to make it more useful—and more accessible—keeps me here.';

export function getHarvardRole() {
  const graduation = new Date('2027-05-31T23:59:59');
  return new Date() <= graduation
    ? 'Harvard senior studying Computer Science'
    : 'Harvard graduate with a B.A. in Computer Science';
}

export function getBioText() {
  return [
    ABOUT_LEDE,
    `Hey, I'm Ivan, a ${getHarvardRole()}. I grew up in Destin, Florida, and now live in Cambridge, Massachusetts. I care deeply about making computer science less daunting for people just starting out, regardless of background.`,
    `I'm especially interested in privacy and security: the technologies designed to protect user data, and the ones designed to take it. Away from the keyboard, you'll usually find me at a movie theater proudly getting value from my AMC A-List.`,
  ].join('\n\n');
}
