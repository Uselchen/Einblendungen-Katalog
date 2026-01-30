import { Overlay } from './types';

export const INITIAL_CATEGORIES = [
  'Bauchbinde',
  'Vollbild',
  'Ticker',
  'Logo',
  'Picture-in-Picture',
  'Sonstiges'
];

export const INITIAL_OVERLAYS: Overlay[] = [
  {
    id: '1',
    title: 'Standard News Bauchbinde',
    description: 'Klassische blaue Bauchbinde für Nachrichten-Segmente mit Platzhalter für Name und Titel.',
    category: 'Bauchbinde',
    tags: ['news', 'blau', 'hd'],
    isFavorite: true,
    previewUrl: 'https://picsum.photos/400/225?random=1',
    createdAt: Date.now() - 10000000,
    lastModified: Date.now() - 100000,
  },
  {
    id: '2',
    title: 'Eilmeldung Ticker',
    description: 'Roter Ticker am unteren Bildrand für dringende Meldungen.',
    category: 'Ticker',
    tags: ['alert', 'rot', 'live'],
    isFavorite: false,
    previewUrl: 'https://picsum.photos/400/225?random=2',
    createdAt: Date.now() - 20000000,
    lastModified: Date.now() - 500000,
  },
  {
    id: '3',
    title: 'Sport Scoreboard',
    description: 'Spielstand-Anzeige oben rechts für Fußballübertragungen.',
    category: 'Sonstiges',
    tags: ['sport', 'live', 'score'],
    isFavorite: true,
    previewUrl: 'https://picsum.photos/400/225?random=3',
    createdAt: Date.now() - 5000000,
    lastModified: Date.now(),
  },
  {
    id: '4',
    title: 'Interview Partner Vollbild',
    description: 'Grafik zur Vorstellung des Gastes vor dem Interview.',
    category: 'Vollbild',
    tags: ['interview', 'bio', 'statisch'],
    isFavorite: false,
    previewUrl: 'https://picsum.photos/400/225?random=4',
    createdAt: Date.now() - 15000000,
    lastModified: Date.now() - 2000000,
  },
  {
    id: '5',
    title: 'Sender Logo Transparent',
    description: 'Wasserzeichen oben rechts, 50% Opazität.',
    category: 'Logo',
    tags: ['branding', 'permanent'],
    isFavorite: false,
    previewUrl: 'https://picsum.photos/400/225?random=5',
    createdAt: Date.now() - 30000000,
    lastModified: Date.now() - 30000000,
  }
];

export const MOCK_USER_NAME = "Redaktion Demo";