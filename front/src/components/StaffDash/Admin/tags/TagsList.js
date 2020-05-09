import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../../common';
import { getTags, deleteTag } from '../../../../actions/tags';

import ReactTooltip from 'react-tooltip';

const TagsList = ({ getTags, deleteTag, tags: { tags, loading } }) => {
  useEffect(() => {
    getTags();
  }, [getTags]);

  const tagsList =
    tags.length > 0 ? (
      tags.map((tag) => {
        const delTag = (
          <Link to='/staff/dash' onClick={(e) => deleteTag(tag.tag_id)}>
            borrar
          </Link>
        );

        const actions = (
          <div className='col-1'>
            <span className='small'>[ {delTag} ]</span>
          </div>
        );

        const tg = <div className='col-1'>{tag.tag}</div>;

        const result = (
          <div
            className='col-1'
            dangerouslySetInnerHTML={{ __html: tag.op_replacer + 'O' + tag.cl_replacer }}
          />
        );

        const replacer = <div className='col'>{tag.op_replacer}</div>;

        const css = (
          <div className='col-1' data-tip={tag.css}>
            {tag.css ? 'css' : ''}
          </div>
        );

        return (
          <div className='columns' key={tag.tag_id}>
            {actions} {tg} {result} {replacer} {css}
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Tags para mostrar</h4>
    );

  const newTag = (
    <Link to='dash/create-tag'>
      <span className='new-item'>[ nuevo tag ]</span>
    </Link>
  );

  const cardContent = loading ? (
    <Loading />
  ) : (
    <Fragment>
      {tagsList}
      <ReactTooltip border={true} borderColor='#7da3b3' />
      {newTag}
    </Fragment>
  );

  return <Card title='Tags' content={cardContent} classes='col' />;
};

TagsList.propTypes = {
  getTags: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  tags: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  tags: state.tags,
});

export default connect(mapStateToProps, { getTags, deleteTag })(TagsList);
