'use strict';

import React from 'react';
import SlackHandler from '../browser/slack-handler.js';

export default class MainTable extends React.Component {

  constructor(props) {
    super(props);
    this._slack = new SlackHandler();
    this.state = {
      dataList: this._slack,
    };
    this._slack.onRefresh = () => {
      this.setState({ dataList: this._slack });
    };
  }

  _onClickTableRow(event) {
    let target = event.target;
    let channelLink = undefined;
    while (target && !channelLink) {
      channelLink = target.getAttribute('data-item');
      target = target.parentElement;
    }
    if (channelLink) {
      document.location.href = channelLink;
    }
  }

  _renderTableRow(dataList) {
    return dataList.getChannels().map((channel, index) => {
      let rowClass = index % 2 ? 'even' : 'odd';
      if (channel.is_new) {
        rowClass += ' new';
      }
      return (
        <tr key={index} data-item={channel.link} onClick={this._onClickTableRow.bind(this)} className={rowClass}>
          <td data-title="date">{channel.date}</td>
          <td data-title="team">{channel.team}</td>
          <td data-title="channel">{channel.channel}</td>
          <td data-title="user">{channel.userName}</td>
          <td data-title="last-message">{channel.lastMessage}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className="main-table table-hover">
        <colgroup>
          <col className="date" />
          <col className="team" />
          <col className="channel" />
          <col className="user" />
          <col className="last-message" />
        </colgroup>
        <thead>
          <tr>
            <th>Date</th>
            <th>Team</th>
            <th>Channel</th>
            <th>User</th>
            <th>Last message</th>
          </tr>
        </thead>
        <tbody>
          {this._renderTableRow(this.state.dataList)}
        </tbody>
      </table>
    );
  }
}
