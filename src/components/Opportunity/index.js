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
import themeable from 'instructure-ui/lib/themeable';
import formatMessage from '../../format-message';
import moment from 'moment-timezone';
import { getFullDateAndTime } from '../../utilities/dateUtils';
import Button from 'instructure-ui/lib/components/Button';
import Link from 'instructure-ui/lib/components/Link';
import Pill from 'instructure-ui/lib/components/Pill';
import PresentationContent from 'instructure-ui/lib/components/PresentationContent';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import IconXLine from 'instructure-icons/lib/Line/IconXLine';
import { string, number, func, object } from 'prop-types';
import styles from './styles.css';
import theme from './theme.js';

export class Opportunity extends Component {
  static propTypes = {
    id: string.isRequired,
    dueAt: string.isRequired,
    points: number,
    courseName: string.isRequired,
    opportunityTitle: string.isRequired,
    timeZone: string.isRequired,
    url: string.isRequired,
    dismiss: func.isRequired,
    plannerOverride: object,
  }

  constructor (props) {
    super(props);

    const tzMomentizedDate = moment.tz(props.dueAt, props.timeZone);
    this.fullDate = getFullDateAndTime(tzMomentizedDate);
  }

  render () {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.oppName}>
            {this.props.courseName}
          </div>
          <div className={styles.title}>
            <Link href={this.props.url}>{this.props.opportunityTitle}</Link>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.status}>
            <Pill text={formatMessage('Missing')} variant="danger"/>
            <div className={styles.due}>
              <span className={styles.dueText}>
                {formatMessage('Due:')}</span> {this.fullDate}
            </div>
          </div>
          <div className={styles.points}>
            <ScreenReaderContent>
               {formatMessage("{points} points", {points: this.props.points})}
            </ScreenReaderContent>
            <PresentationContent>
              <span className={styles.pointsNumber}>
                {this.props.points}
              </span>
              {formatMessage("points")}
            </PresentationContent>
          </div>
        </div>
        <div className={styles.close}>
          <Button
            onClick={() => this.props.dismiss(this.props.id, this.props.plannerOverride)}
            variant="icon"
            size="small"
          >
            <IconXLine
              className={styles.closeButtonIcon}
              title={formatMessage("Dismiss {opportunityName}", {opportunityName: this.props.opportunityTitle})}
            />
          </Button>
        </div>
      </div>
    );
  }
}

export default themeable(theme, styles)(Opportunity);
