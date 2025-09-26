type Props = { open: boolean; onOpen: () => void; onClose: () => void; };

export default function TerminalOverlay({ open, onOpen, onClose }: Props) {
    return (
        <div className={`terminal ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="Terminal">
            <div className="grab" onClick={open ? onClose : onOpen}><div className="bar" /></div>
            <div className="term-head">
                <div>guest@gutierrezivan.com -- interactive shell</div>
                <button className="pill" onClick={onClose}>Close</button>
            </div>
            <div className="term-body" id="termBody" />
            <div className="term-input">
                <span style={{ color: '#7c7c7c' }}>$</span>
                <input id="termInput" placeholder="Type 'help'" />
            </div>
        </div>
    );
}