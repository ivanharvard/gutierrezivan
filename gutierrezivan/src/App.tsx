import './styles/global.css'
import { useProjects } from './data/projects';
import ProjectCard from './components/ProjectCard';
import { getTheme, setTheme, applyAuto } from './theme';

// Set initial theme
const saved = getTheme();
if (saved === 'auto') {
    applyAuto();
} else {
    setTheme(saved);
}

document.documentElement.setAttribute("data-theme", "light");


export default function App() {
  const { data: projects, error, loading } = useProjects();

  return (
    <>
      <div className="wrap">
        {/* ... header, directorygrid, etc. ... */}

        <section id="projects">
          <h2>projects/</h2>
          {/* Load projects */}
          <div className="projects">
            {loading && <div className="card proj"><p>Loading...</p></div>}
            {error && <div className="card proj"><p>Failed to load projects: {error}</p></div>}
            {projects && projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>
      </div>

      {/*... terminal ...*/}
    </>
  )
}
