import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../common';
import { getBanners, deleteBanner, getBoardBanners } from '../../../actions/banners';

import prettyBytes from '../../../utils/prettyBytes';

const BannersList = ({
  getBanners,
  getBoardBanners,
  deleteBanner,
  banners: { banners, loading },
  board_id,
}) => {
  useEffect(() => {
    if (board_id) getBoardBanners(board_id);
    else getBanners();
  }, [getBanners, getBoardBanners, board_id]);

  const bannersList =
    banners.length > 0 ? (
      banners.map((banner) => {
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
            <Link
              to={'/' + banner.image.folder + '/' + banner.image.name + '.' + banner.image.extension}
            >
              {banner.image.name}.{banner.image.extension}
            </Link>
          </div>
        );

        const size = <div className='col-1'>{prettyBytes(banner.image.size)}</div>;

        const board = <div className='col-1'>{banner.board ? banner.board.uri : 'global'}</div>;

        return (
          <div className='columns' key={banner.banner_id}>
            {actions} {name} {size} {!board_id && board}
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
  getBoardBanners: PropTypes.func.isRequired,
  deleteBanner: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired,
  board_id: PropTypes.number,
};

const mapStateToProps = (state) => ({
  banners: state.banners,
});

export default connect(mapStateToProps, { getBanners, getBoardBanners, deleteBanner })(BannersList);
