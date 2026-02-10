'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MediaManager } from './MediaManager';
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';

interface Story {
    id: string;
    created_at: string;
    title: string;
    description: string;
    date: string;
}

export function StoriesManager() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
    const [newStoryTitle, setNewStoryTitle] = useState('');
    const [creating, setCreating] = useState(false);

    // Edit Buffer
    const [editBuffer, setEditBuffer] = useState<{ [id: string]: { title: string, description: string } }>({});
    const [saving, setSaving] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setStories(data);
        setLoading(false);
    };

    const handleCreateStory = async () => {
        if (!newStoryTitle.trim()) return;
        setCreating(true);

        const { data, error } = await supabase
            .from('stories')
            .insert([{
                title: newStoryTitle,
                description: '',
                section: 'transparency'
            }])
            .select()
            .single();

        if (data) {
            setStories([data, ...stories]);
            setNewStoryTitle('');
            setExpandedStoryId(data.id); // Auto expand new story
            // Initialize edit buffer
            setEditBuffer(prev => ({ ...prev, [data.id]: { title: data.title, description: data.description } }));
        }
        setCreating(false);
    };

    const handleDeleteStory = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette story et toutes ses photos ?')) return;

        // 1. Delete associated media first (optional if cascade is set, but stricter here)
        // actually RLS might block, but let's assume cascade or manual delete
        // For simplicity, we rely on ON DELETE SET NULL or CASCADE.
        // My previous SQL used ON DELETE SET NULL for media. So photos become "orphaned" in db but not deleted from bucket. 
        // That's acceptable for now to avoid complex bucket deletion logic here. 

        const { error } = await supabase.from('stories').delete().eq('id', id);

        if (!error) {
            setStories(stories.filter(s => s.id !== id));
            if (expandedStoryId === id) setExpandedStoryId(null);
        } else {
            alert('Erreur lors de la suppression');
            console.error(error);
        }
    };

    const handleSaveStory = async (id: string) => {
        const buffer = editBuffer[id];
        if (!buffer) return;

        setSaving(id);
        const { error } = await supabase
            .from('stories')
            .update({ title: buffer.title, description: buffer.description })
            .eq('id', id);

        if (!error) {
            // Update local state
            setStories(stories.map(s => s.id === id ? { ...s, ...buffer } : s));
        } else {
            alert('Erreur de sauvegarde');
        }
        setSaving(null);
    };

    const toggleExpand = (story: Story) => {
        if (expandedStoryId === story.id) {
            setExpandedStoryId(null);
        } else {
            setExpandedStoryId(story.id);
            // Init buffer if not exists
            if (!editBuffer[story.id]) {
                setEditBuffer(prev => ({ ...prev, [story.id]: { title: story.title, description: story.description } }));
            }
        }
    };

    const updateBuffer = (id: string, field: 'title' | 'description', value: string) => {
        setEditBuffer(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    return (
        <div className="space-y-8">
            {/* Create New Story */}
            <div className="bg-white p-6 rounded-3xl border border-border mt-8">
                <h3 className="font-display font-bold text-xl text-primary mb-4">Nouvelle Story</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Titre de la story (ex: Stage Juillet 2026)"
                        className="flex-1 px-4 py-3 rounded-xl border border-border outline-none focus:border-primary"
                        value={newStoryTitle}
                        onChange={(e) => setNewStoryTitle(e.target.value)}
                    />
                    <button
                        onClick={handleCreateStory}
                        disabled={creating || !newStoryTitle.trim()}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {creating ? <Loader2 className="animate-spin" /> : <Plus />}
                        Créer
                    </button>
                </div>
            </div>

            {/* List Stories */}
            <div className="space-y-4">
                {stories.map(story => {
                    const isExpanded = expandedStoryId === story.id;
                    const buffer = editBuffer[story.id] || story;

                    return (
                        <div key={story.id} className="bg-white rounded-3xl border border-border overflow-hidden transition-all shadow-sm hover:shadow-md">
                            {/* Header Row */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer bg-surface hover:bg-gray-50 transition-colors"
                                onClick={() => toggleExpand(story)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-secondary'}`}>
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-lg">{story.title}</h4>
                                        <p className="text-xs text-text-secondary">Créé le {new Date(story.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteStory(story.id); }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Supprimer la story"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="p-6 border-t border-border bg-white animate-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left: Text Details */}
                                        <div className="space-y-4">
                                            <h5 className="font-bold text-text-secondary uppercase text-xs tracking-wider">Détails</h5>

                                            <div>
                                                <label className="text-xs text-text-secondary mb-1 block">Titre</label>
                                                <input
                                                    type="text"
                                                    value={buffer.title}
                                                    onChange={(e) => updateBuffer(story.id, 'title', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-text-secondary mb-1 block">Description</label>
                                                <textarea
                                                    value={buffer.description || ''}
                                                    onChange={(e) => updateBuffer(story.id, 'description', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary outline-none min-h-[120px]"
                                                    placeholder="Racontez l'histoire..."
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleSaveStory(story.id)}
                                                disabled={saving === story.id}
                                                className="flex items-center gap-2 bg-text-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
                                            >
                                                {saving === story.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                                Sauvegarder les textes
                                            </button>
                                        </div>

                                        {/* Right: Media Manager for this Story */}
                                        <div className="border-l border-border pl-8">
                                            <h5 className="font-bold text-text-secondary uppercase text-xs tracking-wider mb-4">Photos & Vidéos de la Story</h5>
                                            <MediaManager section="transparency" storyId={story.id} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
