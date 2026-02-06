'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2 } from 'lucide-react';

interface SiteContent {
    key: string;
    content: string;
    section: string;
    label: string;
}

interface ContentEditorProps {
    section: 'home' | 'actions' | 'transparency';
}

export function ContentEditor({ section }: ContentEditorProps) {
    const [contents, setContents] = useState<SiteContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchContent();
    }, [section]);

    const fetchContent = async () => {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', section)
            .order('key');

        if (data) setContents(data);
        setLoading(false);
    };

    const handleSave = async (key: string, newValue: string) => {
        setSaving(key);
        try {
            const { error } = await supabase
                .from('site_content')
                .update({ content: newValue })
                .eq('key', key);

            if (error) throw error;

            // Update local state to show it saved
            setContents(prev => prev.map(item =>
                item.key === key ? { ...item, content: newValue } : item
            ));

        } catch (error) {
            alert('Erreur de sauvegarde');
            console.error(error);
        } finally {
            setSaving(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Chargement de l'éditeur...</div>;

    const sectionTitles = {
        home: "Page d'Accueil",
        actions: "Page Actions",
        transparency: "Page Transparence"
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="font-display font-bold text-xl text-primary mb-6">{sectionTitles[section]} - Textes</h3>
            <div className="space-y-6">
                {contents.length === 0 ? (
                    <p className="text-text-secondary italic">Aucun texte configurable pour cette section.</p>
                ) : (
                    contents.map(item => (
                        <EditorRow key={item.key} item={item} onSave={handleSave} isSaving={saving === item.key} />
                    ))
                )}
            </div>
        </div>
    );
}

function EditorRow({ item, onSave, isSaving }: { item: SiteContent, onSave: (k: string, v: string) => void, isSaving: boolean }) {
    const [val, setVal] = useState(item.content);
    const hasChanged = val !== item.content;

    return (
        <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">{item.label}</label>
            <div className="flex gap-4">
                <textarea
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="flex-1 w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none min-h-[100px]"
                />
                <button
                    onClick={() => onSave(item.key, val)}
                    disabled={!hasChanged || isSaving}
                    className={`h-fit p-3 rounded-xl transition-all ${hasChanged
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                        : 'bg-surface text-text-secondary opacity-50 cursor-not-allowed'
                        }`}
                    title="Sauvegarder"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                </button>
            </div>
        </div>
    );
}
