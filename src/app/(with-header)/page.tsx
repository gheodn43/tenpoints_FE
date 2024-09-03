import Link from "next/link";

export default function Home() {
  return (
    <div className="text-white h-screen flex flex-col">
      <div className="grid gap-6 sm:grid-cols-2 mx-8 mt-12">
        <Link href="/flashcard">
          <div className="bg-primary py-3 px-6 rounded-2xl font-inter h-[150px] hover:cursor-pointer">
            <span className="font-semibold responsive-font-medium">FLASHCARD</span>
          </div>
        </Link>
        <div className="bg-secondary py-3 px-6 rounded-2xl font-inter h-[150px] flex flex-col justify-between">
          <span className="font-semibold responsive-font-medium">MULTIPLE CHOICE</span>
          <p className="text-neutral text-bottom responsive-font-small">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
