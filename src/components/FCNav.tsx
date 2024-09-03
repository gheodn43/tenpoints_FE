'use client'
export default function FCNav() { 
  return (
    <div className="flex">
      <button className="bg-primary text-white py-1 px-3 w-14 md:w-18 lg:w-20 rounded-tl rounded-bl hover:bg-slate-600">Decks</button>
      <button className="bg-primary text-white py-1 px-3 w-14 md:w-18 lg:w-20 hover:bg-slate-600">Add</button>
      <button className="bg-primary text-white py-1 px-3 w-14 md:w-18 lg:w-20 rounded-tr rounded-br hover:bg-slate-600">Sync</button>
    </div>
  )
}
