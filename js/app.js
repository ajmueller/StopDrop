var StopDrop = StopDrop || {};
var Global = Global || {};
var Commodal = Commodal || {};

StopDrop.watches = [];
StopDrop.currentVersion = '1.4.2';
StopDrop.singleWatch = 'false';
StopDrop.trackImmediately = 'false';

/* -------------------- TIME FUNCTIONS -------------------- */
// Starts tracking for a watch
StopDrop.startTime = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        $watch = $('#' + id),
        $pause = $watch.find('.pause'),
        $start = $watch.find('.start'),
        $time = $watch.find('.time'),
        sessionStart = Math.floor((new Date()).getTime() / 1000),
        $trackingWatches = $('.tracking');

    // pause all watches that are tracking
    if (StopDrop.singleWatch === 'true') {
        $trackingWatches.each(function() {
            var $this = $(this);

            Global.currentAction = {
                "action" : StopDrop.pauseTime,
                "id" : $this.attr('id')
            };

            StopDrop.pauseTime();
        });
    }

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET sessionStart = ' + sessionStart + ', tracking = "true" WHERE id = ' + id);
    }, StopDrop.errorHandler, function() {
        $watch.addClass('tracking');
        $pause.removeClass('hide');
        $start.addClass('hide');
        $time.text("Tracking...");
    });
};

// Pauses tracking for a watch
StopDrop.pauseTime = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        $watch = $('#' + id),
        $pause = $watch.find('.pause'),
        $start = $watch.find('.start'),
        sessionStart,
        sessionEnd = Math.floor((new Date()).getTime() / 1000),
        sessionTime,
        totalTime;

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM watch WHERE id = ' + id, [], function(tx, results) {
            var i,
                len = results.rows.length;

            for (i = 0; i < len; i++) {
                sessionStart = results.rows.item(i).sessionStart;
                sessionTime = sessionEnd - sessionStart;
                totalTime = results.rows.item(i).totalTime;
            }

            totalTime += sessionTime;
        });
    }, StopDrop.errorHandler);

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET sessionEnd = ' + sessionEnd + ', sessionTime = ' + sessionTime + ', totalTime = ' + totalTime + ', tracking = "false" WHERE id = ' + id);
    }, StopDrop.errorHandler, function() {
        StopDrop.calcTime(id, totalTime);
        StopDrop.calcTotalTime();
        $watch.removeClass('tracking');
        $pause.addClass('hide');
        $start.removeClass('hide');
    });
};

// Pauses the time for all watches
StopDrop.pauseAll = function() {
    $('.stopwatch').each(function() {
        var $this = $(this);

        if ($this.is('.tracking')) {
            Global.currentAction = {
                "action" : StopDrop.pauseTime,
                "id" : $this.attr('id')
            };
            StopDrop.pauseTime();
        }
    });

    StopDrop.calcTotalTime();
};

// Adds 15 minutes for a watch
StopDrop.addTime = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        $watch = $('#' + id),
        totalTime;

    if ($watch.is('.tracking')) {
        StopDrop.pauseTime();
    }

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM watch WHERE id = ' + id, [], function(tx, results) {
            var i,
                len = results.rows.length;

            for (i = 0; i < len; i++) {
                totalTime = results.rows.item(i).totalTime;
            }

            totalTime += 900;
        });
    }, StopDrop.errorHandler);

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET totalTime = ' + totalTime + ', tracking = "false" WHERE id = ' + id);
    }, StopDrop.errorHandler, function() {
        StopDrop.calcTime(id, totalTime);
        StopDrop.calcTotalTime();
    });
};

// Subtracts 15 minutes for a watch
StopDrop.subtractTime = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        $watch = $('#' + id),
        totalTime;

    if ($watch.is('.tracking')) {
        StopDrop.pauseTime();
    }

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM watch WHERE id = ' + id, [], function(tx, results) {
            var i,
                len = results.rows.length;

            for (i = 0; i < len; i++) {
                totalTime = results.rows.item(i).totalTime;
            }

            if (totalTime >= 900) {
                totalTime -= 900;
            }
        });
    }, StopDrop.errorHandler);

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET totalTime = ' + totalTime + ', tracking = "false" WHERE id = ' + id);
    }, StopDrop.errorHandler, function() {
        StopDrop.calcTime(id, totalTime);
        StopDrop.calcTotalTime();
    });
};

