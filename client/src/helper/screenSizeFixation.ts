import { useEffect, useState } from 'react';

type ScreenSize = 'small' | 'medium' | 'large';

export const useScreenSize = (): ScreenSize => {
    const [screenSize, setScreenSize] = useState<ScreenSize>('large');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize(width < 856 ? 'small' : width <= 1064 ? 'medium' : 'large');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};