import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading, Image } from '../../common';
import { getBanners } from '../../../actions/banners';

const Banner = ({ board, getBanners, banners: { banners, loading } }) => {
  const [hide, setHide] = useState(true);

  useEffect(() => {
    getBanners();
  }, [getBanners, board]);

  const bannerImg = banners ? banners[Math.floor(Math.random() * banners.length)] : null;

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
  board: PropTypes.object.isRequired,
  getBanners: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  banners: state.banners,
});

export default connect(mapStateToProps, { getBanners })(Banner);