// Resets the time for a watch
StopDrop.resetTime = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id;

    if (Global.currentAction.confirm) {
        Global.currentAction.confirm = false;

        StopDrop.pauseTime();

        db.transaction(function(tx) {
            tx.executeSql('UPDATE watch SET sessionStart = 0, sessionEnd = 0, sessionTime = 0, totalTime = 0 WHERE id = ' + id);
            StopDrop.calcTime(id, 0);
        }, StopDrop.errorHandler, function() {
            Commodal.close();
        });

        StopDrop.calcTotalTime();
    }
    else {
        Commodal.confirm('Are you sure you want to reset this watch?');
    }
};

// Resets the time for all watches
StopDrop.resetAll = function() {
    if (Global.currentAction.confirm) {
        Global.currentAction.confirm = false;

        $('.stopwatch').each(function() {
            var db = StopDrop.db,
                id = $(this).attr('id');

            Global.currentAction = {
                "action" : StopDrop.pauseTime,
                "id" : id
            };

            StopDrop.pauseTime();

            db.transaction(function(tx) {
                tx.executeSql('UPDATE watch SET sessionStart = 0, sessionEnd = 0, sessionTime = 0, totalTime = 0 WHERE id = ' + id);
                StopDrop.calcTime(id, 0);
            }, StopDrop.errorHandler, function() {
                Commodal.close();
            });
        });

        StopDrop.calcTotalTime();
    }
    else {
        Commodal.confirm('Are you sure you want to reset all watches?');
    }
};

// Expands the view for all watches
StopDrop.expandAll = function() {
    $('.stopwatch').each(function() {
        var db = StopDrop.db,
            $watch = $(this),
            id = $watch.attr('id');

        $watch.removeClass('collapsed');

        db.transaction(function(tx) {
            tx.executeSql('UPDATE watch SET collapsed = "false" WHERE id = ' + id);
        }, StopDrop.errorHandler, function() {
            Commodal.close();
        });
    });
};

// Collapses the view for all watches
StopDrop.collapseAll = function() {
    $('.stopwatch').each(function() {
        var db = StopDrop.db,
            $watch = $(this),
            id = $watch.attr('id');

        $watch.addClass('collapsed');

        db.transaction(function(tx) {
            tx.executeSql('UPDATE watch SET collapsed = "true" WHERE id = ' + id);
        }, StopDrop.errorHandler, function() {
            Commodal.close();
        });
    });
};

// Toggles the collapsed view for the specified watch
StopDrop.toggleCollapsed = function() {
    var id = Global.currentAction.id,
        db = StopDrop.db,
        $watch = $('#' + id),
        collapsed;

    if ($watch.is('.collapsed')) {
        $watch.removeClass('collapsed');
        collapsed = "false";
    }
    else {
        $watch.addClass('collapsed');
        collapsed = "true";
    }

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET collapsed = "' + collapsed + '" WHERE id = ' + id);
    }, StopDrop.errorHandler);
};

// Calculates the time for a given watch
StopDrop.calcTime = function(id, time) {
    var $time = $('#' + id).find('.time'),
        hours = Math.floor(time / 3600),
        quarters = Math.round((time % 3600) / 900),
        minutes = Math.floor((time % 3600) / 60),
        seconds = (time % 3600) % 60,
        bigTimeHours = hours + (quarters * 0.25),
        noun = (bigTimeHours === 1) ? 'hour' : 'hours',
        text = StopDrop.padZeroes(hours) + ":" + StopDrop.padZeroes(minutes) + ":" + StopDrop.padZeroes(seconds) + " (" + bigTimeHours + " " + noun + ")";

    $time.text(text);

    return text;
};

