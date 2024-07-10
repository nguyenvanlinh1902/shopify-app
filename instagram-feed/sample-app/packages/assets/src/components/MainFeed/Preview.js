import React, {useState} from 'react';
import {Card} from '@shopify/polaris';
import MediaModal from './MediaModal';
import LazyLoad from 'react-lazyload';
import './Preview.scss';

// eslint-disable-next-line react/prop-types
function Preview({settings, media}) {
  const mediaToShow = media.slice(0, settings.numberOfRows * settings.numberOfColumns);
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${settings.numberOfColumns}, 1fr)`,
    gap: `${settings.postSpacing}px`,
    alignItems: 'center'
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

  const openModal = index => {
    setSelectedMediaIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMediaIndex(null);
  };

  const navigateMedia = direction => {
    if (direction === 'next') {
      setSelectedMediaIndex(prevIndex => (prevIndex + 1) % mediaToShow.length);
    } else if (direction === 'prev') {
      setSelectedMediaIndex(prevIndex => (prevIndex - 1 + mediaToShow.length) % mediaToShow.length);
    }
  };

  return (
    <div className="page-width">
      <Card>
        <span>{settings.title}</span>
        {mediaToShow.length > 0 ? (
          <div style={gridStyle}>
            {mediaToShow.map((item, index) => (
              <LazyLoad key={item.id} height={200} offset={100} once>
                <div className="Mageplaza-Gird-Media" onClick={() => openModal(index)}>
                  {item.media_type === 'IMAGE' && (
                    <img
                      className="Mageplaza-MediaItem"
                      src={item.media_url}
                      alt={item.caption}
                      loading="lazy"
                    />
                  )}
                  {item.media_type === 'VIDEO' && (
                    <video className="Mageplaza-MediaItem" controls loading="lazy">
                      <source src={item.media_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {item.caption && (
                    <p style={{marginTop: '10px', marginBottom: 0}}>{item.caption}</p>
                  )}
                </div>
              </LazyLoad>
            ))}
          </div>
        ) : (
          <p>No media to display</p>
        )}
      </Card>

      {selectedMediaIndex !== null && (
        <MediaModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          media={mediaToShow[selectedMediaIndex]}
          onNavigate={navigateMedia}
          useName={settings.username}
        />
      )}
    </div>
  );
}

export default Preview;
