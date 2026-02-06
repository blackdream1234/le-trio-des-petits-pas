'use client';

import { useEffect } from 'react';

export function HelloAssoWidget() {
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data && e.data.height) {
                const haWidgetElement = document.getElementById('haWidget-vignette');
                if (haWidgetElement) {
                    (haWidgetElement as HTMLIFrameElement).style.height = e.data.height + 'px';
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="w-full flex justify-center">
            <iframe
                id="haWidget-vignette"
                src="https://www.helloasso.com/associations/le-trio-des-petits-pas/adhesions/adhesion/widget-vignette"
                style={{ width: '350px', border: 'none', minHeight: '500px' }}
                // @ts-ignore
                allowtransparency="true"
                className="rounded-3xl shadow-xl"
            ></iframe>
        </div>
    );
}