// Calculates the total time
StopDrop.calcTotalTime = function() {
    var db = StopDrop.db;

    db.transaction(function(tx) {
        tx.executeSql('SELECT SUM(totalTime) AS "totalTime" FROM watch', [], function(tx, results) {
            var $total = $('.sum'),
                time = results.rows.item(0).totalTime,
                hours = Math.floor(time / 3600),
                quarters = Math.round((time % 3600) / 900),
                minutes = Math.floor((time % 3600) / 60),
                seconds = (time % 3600) % 60,
                bigTimeHours = hours + (quarters * 0.25),
                noun = (bigTimeHours === 1) ? 'hour' : 'hours',
                text = StopDrop.padZeroes(hours) + ":" + StopDrop.padZeroes(minutes) + ":" + StopDrop.padZeroes(seconds) + " (" + bigTimeHours + " " + noun + ")";

            $total.text(text);
        }, StopDrop.errorHandler, function() {
        });

        tx.executeSql('SELECT totalTime FROM watch', [], function(tx, results) {
            var $roundedTotal = $('.rounded-sum'),
                i,
                len = results.rows.length,
                time,
                hours,
                quarters,
                bigTimeHours,
                totalTime = 0,
                noun,
                text;

            for (i = 0; i < len; i++) {
                time = results.rows.item(i).totalTime;
                hours = Math.floor(time / 3600);
                quarters = Math.round((time % 3600) / 900);
                bigTimeHours = hours + (quarters * 0.25);
                totalTime += bigTimeHours;
            }

            noun = (totalTime === 1) ? 'hour' : 'hours';
            text = totalTime + " " + noun;

            $roundedTotal.text(text);
        }, StopDrop.errorHandler, function() {
        });
    });
};

/* ------------------ END TIME FUNCTIONS ------------------ */


/* -------------------- WATCH FUNCTIONS -------------------- */
// Appends a new watch to the DOM
StopDrop.appendWatch = function(name, theme, totalTime, tracking, collapsed) {
    var id = Global.currentAction.id,
        watchProperties = [],
        status,
        buttons,
        html,
        colorSelector = '<div class="color-selector"><div class="red"></div><div class="yellow"></div><div class="green"></div><div class="blue"></div></div>',
        colors = '<div class="colors"><div class="black"></div><div class="red"></div><div class="orange"></div><div class="yellow"></div><div class="green"></div><div class="blue"></div><div class="violet"></div></div>';

    tracking = (tracking === "true") ? true : false;
    collapsed = (collapsed === "true") ? true : false;
    watchProperties.name = name;
    watchProperties.totalTime = totalTime;
    watchProperties.success = true;

    if (tracking) {
        status = "Tracking...";
        theme += " tracking";
        buttons = '<button class="start hide control"><span></span></button><button class="pause control"><span></span></button>';
    }
    else {
        buttons = '<button class="start control"><span></span></button><button class="pause hide control"><span></span></button>';
        status = StopDrop.calcTime(id, totalTime);
    }

    if (collapsed) {
        theme += " collapsed";
    }

    html = '<li class="stopwatch ' + theme + '" id="' + id + '"><div class="properties"><span class="handle">&#x2261;</span><span class="name">' + name + '</span><span class="time">' + status + '</span></div><div class="controls">' + buttons + '<button class="delete control"><span></span></button><button class="reset control"><span>000</span></button><button class="add control"><span></span></button><button class="subtract control"><span></span></button></div>' + colorSelector + colors + '</li>';
    $('.watches').append(html);
};

// Prompts users for a name and creates a watch
StopDrop.createWatch = function() {
    var id,
        name,
        theme;

    if (Global.currentAction.prompted) {
        Global.currentAction.prompted = false;

        id = (new Date()).getTime();
        Global.currentAction.id = id;
        name = Global.currentAction.promptValue;
        theme = "blue";

        StopDrop.appendWatch(name, theme, 0, StopDrop.trackImmediately, "false");
        StopDrop.insertWatch(name, 0, StopDrop.trackImmediately);

        if (StopDrop.trackImmediately === 'true') {
            Global.currentAction = {
                "action" : StopDrop.startTime,
                "id" : id
            };

            StopDrop.startTime();
        }
    }
    else {
        Commodal.prompt("Please enter a name for this watch:");
    }
};

