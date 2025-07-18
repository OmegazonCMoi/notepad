'use client'

import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui";
import { IconDownload } from "@intentui/icons";

export default function Home() {
    const [text, setText] = useState("");
    const [leftWidth, setLeftWidth] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);

    const startResize = (e: React.MouseEvent) => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResize);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        // Limiter entre 20% et 80%
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
            setLeftWidth(newLeftWidth);
        }
    };

    const stopResize = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResize);
    };

    const saveNotes = async () => {
        if (!text.trim()) {
            alert("Aucun contenu à sauvegarder");
            return;
        }

        try {
            // Créer un blob avec le contenu Markdown
            const blob = new Blob([text], { type: 'text/markdown' });
            
            // Créer un lien de téléchargement
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Générer un nom de fichier avec la date
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
            link.download = `notes-${dateStr}.md`;
            
            // Déclencher le téléchargement
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Nettoyer l'URL
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde du fichier');
        }
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', stopResize);
        };
    }, []);

    return (
        <div className='max-w-2xl mx-auto items-center justify-center min-h-screen flex flex-col relative'>
            <h1 className='text-[75px] mb-4' style={{ fontFamily: "Darlington" }}>Notepad Markdown</h1>
            <div ref={containerRef} className="w-full h-full p-4 flex relative">
                <div style={{ width: `${leftWidth}%` }} className="pr-2">
                    <Textarea 
                        placeholder="Enter your text here..." 
                        className="w-full min-h-[400px] resize-none" 
                        value={text} 
                        onChange={setText} 
                    />
                </div>
                
                <div 
                    className="w-1 bg-neutral-800 hover:bg-neutral-700 rounded-full cursor-col-resize transition-colors"
                    onMouseDown={startResize}
                />
                
                <div style={{ width: `${100 - leftWidth}%` }} className="pl-2">
                    <div className="relative w-full min-h-[400px] px-2.5 py-2 text-sm border border-input rounded-lg overflow-auto">
                        <div className="absolute top-4 right-4">
                            <Button 
                                onClick={saveNotes}
                                intent="outline"
                                size="sq-sm"
                                className="flex items-center justify-center bg-neutral-950 hover:bg-neutral-900"
                            >
                                <IconDownload className="w-4 h-4" />
                            </Button>
                        </div>
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </h3>
                                ),
                                h4: ({ children }) => (
                                    <h4 className="text-lg font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </h4>
                                ),
                                h5: ({ children }) => (
                                    <h5 className="text-base font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </h5>
                                ),
                                h6: ({ children }) => (
                                    <h6 className="text-sm font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </h6>
                                ),
                                p: ({ children }) => (
                                    <p className="mb-3 text-neutral-800 dark:text-neutral-200 leading-relaxed">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="mb-3 ml-6 list-disc text-neutral-800 dark:text-neutral-200">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="mb-3 ml-6 list-decimal text-neutral-800 dark:text-neutral-200">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="mb-1 text-neutral-800 dark:text-neutral-200">
                                        {children}
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-bold text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </strong>
                                ),
                                em: ({ children }) => (
                                    <em className="italic text-neutral-800 dark:text-neutral-200">
                                        {children}
                                    </em>
                                ),
                                code: ({ children }) => (
                                    <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-sm font-mono text-neutral-900 dark:text-neutral-100">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg mb-3 overflow-x-auto">
                                        {children}
                                    </pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 mb-3 italic text-neutral-700 dark:text-neutral-300">
                                        {children}
                                    </blockquote>
                                ),
                                a: ({ children, href }) => (
                                    <a 
                                        href={href} 
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                hr: () => (
                                    <hr className="border-neutral-300 dark:border-neutral-600 my-4" />
                                ),
                            }}
                        >
                            {text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
