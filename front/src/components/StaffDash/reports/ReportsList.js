import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../common';
import { getAllReports, getReports, discardReport } from '../../../actions/reports';
import { applyBan } from '../../../actions/ban';

import ReactTooltip from 'react-tooltip';

const ReportsList = ({
  getAllReports,
  getReports,
  discardReport,
  applyBan,
  reports: { reports, loading },
  auth: { staff },
  board_id,
}) => {
  useEffect(() => {
    if (board_id) getReports(board_id);
    else getAllReports();
  }, [getAllReports, getReports, board_id]);

  const onBanClick = (report) => {
    const newBan = {
      staff_id: staff.staff_id,
      report_id: report.report_id,
    };

    const res = applyBan(newBan);

    if (res) alert('Ban applied');
  };

  const onDiscardReportClick = (report) => {
    discardReport({ report_id: report.report_id });
  };

  const reportsList =
    reports.length > 0 ? (
      reports.map((report) => {
        const banear = (
          <Link to='#' onClick={() => onBanClick(report)}>
            banear
          </Link>
        );

        const descartar = (
          <Link to='#' onClick={() => onDiscardReportClick(report)}>
            descartar
          </Link>
        );

        const actions = (
          <div className='col-2'>
            <span className='small'>
              [ {banear} | {descartar} ]
            </span>
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

        const rule = (
          <div className='col-3'>
            {report.rule.board_id ? `/${report.post.board[0].uri}/ - ` : '[G] - ' + report.rule.text}
          </div>
        );

        const post = (
          <div className='col-1' data-tip data-for={'rt' + report.report_id}>
            <Link to={`/${report.post.board[0].uri}/t${report.post.thread_id}#p${report.post.post_id}`}>
              >>{report.post.post_id}
            </Link>
          </div>
        );

        const duration = (
          <div className='col-1'>
            {report.rule.ban_duration === 0 ? '&P' : report.rule.ban_duration + ' hrs'}
          </div>
        );

        const user = (
          <div className='col-1'>
            <span className='small muted'>
              {report.post.user
                ? report.post.user.ipaddress + '::' + report.post.user.fingerprint
                : 'expired'}
            </span>
          </div>
        );

        return (
          <div className='columns' key={report.report_id}>
            {actions} {rule} {post} {duration} {user}
            <ReactTooltip
              className='tooltip'
              id={'rt' + report.report_id}
              place='right'
              type='dark'
              effect='solid'
              border={true}
              borderColor='#7da3b3'>
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
  discardReport: PropTypes.func.isRequired,
  applyBan: PropTypes.func.isRequired,
  reports: PropTypes.object.isRequired,
  board_id: PropTypes.number,
};

const mapStateToProps = (state) => ({
  reports: state.reports,
  auth: state.auth,
});

export default connect(mapStateToProps, { getAllReports, getReports, discardReport, applyBan })(
  ReportsList
);
