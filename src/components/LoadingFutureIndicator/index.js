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
import {bool, func, string} from 'prop-types';
import Button from 'instructure-ui/lib/components/Button';
import Container from 'instructure-ui/lib/components/Container';
import Spinner from 'instructure-ui/lib/components/Spinner';
import Typography from 'instructure-ui/lib/components/Typography';
import ErrorAlert from '../ErrorAlert';
import Waypoint from 'react-waypoint';
import formatMessage from '../../format-message';

export default class LoadingFutureIndicator extends Component {
  static propTypes = {
    loadingFuture: bool,
    allFutureItemsLoaded: bool,
    onLoadMore: func,
    loadingError: string,
  }

  static defaultProps: {
    loadingFuture: false,
    allFutureItemsLoaded: false,
    onLoadMore: () => {},
    loadingError: undefined,
  }

  handleLoadMoreButton = () => {
    this.props.onLoadMore({});
  }

  handleWaypoint = () => {
    if (!this.props.loadingError) {
      this.props.onLoadMore();
    }
  }

  renderLoadMore () {
    if (!this.props.loadingFuture && !this.props.allFutureItemsLoaded) {
      return <Button variant="link" onClick={this.handleLoadMoreButton}>
        {formatMessage('Load more')}
      </Button>;
    }
  }

  renderError () {
    if (this.props.loadingError) {
      // Show an Alert for the user, while including the underlying root cause error
      // in a hidden div in case we need to know what it was
      return (
        <div style={{width: '50%', margin: '0 auto'}}>
          <ErrorAlert error={this.props.loadingError}>
            {formatMessage('Error loading more items')}
          </ErrorAlert>
        </div>
      );
    }
  }

  renderLoading () {
    if (this.props.loadingFuture && !this.props.allFutureItemsLoaded) {
      return <Container>
        <Container display="inline">
          <Spinner size="small" margin="0 x-small 0 0" title={formatMessage('Loading...')} />
        </Container>
        <Typography size="small" color="secondary">
          {formatMessage('Loading...')}</Typography>
      </Container>;
    }
  }

  renderEverythingLoaded () {
    if (this.props.allFutureItemsLoaded) {
      return <Typography color="secondary" size="small">
        {formatMessage('All items loaded')}</Typography>;
    }
  }

  renderWaypoint () {
    if (!this.props.loadingFuture && !this.props.allFutureItemsLoaded){
      return <Waypoint onEnter={this.handleWaypoint} />;
    }
  }

  render () {
    return <div>
      {this.renderWaypoint()}
      <Container as="div" padding="x-large" textAlign="center">
        {this.renderError()}
        {this.renderLoadMore()}
        {this.renderLoading()}
        {this.renderEverythingLoaded()}
      </Container>
    </div>;
  }
}
