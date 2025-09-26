import type { Section } from '../types/section';

export default function DirectoryGrid({ onSelect }: { onSelect: (s: Section) => void }) {
    const items = [
        { href: '#about',    name: 'about/',    hint: 'who is ivan?',     value: 'about' as Section },
        { href: '#projects', name: 'projects/', hint: 'things ivan made', value: 'projects' as Section },
        { href: '#contact',  name: 'contact/',  hint: 'get in touch',     value: 'contact' as Section },
    ];

    return (
        <nav className="grid" aria-label="Directory">
            {items.map(item => (
                <a
                    key={item.name}
                    className="dir"
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); onSelect(item.value); }}
                >
                    <div className="icon" aria-hidden />
                    <div><b>{item.name}</b><small>{item.hint}</small></div>
                </a>
            ))}
        </nav>
    );
}