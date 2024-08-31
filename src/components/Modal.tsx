'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
 
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-blue-500 bg-opacity-75"
      style={{ zIndex: 1000 }}
    >
      <div 
        className="bg-white p-4 rounded-lg shadow-lg"
        style={{ width: '500px', height: '300px' }} // Bạn có thể điều chỉnh kích thước tại đây
      >
        <button
          className="mb-4 text-white bg-red-500 hover:bg-red-700 rounded px-4 py-2"
          onClick={() => {
            router.back()
          }}
        >
          Close modal
        </button>
        <div>{children}</div>
      </div>
    </div>
  )
}
