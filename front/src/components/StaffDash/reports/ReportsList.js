import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../common';
import { getAllReports, getReports } from '../../../actions/reports';

import ReactTooltip from 'react-tooltip';

const ReportsList = ({ getAllReports, getReports, reports: { reports, loading }, board_id }) => {
  useEffect(() => {
    if (board_id) getReports(board_id);
    else getAllReports();
  }, [getAllReports, getReports, board_id]);

  const reportsList =
    reports.length > 0 ? (
      reports.map((report) => {
        const updateSolved = <Link to='/staff/dash'>aplicar ban</Link>;

        const actions = (
          <div className='col-2'>
            <span className='small'>[ {updateSolved} ]</span>
          </div>
        );

        const postText = report.post.text.map((elem, index) => {
          if (/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/g.test(elem))
            return (
              <div
                style={{ display: 'inline-grid' }}
                dangerouslySetInnerHTML={{ __html: elem }}
                key={index}
              />
            );

          return elem;
        });

        const post = (
          <div className='col-1' data-tip data-for={'rt' + report.report_id}>
            <Link to={`/${report.post.board[0].uri}/t${report.post.thread_id}#p${report.post.post_id}`}>
              {report.post.post_id}
            </Link>
          </div>
        );
        const rule = <div className='col'>{report.text}</div>;
        const duration = <div className='col-1'>{report.duration}</div>;

        return (
          <div className='columns' key={report.report_id}>
            {actions} {post} {rule} {duration}
            <ReactTooltip
              className='tooltip'
              id={'rt' + report.report_id}
              place='right'
              type='dark'
              effect='solid'
              border={true}
              borderColor='#7da3b3'
            >
              <div className='post-text'>{postText}</div>
            </ReactTooltip>
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Reportes para mostrar</h4>
    );

  const cardContent = loading ? <Loading /> : reportsList;

  return <Card title='Reportes' content={cardContent} classes='col' />;
};

ReportsList.propTypes = {
  getAllReports: PropTypes.func.isRequired,
  getReports: PropTypes.func.isRequired,
  reports: PropTypes.object.isRequired,
  board_id: PropTypes.number,
};

const mapStateToProps = (state) => ({
  reports: state.reports,
});

export default connect(mapStateToProps, { getAllReports, getReports })(ReportsList);
