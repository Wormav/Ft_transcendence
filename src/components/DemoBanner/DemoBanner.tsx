import { isDemoMode } from "../../config/demo";

export default function DemoBanner() {
  if (!isDemoMode()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 text-center shadow-lg" style={{ zIndex: 10000 }}>
      <div className="flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
        <span className="text-sm font-semibold">
          🎭 DEMO MODE - Interface without backend
        </span>
        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
      </div>
    </div>
  );
}
