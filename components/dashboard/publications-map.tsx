import dynamic from 'next/dynamic'

// Dynamic import of Mapbox component (client-side only)
// This avoids SSR/Turbopack issues with mapbox-gl
export const PublicationsMap = dynamic(
  () => import('./publications-map-client').then(mod => ({ default: mod.PublicationsMapClient })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="font-semibold">Global Publications Map</h3>
        </div>
        <div className="flex h-[500px] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    )
  }
)
