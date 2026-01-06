"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe2, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"
import { formatDistanceToNow } from "date-fns"

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css'

// Mapbox GL types
type MapboxMap = any
type MapboxMarker = any

type CountryPublication = {
  country_iso2: string
  country: string
  site_name: string
  article_count: string
  last_published: string
}

type PublicationsMapClientProps = {
  data: CountryPublication[]
}

// Country coordinates (capital cities) - Complete mapping for all 103 medias
const COUNTRY_COORDS: Record<string, [number, number]> = {
  // Europe
  FR: [2.3522, 48.8566], DE: [13.405, 52.52], IT: [12.4964, 41.9028],
  ES: [-3.7038, 40.4168], GB: [-0.1278, 51.5074], CH: [7.4474, 46.948],
  NL: [4.9041, 52.3676], BE: [4.3517, 50.8503], AT: [16.3738, 48.2082],
  SE: [18.0686, 59.3293], NO: [10.7522, 59.9139], DK: [12.5683, 55.6761],
  PL: [21.0122, 52.2297], PT: [-9.1393, 38.7223], GR: [23.7275, 37.9838],
  UA: [30.5234, 50.4501], RU: [37.6173, 55.7558], IS: [-21.8174, 64.1466],
  IE: [-6.2603, 53.3498], FI: [24.9384, 60.1699], BG: [23.3219, 42.6977],
  HR: [15.9819, 45.815], HU: [19.0402, 47.4979], LT: [25.2797, 54.6872],
  RS: [20.4489, 44.7866],
  
  // Americas
  US: [-77.0369, 38.9072], CA: [-75.6972, 45.4215], MX: [-99.1332, 19.4326],
  BR: [-47.8825, -15.7942], AR: [-58.3816, -34.6037], CL: [-70.6693, -33.4489],
  CO: [-74.0721, 4.711], PE: [-77.0428, -12.0464], VE: [-66.9036, 10.4806],
  BO: [-68.15, -16.5], CR: [-84.0907, 9.9281], CU: [-82.3666, 23.1136],
  EC: [-78.4678, -0.1807], GY: [-58.1551, 6.8013], HT: [-72.3074, 18.5944],
  PA: [-79.5199, 8.9824], PY: [-57.5759, -25.2637], SR: [-55.2038, 5.852],
  UY: [-56.1645, -34.9011],
  
  // Asia-Pacific
  CN: [116.4074, 39.9042], JP: [139.6917, 35.6895], IN: [77.209, 28.6139],
  KR: [126.978, 37.5665], TH: [100.5018, 13.7563], ID: [106.865, -6.1751],
  MY: [101.6869, 3.139], PH: [120.9842, 14.5995], VN: [105.8542, 21.0285],
  PK: [73.0479, 33.6844], BD: [90.4125, 23.8103], KZ: [71.4704, 51.1801],
  AM: [44.5152, 40.1792], HK: [114.1694, 22.3193], SG: [103.8198, 1.3521],
  AU: [149.13, -35.2809], NZ: [174.7633, -41.2865],
  
  // Middle East
  TR: [32.8597, 39.9334], SA: [46.6753, 24.7136], AE: [54.3773, 24.4539],
  IL: [35.2137, 31.7683], IR: [51.389, 35.6892], IQ: [44.3661, 33.3152],
  EG: [31.2357, 30.0444], LB: [35.5018, 33.8938], BH: [50.586, 26.2285],
  KW: [47.9774, 29.3759], OM: [58.4059, 23.5859], QA: [51.531, 25.2854],
  
  // Africa
  ZA: [28.2293, -25.7479], NG: [7.3986, 9.0765], KE: [36.8219, -1.2921],
  GH: [-0.187, 5.6037], MA: [-6.8498, 33.9716], DZ: [3.0588, 36.7538],
  TN: [10.1815, 36.8065], AO: [13.2343, -8.8383], BF: [-1.5247, 12.3714],
  BW: [25.9087, -24.6282], CI: [-4.0083, 5.36], CM: [11.5021, 3.848],
  CD: [15.2663, -4.4419], ET: [38.7469, 9.145], GA: [9.4536, 0.4162],
  MG: [47.5079, -18.8792], ML: [-8.0029, 12.6392], MZ: [32.5732, -25.9692],
  NA: [17.0658, -22.5597], RW: [30.0619, -1.9441], SN: [-17.4441, 14.7167],
  SZ: [31.1367, -26.3054], TZ: [39.2083, -6.7924], UG: [32.5825, 0.3476],
  ZM: [28.2833, -15.3875], ZW: [31.0539, -17.8252],
}

