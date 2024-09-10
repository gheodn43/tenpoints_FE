import Dexie, { type EntityTable } from 'dexie';
enum DeckStatus {
  SYNCHRONIZED = 'synchronized',
  UPDATED = 'updated',
  MODIFIED = 'modified',
  DELETED = 'deleted',
  DEFAULT = 'default'
}
interface Deck {
  deck_id: string;
  deck_path: string;
  parent_deck_path: string | null;
  deck_name: string;
  new_count: number;
  learning_count: number;
  review_count: number;
  total_cards: number;
  status: DeckStatus;
}

const dbDeck = new Dexie('DeckDatabase') as Dexie & {
  deck: EntityTable<Deck, 'deck_id'>;
};

dbDeck.version(1).stores({
  deck: 'deck_id, deck_path, parent_deck_path, deck_name, new_count, learning_count, review_count, total_cards, status'
});

export type { Deck };
export { dbDeck, DeckStatus }; 
