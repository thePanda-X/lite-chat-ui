import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, StopCircle, Sparkles, Settings, RefreshCw, Cpu } from 'lucide-react';
import { Message } from '../types';
import { sendMessageStream, fetchOllamaModels } from '../services/ollamaService';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ThinkingDisclosure } from './ThinkingDisclosure';
import { StatsDisplay } from './StatsDisplay';
import { SettingsDialog } from './SettingsDialog';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [ollamaModels, setOllamaModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Load settings from local storage
        const storedBaseUrl = localStorage.getItem('ollama_base_url');
        if (storedBaseUrl) {
            setBaseUrl(storedBaseUrl);
        }
    }, []);

    useEffect(() => {
        loadOllamaModels();
    }, [baseUrl]);

    const loadOllamaModels = async () => {
        setIsLoadingModels(true);
        try {
            const models = await fetchOllamaModels(baseUrl);
            setOllamaModels(models);
            if (models.length > 0 && !models.includes(selectedModel)) {
                setSelectedModel(models[0]);
            }
        } catch (error) {
            console.error('Failed to load Ollama models:', error);
        }
        setIsLoadingModels(false);
    };

    const handleSaveSettings = (url: string) => {
        setBaseUrl(url);
        if (url) {
            localStorage.setItem('ollama_base_url', url);
        } else {
            localStorage.removeItem('ollama_base_url');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleReset = () => {
        if (messages.length > 0 && window.confirm('Are you sure you want to clear the chat history?')) {
            setMessages([]);
            setInput('');
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Create placeholder for AI response
        const aiMessageId = (Date.now() + 1).toString();
        const initialAiMessage: Message = {
            id: aiMessageId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, initialAiMessage]);

        const startTime = Date.now();

        // Handle streaming
        await sendMessageStream(
            selectedModel,
            [...messages, userMessage],
            userMessage.content,
            {
                onChunk: (text, thinking) => {
                    setMessages(prev => prev.map(msg =>
                        msg.id === aiMessageId
                            ? { ...msg, content: text, thinking: thinking }
                            : msg
                    ));
                },
                onComplete: (usage) => {
                    setIsLoading(false);
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    if (usage) {
                        setMessages(prev => prev.map(msg =>
                            msg.id === aiMessageId
                                ? { ...msg, usage, timing: duration }
                                : msg
                        ));
                    } else {
                        setMessages(prev => prev.map(msg =>
                            msg.id === aiMessageId
                                ? { ...msg, timing: duration }
                                : msg
                        ));
                    }
                },
                onError: (err) => {
                    setIsLoading(false);
                    setMessages(prev => prev.map(msg =>
                        msg.id === aiMessageId
                            ? { ...msg, content: msg.content + `\n\n*Error: ${err.message}*`, isError: true }
                            : msg
                    ));
                }
            },
            { baseUrl, model: selectedModel }
        );
    };

    // Auto-resize textarea
    const handleInputCheck = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background relative selection:bg-primary/30 selection:text-foreground">
            <SettingsDialog
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentBaseUrl={baseUrl}
                onSave={handleSaveSettings}
            />

            {/* Header - No hard borders, uses gradient fade */}
            <header className="z-30 fixed top-0 left-0 w-full transition-all duration-300">
                <div className="bg-gradient-to-b from-background via-background/95 to-transparent pb-4">
                    <div className="max-w-5xl mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo & Brand */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute -inset-1.5 bg-primary/25 rounded-2xl blur-lg opacity-70"></div>
                                    <div className="relative p-2.5 bg-gradient-to-br from-primary/90 to-primary/70 rounded-xl text-primary-foreground">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="font-bold text-base leading-tight tracking-tight text-foreground">liteUI</h1>
                                    <p className="text-[10px] text-muted-foreground/70 font-medium tracking-wide">Local AI Chat</p>
                                </div>
                            </div>

                            {/* Center - Model Selector (Desktop) */}
                            <div className="hidden md:flex items-center">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-secondary/40 backdrop-blur-sm">
                                    <Cpu className="h-4 w-4 text-muted-foreground/60" />
                                    <Select
                                        value={selectedModel}
                                        onChange={(val) => setSelectedModel(val)}
                                        options={ollamaModels.map(m => ({ value: m, label: m }))}
                                        placeholder="Select model..."
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={loadOllamaModels}
                                        disabled={isLoadingModels}
                                        className="h-7 w-7 rounded-lg hover:bg-white/5"
                                        title="Refresh models"
                                    >
                                        <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground/60 ${isLoadingModels ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </div>

                            {/* Right - Actions */}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSettingsOpen(true)}
                                    title="Settings"
                                    className="h-9 w-9 rounded-xl text-muted-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                                >
                                    <Settings className="h-[18px] w-[18px]" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleReset}
                                    title="New Chat"
                                    disabled={messages.length === 0}
                                    className="h-9 w-9 rounded-xl text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 transition-all disabled:opacity-20"
                                >
                                    <Trash2 className="h-[18px] w-[18px]" />
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Model Selector */}
                        <div className="md:hidden pb-1">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-secondary/30 backdrop-blur-sm">
                                <Cpu className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                                <Select
                                    value={selectedModel}
                                    onChange={(val) => setSelectedModel(val)}
                                    options={ollamaModels.map(m => ({ value: m, label: m }))}
                                    placeholder="Select model..."
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={loadOllamaModels}
                                    disabled={isLoadingModels}
                                    className="h-8 w-8 rounded-lg flex-shrink-0 hover:bg-white/5"
                                >
                                    <RefreshCw className={`h-4 w-4 text-muted-foreground/50 ${isLoadingModels ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-none pt-24 md:pt-20">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-12">
                            {/* Hero Icon */}
                            <div className="relative">
                                <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl"></div>
                                <div className="relative p-7 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-3xl shadow-2xl shadow-primary/5">
                                    <Sparkles className="h-12 w-12 text-primary/80" />
                                </div>
                            </div>

                            {/* Welcome Text */}
                            <div className="max-w-md space-y-3">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                                    Welcome to liteUI
                                </h2>
                                <p className="text-base text-muted-foreground/70 leading-relaxed">
                                    Your local AI chat interface. Fast, private, and powerful conversations with your Ollama models.
                                </p>
                            </div>

                            {/* Status */}
                            {ollamaModels.length === 0 ? (
                                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-destructive/10 text-destructive/90 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-destructive/80 animate-pulse"></div>
                                    <span>Cannot connect to Ollama at {baseUrl || 'http://localhost:11434'}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-500/10 text-emerald-400/90 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                    <span>{ollamaModels.length} model{ollamaModels.length !== 1 ? 's' : ''} available</span>
                                </div>
                            )}

                            {/* Quick Tips */}
                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                <div className="px-3 py-1.5 rounded-full bg-secondary/30 text-xs text-muted-foreground/60">
                                    <kbd className="font-mono text-primary/70">Ctrl</kbd> + <kbd className="font-mono text-primary/70">Enter</kbd> to send
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0 mt-1">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'bg-secondary/50 text-secondary-foreground/70'
                                        }`}>
                                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {/* Role Label */}
                                    <span className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 ${msg.role === 'user' ? 'text-primary/50 mr-1' : 'text-muted-foreground/50 ml-1'
                                        }`}>
                                        {msg.role === 'user' ? 'You' : 'Assistant'}
                                    </span>

                                    {/* Message Bubble */}
                                    <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-primary/90 to-primary/80 text-primary-foreground rounded-tr-md shadow-lg shadow-primary/15'
                                        : 'bg-secondary/30 text-foreground rounded-tl-md'
                                        }`}>
                                        {msg.thinking && <ThinkingDisclosure content={msg.thinking} />}

                                        {msg.role === 'model' || msg.role === 'assistant' ? (
                                            <div className="markdown-body">
                                                <MarkdownRenderer content={msg.content} />
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    {msg.role === 'assistant' && !isLoading && (
                                        <div className="mt-2 opacity-50 hover:opacity-100 transition-opacity">
                                            <StatsDisplay usage={msg.usage} timing={msg.timing} model={selectedModel} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-secondary/50 text-secondary-foreground/70 flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-md bg-secondary/30">
                                <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}

                    {/* Bottom Spacer */}
                    <div className="h-36 md:h-44 flex-shrink-0" />
                    <div ref={messagesEndRef} className="h-px" />
                </div>
            </div>

            {/* Floating Input Area */}
            <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
                {/* Gradient Overlay - Smoother fade */}
                <div
                    className="absolute inset-x-0 bottom-0 h-52 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--background) 50%, transparent)' }}
                />

                <div className="relative max-w-4xl mx-auto px-4 md:px-6 pb-6 pt-4 pointer-events-auto">
                    {/* Input Container - No hard borders */}
                    <div className="relative flex items-end gap-3 p-2 rounded-2xl shadow-2xl shadow-black/10 backdrop-blur-xl bg-secondary/40 focus-within:bg-secondary/50 focus-within:shadow-primary/5 transition-all duration-300">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputCheck}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 max-h-[200px] min-h-[48px] w-full resize-none bg-transparent py-3 px-4 text-[15px] placeholder:text-muted-foreground/40 ring-1 ring-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed rounded-lg"
                            rows={1}
                            disabled={isLoading}
                        />
                        <Button
                            onClick={() => handleSubmit()}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            title="Send message (Ctrl+Enter)"
                            className={`mb-1 mr-1 !rounded-xl h-10 w-10 flex-shrink-0 transition-all duration-200 ${input.trim()
                                ? 'bg-gradient-to-br from-primary/90 to-primary/80 text-primary-foreground hover:from-primary hover:to-primary/90 hover:scale-105 shadow-lg shadow-primary/25'
                                : 'bg-secondary/50 text-muted-foreground/40'
                                }`}
                        >
                            {isLoading ? <StopCircle className="h-5 w-5 animate-pulse" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-[11px] text-muted-foreground/30 mt-3 font-medium">
                        AI responses may be inaccurate. Verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
};