// Deletes a watch from the database and the DOM
StopDrop.deleteWatch = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id;

    if (Global.currentAction.confirm) {
        Global.currentAction.confirm = false;

        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM watch WHERE id = ' + id);
        }, StopDrop.errorHandler, function() {
            Commodal.close();
        });

        $('#' + id).hide(500, function() {
            $(this).remove();
        });

        StopDrop.calcTotalTime();
    }
    else {
        Commodal.confirm('Are you sure you want to delete this watch?');
    }
};

// Deletes all watches from the database and the DOM
StopDrop.deleteAll = function() {
    var db = StopDrop.db;

    if (Global.currentAction.confirm) {
        Global.currentAction.confirm = false;

        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM watch');
        }, StopDrop.errorHandler, function() {
            Commodal.close();
        });

        $('.stopwatch').fadeOut(500, function() {
            $(this).remove();
        });

        StopDrop.calcTotalTime();
    }
    else {
        Commodal.confirm('Are you sure you want to delete all watches?');
    }
};

// Retrieves the watches from the database
StopDrop.getWatches = function() {
    var db = StopDrop.db;

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS watch (id unique, name, sessionStart, sessionEnd, sessionTime, totalTime, tracking, collapsed, rank, theme)');

        tx.executeSql('SELECT * FROM watch ORDER BY rank', [], function (tx, results) {
            var i,
                len = results.rows.length;

            for (i = 0; i < len; i++) {
                Global.currentAction.id = results.rows.item(i).id;

                StopDrop.appendWatch(results.rows.item(i).name, results.rows.item(i).theme, results.rows.item(i).totalTime, results.rows.item(i).tracking, results.rows.item(i).collapsed);
            }
        });
    }, StopDrop.errorHandler);
};

// Inserts a new watch into the database
StopDrop.insertWatch = function(name, totalTime, tracking) {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        sessionStart = 0;

    if (tracking === 'true') {
        sessionStart = Math.floor((new Date()).getTime() / 1000);
    }

    db.transaction(function(tx) {
        tx.executeSql('SELECT max(rank)+1 AS "rank" FROM watch', [], function(tx, results) {
            var len = results.rows.length, i, max;
            for (i = 0; i < len; i++) {
                max = results.rows.item(i).rank;
            }
            tx.executeSql('INSERT INTO watch (id, name, sessionStart, sessionEnd, sessionTime, totalTime, tracking, rank, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, name, sessionStart, 0, 0, totalTime, false, max, "blue"]);
        });
    }, StopDrop.errorHandler, function() {
        Commodal.close();
    });
};

// Updates the watch's name
StopDrop.updateName = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        name = Global.currentAction.name;

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET name = "' + name + '" WHERE id = ' + id);
    }, StopDrop.errorHandler);
};

// Updates the rank order of the watches
StopDrop.updateRanks = function(results) {
    var i,
        db = StopDrop.db;

    db.transaction(function(tx) {
        for (i = 0; i < results.length; i++) {
            tx.executeSql('UPDATE watch SET rank = ' + i + ' WHERE id = ' + results[i]);
        }
    }, StopDrop.errorHandler, StopDrop.successHandler("Order successfully updated."));
};
/* ------------------ END WATCH FUNCTIONS ------------------ */

/* -------------------- HELPER FUNCTIONS -------------------- */
StopDrop.padZeroes = function(number) {
    if (number < 10) {
        return "0" + number;
    }
    else {
        return number;
    }
};

StopDrop.errorHandler = function(error) {
    StopDrop.$notification
        .addClass('error')
        .text("Error: " + error.message)
        .show();
};

StopDrop.successHandler = function(message) {
    StopDrop.$notification
        .addClass('success')
        .text(message)
        .show()
        .delay(1000)
        .fadeOut('slow', function() {
            $(this)
                .removeClass('success')
                .text('');
        });
};

