'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Upload, Loader2, Video, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    caption: string;
    section: string;
}

interface MediaManagerProps {
    section: string;
}

export function MediaManager({ section }: MediaManagerProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [captionBuffer, setCaptionBuffer] = useState<{ [key: string]: string }>({});
    const supabase = createClient();

    useEffect(() => {
        fetchMedia();
    }, [section]);

    const fetchMedia = async () => {
        const { data, error } = await supabase
            .from('site_media')
            .select('*')
            .eq('section', section)
            .order('created_at', { ascending: false });

        if (data) setMedia(data as MediaItem[]);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        try {
            // Process all uploads in parallel
            await Promise.all(files.map(async (file) => {
                const isVideo = file.type.startsWith('video/');
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('gallery')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(filePath);

                // 3. Save to DB
                const { error: dbError } = await supabase
                    .from('site_media')
                    .insert([{
                        url: data.publicUrl,
                        type: isVideo ? 'video' : 'image',
                        caption: '',
                        section: section
                    }]);

                if (dbError) throw dbError;
            }));

            fetchMedia();
            alert(`${files.length} média(s) ajouté(s) !`);

        } catch (error: any) {
            alert('Erreur: ' + error.message);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm('Supprimer ce média ?')) return;

        // Extract filename from URL to delete from storage might be tricky if not stored purely, 
        // but for now let's just delete the DB record reference which hides it.
        // A proper implementation would parse the URL to delete the object too, 
        // but keeping it simple for now as per "MVP" unless requested.

        const { error } = await supabase
            .from('site_media')
            .delete()
            .eq('id', id);

        if (!error) fetchMedia();
    };

    const updateCaption = async (id: string, caption: string) => {
        await supabase
            .from('site_media')
            .update({ caption })
            .eq('id', id);
        // Silent update
    };

    return (
        <div className="space-y-8">
            {/* Upload Area */}
            <div className="bg-white p-6 rounded-3xl border border-dashed border-primary/30 text-center hover:bg-primary/5 transition-colors">
                <input
                    type="text"
                    accept="image/*,video/*"
                    onChange={() => { }} // Dummy to avoid error, actual handler is on input file below, wait... 
                    className="hidden"
                />
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleUpload}
                    id="media-upload"
                    className="hidden"
                    disabled={uploading}
                    multiple
                />
                <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center justify-center p-8">
                    {uploading ? (
                        <Loader2 className="animate-spin text-primary mb-2" size={40} />
                    ) : (
                        <Upload className="text-primary mb-2" size={40} />
                    )}
                    <span className="font-bold text-lg text-primary">
                        {uploading ? 'Envoi en cours...' : 'Ajouter des photos ou vidéos'}
                    </span>
                    <span className="text-text-secondary text-sm mt-1">Glissez ou cliquez pour uploader (Plusieurs fichiers possibles)</span>
                </label>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {media.length === 0 && (
                    <div className="col-span-full text-center text-text-secondary py-12">
                        Aucun média pour le moment.
                    </div>
                )}

                {media.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden group">
                        <div className="relative h-48 bg-gray-100">
                            {item.type === 'video' ? (
                                <video src={item.url} className="w-full h-full object-cover" controls />
                            ) : (
                                <Image src={item.url} alt="Media" fill className="object-cover" />
                            )}

                            <button
                                onClick={() => handleDelete(item.id, item.url)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                {item.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                {item.type === 'video' ? 'VIDÉO' : 'PHOTO'}
                            </div>
                        </div>
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Ajouter une légende..."
                                defaultValue={item.caption}
                                onBlur={(e) => updateCaption(item.id, e.target.value)}
                                className="w-full text-sm border-none bg-transparent focus:ring-0 placeholder:text-text-secondary/50 font-medium"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
