import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading, Image } from '../../common';
import { getBanners } from '../../../actions/banners';

const Banner = ({ board, getBanners, banners: { banners, loading } }) => {
  useEffect(() => {
    getBanners(board.board_id);
  }, [getBanners, board]);

  const bannerImg = banners ? banners[Math.floor(Math.random() * banners.length)] : null;

  const imgSrc = bannerImg ? bannerImg.uri.replace('data/image', '/src') : '';

  const bannerElement =
    loading || !imgSrc ? <Loading /> : <Image className='banner centered' src={imgSrc} />;

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
