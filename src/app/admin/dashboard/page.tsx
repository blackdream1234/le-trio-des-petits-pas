'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AddChildForm } from '@/components/admin/AddChildForm';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { MediaManager } from '@/components/admin/MediaManager';
import { Trash2, Pencil, Users, Home, Activity, Camera } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Child {
    id: string;
    name: string;
    age: string;
    story: string;
    image_url: string | null;
    image_position?: string;
    video_url?: string;
}

export default function Dashboard() {
    const [children, setChildren] = useState<Child[]>([]);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [activeTab, setActiveTab] = useState<'children' | 'home' | 'actions' | 'transparency'>('children');
    const supabase = createClient();
    const router = useRouter();

    const fetchChildren = async () => {
        const { data, error } = await supabase.from('children').select('*').order('created_at', { ascending: false });
        if (data) setChildren(data);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
            } else {
                fetchChildren();
            }
        };
        checkUser();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) return;
        const { error } = await supabase.from('children').delete().eq('id', id);
        if (!error) fetchChildren();
    };

    const handleSuccess = () => {
        fetchChildren();
        setEditingChild(null);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-surface">
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-text-primary">Tableau de bord</h1>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
                        className="text-text-secondary hover:text-red-500 font-medium"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Navigation Tabs - Page Centric */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('children')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'children'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-text-secondary hover:bg-gray-50'
                            }`}
                    >
                        <Users size={20} />
                        Enfants (Histoire)
                    </button>
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'home'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-text-secondary hover:bg-gray-50'
                            }`}
                    >
                        <Home size={20} />
                        Page Accueil
                    </button>
                    <button
                        onClick={() => setActiveTab('actions')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'actions'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-text-secondary hover:bg-gray-50'
                            }`}
                    >
                        <Activity size={20} />
                        Page Actions
                    </button>
                    <button
                        onClick={() => setActiveTab('transparency')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'transparency'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-text-secondary hover:bg-gray-50'
                            }`}
                    >
                        <Camera size={20} />
                        Page Transparence
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'children' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Form (Add or Edit) */}
                        <div className="lg:col-span-1">
                            <AddChildForm
                                onSuccess={handleSuccess}
                                initialData={editingChild}
                                onCancel={() => setEditingChild(null)}
                            />
                        </div>

                        {/* Right: List */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="font-display font-bold text-2xl text-text-primary">
                                Enfants ({children.length})
                            </h2>

                            {children.length === 0 ? (
                                <div className="bg-white p-8 rounded-3xl border border-border text-center text-text-secondary">
                                    Aucune fiche enfant pour le moment. Ajoutez-en une !
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {children.map((child) => (
                                        <div key={child.id} className={`bg-white p-4 rounded-2xl border flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${editingChild?.id === child.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0">
                                                {child.image_url ? (
                                                    <Image src={child.image_url} alt={child.name} fill className={`object-cover ${child.image_position || 'object-top'}`} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">No img</div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg text-text-primary truncate">{child.name}</h3>
                                                <p className="text-sm text-text-secondary">{child.age}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingChild(child);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(child.id)}
                                                    className="p-2 text-text-secondary hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'home' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-800">
                            <p className="font-bold text-lg mb-2">💡 Info Page Accueil</p>
                            <p>
                                Ici, vous modifiez le texte d'introduction de la page d'accueil.
                                Les histoires des enfants se gèrent dans l'onglet <strong>"Enfants (Histoire)"</strong>.
                            </p>
                        </div>
                        <ContentEditor section="home" />
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Textes</h2>
                                <ContentEditor section="actions" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Galerie (Optionnel)</h2>
                                <p className="text-text-secondary mb-4 text-sm">Vous pouvez ajouter des photos qui apparaîtront si nous activons une galerie sur cette page.</p>
                                <MediaManager section="actions" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transparency' && (
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Textes</h2>
                                    <ContentEditor section="transparency" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Galerie Photo & Vidéo</h2>
                                <p className="text-text-secondary mb-4">Ces photos apparaissent directement dans la grille "La preuve par l'image".</p>
                                <MediaManager section="transparency" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
