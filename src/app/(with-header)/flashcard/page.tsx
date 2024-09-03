import Link from 'next/link';
import DeckTree from '@/components/FCDeckTree';

const decks = [
    {
      user_id: '02',
      deck_path: 'default',
      deck_id: 'ec675898-44b2-4dd6-b5b8-e5df8467f648',
      parent_deck_path: null,
      deck_name: 'Default Deck',
      new_count: 2,
      learning_count: 3,
      review_count: 5,
      total_cards: 10,
    },
    {
      user_id: '02',
      deck_path: 'default::subdeck1',
      deck_id: 'a67c0f69-d1f2-4e76-9b5d-9f25ed9a0c7f',
      parent_deck_path: 'default',
      deck_name: 'Subdeck 1',
      new_count: 1,
      learning_count: 1,
      review_count: 4,
      total_cards: 6,
    },
    {
      user_id: '02',
      deck_path: 'default::subdeck2',
      deck_id: 'b3d21e71-07c5-4a68-bb8c-5f98baf68512',
      parent_deck_path: 'default',
      deck_name: 'Subdeck 2',
      new_count: 0,
      learning_count: 2,
      review_count: 3,
      total_cards: 5,
    }
  ];
export default function FlashcardPage() {
    return (
        <div className="flex flex-col ">
            <div className='m-8'><DeckTree decks={decks}/></div>
            <div className="flex space-x-3 items-center justify-center">
                <Link href="/">
                    <p className="text-white responsive-font-small underline hover:text-primary">Create Deck</p>
                </Link>
                <Link href="/">
                    <p className="text-white responsive-font-small underline  hover:text-primary">Import File</p>
                </Link>
            </div>
        </div>
    );
}