export function PublicationsMapClient({ data }: PublicationsMapClientProps) {
  const { resolvedTheme } = useTheme()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<MapboxMap | null>(null)
  const markersRef = useRef<Map<string, MapboxMarker>>(new Map())
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryPublication & { sites: string[] } | null>(null)
  const [mapboxgl, setMapboxgl] = useState<any>(null)

  // Load Mapbox GL dynamically
  useEffect(() => {
    import('mapbox-gl').then((module) => {
      setMapboxgl(module.default)
    })
  }, [])

  // Group data by country
  const countryData = useMemo(() => {
    const grouped = new Map<string, CountryPublication & { sites: string[] }>()
    
    data.forEach(item => {
      const existing = grouped.get(item.country_iso2)
      if (existing) {
        existing.article_count = String(Number(existing.article_count) + Number(item.article_count))
        existing.sites.push(item.site_name)
      } else {
        grouped.set(item.country_iso2, { ...item, sites: [item.site_name] })
      }
    })
    
    return Array.from(grouped.values())
  }, [data])

  const maxActivity = useMemo(() => 
    Math.max(...countryData.map(d => Number(d.article_count)), 1),
    [countryData]
  )

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxgl) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    try {
      mapboxgl.accessToken = token
      const isDark = resolvedTheme === "dark"
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${isDark ? 'dark' : 'light'}-v11`,
        projection: 'globe',
        center: [0, 20],
        zoom: 1.5,
        pitch: 0,
      })

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      
      map.current.on('load', () => {
        setIsLoaded(true)
        
        // Add atmosphere
        map.current.setFog({
          color: isDark ? 'rgb(11, 11, 25)' : 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': isDark ? 0.6 : 0.3,
        })
      })
    } catch (error) {
      console.error('Mapbox error:', error)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapboxgl, resolvedTheme])

  // Add markers
  useEffect(() => {
    if (!map.current || !isLoaded || !mapboxgl) return

    console.log('[Map] Adding markers for countries:', countryData.length)

    const markers = markersRef.current
    markers.forEach(m => m.remove())
    markers.clear()

    countryData.forEach(country => {
      const coords = COUNTRY_COORDS[country.country_iso2]
      
      console.log(`[Map] Country ${country.country_iso2}:`, coords ? 'has coords' : 'MISSING coords')
      
      if (!coords) {
        console.warn(`[Map] No coordinates for ${country.country_iso2} (${country.country})`)
        return
      }

      const size = Math.max(24, Math.min(48, 24 + (Number(country.article_count) / maxActivity) * 24))
      
      console.log(`[Map] Creating pin for ${country.country_iso2} at`, coords, 'size:', size)
      
      const el = document.createElement('div')
      el.className = 'marker-pin'
      el.innerHTML = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.85);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${Math.max(11, size * 0.35)}px;
          transition: all 0.2s ease;
        ">${country.article_count}</div>
      `

      const markerEl = el.firstElementChild as HTMLElement
      
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.15)'
        markerEl.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)'
      })
      
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)'
        markerEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
      })

      markerEl.addEventListener('click', () => {
        setSelectedCountry(country)
        map.current?.flyTo({
          center: coords,
          zoom: 4,
          duration: 2000,
        })
      })

      try {
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(coords)
          .addTo(map.current)

        markers.set(country.country_iso2, marker)
        console.log(`[Map] ✅ Pin added for ${country.country_iso2}`)
      } catch (error) {
        console.error(`[Map] ❌ Failed to add marker for ${country.country_iso2}:`, error)
      }
    })

    console.log(`[Map] Total markers added: ${markers.size}`)
  }, [countryData, isLoaded, maxActivity, mapboxgl])

  const resetView = () => {
    map.current?.flyTo({ center: [0, 20], zoom: 1.5, pitch: 0, duration: 2000 })
    setSelectedCountry(null)
  }

  if (!mapboxgl || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Global Publications Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[500px] items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            <p>Mapbox token not configured</p>
            <p className="mt-1 text-xs">Add NEXT_PUBLIC_MAPBOX_TOKEN to environment</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <Globe2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">Global Publications Map</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetView} 
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            <RefreshCw className="mr-1.5 h-3 w-3" aria-hidden="true" />
            Reset View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[300px] w-full overflow-hidden rounded-b-lg sm:h-[400px] lg:h-[500px]">
          <div ref={mapContainer} className="h-full w-full" />
          
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
              <div className="space-y-2 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Loading globe...</p>
              </div>
            </div>
          )}

          {/* Bottom Panel - Selected Country Info - Mobile optimized */}
          {selectedCountry && (
            <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/95 p-3 backdrop-blur-sm sm:p-4">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="text-sm font-semibold text-foreground sm:text-base lg:text-lg">
                      {selectedCountry.country}
                    </h3>
                    <Badge variant="secondary" className="bg-primary/10 text-xs text-primary">
                      {selectedCountry.article_count.toLocaleString()} articles
                    </Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {selectedCountry.sites.length} media{selectedCountry.sites.length > 1 ? 's' : ''}: {selectedCountry.sites.slice(0, 2).join(', ')}
                      {selectedCountry.sites.length > 2 && ` +${selectedCountry.sites.length - 2} more`}
                    </p>
                    <p className="text-[11px] text-muted-foreground sm:text-xs">
                      Last: {formatDistanceToNow(new Date(selectedCountry.last_published), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close country details"
                >
                  <span className="text-lg" aria-hidden="true">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

