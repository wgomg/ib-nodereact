import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../common';
import { deleteRule, getAllRules, getRules } from '../../../actions/rules';

import ReactTooltip from 'react-tooltip';

const RulesList = ({ getAllRules, getRules, deleteRule, rules: { rules, loading }, board_id }) => {
  useEffect(() => {
    if (board_id) getRules(board_id);
    else getAllRules();
  }, [getAllRules, getRules, board_id]);

  const rulesList =
    rules.length > 0 ? (
      rules.map((rule) => {
        const delRule = (
          <Link to='/staff/dash' onClick={() => deleteRule(rule.rule_id)}>
            borrar
          </Link>
        );

        const actions = (
          <div className='col-1'>
            <span className='small'>[ {delRule} ]</span>
          </div>
        );

        const text = <div className='col'>{rule.text}</div>;
        const banDuration = <div className='col-1'>{rule.ban_duration}</div>;

        return (
          <div className='columns' key={rule.rule_id} data-tip={rule.details}>
            {actions} {text} {banDuration}
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Reglas para mostrar</h4>
    );

  const newRule = (
    <Link to='dash/create-rule'>
      <span className='new-item'>[ nueva regla ]</span>
    </Link>
  );

  const cardContent = loading ? (
    <Loading />
  ) : (
    <Fragment>
      {rulesList}
      <ReactTooltip border={true} borderColor='#7da3b3' />
      {newRule}
    </Fragment>
  );

  return <Card title='Rules' content={cardContent} classes='col' />;
};

RulesList.propTypes = {
  getAllRules: PropTypes.func.isRequired,
  getRules: PropTypes.func.isRequired,
  deleteRule: PropTypes.func.isRequired,
  rules: PropTypes.object.isRequired,
  board_id: PropTypes.number,
};

const mapStateToProps = (state) => ({
  rules: state.rules,
});

export default connect(mapStateToProps, { getAllRules, getRules, deleteRule })(RulesList);
