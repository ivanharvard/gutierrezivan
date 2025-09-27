import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import type { Project } from "../src/data/projects";

export type TerminalCtx = {
    who?: { user: string; host: string };
    navigate: (section: "about" | "projects" | "contact") => void;
    setTheme: (mode: "light" | "dark" | "pink" | "dark-purple" | "auto" | "toggle") => void;
    downloadResume: () => void;
    openTerminal?: () => void;
    openUrl?: (href: string) => void;
    projects: Array<Project>;
};

export type CommandHandler = (arg?: string) => void;

type NodeDir = { type: "dir"; entries: Record<string, VfsNode> };
type NodeFile = { type: "file"; content: string };
type VfsNode = NodeDir | NodeFile;

const isDir = (n: VfsNode): n is NodeDir => n.type === "dir";
const isFile = (n: VfsNode): n is NodeFile => n.type === "file";

const SLASH = "/";
const HOME = "/home";

// ========= HELPERS FOR DIRS ==========

function normalizePath(path: string): string {
    const parts = path.split(SLASH).filter(p => p !== "");
    const out: string[] = [];
    for (const p of parts) {
        if (p === ".") continue;
        if (p === "..") out.pop();
        else out.push(p);
    }
    return SLASH + out.join(SLASH);
}

function joinPath(baseAbs: string, rhs: string): string {
    if (!rhs) return baseAbs;
    if (rhs === "~") return HOME;
    if (rhs.startsWith("~" + SLASH)) return normalizePath(HOME + SLASH + rhs.slice(2));

    if (rhs === '.') return baseAbs;
    if (rhs === ".." && baseAbs === HOME) return HOME;
    if (rhs === '..') return normalizePath(baseAbs + SLASH + "..");

    if (rhs.startsWith(SLASH)) return normalizePath(rhs);

    return normalizePath(baseAbs + SLASH + rhs);
}

function toTilde(abs: string): string {
    if (abs === HOME) return "~";
    if (abs.startsWith(HOME + SLASH)) return "~" + abs.slice(HOME.length);
    return abs;
}

const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ======== HOOK ==========

