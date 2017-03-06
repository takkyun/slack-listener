'use strict';

import slack from 'slack';
import Storage from 'electron-json-storage';

const ChannelCache = 'channel_cache';
const UserCache = 'user_cache';
const AppConfig = require('../assets/conf.json');
const MIN_IN_SEC = 60;
const HOUR_IN_SEC = MIN_IN_SEC * 60;
const DAY_IN_SEC = HOUR_IN_SEC * 24;
const CHANNEL_UPDATE_IN_MSEC = 2000;
const TEAM_UPDATE_IN_MSEC = 60 * CHANNEL_UPDATE_IN_MSEC;
const MAX_REFRESH_WAIT_IN_MSEC = 5000;

export default class SlackHandler {

  constructor() {
    this.onRefresh = null;
    this._sortedChannelIds = [];
    this._channels = {};
    this._users = {};
    this._teams = {};
    this._tokens = AppConfig['tokens'];
    this._updatedTime = new Date();
    this._loadCache(() => {
      this._updateTeam();
    });
  }

  getChannels() {
    return this._sortedChannelIds.map((channelId) => {
      const channel = this._channels[channelId];
      return {
        id: channel.id,
        team: channel.team,
        channel: channel.name,
        is_new: channel.is_new,
        link: this._deeplink(channel.team,channel.id),
        date: this._formatedDate(channel.last_message.post_time),
        userName: this.getUser(channel.last_message.user_id),
        lastMessage: channel.last_message.text,
      };
    });
  }

  getSize() {
    return this._sortedChannelIds.length;
  }

  getUser(userId) {
    return this._users[userId];
  }

  _loadCache(callback) {
    Promise
      .resolve()
      .then(() => {
        Storage.get(ChannelCache,(error, data) => {
          if (error) {
            console.log(error);
          }
          else {
            this._channels = data;
          }
          return Promise.resolve();
        });
      })
      .then(() => {
        Storage.get(UserCache,(error, data) => {
          if (error) {
            console.log(error);
          }
          else {
            this._users = data;
          }
          return Promise.resolve();
        });
      })
      .then(callback);
  }

  _cacheChannels() {
    Storage.set(ChannelCache,this._channels,(error, data) => {
      if (error) console.log(error);
    });
  }

  _cacheUsers() {
    Storage.set(UserCache,this._users,(error, data) => {
      if (error) console.log(error);
    });
  }

  _formatedDate(date) {
    if (!date) return '';
    const base = Math.round(this._updatedTime.getTime() / 1000);
    const diff = base - date;
    if (diff > DAY_IN_SEC) {
      const day = Math.floor( diff / DAY_IN_SEC );
      if (day > 1) {
        return day + ' days ago';
      }
      return 'Yesterday';
    }
    if (diff > HOUR_IN_SEC) {
      const hour = Math.floor( diff / HOUR_IN_SEC );
      if (hour > 1) {
        return hour + ' hours ago';
      }
      return '1 hour ago';
    }
    const min = Math.floor( diff / MIN_IN_SEC );
    if (min > 1) {
      return min + ' mins ago';
    }
    return min + ' min ago';
  }

  _deeplink(team,channel) {
    if (!this._teams[team]) return 'slack://open';
    return 'slack://channel?team=' + this._teams[team] + '&id=' + channel;
  }

  _handleRefresh(forceRefresh) {
    const now = new Date();
    if (forceRefresh || this._updatedTime.getTime() + MAX_REFRESH_WAIT_IN_MSEC < now.getTime()) {
      this._updatedTime = now;
      if (this.onRefresh) {
        this.onRefresh();
      }
    }
  }

  _sortData() {
    let channelIds = Object.keys(this._channels);
    channelIds = channelIds.filter((id) => {
      return !this._channels[id].is_ignored;
    });
    channelIds.sort((idA, idB) => {
      const dateA = this._channels[idA].last_message.post_time;
      const dateB = this._channels[idB].last_message.post_time;
      return dateB - dateA;
    });
    this._sortedChannelIds = channelIds;
    this._handleRefresh(true);
  }

  _updateTeam() {
    Object.keys(this._tokens).forEach((key) => {
      this._getTeamInfo(key);
      this._updateChannels(key);
    });
  }

  _updateChannels(team) {
    slack.groups.list({token: this._tokens[team]}, (error, data) => {
      if (error) {
        console.log(error);
        this._sortData();
        return;
      }
      data.groups.forEach((channelInfo, index, array) => {
        this._getChannelInfo(team, channelInfo.id);
        if (index == array.length - 1) {
          this._reserveNextListUpdate(team);
        }
      });
    });
  }

  _reserveNextListUpdate(team) {
    setTimeout(() => {
      this._updateChannels(team);
    }, TEAM_UPDATE_IN_MSEC);
  }

  _getChannelInfo(team, channelId) {
    const param = {
      token: this._tokens[team],
      channel: channelId,
    };
    slack.groups.info(param, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      const channel = {
        id: data.group.id,
        team: team,
        name: data.group.name,
        is_new: data.group.unread_count > 0,
        is_ignored: SlackHandler.shouldIgnoreChannel(data.group),
        last_message: SlackHandler.convertMessage(data.group.latest),
      };
      const cache = this._channels[channel.id];
      this._channels[channel.id] = channel;
      if (!cache || cache.last_message.post_time != channel.last_message.post_time) {
        this._cacheChannels();
        this._sortData();
      }
      else {
        this._handleRefresh(false);
      }
      if (!this._users[channel.last_message.user_id]) {
        this._getUserInfo(team, channel.last_message.user_id);
      }
      if (!channel.is_ignored) {
        this._reserveNextChannelUpdate(team, channel.id);
      }
    });
  }

  _reserveNextChannelUpdate(team, channelId) {
    // making delay randomized so that we do fetch channel info inconsistently.
    setTimeout(() => {
      this._getChannelInfo(team, channelId);
    }, CHANNEL_UPDATE_IN_MSEC + (Math.random() - 0.5) * 500);
  }

  _getTeamInfo(team) {
    slack.team.info({token: this._tokens[team]}, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      this._teams[team] = data.team.id;
    });
  }

  _getUserInfo(team, userId) {
    const updateName = (name) => {
      this._users[userId] = name;
      this._cacheUsers();
      this._handleRefresh(true);
    };
    let param = { token: this._tokens[team] };
    if (userId.startsWith('user_')) {
      param.user = userId.replace(/^user_/,'');
      slack.users.info(param, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        updateName(data.user.name);
      });
    }
    else if (userId.startsWith('bot_')) {
      param.bot = userId.replace(/^bot_/,'');
      slack.bots.info(param, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        updateName(data.bot.name);
      });
    }
  }

  static convertMessage(info) {
    let userId = info.user ? 'user_' + info.user : undefined;
    if (!userId && info.bot_id) {
      userId = 'bot_' + info.bot_id;
    }
    return {
      user_id: userId,
      post_time: info.ts,
      text: info.text.replace(/\n/,' '),
    };
  }

  static shouldIgnoreChannel(info) {
    if (info.is_archived) return true;
    const ignore = AppConfig['ignore'];
    for (let i=0,n=ignore.length;i<n;i++) {
      if (info.name.indexOf(ignore[i]) > -1) return true;
    }
    return false;
  }

}
