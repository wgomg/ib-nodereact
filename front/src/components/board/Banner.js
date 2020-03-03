import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading } from '../common';
import { getBanners } from '../../actions/banners';

import getImageBase64Data from '../../utils/getImageBase64Data';

const Banner = ({ board, getBanners, banners: { banners, loading } }) => {
  useEffect(() => {
    getBanners(board.board_id);
  }, [getBanners, board]);

  const bannerImg = banners ? banners[Math.floor(Math.random() * banners.length)] : null;

  const imgSrc = bannerImg ? getImageBase64Data(bannerImg) : null;

  const bannerElement =
    loading || !imgSrc ? <Loading /> : <img className='banner centered' src={imgSrc} alt='banner' />;

  return <div className='container centered'>{bannerElement}</div>;
};

Banner.propTypes = {
  board: PropTypes.object.isRequired,
  getBanners: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  banners: state.banners
});

export default connect(mapStateToProps, { getBanners })(Banner);
