import { Component, ReactNode } from "react";

export class DevBoundary extends Component<{ children: ReactNode }, { err?: Error }> {
    state = { err: undefined as Error | undefined };
    static getDerivedStateFromError(err: Error) {
        return { err };
    }

    render(): ReactNode {
        if (this.state.err) {
            return (
                <div style={{ padding: 16 }}>
                    <h2>something went wrong.</h2>
                    <h4>(does this mean I didn’t get the job?)</h4>
                    <pre>{this.state.err.message}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}