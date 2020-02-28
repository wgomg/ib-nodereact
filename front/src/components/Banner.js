import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading } from './elements';
import { getBanners } from '../actions/banners';

const Banner = ({ board, getBanners, banners: { banners, loading } }) => {
  // if (board && board.length > 0)
  useEffect(() => {
    getBanners(board[0].board_id);
  }, [getBanners, board]);

  return <div>Banner</div>;
};

Banner.propTypes = {
  board: PropTypes.array.isRequired,
  getBanners: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  banners: state.banners
});

export default connect(mapStateToProps, { getBanners })(Banner);
