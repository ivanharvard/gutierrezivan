export default function RootHeader() {
    return (
        <header className="header">
            <div className="brand">
                <div className="avatar" aria-hidden />
                <div>
                    <div className="title">ivan gutierrez</div>
                    <div className="muted">harvard CS | software engineer</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a className="pill" href="/projects.json" download>download resume</a>
            </div>
        </header>
    )
}