StopDrop.eventListener = function() {
    Global.currentAction.action.call();
};

// user option functions
StopDrop.loadOptions = function() {
    var db = StopDrop.db,
        $singleWatch = $('#single-watch'),
        $trackImmediately = $('#track-immediately');

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM options', [], function(tx, results) {
            var i,
                len = results.rows.length;

            for (i = 0; i < len; i++) {
                if (results.rows.item(i).name === 'singleWatch') {
                    if (results.rows.item(i).value === 'true') {
                        $singleWatch.attr('checked', 'checked');
                        $('.pause-all').hide();
                    }
                    StopDrop.singleWatch = results.rows.item(i).value;
                }

                if (results.rows.item(i).name === 'trackImmediately') {
                    if (results.rows.item(i).value === 'true') {
                        $trackImmediately.attr('checked', 'checked');
                    }
                    StopDrop.trackImmediately = results.rows.item(i).value;
                }
            }
        });
    }, StopDrop.errorHandler);
};
StopDrop.setOption = function(name, value) {
    var db = StopDrop.db;

    db.transaction(function(tx) {
        tx.executeSql('UPDATE options SET value = "' + value + '" WHERE name = "' + name + '"');
    }, StopDrop.errorHandler, function() {
        if (name === 'singleWatch') {
            StopDrop.singleWatch = value;

            if (value === 'true') {
                $('.pause-all').hide();
            }
            else {
                $('.pause-all').show();
            }
        }
        if (name === 'trackImmediately') {
            StopDrop.trackImmediately = value;
        }
    });
};
// end user option functions

StopDrop.setTheme = function() {
    var db = StopDrop.db,
        id = Global.currentAction.id,
        theme = Global.currentAction.theme;

    db.transaction(function(tx) {
        tx.executeSql('UPDATE watch SET theme = "' + theme + '" WHERE id = ' + id);
    }, StopDrop.errorHandler, function() {
        var $watch = $('#' + id);

        if ($watch.is('.tracking')) {
            theme += ' tracking';
        }
        $watch
            .removeClass($(this).attr('class'))
            .addClass('stopwatch ' + theme);
    });
};

StopDrop.connectToDB = function() {
    StopDrop.db = openDatabase('StopDrop', '', 'Storage for the StopDrop extension.', 5 * 1024 * 1024);
};

// Handles database upgrades for new versions
StopDrop.upgradeDB = function() {
    var db = StopDrop.db;

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS watch (id unique, name, sessionStart, sessionEnd, sessionTime, totalTime, tracking, collapsed, rank, theme)');
        tx.executeSql('SELECT * FROM watch', [], function(tx, results) {
            var i,
                len = results.rows.length;

            tx.executeSql('DROP TABLE IF EXISTS watch');
            tx.executeSql('CREATE TABLE IF NOT EXISTS watch (id unique, name, sessionStart, sessionEnd, sessionTime, totalTime, tracking, collapsed, rank, theme)');

            for (i = 0; i < len; i++) {
                // if using 1.0 or 1.1, divide all times by 1000 and set the theme to blue
                if (db.version === "1.0" || db.version === "1.1" ) {
                    tx.executeSql('INSERT INTO watch (id, name, sessionStart, sessionEnd, sessionTime, totalTime, tracking, collapsed, rank, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [results.rows.item(i).id, results.rows.item(i).name, Math.floor(results.rows.item(i).sessionStart / 1000), Math.floor(results.rows.item(i).sessionEnd / 1000), Math.floor(results.rows.item(i).sessionTime / 1000), Math.floor(results.rows.item(i).totalTime / 1000), results.rows.item(i).tracking, "false", i, "blue"]);
                }
                else {
                    tx.executeSql('INSERT INTO watch (id, name, sessionStart, sessionEnd, sessionTime, totalTime, tracking, collapsed, rank, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [results.rows.item(i).id, results.rows.item(i).name, results.rows.item(i).sessionStart, results.rows.item(i).sessionEnd, results.rows.item(i).sessionTime, results.rows.item(i).totalTime, results.rows.item(i).tracking, "false", i, results.rows.item(i).theme]);
                }
            }
        });
        tx.executeSql('CREATE TABLE IF NOT EXISTS options (name unique, value)');
        tx.executeSql('SELECT * FROM options', [], function(tx, results) {
            var i,
                len = results.rows.length;

            // if options already exist, add the pre-existing values
            if (len > 0) {
                tx.executeSql('DROP TABLE IF EXISTS options');
                tx.executeSql('CREATE TABLE IF NOT EXISTS options (name unique, value)');

                for (i = 0; i < len; i++) {
                    tx.executeSql('INSERT INTO options (name, value) VALUES (?, ?)', [results.rows.item(i).name, results.rows.item(i).value]);
                }
            }
            // otherwise insert the defaults
            else {
                tx.executeSql('INSERT INTO options (name, value) VALUES (?, ?)', ["singleWatch", false]);
                tx.executeSql('INSERT INTO options (name, value) VALUES (?, ?)', ["trackImmediately", false]);
            }
        });
    }, StopDrop.errorHandler);

    db.changeVersion(db.version, StopDrop.currentVersion, function() {}, function(){}, function() {
        Commodal.confirm("Updated to version " + db.version);
    });
};

