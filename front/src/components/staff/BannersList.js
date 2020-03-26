import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../common';
import { getBanners, deleteBanner } from '../../actions/banners';

import prettyBytes from '../../utils/prettyBytes';

const BannersList = ({ getBanners, deleteBanner, banners: { banners, loading } }) => {
  useEffect(() => {
    getBanners();
  }, [getBanners]);

  const bannersList =
    !loading && banners ? (
      banners.map(banner => {
        const delBanner = (
          <Link to='/staff/dash' onClick={() => deleteBanner(banner.banner_id)}>
            borrar
          </Link>
        );
        const editBanner = <Link to={`dash/edit-banner/${banner.banner_id}`}>editar</Link>;

        const actions = (
          <div className='col-2'>
            <span className='small'>
              [ {delBanner} | {editBanner} ]
            </span>
          </div>
        );

        const name = (
          <div className='col'>
            <Link to={banner.uri.replace('data/image', '/src')}>
              {banner.name}.{banner.contentType.split('/')[1]}
            </Link>
          </div>
        );

        const size = <div className='col-1'>{prettyBytes(banner.size)}</div>;

        const board = <div className='col-1'>{banner.board ? banner.board : 'global'}</div>;

        return (
          <div className='columns' key={banner.banner_id}>
            {actions} {name} {size} {board}
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Banners para mostrar</h4>
    );

  const newBanner = (
    <Link to='dash/create-banner'>
      <span className='new-item'>[ nuevo banner ]</span>
    </Link>
  );

  const cardContent = loading ? (
    <Loading />
  ) : (
    <Fragment>
      {bannersList}
      {newBanner}
    </Fragment>
  );

  return <Card title='Banners' content={cardContent} classes='col' />;
};

BannersList.propTypes = {
  getBanners: PropTypes.func.isRequired,
  deleteBanner: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  banners: state.banners
});

export default connect(mapStateToProps, { getBanners, deleteBanner })(BannersList);
