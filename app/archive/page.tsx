'use client';
import { useEffect, useState } from 'react';
import { supabase, Photo, Album } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function ArchivePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedAlbum]);

  async function loadData() {
    setLoading(true);
    
    // Load albums
    const { data: albumsData } = await supabase
      .from('albums')
      .select('*')
      .order('display_order', { ascending: true });
    
    setAlbums(albumsData || []);

    // Load photos (filtered by album if selected)
    let query = supabase
      .from('photos')
      .select('*')
      .eq('published', true)
      .order('uploaded_at', { ascending: false });
    
    if (selectedAlbum) {
      query = query.eq('album_id', selectedAlbum);
    }
    
    const { data: photosData } = await query;
    setPhotos(photosData || []);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#fff', 
          textDecoration: 'none' 
        }}>
          alexramm
        </Link>
        <Link href="/admin" style={{ 
          color: 'rgba(255,255,255,0.7)', 
          textDecoration: 'none',
          fontSize: '14px'
        }}>
          Admin
        </Link>
      </header>

      {/* Album Filter */}
      {albums.length > 0 && (
        <div style={{
          padding: '24px',
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setSelectedAlbum(null)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedAlbum === null ? '1px solid #fff' : '1px solid rgba(255,255,255,0.3)',
              background: selectedAlbum === null ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: '#fff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '14px'
            }}
          >
            All Photos
          </button>
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedAlbum === album.id ? '1px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                background: selectedAlbum === album.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '14px'
              }}
            >
              {album.name}
            </button>
          ))}
        </div>
      )}

      {/* Photo Grid */}
      <main style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
            Loading...
          </div>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
            No photos yet. <Link href="/admin" style={{ color: '#fff', textDecoration: 'underline' }}>Upload some!</Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {photos.map(photo => (
              <div
                key={photo.id}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)'
                }}
                onClick={() => {
                  // Open lightbox (we'll implement this later)
                  window.open(photo.image_url, '_blank');
                }}
              >
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title || 'Photo'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                {photo.title && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    fontSize: '14px'
                  }}>
                    {photo.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        © {new Date().getFullYear()} Alexander Ramm Photography
      </footer>
    </div>
  );
}

