import Link from 'next/link';
import FCDeck from '@/components/FCDeck';
export default function FlashcardPage() {
    return (
        <div className="flex flex-col ">
            <div className='m-8'><FCDeck/></div>
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

