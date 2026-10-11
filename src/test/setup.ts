import '@testing-library/jest-dom/vitest';

// jsdom neimplementuje posun stránky
window.scrollTo = () => {};
