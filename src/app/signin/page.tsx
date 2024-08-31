import Link from 'next/link';
import SignInForm from '@/components/SignInForm';

const SignInPage = () => {
  return (
    <div className="bg-black text-white h-screen flex flex-col">
      <header className="w-full flex justify-between px-8 py-4 z-50">
        <Link href="/">
          <h1 className="font-bold font-racing-sans text-3xl">TENPOINTS</h1>
        </Link>
      </header>
      <SignInForm />
    </div>
  );
};

export default SignInPage;