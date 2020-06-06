import React, { Fragment, useState, useEffect } from 'react';
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
    thumbSrc = `/${bannerImg.image.thumb}/${bannerImg.image.name}.${bannerImg.image.extension}`;
  }

  const bannerView = loading ? (
    <Loading />
  ) : (
    <Fragment>
      <Image className='banner centered' src={thumbSrc} hide={!hide} setHide={() => setHide(!hide)} />
      <Image className='banner centered' src={imgSrc} hide={hide} setHide={() => setHide(!hide)} />
    </Fragment>
  );

  return <div className='container centered'>{bannerView}</div>;
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
