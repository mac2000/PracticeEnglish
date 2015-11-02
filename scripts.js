function User(data) {
    var self = this;
    ko.utils.extend(self, data);
    self.call = ko.computed(function() {
        return 'skype:' + self.Skype + '?call';
    });
    self.avatar = ko.computed(function () {
        return 'http://api.skype.com/users/' + self.Skype + '/profile/avatar';
    });
    self.countryIconClass = ko.computed(function () {
        return 'flag-icon flag-icon-' + self.Country.toLowerCase();
    });
}

function Model() {
    var self = this;

    self.connected = ko.observable(false);
    self.joined = ko.observable(false);

    self.users = ko.observableArray();

    self.skype = ko.observable(localStorage.getItem('skype'));
    self.age = ko.observable(localStorage.getItem('age'));
    self.country = ko.observable(localStorage.getItem('country'));
    self.topics = ko.observable(localStorage.getItem('topics'));
    self.user = ko.computed(function () {
        return {
            Skype: self.skype(),
            Age: self.age(),
            Country: self.country(),
            Topics: self.topics()
        };
    });

    self.isJoinFormVisible = ko.computed(function () {
        return self.connected() && !self.joined();
    });

    self.statusText = ko.computed(function () {
        if (!self.connected()) return 'Disconnected';
        else if (self.connected() && !self.joined()) return 'Away';
        else if (self.connected() && self.joined()) return 'Online';
    });

    self.status = ko.computed(function () {
        if (!self.connected()) return 'offline';
        else if (self.connected() && !self.joined()) return 'away';
        else if (self.connected() && self.joined()) return 'online';
    });

    //TODO: When there is no backend - jQuery.connection.chatHub IS UNDEFINED
    self.hub = jQuery.connection.chatHub;
    self.hub.client.userJoined = function (user) {
        if (self.joined() && user) self.users.push(new User(user));
    };
    self.hub.client.userLeaved = function (user) {
        if (self.joined() && user) self.users.remove(function (item) { return item.Skype === user.Skype });
    };
    self.join = function () {
        self.hub.server.join(self.user()).done(function () {
            self.joined(true);
            self.hub.server.list().done(function (users) {
                self.users(ko.utils.arrayMap(users, function (user) { return new User(user); }));
            });
        });
    };
    self.leave = function () {
        self.hub.server.leave(self.user()).done(function () {
            self.joined(false);
        });
    };

    //#region SignalR Hub
    jQuery.connection.hub.url = jQuery('#hub').attr('src');
    jQuery.connection.hub.start().done(function () {
        self.connected(true);
        self.joined(false);
        if (!localStorage.getItem('country')) {
            jQuery.getJSON('http://ipinfo.io', function (data) {
                if (data.country) {
                    self.country(data.country);
                }
            });
        }
    });
    jQuery.connection.hub.reconnecting(function () {
        self.connected(false);
        self.joined(false);
    });
    jQuery.connection.hub.reconnected(function () {
        self.connected(true);
        self.joined(false);
    });
    jQuery.connection.hub.disconnected(function () {
        self.connected(false);
        self.joined(false);
    });
    //#endregion

    //#region LocalStorage
    ['skype', 'age', 'country', 'topics'].forEach(function (key) {
        self[key].subscribe(function (value) {
            localStorage.setItem(key, value);
        });
    });
    //#endregion
}

var model = new Model();
ko.applyBindings(model);
