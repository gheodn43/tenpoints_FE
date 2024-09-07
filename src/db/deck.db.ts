import Dexie, { type EntityTable } from 'dexie';
enum DeckStatus {
  SYNCHRONIZED = 'synchronized',
  UPDATED = 'updated',
  MODIFIED = 'modified',
  DELETED = 'deleted'
}
interface Deck {
  id: number;
  deck_path: string;
  parent_deck_path: string;
  deck_name: string;
  new_count: number;
  learning_count: number;
  review_count: number;
  total_cards: number;
  status: DeckStatus;
}

const dbDeck = new Dexie('DeckDatabase') as Dexie & {
  deck: EntityTable<Deck, 'id'>;
};

dbDeck.version(1).stores({
  deck: '++id, deck_path, parent_deck_path, deck_name, new_count, learning_count, review_count, total_card, status'
});

export type { Deck };
export { dbDeck, DeckStatus }; 