export function useTerminal(ctx: TerminalCtx) {
    const user = ctx.who?.user ?? "guest";
    const host = ctx.who?.host ?? "localhost";

    const [lines, setLines]     = useState<string[]>(["Type 'help' to get started."]);
    const [cmd, setCmd]         = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState<number | null>(null);

    const [cwd, setCwd]         = useState<string>(HOME);

    const bodyRef = useRef<HTMLDivElement | null>(null);

    const print = useCallback((s: string) => {
        setLines((prev) => [...prev, s]);
        // Use setTimeout instead of requestAnimationFrame for better reliability
        setTimeout(() => {
            const el = bodyRef.current;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        }, 0);
    }, []);

    const clear = useCallback(() => setLines([]), []);
    const prompt = useCallback(() => `${user}@${host} ${toTilde(cwd)} %`, [user, host, cwd]);

    const vfs = useMemo<VfsNode>(() => {
        const root: NodeDir = { type: "dir", entries: {} };
        const home: NodeDir = { type: "dir", entries: {} };
        root.entries["home"] = home;

        // ~/about
        home.entries["about"] = { type: "dir", entries: {
            "bio.txt": { type: "file", content: document.getElementById("aboutText")?.textContent || "" },
        } };

        // ~/contact
        home.entries["contact"] = { type: "dir", entries: {
            "email.txt": { type: "file", content: document.getElementById("email")?.textContent || "" },
            "resume.txt": { type: "file", content: document.getElementById("resumeLink")?.getAttribute("href") || "" },
            "github.txt": { type: "file", content: document.getElementById("github")?.textContent || "" },
            "linkedin.txt": { type: "file", content: document.getElementById("linkedin")?.textContent || "" },
        } };

        // ~/projects (one file per project)
        const projectsDir: NodeDir = { type: "dir", entries: {} };
        const list = ctx.projects || [];
        for (const p of list) {
            const name = `${slug(p.title || "project")}.proj`;
            const body = [
                `Title: ${p.title}`,
                p.blurb ? `Blurb: ${p.blurb}` : "",
                p.liveUrl ? `Live: ${p.liveUrl}` : "",
                p.codeUrl ? `Code: ${p.codeUrl}` : "",
                p.tags && p.tags.length ? `Tags: ${p.tags.join(", ")}` : "",
            ].filter(Boolean).join("\n");
            projectsDir.entries[name] = { type: "file", content: body || p.title || name }; 
        }
        home.entries["projects"] = projectsDir;

        return root;
    }, [ctx]);

    // resolve absolute path
    const resolve = useCallback((absPath: string): VfsNode | null => {
        const parts = absPath.split(SLASH).filter(Boolean);
        let node: VfsNode = vfs;
        for (const p of parts) {
            if (!isDir(node)) return null;
            const next = node.entries[p];
            if (!next) return null;
            node = next;
        }
        return node;
    }, [vfs]);

    // list directory entries as names
    const listDir = useCallback((absPath: string): string[] | null => {
        const node = resolve(absPath);
        if (!node || !isDir(node)) return null;
        return Object.keys(node.entries).sort();
    }, [resolve]);

    // change directory 
    const chdir = useCallback((rhs: string | undefined): boolean => {
        const targetAbs = rhs ? joinPath(cwd, rhs) : HOME;
        const node = resolve(targetAbs);
        if (!node || !isDir(node)) return false;
        setCwd(targetAbs);
        
        // Navigate to corresponding page sections based on directory
        const tilde = toTilde(targetAbs);
        
        // If we're at home (~) or root (/), go to root page
        if (tilde === "~" || targetAbs === "/" || tilde === "~/") {
            // Clear hash to go to root/home page
            if (window.location.hash) {
                window.location.hash = "";
            }
            return true;
        }
        
        // If we're in a subdirectory of home, navigate to that section
        if (tilde.startsWith("~/")) {
            const seg = tilde.slice(2).split(SLASH)[0]; // about | projects | contact
            if (seg === "about" || seg === "projects" || seg === "contact") {
                ctx.navigate(seg as "about" | "projects" | "contact");
                // Ensure terminal stays open and refocused after navigation
                setTimeout(() => {
                    ctx.openTerminal?.();
                }, 100); // Delay to let the navigation and DOM updates complete
            }
        }
        
        return true;
    }, [cwd, resolve, ctx]);

    // read file content at path
    const readFile = useCallback((path: string): string | null => {
        const abs = joinPath(cwd, path);
        const node = resolve(abs);
        if (node && isFile(node)) return node.content;
        return null;
    }, [cwd, resolve]);

    // ========== CMD REGISTRY =============

    const registry = useMemo(() => ({
        help: () =>
        print("Commands: help, ls [path], pwd, cd [path], cat <file>, theme [light|dark|pink|dark-purple|auto], rm [-rf] [path], download, see-code, clear"),

        clear: () => clear(),

        pwd: () => print(toTilde(cwd)),

        ls: (arg) => {
            const target = arg ? joinPath(cwd, arg) : cwd;
            const items = listDir(target);
            if (!items) { 
                print(`ls: ${arg ?? ""}: Not a directory (target: ${target})`); 
                return; 
            }
            print(items.join("  "));
        },

        cd: (arg) => {
            if (!arg) { 
                setCwd(HOME); 
                // Navigate to root page when going to home
                if (window.location.hash) {
                    window.location.hash = "";
                }
                return; 
            }
            const ok = chdir(arg);
            if (!ok) print(`cd: ${arg}: No such file or directory`);
        },

        cat: (arg) => {
            if (!arg) { print("usage: cat <file>"); return; }
            
            let abs = joinPath(cwd, arg);
            let node = resolve(abs);

            if (!node || !isFile(node)) {
                abs = joinPath(cwd, arg.endsWith(".txt") ? arg : arg + ".txt");
                node = resolve(abs);
            }

            if (!node || !isFile(node)) { print(`cat: ${arg}: No such file`); return; }

            node.content.split("\n").forEach(line => print(line));
        },

        theme: (arg) => {
            if (arg === "light" || arg === "dark" || arg === "pink" || arg === "dark-purple" || arg === "auto") ctx.setTheme(arg);
            else print("usage: theme [light|dark|pink|dark-purple|auto]");
        },

        download: () => {
            print("Downloading resume...");
            ctx.downloadResume();
        },

        "see-code": () => {
            print("Opening source code repository...");
            if (ctx.openUrl) {
                ctx.openUrl("https://github.com/ivanharvard/gutierrezivan");
            } else {
                window.open("https://github.com/ivanharvard/gutierrezivan", "_blank");
            }
        },

        rm : (arg) => {
            const showPrank404 = () => {
                // Create a fake filesystem to "delete"
                const fakeFiles = [
                    "/bin/bash", "/bin/zsh", "/usr/bin/node", "/usr/bin/npm",
                    "/etc/passwd", "/etc/hosts", "/home/user/documents",
                    "/home/user/photos", "/var/log/system.log", "/tmp/cache",
                    "/Applications/Chrome.app", "/Applications/VSCode.app",
                    "/System/Library", "/Library/Preferences", "/usr/local/bin",
                ];

                // Store removed elements for restoration
                const removedElements: Array<{element: HTMLElement, parent: Node, nextSibling: Node | null}> = [];

                const removeElement = (element: HTMLElement) => {
                    if (element && element.parentNode) {
                        removedElements.push({
                            element: element,
                            parent: element.parentNode,
                            nextSibling: element.nextSibling
                        });
                        element.parentNode.removeChild(element);
                    }
                };

                let index = 0;
                const deleteInterval = setInterval(() => {
                    if (index < fakeFiles.length) {
                        print(`rm: removing '${fakeFiles[index]}'`);
                        
                        // Get current visible elements to remove (refresh each time since DOM changes)
                        const currentElements = [
                            document.querySelector('header'),
                            document.querySelector('.grid'),
                            ...Array.from(document.querySelectorAll('.card')),
                            ...Array.from(document.querySelectorAll('.dir')),
                            ...Array.from(document.querySelectorAll('section:not(.terminal-section)')),
                            document.querySelector('footer'),
                            ...Array.from(document.querySelectorAll('h2')),
                            ...Array.from(document.querySelectorAll('p')),
                        ].filter(Boolean) as HTMLElement[];

                        // Remove the first available element
                        if (currentElements.length > 0) {
                            removeElement(currentElements[0]);
                        }
                        
                        index++;
                    } else {
                        clearInterval(deleteInterval);
                        
                        // Show final "critical system files" being deleted
                        setTimeout(() => {
                            print("rm: removing '/System/Library/CoreServices'");
                            print("rm: removing '/System/Library/Kernels'");
                            print("rm: removing '/usr/bin/sudo'");
                            
                            // Remove any remaining visible elements
                            const remainingElements = Array.from(document.querySelectorAll('body > *')).filter(el => 
                                !el.classList.contains('terminal') && 
                                (el as HTMLElement).style.display !== 'none' &&
                                el.tagName !== 'SCRIPT'
                            ) as HTMLElement[];
                            
                            remainingElements.forEach((el) => {
                                removeElement(el);
                            });
                            
                            // Show the 404 screen after all deletions
                            setTimeout(() => {
                                const overlay = document.createElement("div");
                                Object.assign(overlay.style, {
                                    position: "fixed", 
                                    inset: "0",
                                    background: "var(--bg)",
                                    display: "grid",
                                    placeItems: "center",
                                    zIndex: "999999",
                                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                                    fontSize: "clamp(18px, 3vw, 28px)",
                                    textAlign: "center",
                                    color: "var(--text)",
                                } as CSSStyleDeclaration);
                                overlay.innerHTML = 
                                    `<div>
                                        <div style="opacity:.85">404</div>
                                        <div style="margin-top:8px;font-size:.8em;opacity:.6">Page not found</div>
                                    </div>`;
                                document.body.appendChild(overlay);

                                // dramatic pause, then "restore" the filesystem
                                setTimeout(() => {
                                    overlay.innerHTML = 
                                        `<div>
                                            <div>just kidding!</div>
                                            <div style="margin-top:8px;font-size:.8em;opacity:.6">restoring filesystem…</div>
                                        </div>`;
                                    
                                    // Restore all removed elements
                                    removedElements.reverse().forEach(({element, parent, nextSibling}) => {
                                        if (nextSibling) {
                                            parent.insertBefore(element, nextSibling);
                                        } else {
                                            parent.appendChild(element);
                                        }
                                    });
                                }, 7000);

                                setTimeout(() => {
                                    clear();
                                    document.body.removeChild(overlay);
                                    print("rm: don't be silly, your files are safe :)");
                                }, 9000);
                            }, 800);
                        }, 300);
                    }
                }, 100); // Show each deletion every 100ms
            };

            const isRootish = (s: string) => {
                // what we consider a "root nuke"
                // - `/`, `/*`, `/ --no-preserve-root`, variants with `-rf`
                // - `~` when it maps to HOME, and absolute `/` from anywhere
                if (!s) return false;
                const raw = s.trim();
                // tokenize to catch flags and target
                const parts = raw.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
                const flags = parts.filter(p => p.startsWith("-")).join(" ");
                const target = parts.filter(p => !p.startsWith("-")).join(" ").trim() || "";
                const looksLikeRoot =
                    target === "/" || target === "/*" ||
                    target === "~" || target === "~/" 
                    || target === `${SLASH}`
                    || target.replace(/\/+$/,'') === ""; // defensive
                const explicitNoPreserve = /\B--no-preserve-root\b/.test(flags);
                return looksLikeRoot && explicitNoPreserve;
            }

            const usage = () => print("usage: rm [-rf] <file|dir>");
            if (!arg || !arg.trim()) { return usage(); }

            // prank if they try to nuke root
            if (isRootish(arg)) {
                clear();
                showPrank404();
                return;
            }

            // everything else is read-only
            const parts = arg.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
            const flags = parts.filter((p: string) => p.startsWith("-")).join(" ");
            const targetRaw = parts.filter((p: string) => !p.startsWith("-"))?.pop();
            if (!targetRaw) { return usage(); }

            const has = (ch: string) => new RegExp(`(^|-)${ch}`).test(flags);
            const abs = joinPath(cwd, targetRaw.replace(/^["']|["']$/g, ""));
            const node = resolve(abs);

            if (!node) { 
                if (has("f")) return; // silent if -f
                return print(`rm: cannot remove '${toTilde(targetRaw)}': No such file or directory`);
            }

            if (isDir(node) && !has("r")) {
                return print(`rm: cannot remove '${toTilde(targetRaw)}': Is a directory`);
            }

            return print(`rm: cannot remove '${toTilde(targetRaw)}': Read-only file system`);
        }
    }), [cwd, print, clear, listDir, chdir, resolve, ctx]);    
    
    const commandNames = () => Object.keys(registry);

    const executeCommand = useCallback((input: string) => {
        const trimmed = input.trim();
        print(`${prompt()} ${trimmed}`);
        if (!trimmed) return;

        // history
        setHistory((h) => [...h, trimmed]);
        setHistIdx(null);

        const [c, ...rest] = trimmed.split(/\s+/);
        const arg = rest.join(" ");
        const fn = (registry as Record<string, CommandHandler>)[c];
        if (fn) fn(arg);
        else print(`-zsh: ${c}: command not found`);
        
        // Ensure scroll to bottom after command execution
        setTimeout(() => {
            const el = bodyRef.current;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        }, 10);
    }, [print, prompt, registry, bodyRef]);

    // key handling for input (history, tab, Ctrl+L)
    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHistIdx((idx) => {
                const next = idx === null ? history.length - 1 : Math.max(0, idx - 1);
                setCmd(history[next] ?? "");
                return next;
            });
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHistIdx((idx) => {
                if (idx === null) return null;
                const next = Math.min(history.length - 1, idx + 1);
                const val = history[next] ?? "";
                setCmd(next >= history.length ? "" : val);
                return next >= history.length ? null : next;
            });
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
            e.preventDefault();
            clear(); return;
        }
        if (e.key === "Tab") {
            e.preventDefault();
            // simple completion based on context
            const parts = cmd.split(/\s+/);
            const head = parts[0] || "";
            const partial = parts[1] || "";

            if (parts.length == 1) {
                const matches = commandNames().filter(n => n.startsWith(head));
                if (matches.length === 1) setCmd(matches[0] + " ");
                else if (matches.length > 1) print(matches.join("  "));
                return;
            }

            if (head === "cd" || head === "ls" || head === "cat") {
                // determine directory to list for completion
                const rhs = partial || "";
                const baseAbs = rhs.includes(SLASH) 
                                ? joinPath(cwd, rhs.substring(0, rhs.lastIndexOf(SLASH))) 
                                : cwd;
                const prefix = rhs.includes(SLASH) ? rhs.substring(rhs.lastIndexOf(SLASH) + 1) : rhs;
                const items = listDir(baseAbs) ?? [];
                const matches = items.filter(n => n.startsWith(prefix));
                if (matches.length === 1) {
                    const dirPart = rhs.includes(SLASH) ? rhs.substring(0, rhs.lastIndexOf(SLASH) + 1) : "";
                    setCmd(`${head} ${dirPart}${matches[0]}`);
                } else if (matches.length > 1) {
                    print(matches.join("  "));
                }
            }
        }
    }, [cmd, history, listDir, clear, print]);

    // update projects dir when projects change
    useEffect(() => {
        // no-op; vfs rebuilds via useMemo deps
    }, [ctx.projects]);

    return { lines, cmd, setCmd, bodyRef, print, clear, executeCommand, prompt, onKeyDown };
}
