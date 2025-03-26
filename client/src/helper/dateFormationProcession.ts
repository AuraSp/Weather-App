export const getCurrentTimeFormatted = (): string => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleTimeString('us-US', options);
};