// Initialize the application
StopDrop.init = function() {
    // bind events to the document
    $(document).bind('commodalConfirm commodalPrompt', StopDrop.eventListener);

    // check to see if the user's browser supports Web SQL
    if (typeof openDatabase !== 'function') {
        Commodal.confirm('Your browser does not support Web SQL, the database system StopDrop uses to store your watch data on your computer.<p>Please download a browser, such as <a href="http://google.com/chrome" target="_blank">Chrome</a>, <a href="http://www.apple.com/safari/" target="_blank">Safari</a>, or <a href="http://www.opera.com/" target="_blank">Opera</a>, which supports Web SQL.</p>');
    }
    else {
        StopDrop.connectToDB();

        if (StopDrop.db.version !== StopDrop.currentVersion) {
            StopDrop.upgradeDB();
        }

        StopDrop.loadOptions();
        StopDrop.getWatches();
        StopDrop.calcTotalTime();
    }
};
/* ------------------ END HELPER FUNCTIONS ------------------ */

$(function() {
    StopDrop.init();

    StopDrop.$notification = $('.notification');

    $('.watches').sortable({
        axis : 'y',
        handle : 'span.handle',
        placeholder : 'placeholder',
        update : function() {
            var results = $(this).sortable('toArray');

            StopDrop.updateRanks(results);
        }
    });

    /*** ------------ BIND CLICK EVENTS ----------- ***/

    /* -------------- STOPWATCH BUTTONS ------------- */
    $(document).on('doubletap', '.stopwatch', function(e) {
        var id = ($(e.target).is('.stopwatch')) ? $(e.target).attr('id') : $(e.target).parents('.stopwatch').attr('id');

        e.preventDefault();

        Global.currentAction = {
            "action" : StopDrop.toggleCollapsed,
            "id" : id
        };

        StopDrop.toggleCollapsed();
    });

    $(document).on('click', '.name', function() {
        var $this = $(this),
            name = $this.text();

        $this.replaceWith('<input type="text" class="name-input" value="' + name + '" />');
        $('.name-input').focus();
    });

    $(document).on('blur', '.name-input', function() {
        var $this = $(this);

        Global.currentAction = {
            "action" : StopDrop.updateName,
            "id" : $this.parents('.stopwatch').attr('id'),
            "name" : $this.val()
        };

        StopDrop.updateName();
        $this.replaceWith('<span class="name">' + $this.val() + '</span>');
    });

    $(document).on('keydown', '.name-input', function(e) {
        if (e.keyCode === 13) {
            $(this).blur();
        }
    });

    $(document).on('click', '.start', function() {
        Global.currentAction = {
            "action" : StopDrop.startTime,
            "id" : $(this).parents('.stopwatch').attr('id')
        };

        StopDrop.startTime();
    });

    $(document).on('click', '.pause', function() {
        Global.currentAction = {
            "action" : StopDrop.pauseTime,
            "id" : $(this).parents('.stopwatch').attr('id')
        };

        StopDrop.pauseTime();
    });

    $(document).on('click', '.reset', function() {
        Global.currentAction = {
            "action" : StopDrop.resetTime,
            "id" : $(this).parents('.stopwatch').attr('id')
        };

        StopDrop.resetTime(false);
    });

    $(document).on('click', '.delete', function() {
        Global.currentAction = {
            "action" : StopDrop.deleteWatch,
            "id" : $(this).parents('.stopwatch').attr('id')
        };

        StopDrop.deleteWatch();
    });

    $(document).on('click', '.add', function() {
        Global.currentAction = {
            "action" : StopDrop.addTime,
            "id" : $(this).parents('.stopwatch').attr('id')
        };

        StopDrop.addTime();
    });

    $(document).on('click', '.subtract', function() {
        Global.currentAction = {
            "action" : StopDrop.subtractTime,
            "id" : $(this).parents('.stopwatch').attr('id')
        };

        StopDrop.subtractTime();
    });

    $(document).on('click', '.color-selector', function() {
        var $colors = $(this).siblings('.colors');

        if ($colors.is(':visible')) {
            $colors.hide();
        }
        else {
            $colors.show();
        }
    });

    $(document).on('click', '.colors div', function() {
        var $this = $(this);

        Global.currentAction = {
            "action" : StopDrop.setTheme,
            "id" : $this.parents('.stopwatch').attr('id'),
            "theme" : $this.attr('class')
        };

        StopDrop.setTheme();
    });
    /* ------------ END STOPWATCH BUTTONS ----------- */


    /* ------------ MODAL BUTTONS ----------- */
    $(document).on('click', '.prompt', function() {
        Global.currentAction.prompted = true;
        Global.currentAction.promptValue = $('.prompt-input').val();

        $(this).trigger('commodalPrompt');
    });

    $(document).on('keydown', '.prompt-input', function(e) {
        if (e.keyCode === 13) {
            Global.currentAction.prompted = true;
            Global.currentAction.promptValue = $('.prompt-input').val();

            $(this).trigger('commodalPrompt');
        }
    });

    $(document).on('click', '.confirm', function() {
        Global.currentAction.confirm = true;

        Commodal.close();

        $(this).trigger('commodalConfirm');
    });

    $(document).on('click', '.cancel', function() {
        Global.currentAction.confirm = false;
        Global.currentAction.prompted = false;

        Commodal.close();
    });
    /* ------------ END MODAL BUTTONS ----------- */


    /* ------------ PERSISTENT BUTTONS ------------ */
    $('.new').on('click', function() {
        Global.currentAction.action = StopDrop.createWatch;

        StopDrop.createWatch();
    });

    $('.reset-all').on('click', function() {
        Global.currentAction.action = StopDrop.resetAll;

        StopDrop.resetAll();
    });

    $('.delete-all').on('click', function() {
        Global.currentAction.action = StopDrop.deleteAll;

        StopDrop.deleteAll();
    });

    $('.pause-all').on('click', function() {
        Global.currentAction.action = StopDrop.pauseAll;

        StopDrop.pauseAll();
    });

    $('.expand-all').on('click', function() {
        Global.currentAction.action = StopDrop.expandAll;

        StopDrop.expandAll();
    });

    $('.collapse-all').on('click', function() {
        Global.currentAction.action = StopDrop.collapseAll;

        StopDrop.collapseAll();
    });

    $('#single-watch').on('change', function() {
        StopDrop.setOption('singleWatch', $(this).is(':checked').toString());
    });

    $('#track-immediately').on('change', function() {
        StopDrop.setOption('trackImmediately', $(this).is(':checked').toString());
    });
    /* ------------ END PERSISTENT BUTTONS ------------ */

    /*** ------------ END BIND CLICK EVENTS --------- ***/
});