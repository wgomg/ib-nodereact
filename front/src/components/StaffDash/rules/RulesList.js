import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../common';
import { deleteRule, getAllRules, getRules } from '../../../actions/rules';

const RulesList = ({
  getAllRules,
  getRules,
  deleteRule,
  boards: { boards },
  rules: { rules, loading },
  board_id,
}) => {
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

        const ruleBoard = boards.filter((board) => board.board_id === rule.board_id);

        const board = ruleBoard.length > 0 ? `/${ruleBoard[0].board.uri}/` : '[G]';

        const text = (
          <div className='col'>
            {board} - {rule.text}
          </div>
        );

        const banDuration = <div className='col-1'>{rule.ban_duration} hrs</div>;

        return (
          <div className='columns' key={rule.rule_id}>
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
  boards: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  rules: state.rules,
  boards: state.boards,
});

export default connect(mapStateToProps, { getAllRules, getRules, deleteRule })(RulesList);
