'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Child {
    id?: string;
    name: string;
    age: string;
    story: string;
    image_url: string | null;
    image_position?: string;
    video_url?: string;
}

interface Props {
    onSuccess: () => void;
    initialData?: Child | null;
    onCancel?: () => void;
}

export function AddChildForm({ onSuccess, initialData, onCancel }: Props) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [story, setStory] = useState('');
    const [imagePosition, setImagePosition] = useState('object-top');
    const [videoUrl, setVideoUrl] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const supabase = createClient();

    // Populate form when initialData changes (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setAge(initialData.age);
            setStory(initialData.story);
            setImageUrl(initialData.image_url);
            setImagePosition(initialData.image_position || 'object-top');
            setVideoUrl(initialData.video_url || '');
            setImage(null); // Reset new file selection
        } else {
            // Reset form for Add Mode
            setName('');
            setAge('');
            setStory('');
            setImageUrl(null);
            setImagePosition('object-top');
            setVideoUrl('');
            setImage(null);
        }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
                alert('Le format HEIC n\'est pas supporté par les navigateurs web. Veuillez utiliser JPG ou PNG.');
                return;
            }

            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImageUrl = imageUrl;

            // Upload new image if selected
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('children-photos')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('children-photos')
                    .getPublicUrl(filePath);

                finalImageUrl = data.publicUrl;
            }

            // Helper to handle saving with fallback for missing column
            try {
                if (initialData?.id) {
                    const { error } = await supabase
                        .from('children')
                        .update({
                            name,
                            age,
                            story,
                            image_url: finalImageUrl,
                            image_position: imagePosition,
                            video_url: videoUrl
                        })
                        .eq('id', initialData.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('children')
                        .insert([{
                            name,
                            age,
                            story,
                            image_url: finalImageUrl,
                            image_position: imagePosition,
                            video_url: videoUrl
                        }]);
                    if (error) throw error;
                }
            } catch (err: any) {
                // FALLBACK: If column doesn't exist (schema cache error), try saving without image_position or video_url
                if (err.message && (err.message.includes("Could not find the") || err.code === '42703')) {
                    console.warn("Column missing, saving with fallback.");
                    if (initialData?.id) {
                        const { error } = await supabase
                            .from('children')
                            .update({ name, age, story, image_url: finalImageUrl })
                            .eq('id', initialData.id);
                        if (error) throw error;
                    } else {
                        const { error } = await supabase
                            .from('children')
                            .insert([{ name, age, story, image_url: finalImageUrl }]);
                        if (error) throw error;
                    }
                    alert('Sauvegardé ! (Note: Certaines options avancées n\'ont pas pu être appliquées car la base de données n\'est pas à jour, mais le reste est bon !)');
                } else {
                    throw err;
                }
            }

            if (!initialData?.id) {
                alert('Enfant ajouté avec succès !');
                // Only reset if adding
                setName('');
                setAge('');
                setStory('');
                setImage(null);
                setImageUrl(null);
                setImagePosition('object-top');
                setVideoUrl('');
            } else {
                alert('Modifications enregistrées !');
            }

            onSuccess(); // Refresh list

        } catch (error: any) {
            alert('Erreur: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-lg border border-border sticky top-24">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-bold text-xl text-primary">
                    {initialData ? 'Modifier la fiche' : 'Ajouter un enfant'}
                </h2>
                {initialData && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-text-secondary hover:text-primary underline"
                    >
                        Annuler
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">Prénom</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">Âge</label>
                    <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">Histoire</label>
                    <textarea
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                        rows={6}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">Photo</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer relative mb-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {imageUrl ? (
                            <div className="relative h-48 w-full">
                                <Image src={imageUrl} alt="Preview" fill className={`object-cover ${imagePosition} rounded-lg transition-all duration-500`} />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setImage(null);
                                        setImageUrl(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-text-secondary">
                                <Upload size={32} className="mb-2" />
                                <span className="text-sm font-medium">Cliquez pour ajouter une photo</span>
                            </div>
                        )}
                    </div>

                    {/* Position Selector */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Cadrage de la photo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Haut (Visage)', value: 'object-top' },
                                { label: 'Centre', value: 'object-center' },
                                { label: 'Bas', value: 'object-bottom' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setImagePosition(option.value)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${imagePosition === option.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-surface border-border text-text-secondary hover:border-primary'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">Lien Vidéo (Optionnel)</label>
                    <input
                        type="text"
                        placeholder="https://youtube.com/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                    />
                    <p className="text-xs text-text-secondary mt-1">Lien vers une vidéo YouTube ou Vimeo.</p>
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                >
                    {uploading ? 'Enregistrement...' : (initialData ? 'Mettre à jour' : 'Ajouter')}
                </button>
            </div>
        </form>
    );
}
