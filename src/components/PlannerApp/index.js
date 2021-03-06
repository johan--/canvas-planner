/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import { arrayOf, oneOfType, bool, object, string, number, func } from 'prop-types';
import { momentObj } from 'react-moment-proptypes';
import Day from '../Day';
import ShowOnFocusButton from '../ShowOnFocusButton';
import StickyButton from '../StickyButton';
import LoadingFutureIndicator from '../LoadingFutureIndicator';
import LoadingPastIndicator from '../LoadingPastIndicator';
import PlannerEmptyState from '../PlannerEmptyState';
import formatMessage from '../../format-message';
import {loadFutureItems, scrollIntoPast, loadPastUntilNewActivity, togglePlannerItemCompletion, updateTodo} from '../../actions';
import {getFirstLoadedMoment} from '../../utilities/dateUtils';
import {notifier} from '../../dynamic-ui';

export class PlannerApp extends Component {
  static propTypes = {
    days: arrayOf(
      arrayOf(
        oneOfType([/* date */ string, arrayOf(/* items */ object)])
      )
    ),
    timeZone: string,
    isLoading: bool,
    loadingPast: bool,
    loadingError: string,
    allPastItemsLoaded: bool,
    loadingFuture: bool,
    allFutureItemsLoaded: bool,
    firstNewActivityDate: momentObj,
    scrollIntoPast: func,
    loadPastUntilNewActivity: func,
    loadFutureItems: func,
    stickyOffset: number, // in pixels
    stickyZIndex: number,
    changeToDashboardCardView: func,
    togglePlannerItemCompletion: func,
    updateTodo: func,
    triggerDynamicUiUpdates: func,
    preTriggerDynamicUiUpdates: func,
  };

  static defaultProps = {
    isLoading: false,
    stickyOffset: 0,
    triggerDynamicUiUpdates: () => {},
    preTriggerDynamicUiUpdates: () => {},
  };

  componentWillUpdate () {
    this.props.preTriggerDynamicUiUpdates(this.fixedElement);
  }

  componentDidUpdate () {
    this.props.triggerDynamicUiUpdates(this.fixedElement);
  }

  fixedElementRef = (elt) => {
    this.fixedElement = elt;
  }

  handleNewActivityClick = () => {
    this.props.loadPastUntilNewActivity();
  }

  renderLoading () {
    return <Container
      display="block"
      padding="xx-large medium"
      textAlign="center"
    >
      <Spinner
        title={formatMessage('Loading planner items')}
        size="medium"
      />
    </Container>;
  }

  renderNewActivity () {
    if (this.props.isLoading) return;
    if (!this.props.firstNewActivityDate) return;

    const firstLoadedMoment = getFirstLoadedMoment(this.props.days, this.props.timeZone);
    if (firstLoadedMoment.isSame(this.props.firstNewActivityDate) || firstLoadedMoment.isBefore(this.props.firstNewActivityDate)) return;

    return (
      <StickyButton
        direction="up"
        onClick={this.handleNewActivityClick}
        offset={this.props.stickyOffset + 'px'}
        zIndex={this.props.stickyZIndex}
      >
        {formatMessage("New Activity")}
      </StickyButton>
    );
  }

  renderLoadingPast () {
    return <LoadingPastIndicator
      loadingPast={this.props.loadingPast}
      allPastItemsLoaded={this.props.allPastItemsLoaded}
      loadingError={this.props.loadingError} />;
  }

  renderLoadMore () {
    if (this.props.isLoading) return;
    return <LoadingFutureIndicator
      loadingFuture={this.props.loadingFuture}
      allFutureItemsLoaded={this.props.allFutureItemsLoaded}
      loadingError={this.props.loadingError}
      onLoadMore={this.props.loadFutureItems} />;
  }

  renderNoAssignments() {
    return <PlannerEmptyState changeToDashboardCardView={this.props.changeToDashboardCardView}/>;
  }

  renderBody (children) {

    if (children.length === 0) {
      return <div>
        {this.renderNewActivity()}
        {this.renderNoAssignments()}
      </div>;
    }

    return <div className="PlannerApp">
      {this.renderNewActivity()}
      <ShowOnFocusButton
        buttonProps={{
          onClick: this.props.scrollIntoPast
        }}
      >
        {formatMessage('Load prior dates')}
      </ShowOnFocusButton>
      {this.renderLoadingPast()}
      {children}
      {this.renderLoadMore()}
      <div id="planner-app-fixed-element" ref={this.fixedElementRef} />
    </div>;
  }

  render () {
    if (this.props.isLoading) {
      return this.renderBody(this.renderLoading());
    }

    const children = this.props.days.map(([dayKey, dayItems], dayIndex) => {
      return <Day
        timeZone={this.props.timeZone}
        day={dayKey}
        itemsForDay={dayItems}
        animatableIndex={dayIndex}
        key={dayKey}
        toggleCompletion={this.props.togglePlannerItemCompletion}
        updateTodo={this.props.updateTodo}
      />;
    });

    return this.renderBody(children);
  }
}

const mapStateToProps = (state) => {
  return {
    days: state.days,
    isLoading: state.loading.isLoading,
    loadingPast: state.loading.loadingPast,
    allPastItemsLoaded: state.loading.allPastItemsLoaded,
    loadingFuture: state.loading.loadingFuture,
    allFutureItemsLoaded: state.loading.allFutureItemsLoaded,
    loadingError: state.loading.loadingError,
    firstNewActivityDate: state.firstNewActivityDate,
    timeZone: state.timeZone,
  };
};

const mapDispatchToProps = {loadFutureItems, scrollIntoPast, loadPastUntilNewActivity, togglePlannerItemCompletion, updateTodo};
export default notifier(connect(mapStateToProps, mapDispatchToProps)(PlannerApp));
