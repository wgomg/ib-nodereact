import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading, Image } from '../common';
import { getAllBanners } from '../../actions/banners';

const Banner = ({ board, getAllBanners, banners: { banners, loading } }) => {
  const thisBoard = board && board.length > 0 ? board[0] : {};

  const [boardBanners, setBoardBanners] = useState(null);

  const [hide, setHide] = useState(true);

  useEffect(() => {
    getAllBanners();
  }, [getAllBanners]);

  useEffect(() => {
    setBoardBanners(
      banners.filter((banner) => banner.board_id === thisBoard.board_id || banner.board_id === null)
    );
  }, [banners, thisBoard]);
  const bannerImg = boardBanners ? boardBanners[Math.floor(Math.random() * boardBanners.length)] : null;

  let imgSrc = null;
  let thumbSrc = null;
  if (bannerImg) {
    imgSrc = `/${bannerImg.image.folder}/${bannerImg.image.name}.${bannerImg.image.extension}`;
    thumbSrc = `/${bannerImg.image.thumb}`;
  }

  const bannerView = bannerImg ? (
    <div className='container centered'>
      <Image className='banner centered' src={thumbSrc} hide={!hide} onClick={() => setHide(!hide)} />
      <Image className='banner centered' src={imgSrc} hide={hide} onClick={() => setHide(!hide)} />
    </div>
  ) : (
    <h4 className='centered'>No hay banners</h4>
  );

  return loading ? <Loading /> : bannerView;
};

Banner.propTypes = {
  board: PropTypes.array,
  getAllBanners: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  banners: state.banners,
});

export default connect(mapStateToProps, { getAllBanners })(Banner);
