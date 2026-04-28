export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
}