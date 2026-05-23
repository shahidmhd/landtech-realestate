'use client';

import { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useLocale, useTranslations } from 'next-intl';
import type { Property } from '@/types/property';
import { formatAed } from '@/lib/utils';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Side-effect import so the cluster plugin attaches itself onto L.
// All Leaflet code runs client-side because this file is dynamic-imported with ssr:false.
import L from 'leaflet';
import 'leaflet.markercluster';

interface Props {
  properties: Property[];
}

const DUBAI_CENTER: [number, number] = [25.2, 55.27];

export default function PropertiesMap({ properties }: Props) {
  const t = useTranslations('map_view');
  const tc = useTranslations('common');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DUBAI_CENTER,
      zoom: 11,
      zoomControl: false,
      worldCopyJump: true,
      attributionControl: true,
    });
    mapRef.current = map;

    // dark tiles match the rest of the UI
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // gold pin marker (inline SVG → Leaflet divIcon)
    const pinHtml = renderToStaticMarkup(<PinMark />);
    const pinIcon = L.divIcon({
      html: pinHtml,
      className: 'luxe-pin',
      iconSize: [34, 42],
      iconAnchor: [17, 40],
      popupAnchor: [0, -36],
    });

    const cluster = (L as unknown as { markerClusterGroup: (opts?: object) => L.LayerGroup }).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      iconCreateFunction: (c: L.MarkerCluster) => {
        const n = c.getChildCount();
        return L.divIcon({
          html: `<div class="luxe-cluster">${n}</div>`,
          className: 'luxe-cluster-wrapper',
          iconSize: [44, 44],
        });
      },
    });

    properties.forEach((p) => {
      if (!p.coordinates?.lat || !p.coordinates?.lng) return;
      const marker = L.marker([p.coordinates.lat, p.coordinates.lng], { icon: pinIcon });
      const html = renderToStaticMarkup(
        <Popup
          p={p}
          locale={locale}
          aed={tc('aed')}
          beds={tc('beds')}
          sqft={tc('sqft')}
          view={t('popup_view')}
        />
      );
      marker.bindPopup(html, { closeButton: false, className: 'luxe-popup', minWidth: 240 });
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);

    // fit to all points if we have any
    if (properties.length > 0) {
      const group = L.featureGroup(
        properties
          .filter((p) => p.coordinates?.lat && p.coordinates?.lng)
          .map((p) => L.marker([p.coordinates.lat, p.coordinates.lng]))
      );
      if (group.getLayers().length) {
        map.fitBounds(group.getBounds().pad(0.2), { animate: false });
      }
    }

    return () => {
      map.removeLayer(cluster);
    };
  }, [properties, locale, tc, t]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-[70vh] w-full overflow-hidden rounded-3xl border border-white/[0.08]"
      />
      <style jsx global>{`
        .leaflet-container {
          background: #0A0A0B;
          font-family: var(--font-sans);
        }
        .leaflet-control-attribution {
          background: rgba(10,10,11,0.7) !important;
          color: rgba(245,241,232,0.55) !important;
          font-size: 10px !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(200,164,92,0.85) !important;
        }
        .leaflet-bar a {
          background: rgba(10,10,11,0.85) !important;
          color: #F5F1E8 !important;
          border-color: rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(12px);
        }
        .leaflet-bar a:hover { color: #C8A45C !important; }
        .luxe-cluster-wrapper { background: transparent !important; }
        .luxe-cluster {
          width: 44px; height: 44px;
          display: grid; place-items: center;
          border-radius: 9999px;
          color: #0A0A0B;
          font-weight: 600;
          font-size: 13px;
          background: linear-gradient(135deg, #E6CC85, #C8A45C);
          box-shadow: 0 10px 30px -8px rgba(200,164,92,0.5);
          border: 2px solid rgba(10,10,11,0.6);
        }
        .leaflet-popup-content-wrapper {
          background: #111114 !important;
          color: #F5F1E8 !important;
          border-radius: 14px !important;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0 !important;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.7) !important;
        }
        .leaflet-popup-tip { background: #111114 !important; }
        .leaflet-popup-content { margin: 0 !important; min-width: 240px; }
      `}</style>
    </>
  );
}

function PinMark() {
  return (
    <svg viewBox="0 0 34 42" width={34} height={42} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6CC85" />
          <stop offset="1" stopColor="#8E6C2E" />
        </linearGradient>
      </defs>
      <path
        d="M17 1.5c8.3 0 15 6.7 15 15 0 10.1-13.5 23.5-14.1 24.1a1.3 1.3 0 0 1-1.8 0C15.5 40 2 26.6 2 16.5 2 8.2 8.7 1.5 17 1.5Z"
        fill="url(#lg)"
        stroke="#0A0A0B"
        strokeWidth="1.5"
      />
      <circle cx="17" cy="16" r="5" fill="#0A0A0B" />
    </svg>
  );
}

function Popup({
  p, locale, aed, beds, sqft, view,
}: {
  p: Property;
  locale: string;
  aed: string;
  beds: string;
  sqft: string;
  view: string;
}) {
  return (
    <a
      href={`/${locale === 'en' ? '' : locale + '/'}properties/${p.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: '#F5F1E8',
        padding: 0,
      }}
    >
      <div style={{ position: 'relative', height: 120, overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
        <img src={p.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,11,0.85), transparent 60%)',
          }}
        />
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.24em', color: '#C8A45C' }}>
          <MapPinSvg /> {p.location}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 4 }}>
          {p.title}
        </div>
        <div style={{ fontSize: 13, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#C8A45C', fontWeight: 600 }}>
            {aed} {formatAed(p.price, locale)}
          </span>
          <span style={{ color: 'rgba(245,241,232,0.65)' }}>
            {p.bedrooms} {beds} · {p.areaSqft.toLocaleString()} {sqft}
          </span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: '#C8A45C',
          }}
        >
          {view} →
        </div>
      </div>
    </a>
  );
}

// Lightweight inline SVG so we don't ship a full lucide icon into renderToStaticMarkup popups.
function MapPinSvg() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

