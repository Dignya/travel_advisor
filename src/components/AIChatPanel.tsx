
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Loader2, X } from 'lucide-react'
import { useTripStore } from '@/store/trip-store'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

export default function AIChatPanel() {
    const [isOpen, setIsOpen] = useState(true)
    const [inputValue, setInputValue] = useState('')
    const { isAnalyzing, setAnalyzeStart, setAnalyzeComplete, setUserQuery } = useTripStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        setAnalyzeStart()
        setUserQuery(inputValue)

        try {
            const response = await fetch('/api/ai/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: inputValue })
            })
            const data = await response.json()

            if (data.matches) {
                setAnalyzeComplete(data.matches)
            }
        } catch (error) {
            console.error('Failed to get suggestions', error)
            setAnalyzeComplete([])
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[350px]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="backdrop-blur-md bg-black/60 border-white/20 shadow-2xl overflow-hidden">
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="p-1.5 rounded-lg bg-indigo-500/20">
                                            <Sparkles className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm">Travel Oracle</h3>
                                            <p className="text-xs text-indigo-200/60">Ask me anything...</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="relative">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="E.g., I want a snowy adventure with cheap hotels..."
                                        className="pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-indigo-500/50"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={isAnalyzing || !inputValue.trim()}
                                        className={cn(
                                            "absolute right-1 top-1 h-7 w-7 transition-all",
                                            isAnalyzing ? "bg-indigo-500/50" : "bg-indigo-500 hover:bg-indigo-600"
                                        )}
                                    >
                                        {isAnalyzing ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Send className="w-3 h-3" />
                                        )}
                                    </Button>
                                </form>

                                {isAnalyzing && (
                                    <div className="text-xs text-center text-indigo-300 animate-pulse">
                                        Scanning the globe for your perfect match...
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="lg"
                        className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Ask Oracle
                    </Button>
                </motion.div>
            )}
        </div>
    )
}
