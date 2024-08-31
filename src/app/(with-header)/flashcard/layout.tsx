import FCNav from '../../../components/FCNav';

export default function FlashCardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='w-full flex justify-center items-center text-sm sm:text-base lg:text-lg'>
      <FCNav />
      </div>
      {children}
    </div>
  );
}
