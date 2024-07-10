// MediaModal.js
import React from 'react';
import Modal from 'react-modal';
import './MediaModal.scss';

const MediaModal = ({isOpen, onRequestClose, media, onNavigate, useName}) => {
  if (!media) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Media Details"
      className="MediaModal"
      overlayClassName="Overlay"
    >
      <button className="CloseButton" onClick={onRequestClose}>
        ×
      </button>
      <div className="MediaModalContent">
        <div className="MediaSection">
          {media.media_type === 'IMAGE' && (
            <img className="MediaItem" src={media.media_url} alt={media.caption} />
          )}
          {media.media_type === 'VIDEO' && (
            <video className="MediaItem" controls>
              <source src={media.media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="InfoSection">
          <div className={'Info'}>
            <strong>@{useName}</strong>
          </div>
          <p>{media.caption}</p>
        </div>
      </div>
      <button className="NavigateButton Prev" onClick={() => onNavigate('prev')}>
        ‹
      </button>
      <button className="NavigateButton Next" onClick={() => onNavigate('next')}>
        ›
      </button>
    </Modal>
  );
};

export default MediaModal;
