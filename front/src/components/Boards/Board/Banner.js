import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading, Image } from '../../common';
import { getBanners } from '../../../actions/banners';

const Banner = ({ board, getBanners, banners: { banners, loading } }) => {
  useEffect(() => {
    getBanners();
  }, [getBanners, board]);

  const bannerImg = banners ? banners[Math.floor(Math.random() * banners.length)] : null;

  const imgSrc = bannerImg
    ? `/${bannerImg.image.folder}/${bannerImg.image.name}.${bannerImg.image.extension}`
    : null;

  const bannerView = loading ? <Loading /> : <Image className='banner centered' src={imgSrc} />;

  return <div className='container centered'>{bannerView}</div>;
};

Banner.propTypes = {
  board: PropTypes.object.isRequired,
  getBanners: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  banners: state.banners,
});

export default connect(mapStateToProps, { getBanners })(Banner);
