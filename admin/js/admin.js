var debug = 0;
var usepop = '';
var content = 0;
var save_html = '';
var active_updating_id = '';
var pane;
var CKEDITOR;

$(document).ready(function () {
    show_loading();
    resize_window();
    table_checks('active_table');
    /**
     * Expand Search when focus.
     */
    $('#search input').focus(function () {
        $(this).removeClass('sleep');
        if ($(this).val() == 'Search') {
            $(this).val('');
        }
    });
    $('#search input').blur(function () {
        $(this).addClass('sleep');
        if ($(this).val() == '') {
            $(this).val('Search');
        }
    });
    $("img.hover").live({

        mouseenter: function () {
            var src = $(this).attr('src');
            var news = src.replace(".png", "-on.png");
            $(this).attr('src', news);
        },
        mouseleave: function () {
            var src = $(this).attr('src');
            var news = src.replace("-on.png", ".png")
            $(this).attr('src', news);
        }

    });
    /**

     * CTRL-S

     */
/*
    shortcut.add("Ctrl+S", function () {
        if ($("#popupform").length > 0) {
            $('#popupform').submit();
        } else {
            if ($("#slider_form").length > 0) {
                $('#slider_form').submit();
            }
        }
    });

    shortcut.add("Ctrl+W", function () {
        close_popup();
        close_large_popup();
        close_search();
        closequickadd();
        close_filters();
        close_loading();
        close_slider();
    });
*/
    /**

     * CTRL-S

     */
/*
    shortcut.add("Ctrl+S", function () {
        if ($("#popupform").length > 0) {
            $('#popupform').submit();
        } else {
            if ($("#slider_form").length > 0) {
                $('#slider_form').submit();
            }
        }
    });

    shortcut.add("Ctrl+W", function () {
        close_popup();
        close_large_popup();
        close_search();
        closequickadd();
        close_filters();
        close_loading();
        close_slider();
    });
*/
    ajax_notify();
    // setTimeout(ajax_notify, 120000); // 2 Minutes
});
function ajax_notify() {
    $.post('cp-functions/ajax_notices.php', '', function (theResponse) {
        if (debug == 1) {
            console.log(theResponse);
        }
        if (theResponse) {
            if (theResponse == '0+++redirect') {
                show_inline_login();
            } else {
                if (theResponse != 'na') {
                    $('#feed_box').remove();
                    htmlput = '<div id="feed_box"><div id="feed_box_inner">';
                    htmlput += '<h4><a href="index.php?l=feed">Notifications</a></h4>';
                    htmlput += '<ul id="ajax_notices">';
                    htmlput += theResponse;
                    htmlput += '</ul>';
                    htmlput += '</div></div>';
                    $('body').append(htmlput);
                    $('#ajax_notices').show();
                    $('#noticeImg').attr('src', 'imgs/icon-feed.png');
                    $('#noticeImg').addClass('pulse');
                    play_sound();
                    set_activity_timeout();
                }
                setTimeout(ajax_notify, 120000); // 2 Minutes 120000
            }
        } else {
            $('#feed_icon').attr('src', 'imgs/icon-feed-off.png');
            setTimeout(ajax_notify, 120000); // 2 Minutes 120000
        }
    });
    return false;
}
function show_inline_login() {
    faded = '<div class="faded_all">';
    faded += '<div id="feed_box"><div id="feed_box_inner">';
    faded += '<h4>Your session has expired</h4>';
    faded += '<div id="feed_login">';
    faded += '<div id="login_error" class="error_div"></div>';
    faded += '<form action="" id="login" method="post" onsubmit="return verifyLogin(\'login\',\'1\');">';
    faded += '<div class="field"><label class="less">Username</label><div class="field_entry_less"><input type="text" name="username" value="" class="home req" style="width:100%;" /></div></div>';
    faded += '<div class="field"><label class="less">Password</label><div class="field_entry_less"><input type="password" name="password" value="" class="home req" style="width:100%;" /></div></div>';
    faded += '<div class="field"><div id="captcha_block" class="notice" style="display:none;"><div class="pad20"><center>';
    faded += '    <img width="200" height="50" id="captchaput" class="imageout" src="" />';
    faded += '    <input type="text" name="captcha" value="" class="home" style="width:200px;" />';
    faded += '</center></div></div></div>';
    faded += '<div class="field center"><input type="checkbox" name="remember" value="1" /> Remember Me</div>';
    faded += '<div class="field center"><input type="submit" value="Login" class="save" /></div>';
    faded += '</form> ';
    faded += '</div></div></div>';
    faded += '</div> ';
    $('body').append(faded);
    $('#ajax_notices').show();
    play_sound();
}
function close_inline_login() {
    $('.faded_all').fadeOut('200', function () {
        $('.faded_all').remove();
    });
    set_activity_timeout();
}
function play_sound(soundfile) {
    if (!soundfile) {
        soundfile = 'misc/sounds/notice.mp3';
    }
    sound = '<embed src="' + soundfile + '" hidden="true" autostart="true" loop="false" id="sound_ping" />';
    $('embed').remove();
    $('body').append(sound);
}
function set_activity_timeout() {
    setTimeout(close_notify, 30000); // 30 Seconds
}
function toggle_feed() {
    if ($("#feed_box").length) {
        $('#feed_box').toggle();
    } else {
        window.location = 'index.php?l=feed'
    }
    return false;
}
function close_notify() {
    $('#feed_box').hide();
    // $('#noticeImg').attr('src', 'imgs/icon-feed-off.png');
    $('#sound_ping').remove();
    $('#noticeImg').removeClass('pulse');
}
$(window).resize(function () {
    resize_window();
});
// Check for active tables
function table_checks(id) {
    if (!id) {
        id = 'active_table';
    }
    // find("tr")
    // .size() > 1
    if ($('#' + id).find("tbody")) {

        //var images = $("#active_table img").length;
        //var space = images * 16 + images * 6;
        //$('td.options').css('width',space);
        // Disable first and last
        // column sorting.
        var allcols = $("#" + id).find("thead th").length;
        allcols -= 1;
        var myHeaders = {}
        myHeaders[0] = { sorter: false };
        myHeaders[allcols] = { sorter: false };
        $("#" + id).tablesorter({

            //sortList: [[1,0]],
            headers: myHeaders

        });

        // Detect icon activation
        $("td.options img").hover(
            function () {
                var src = $(this).attr('src');
                var news = src.replace(".png", "-on.png");
                $(this).attr('src', news);
            },
            function () {
                var src = $(this).attr('src');
                var news = src.replace("-on.png", ".png")
                $(this).attr('src', news);
            }
        );

        // Check all checkboxes
        $('#' + id + ' td :checkbox').click(function () {
            if ($(this).is(':checked')) {
                $(this).closest('tr').addClass('active');
            } else {
                $(this).closest('tr').removeClass('active');
            }
        });

        /**
         * Tick a checkbox by selecting a table row,
         * but not the first, second, or last <td>.
         */
        $('#' + id + ' tr td').not(':nth-child(1)').not(':last').not(':nth-child(2)').click(function () {
            var parent_tr = $(this).closest('tr');
            if ($(parent_tr).find(':checkbox').is(':checked')) {
                $(parent_tr).find(':checkbox').attr('checked', false);
                $(this).closest('tr').removeClass('active');
            } else {
                $(parent_tr).find(':checkbox').attr('checked', true);
                $(this).closest('tr').addClass('active');
            }
        });
        // Table Hover
        $("#" + id + " tbody tr").hover(
            function () {
                $(this).addClass('tr_highlight');
            },
            function () {
                $(this).removeClass('tr_highlight');
            }
        );
    }
}

function prep_export(type, crit_id) {
    popup('export_data', 'type=' + type + '&crit_id=' + crit_id + '&data=' + $('#filter_field').val());
    return false;
}

function update_table() {
    show_loading();
    send_data = $('#table_filters').serialize();

    $.post('cp-includes/rotate_table.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            $('#page_number').html(returned['2']);
            $('#total_display').html(returned['3']);
            $('#filter_field').val(returned['4']);

            var plugin = getParameterByName('plugin');
            var lname = getParameterByName('l');
            var pathname = window.location.pathname;
            send_url = pathname + '?l=' + lname + '&plugin=' + plugin + '&' + returned['5'];

            if (returned[10]) {
                $("#next_link").attr("href", send_url + '&page=' + returned[11]);
                $("#next_link").show();
            } else {
                $("#next_link").hide();
            }
            if (returned[13]) {
                $("#prev_link").attr("href", send_url + '&page=' + returned[14]);
                $("#prev_link").show();
            } else {
                $("#prev_link").hide();
            }

            if (history.pushState) history.pushState({}, '', send_url);
            rotate_table(returned['1']);
            // Update math totals, if any
            replace_div_content('math1',returned['6']);
            replace_div_content('math2',returned['7']);
            replace_div_content('math3',returned['8']);
            replace_div_content('math4',returned['9']);
            // Get rid of autocomplete
            $('.autocom').remove();
            close_filters();
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}



function replace_div_content(id, entry)
{
    if ($('#' + id).length != 0) {
        $('#' + id).html(entry);
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)

        return "";
    else

        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
/**

 * Scope is a table name

 * that is sent through

 * the history class.

 */

function update_slider_table(scope, join_table) {
    show_loading();
    send_data = 'join=' + join_table + '&scope=' + scope + '&' + $('#slider_sorting').serialize();
    $.post('cp-includes/rotate_slider_table.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) { console.log(theResponse); }
        if (returned['0'] == '1') {
            $('#sub_page_number').html(returned['2']);
            $('#sub_total_display').html(returned['3']);
            rotate_table(returned['1'], 'subslider_table');
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}

function check_all(table) {
    if (! table) {
        table = 'active_table';
    }
    if (boxes_checked == 1) {
        $('#' + table + ' :checkbox').each(function () {
            this.checked = false;
            $(this).closest('tr').removeClass('active');
        });
        boxes_checked = 0;
    } else {
        $('#' + table + ' :checkbox').each(function () {
            this.checked = true;
            $(this).closest('tr').addClass('active');
        });
        boxes_checked = 1;
    }
    return false;
}

function resize_window() {
    var height = $(window).height();
    var width = $(window).width();
    var main_height = height - subtract; // 158
    window_height = main_height;
    window_width = width;
    $('#mainsection').css('height', main_height);

    //pane = $('#mainsection');
    // $('#mainsection').jScrollPane(); // settings
    // var api = pane.data('jsp');

    close_loading();
}

function show_loading() {
    if ($( "#loading" ).length) {
        return false;
    }

    var final_content = '<div id="loading" class="loading_box" style="cursor:pointer;" onclick="return close_loading();"></div>';
    $('body').append(final_content);
}

function helpBubble(eleme, text)
{
    var elem = $('#' + eleme);
    var eTop = elem.offset();
    var left = eTop.left + elem.innerWidth() + 12;
    var top = eTop.top;

    var html = '<div class="helpBubble" style="top:' + top + 'px;left:' + left + 'px;">' + text + '</div>';

    $('body').append(html);

    console.log(eTop, text);
}

function closeBubble() {
    $('.helpBubble').remove();
}

function regBubble(elem, text) {
    $('#' + elem).bind({
        mouseenter: function(e) {
            helpBubble(elem, text);
        },
        mouseleave: function(e) {
            closeBubble();
        }
    });
}

function close_loading() {
    $('.loading_box').remove();
}

function popup(page, pass_fields, large) {
    close_popup();
    close_large_popup();
    close_search();
    closequickadd();
    show_loading();
    send_data = 'p=' + page + '&' + pass_fields;
    $.post('cp-includes/get_popup.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (returned['0'] == '1') {
            append_popup(returned['1'], large, page);
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
function get_list(inpage, pop_id, pop_name, letter_filter, page) {
    if ($('#get_list').length != 0) {
        close_list();
    } else {
        show_loading();
        if (!page) {
            page = 1;
        }
        send_data = 'id=' + inpage + '&pop_id=' + pop_id + '&pop_name=' + pop_name + '&page=' + page + '&letter_filter=' + letter_filter;
        $.post('cp-includes/get_list.php', send_data, function (theResponse) {
            var returned = theResponse.split('+++');
            if (debug == 1) {
                console.log(theResponse);
            }
            if (returned['0'] == '1') {
                next = parseInt(page) + 1;
                prev = parseInt(page) - 1;
                if (prev <= 0) {
                    prev = 1;
                }
                put = '<li class="close">';
                put += '<div class="float_right"><a href="null.php" onclick="return close_list();">Close List</a></div>';
                put += '<div class="float_left"><a href="null.php" onclick="return get_list(\'' + inpage + '\',\'' + pop_id + '\',\'' + pop_name + '\',\'' + letter_filter + '\',\'' + prev + '\');">&laquo; Prev</a> - <a href="null.php" onclick="return get_list(\'' + inpage + '\',\'' + pop_id + '\',\'' + pop_name + '\',\'' + letter_filter + '\',\'' + next + '\');">Next &raquo;</a></div>';
                put += '<div class="clear"></div></li>';
                put += returned['1'];
                if ($('#get_list').length == 0) {
                    show_list(put);
                } else {
                    $('#get_list').html(put);
                }
                close_loading();
            } else {
                handle_error(returned['1']);
            }
        });
    }
    return false;
}
function get_list_populate(id, name, pop_id, pop_name) {
    $('#' + pop_id).val(id);
    $('#' + pop_name).val(name);
    $('#' + pop_name).addClass('savedAutocomplete');
    $('#' + pop_id).focus();
    close_list();
    return false;
}
function show_list(indata) {
    var data = '<ul id="get_list" style="display:none;">' + indata + '</ul>';
    $('body').append(data);
    $('#get_list').slideDown("fast");
}
function close_list() {
    $('#get_list').slideUp('fast', function () {
        $('#get_list').remove();
    });
    return false;
}
function switch_popup(page, pass_fields, large) {
    show_loading();
    send_data = 'p=' + page + '&' + pass_fields;
    $.post('cp-includes/get_popup.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        // append_popup(returned['1'],large);
        $('#' + usepop).html(returned['1']);
        //update_popup_height();
        close_loading();
    });
    return false;
}

/*
function update_popup_height() {
    var current_height = $('.popupbody').height();
    var wheight = $(window).height();
    useheight = wheight - 30;
    var popHeight = $('.popupbody').height();
    if (popHeight > wheight) {
        placeHeight = wheight - 32;
    } else {
        if (popHeight < 600) {
            placeHeight = 600;
        } else {
            if ((popHeight + 125) > wheight) {
                placeHeight = useheight;
            } else {
                placeHeight = popHeight + 125;
            }
        }
    }
    $('#' + usepop).animate({

        height: placeHeight + 'px'

    }, 300);
}
*/

function append_popup(content, large, page) {
    close_search();
    var top = $(window).scrollTop();
    var wheight = $(window).height();
    var wwidth = $(window).width();
    useheight = wheight - 30;

    popup_width = wwidth - 56;
    usepop = 'popupLarge';
    //var style = 'top:' + top + 'px;height:' + useheight + 'px;width:' + popup_width + 'px;';
    //var style = 'width:' + popup_width + 'px;';
    var closer = 'popup_close_large';

    /*
     top = top + 15;
    if (large == '1') {
        popup_width = wwidth - 56;
        usepop = 'popupLarge';
        //var style = 'top:' + top + 'px;height:' + useheight + 'px;width:' + popup_width + 'px;';
        var style = 'width:' + popup_width + 'px;';
        var closer = 'popup_close_large';
    } else {
        usepop = 'popup';
        //var style = 'top:' + top + 'px;height:' + useheight + 'px;';
        //var style = 'height:' + useheight + 'px;';
        var closer = 'popup_close';
    }
    */

    var final_content = '<div id="' + closer + '">';
    if (large == '1') {
        final_content += '<a href="return_null.php" onclick="return close_large_popup();">';
    } else {
        final_content += '<a href="return_null.php" onclick="return close_popup();">';
    }
    final_content += '<img src="imgs/icon-close.png" width="16" height="16" border="0" alt="Close" title="Close" /></a></div>';
    final_content += '<div id="' + usepop + '">'; //  style="' + style + '"
    final_content += content;
    final_content += '</div>';
    active_faded = unique_id();
    $('body').append($(final_content)
        //.hide()
        .add('<div id="' + active_faded + '" class="faded"></div>')
        //.fadeIn(250, function () { $("#" + usepop).draggable({ handle: "h1" }); })
    );
}
function crop_image(action, id, rotate) {
    show_loading();
    send_data = 'action=' + action + '&rotate=' + rotate + '&id=' + id + '&' + $('#crop_form').serialize();
    $.post('cp-functions/crop_image.php', send_data, function (theResponse) {
        if (debug == 1) {
            console.log(theResponse);
        }
        var returned = theResponse.split('+++');
        if (returned['0'] == '1') {
            $('#cropping').attr('src', returned['1']);
            $(".profile_pic").attr('src', returned['1']);
            show_saved('Saved');
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
function confirm_act(file, id, values) {
    if (confirm("Please confirm that you wish to continue.\n\nThis action cannot be reversed.")) {
        return command(file, id, values);
    }
    return false;
}
/**

 * Runs a fixed command. Just like add()

 * But without the form serialization.

 * @param file cp-functions/[file].php

 * @param id ID we are running the command on.

 * @param values Values we are updating.

 */

function command(file, id, values) {
    send_data = 'id=' + id + '&' + values;
    show_loading();
    $.post('cp-functions/' + file + '.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            if (returned['1'] == 'table_append') {
                if ($("#subslider_table").length > 0) {
                    $("#subslider_table tbody:first").prepend(returned['2']);
                } else {
                    if ($("#active_table").length > 0) {
                        $("#active_table tbody:first").before(returned['2']);
                    }
                }
            } else {
                // Nothing else to do.
            }
            show_saved(returned['1']);
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
function pick_theme(type, id) {
    $('.popup_full_section').removeClass('active');
    $('#theme-' + id).addClass('active');
    command('theme_select', id, 'type=' + type);
}
function add(type, id, edit, form, skip_loader, skip_form_check) {
    show_loading();
    if (!form) {
        form = 'slider_form';
    }
    if (skip_form_check != '1') {
        req = check_form(form);
        if (req === false) {
            close_loading();
            return false;
        }
    }
    send_data = 'id=' + id + '&edit=' + edit + '&' + $('#' + form).serialize();
    $.post('cp-functions/' + type + '-add.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            /// Editing
            if (edit == '1') {
                if (returned['2'] == 'refresh') {
                    close_popup();
                    close_large_popup();
                    refresh_slider();
                }
                else if (returned['2'] == 'close_popup') {
                    show_saved();
                    close_popup();
                    close_large_popup();
                }
                else if (returned['2'] == 'reload') {
                    window.location.reload();
                }
                else if (returned['2'] == 'redirect_popup') {
                    switch_popup(returned['3'], returned['4']);
                    show_saved();
                }
                else if (returned['2'] == 'update_content') {
                    $('.popupbody').html(returned['1']);
                    show_saved();
                }
                else {
                    show_saved();
                }
            }



            // Creating
            else {
                if (skip_loader != '1') {

                    // If a table cell was returned,
                    // append it to the table. Only
                    // used when added from a popup.
                    if (returned['2']) {
                        if (returned['2'] == 'refresh') {
                            refresh_slider();
                            show_saved();
                            close_popup();
                            close_large_popup();
                        }
                        else if (returned['2'] == 'redirect_popup') {
                            switch_popup(returned['3'], returned['4']);
                            show_saved();
                        }
                        else if (returned['2'] == 'update_content') {
                            $('.popupbody').html(returned['1']);
                            show_saved();
                        }
                        else if (returned['2'] == 'slider') {
                            load_page(returned['3'], returned['5'], returned['4']);
                            // load_page('member','view','HVQZ-49344-04208');
                            show_saved();
                            close_popup();
                            close_large_popup();
                        }
                        else {



                            /*

                             if (form == 'popupform') {

                             if ($("#subslider_table").length > 0) {

                             $("#subslider_table tbody:first").before(returned['2']);

                             } else {

                             if ($("#active_table").length > 0) {

                             $("#active_table tbody:first").prepend(returned['2']);

                             }

                             }

                             } else {

                             if ($("#active_table").length > 0) {

                             $("#active_table tbody:first").prepend(returned['2']);

                             } else {

                             if ($("#subslider_table").length > 0) {

                             $("#subslider_table tbody:first").before(returned['2']);

                             }

                             }

                             }

                             */
                            if ($("#subslider_table").length > 0) {
                                $("#subslider_table tbody:first").prepend(returned['2']);
                            } else {
                                if ($("#active_table").length > 0) {
                                    $("#active_table tbody:first").before(returned['2']);
                                }
                            }
                            show_saved();
                            close_popup();
                            close_large_popup();
                        }
                    } else {
                        load_page(type, 'view', id, '1');
                        show_saved();
                        close_popup();
                        close_large_popup();
                    }
                } else {
                    show_saved();
                }
            }
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
/*
 * ----------------------------------------------
 * New JSON update and add features
 *
 * @param string page_target Exact name of file to run in cp-functions without the .php
 * @param string id ID of item being added/edited
 * @param bool editing 1 if editing or 0 if creating
 * @param string form_id ID of form being serialized. Defaults to "popupform". Enter "skip" to not serialize anything.
 * @param string passfields Query string of additional fields to post to the page_target.
 */
function json_add(page_target, id, editing, form_id, passfields, skip_form_check) {
    show_loading();
    active_updating_id = id;

    // Update CKEDITOR instances
    if (CKEDITOR) {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
    }

    // Presume all requests are coming
    // from the slider.
    if (form_id != 'skip') {
        if (!form_id) {
            form_id = 'popupform';
        }
        if (skip_form_check != '1') {
            var req = check_form(form_id);
            if (req === false) {
                close_loading();
                return false;
            }
        }
        var form_data = $('#' + form_id).serialize();
    } else {
        var form_data = '';
    }
    if (passfields) {
        var fpassfields = '&' + passfields;
    } else {
        var fpassfields = '';
    }
    // Clear errors
    $('.zen_field_error').remove();
    $('.warning').removeClass('warning');

    // Custom
    if (page_target.substr(0,7) == 'custom:') {
        var accttt = page_target.split(':');

        fpassfields += '&_plugin=' + accttt['1'] + '&_task=' + accttt['2'];

        var tUrl = zen_url + '/custom/plugins/route.php';
    } else {
        var acttt = '';
        var tUrl = zen_url + '/admin/cp-functions/' + page_target + '.php';
    }

    //console.log(tUrl, 'id=' + id + '&ext=' + acttt + '&edit=' + editing + '&' + form_data + fpassfields);

    // Make the ajax call.
    $.ajax({
        // Establish parameters
        type: "POST",
        url: tUrl,
        data: 'id=' + id + '&ext=' + acttt + '&edit=' + editing + '&' + form_data + fpassfields,
        // Successful bridge
        success: function (theResponse) {

            //console.log(theResponse);

            var returned = theResponse.split('+++');
            // Success
            if (returned['0'] == '1') {
                handle_success(returned['1']);
            }

            // Failed
            else {
                handle_json_error(returned['1']);
            }
        },
        // Failed bridge
        error: function (error, txt) {
            handle_error(error.status);
        }
    });
    return false;
}
function handle_success(json_data) {
    var data = $.parseJSON(json_data);
    if (debug == 1) {
        console.log(data);
    }
    $.each(data, function (action, additional_data) {
        process_success_action(action, additional_data);
    });
    active_updating_id = '';
    close_loading();
}
//   show_saved: Shows "Saved" message
//   close_popup: Closes popup
//   update_popup: Updates popup content
//   redirect_popup: Changes the location of a popup
//      page
//      fields (Query String)
//   append_table_row:
//   append
//   update_cells:
//   remove_cells
//   close_slider
//   refresh_slider:
//   reload
//   redirect_window
//   load_slider:
//   add_class:
//   image_src
//	id
//	class
//   remove_class:
//	id
//	class
//   change_popup_tab
//   change_slider:
function process_success_action(action, additional_data) {
    if (action == 'show_saved') {
        show_saved(additional_data);
    }
    else if (action == 'show_saved_stay') {
        show_saved(additional_data, '1');
    }
    else if (action == 'close_popup') {
        close_popup();
        close_large_popup();
    }
    else if (action == 'image_src') {
        $.each(additional_data, function (image_id, image_src) {
            $('#' + image_id).attr('src', image_src);
        });
    }
    else if (action == 'update_popup') {
        $('.popupbody').html(additional_data);
    }

    // Changes the view of the current popup
    // page,pass_fields,large
    else if (action == 'redirect_popup') {
        switch_popup(additional_data.page, additional_data.fields);
    }
    else if (action == 'append_table_row') {
        if ($("#subslider_table").length > 0) {
            $("#subslider_table tbody:first").prepend(additional_data);
            $('#subslider_table tr#tr-no-results').remove();
        } else {
            if ($("#active_table").length > 0) {
                $("#active_table tbody:first").before(additional_data);
                $('#active_table tr#tr-no-results').remove();
            }
        }
    }
    else if (action == 'append') {
        $("#" + additional_data.id).append(additional_data.data);
    }
    else if (action == 'update_cells') {
        $.each(additional_data, function (cell_name, cell_value) {
            update_cell(cell_name, cell_value);
        });
    }
    else if (action == 'add_class') {
        $('#' + additional_data.id).addClass(additional_data.class);
    }
    else if (action == 'add_classes') {
        $.each(additional_data, function (cell_name, cell_value) {
            $('#' + cell_name).addClass(cell_value);
        });
    }
    else if (action == 'remove_class') {
        $('#' + additional_data.id).removeClass(additional_data.class);
    }
    else if (action == 'remove_classes') {
        $.each(additional_data, function (cell_name, cell_value) {
            $('#' + cell_name).removeClass(cell_value);
        });
    }
    else if (action == 'change_popup_tab') {
        goToStep(additional_data);
    }
    else if (action == 'remove_cells') {
        $.each(additional_data, function (cell_name, cell_value) {
            hide_div(cell_value);
        });
    }
    else if (action == 'update_row') {
        $('#td-cell-' + active_updating_id).hide().html(additional_data).addClass('cell_updated').show();
        setTimeout("hide_updated()", 8000);
    }
    else if (action == 'refresh_slider') {
        refresh_slider();
    }
    else if (action == 'close_slider') {
        close_slider();
    }
    else if (action == 'reload') {
        window.location.reload();
    }
    else if (action == 'redirect_window') {
        window.location = additional_data;
    }
    else if (action == 'load_slider') {
        load_page(additional_data.page, additional_data.subpage, additional_data.id);
    }
    else if (action == 'change_slider') {
        get_slider_subpage(additional_data.subpage);
    }
}
function update_cell(id, value) {
    $('#' + id).html(value);
    $('#' + id).addClass('cell_updated');
    setTimeout("hide_updated()", 8000);
}
function hide_updated() {
    $('.cell_updated').removeClass('cell_updated');
}
function handle_json_error(json_data) {
    try {
        var data = $.parseJSON(json_data);
        if (debug == 1) {
            console.log(data);
        }
        $.each(data, function (field_name, anObject) {
            var field_errors = '';
            $.each(anObject, function (error_code, error_english) {
                field_errors += error_english + '<br />';
            });
            $('[name=' + field_name + ']').addClass('warning');
            $('[name=' + field_name + ']').after('<div class="zen_field_error">' + field_errors + '</div>');
        });
    } catch (e) {
        handle_error(json_data);
    }
    close_loading();
}
/*

 -- End JSON add/edit features

 ----------------------------------------------

 */
function closeDiv(id, effect, remove) {
    if (remove == 1) {
        $('#' + id).remove();
    } else {
        if (effect == 'fade') {
            $('#' + id).fadeOut(250);
        } else {
            $('#' + id).hide();
        }
    }
}
function switch_timeframe(id, value) {
    if (value == 'day_of_year') {
        hide_div(id + '-A');
        hide_div(id + '-B');
        show_div(id + '-C');
    }
    else if (value == 'day_of_month') {
        hide_div(id + '-A');
        hide_div(id + '-C');
        show_div(id + '-B');
    }
    else {
        hide_div(id + '-C');
        hide_div(id + '-B');
        show_div(id + '-A');
    }
}
function rotate_table(final_content, table) {
    if (!table) {
        table = 'active_table';
    }
    var out_trs = function () {
        $("#" + table + " tbody tr").each(function (index) {
            $(this).delay(10 * index).fadeOut(50, function () {
                $(this).remove();
            });
        });
    }

    // Required after a change on how tables
    // are rendered through table.class.php
    final_content = final_content.replace(/<tbody>/gi, '');
    final_content = final_content.replace(/<\/tbody>/gi, '');

    $.when(out_trs()).done(function () {

        $("#" + table + " tbody").append(final_content);
        // Reset scroll.
        /*
        if (table == 'subslider_table') {
            var paneA = $('#sliding'); // settings
            paneA.jScrollPane({
                showArrows: true
            });
            var apiA = paneA.data('jsp');
            //apiA.scrollBy(0, 0);
        } else {
            var pane = $('#mainsection'); // settings
            pane.jScrollPane({
                showArrows: true
            });
            var api = pane.data('jsp');
            api.scrollBy(0, 0);
        }
        */

        /*
         $("#" + table + " tbody tr").each(function (index) {
         $(this).delay(10 * index).fadeIn(50);
         });
         */

    });


    // $('#sliding').jScrollPane();

    // Re-work cells for sorting
    var usersTable = $(".tablesorter");
    usersTable.trigger("update")
        .trigger("sorton", [usersTable.get(0).config.sortList])
        .trigger("appendCache")
        .trigger("applyWidgets");

    return false;
}
/**

 * page: What we are loading, IE "contact" / "member"

 * act: what we are doing, IE "add" / "view"

 * id: If applicable, ID of what we are loading

 */

function load_page(page, act, id, skip_faded, recache, get_append) {
    show_loading();
    if (!act) {
        act = 'view';
    }
    active_page = page;
    active_act = act;
    active_id = id;
    close_popup();
    close_large_popup();
    close_search();
    if ($("#sliding").length > 0) {
        close_slider(skip_faded, function () {
            get_page(page, act, id, recache, get_append);
        });
    } else {
        get_page(page, act, id, recache);
    }
    return false;
}
function get_page(page, act, id, recache, get_append) {
    show_loading();
    send_data = 'get=wrapper&p=' + page + '&act=' + act + '&id=' + id + '&subpage=overview&recache=' + recache + '&' + get_append;
    $.ajax({
        type: "POST",
        url: "cp-includes/get_page.php",
        data: send_data,
        async: false,
        success: function (theResponse) {
            //console.log(theResponse);
            var returned = theResponse.split('+++');
            if (returned['0'] == '1') {
                show_slider(returned['1']);
                active_page = page;
                active_act = act;
                active_id = id;
                active_subpage_id = 'overview';
                close_loading();
            } else {
                handle_error(returned['1']);
            }
        }

    });
    /*

     $.post('cp-includes/get_page.php', send_data, function(theResponse) {

     if (debug == 1) { console.log(theResponse); }

     var returned = theResponse.split('+++');

     if (returned['0'] == '1') {

     show_slider(returned['1']);

     active_page = page;

     active_act = act;

     active_id = id;

     active_subpage_id = 'overview';

     close_loading();

     } else {

     handle_error(returned['1']);

     }

     });

     */
    return false;
}
// data must be a serialized array, if any.
//   Used for stuff like slider sub-page sorting.
//   Example usages: Event: View Attendee List: E-Mail Based on Criteria
function get_slider_subpage(subpage_id, recache, data) {
    show_loading();
    send_data = 'get=subpage&p=' + active_page + '&act=' + active_act + '&id=' + active_id + '&subpage=' + subpage_id + '&recache=' + recache + '&pd=' + data + '&' + data;
    if (debug == 1) {
        console.log('SUB-SLIDER:' + "\n\n" + subpage_id + "\n\n" + send_data);
    }
    $.post('cp-includes/get_page.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            active_subpage_id = subpage_id;
            $('#primary_slider_content').html(returned['1']);
            $('#slider_tabs li').removeClass('on');
            $('#slider_tabs li#' + subpage_id).addClass('on');
            /*

             // REJECTED SLIDER CONCEPT

             $('.sl_nav li').removeClass('on');

             $('.sl_nav li#' + subpage_id).addClass('on');

             var sl_width = $('#sliding').width();

             var dif = sl_width - 210;

             $('#primary_slider_content').css('width',dif + 'px');

             */
            table_checks('subslider_table');
            //$(function () {
            //$('#sliding').jScrollPane();
            //});
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
function apply_filters(subpage_id) {
    send_data = $('#popupform').serialize();
    if (debug == 1) {
        console.log(subpage_id + '---' + send_data);
    }
    get_slider_subpage(subpage_id, '0', send_data);
    show_saved('Applied');
    close_popup();
    close_loading();
    return false;
}
function refresh_slider() {
    show_loading();
    if (active_page) {
        get_slider_subpage(active_subpage_id, '1');
        close_loading();
    }
    close_loading();
    return false;
}
function reload_active() {
    //refresh_slider();
    if (active_page) {
        if (! active_subpage_id) {
            active_id = 'view';
        }
        else if (active_subpage_id == 'overview') {
            active_subpage_id = 'view';
        }
        load_page(active_page, 'view', active_id, '1');
        close_loading();
    }
    return false;
}
function close_slider(skip_faded, callback) {
    var width = $('#sliding').outerWidth();
    $('#close_sliding').remove();
    $('#sliding').animate({ left: -width, duration: 'fast' }, function () {
        $('#sliding').remove();
        // Deprecated when ID system was introduced
        // for faded divs.
        //if (skip_faded != '1') {
        $('#' + active_faded_main).fadeOut('50', function () {
            $('#' + active_faded_main).remove();
            active_page = '';
            active_act = '';
            active_id = '';
            active_subpage_id = '';
            active_faded_main = '';
            if (callback) {
                callback();
            }
        });
        //}
    });
    return false;
}
function close_popup() {
    close_large_popup();

    /*
    if ($("#popup").length > 0) {
        $('#popup').add('#' + active_faded).add('#popup_close').fadeOut('50', function () {
            $('#' + active_faded).remove();
            $('#popup').remove();
            $('#popup_close').remove();
            active_faded = '';
            if (cropping) {
                cropping.cancelSelection();
            }
            $('.autocom').remove();
        });
    }
    */
    return false;
}
function close_large_popup() {

    $('#popupLarge').remove();
    $('#popup_close_large').remove();
    $('#' + active_faded).remove();

    if (cropping) {
        cropping.cancelSelection();
    }

    $('.autocom').remove();

    /*
    $('#popup_close_large')
        .add('#' + active_faded)
        .add('#popup_close_large')
        .fadeOut('50', function () {
            $('#' + active_faded).remove();
            $('#popupLarge').remove();
            $('#popup_close_large').remove();
            active_faded = '';
            if (cropping) {
                cropping.cancelSelection();
            }
            $('.autocom').remove();
    });
    */

    close_error();
    return false;
}
function show_slider(inData) {
    var position = $('#mainsection').position();
    var top = $('#topbar').height() + $('#topdark').height() + $('#topblue').height() + 1;
    var put_width = window_width - 50;
    var put_width_close = put_width + 12;
    var closetop = top + 16;
    //width:' + put_width + 'px;
    var data = '<div id="sliding" style="top:' + top + 'px;left:-' + window_width + 'px;height:' + window_height + 'px;">';
    data += inData;
    data += '</div>';
    data += '<div id="close_sliding" style="top:' + closetop + 'px;left:' + put_width_close + 'px;">';
    data += '<a href="null.php" onclick="return close_slider();"><img src="imgs/icon-close.png" width="16" height="16" border="0" alt="Close" title="Close" /></a><br />';
    data += '<a href="null.php" onclick="return refresh_slider();"><img style="margin-top:8px;" src="imgs/icon-refresh.png" width="16" height="16" border="0" alt="Refresh" title="Refresh" /></a><br />';
    data += '<a href="null.php" onclick="return reload_active();"><img style="margin-top:8px;" src="imgs/icon-cache.png" width="16" height="16" border="0" alt="Rebuild Cache" title="Rebuild Cache" /></a>';
    data += '</div>';

    active_faded_main = unique_id();
    $('body')
        .append($('<div id="' + active_faded_main + '" class="faded_main"></div>')
        .hide()
            .fadeIn('100', function () {
                $('body').append(data);
                $('#sliding').animate({ left: 0, duration: 'fast' });
                $(function () {
                    //$('#sliding').jScrollPane();
                });
    }));
    closequickadd();
    closeuserbox();
}
function unique_id() {
    id = Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17);
    return id;
}
function handle_error(error) {
    if (error) {
        if (error == 'redirect') {
            show_inline_login();
            // window.location = 'login.php?notice=1';
        } else {
            $('#error_slide').remove();
            $('#error_slide_close').remove();
            data = '<div id="error_slide_close" onclick="return close_error();"></div><div id="error_slide"><div class="pad24">' + error + '</div></div>';
            $('body').append(data);
            $('#error_slide').animate({ bottom: 0, duration: 'fast' });
            closequickadd();
            close_loading();
        }
    }
}
function close_error() {
    $('#error_slide_close').remove();
    $('#error_slide').fadeOut('50', function () {
        $('#error_slide').remove();
        // $('#' + active_faded).remove();
    });
    return false;
}
function quick_add() {
    if ($("#quickpopli").length > 0) {
        closequickadd();
    } else {
        var final_content = '<ul id="quickpopli" style="top:82px;" class="poplist fonts small">';
        final_content += '<li><a href="returnnull.php" onclick="return load_page(\'account\',\'add\');">Add Account</a></li>';
        final_content += '<li><a href="returnnull.php" onclick="return load_page(\'contact\',\'add\');">Add Contact</a></li>';
        final_content += '<li><a href="returnnull.php" onclick="return load_page(\'member\',\'add\');">Add Member</a></li>';
        final_content += '<li><a href="returnnull.php" onclick="return popup(\'product-add\',\'\',\'1\');">Add Product</a></li>';
        final_content += '<li><a href="returnnull.php" onclick="return popup(\'invoice-add\',\'\',\'1\');">Add Invoice</a></li>';
        final_content += '<li><a href="returnnull.php" onclick="return popup(\'event-add\',\'\',\'1\');">Add Event</a></li>';
        final_content += '<li><a href="returnnull.php" onclick="return popup(\'content_type\',\'\',\'1\');">Add Content</a></li>';
        final_content += '</ul>';
        $('body').append($(final_content).fadeIn('fast'));
        $('#quickadd').attr('src', 'imgs/icon-minus.png');
    }
    return false;
}
function closequickadd() {
    $('#quickpopli').fadeOut('fast').remove();
    $('#user_boxli').fadeOut('fast').remove();
    $('#user_arrow').attr('src', 'imgs/down-arrow.png');
    $('#quickadd').attr('src', 'imgs/icon-quickadd.png');
}
function user_box() {
    if ($("#user_boxli").length > 0) {
        closeuserbox();
    } else {
        var topbarHeight = $('#topbar').innerHeight();
        var final_content = '<ul id="user_boxli" style="top:' + topbarHeight + 'px;" class="poplist fonts small">';
        final_content += '<li class="dividerpre"><a href="null.php" onclick="return popup(\'update_account\',\'\');">Update Account</a></li>';
        final_content += '<li class=""><a href="index.php?l=calendar">My Calendar</a></li>';
        final_content += '<li class=""><a href="index.php?l=notes&filters[]=25||label||eq||ppSD_notes&filters[]=1||complete||neq||ppSD_notes&order=deadline&dir=ASC">My Appointments</a></li>';
        final_content += '<li class=""><a href="index.php?l=notes&filters[]=4||label||eq||ppSD_notes&filters[]=1||complete||neq||ppSD_notes">My To-Do List</a></li>';
        final_content += '<li class=""><a href="index.php?l=notes&filters[]=1920-01-01%2000:01:01||deadline||neq||ppSD_notes&filters[]=1||complete||neq||ppSD_notes&order=deadline&dir=ASC">My Deadlines</a></li>';
        final_content += '<li class=""><a href="index.php?l=uploads">My Uploads</a></li>';
        final_content += '<li class="dividerpre"><a href="index.php?l=notes">My Notes</a></li>';
        final_content += '<li><a href="logout.php">Logout</a></li>';
        final_content += '</ul>';
        $('body').append($(final_content).fadeIn('fast'));
        $('#user_arrow').attr('src', 'imgs/up-arrow.png');
    }
    return false;
}
function closeuserbox() {
    $('#user_boxli').fadeOut('fast').remove();
    $('#user_arrow').attr('src', 'imgs/down-arrow.png');
}
function show_criteria_actions() {
    if ($("#criteria_actions").length > 0) {
        if ($("#criteria_actions").is(":visible")) {
            var imgsrc = 'imgs/down-arrow.png';
        } else {
            var imgsrc = 'imgs/up-arrow.png';
        }
        $('#filter_arrow1').attr('src', imgsrc);
        $('#criteria_actions').slideToggle('fast');
    }
    return false;
}
function show_filters() {
    if ($("#filters").length > 0) {
        if ($("#filters").is(":visible")) {
            var imgsrc = 'imgs/down-arrow.png';
        } else {
            var imgsrc = 'imgs/up-arrow.png';
        }
        $('#filter_arrow').attr('src', imgsrc);
        $('#filters').slideToggle('fast');
    }
    return false;
}
function close_filters() {
    var imgsrc = 'imgs/down-arrow.png';
    $('#filter_arrow').attr('src', imgsrc);
    $('#filters').slideUp('fast');
}
// ------------------------------------------------
// Resend an invoice.
function resend_invoice(id) {
    getadd = start_act();
    js_path_put = "cp-functions/resend_invoice.php";
    send_data = 'id=' + id;
    $.post(js_path_put, send_data, function (theResponse) {
        //console.log(theResponse);
        var returned = theResponse.split('+++');
        if (returned['0'] == "1") {
            show_saved('Sent');
        } else {
            handle_error(returned['1']);
        }
    });
    end_act();
    return false;
}
// ------------------------------------------------
// Preview Criteria
function preview_criteria(form) {
    show_loading();
    if ($("#crit_preview").length > 0) {
        close_crit_preview();
    } else {
        js_path_put = "cp-functions/preview_criteria.php";
        send_data = $('#' + form).serialize();
        $.post(js_path_put, send_data, function (theResponse) {
            $('#pop_inner').fadeOut('200', function () {
                // $('#criteriaPreview').html('');
                $('#' + usepop).append(theResponse);
                $('#preview_but').val('Close Preview');
            });
            close_loading();
        });
    }
    return false;
}
function close_crit_preview(form) {
    $('#crit_preview').remove();
    $('#pop_inner').fadeIn('200');
    $('#preview_but').val('Preview');
    close_loading();
    return false;
}
// ------------------------------------------------
//	Login Functions
// Verify admin login
function verifyLogin(form, inline) {
    getadd = start_act(form);
    js_path_put = "cp-functions/login.php";
    send_data = getadd;
    $.post(js_path_put, send_data, function (theResponse) {
        //console.log(theResponse);
        var returned = theResponse.split('+++');
        if (returned['0'] == "1") {
            if (inline == '1') {
                close_inline_login();
            } else {
                process_success(theResponse);
            }
        } else {
            if (returned['1'] == 'captcha') {
                $('#login_error').html('Verify that your are human!');
                $('#login_error').fadeIn('50');
                captcha(returned['2']);
            }
            else if (returned['1'] == 'captcha_in') {
                $('#login_error').html('Incorrect CAPTCHA submitted. Please try again.');
                $('#login_error').fadeIn('50');
                captcha(returned['2']);
            }
            else {
                if (returned['2'] == 'captcha_remove') {
                    closeDiv('captcha_block');
                }
                $('#login_error').html(returned['1']);
                $('#login_error').fadeIn('50');
            }
        }
    });
    end_act();
    return false;
}
// Process return success message
function process_success(msg) {
    var returned = msg.split('+++');
    if (returned['1'] == 'redirect') {
        window.location = returned['2'];
    } else {
        show_saved(returned['2']);
    }
    return false;
}
// Starts and ends an ajax call
function start_act(form) {

    // Show loading
    show_loading();
    // Process pagination form
    if (!form) {
        return '';
    } else {
        if ($('#' + form).length > 0) {
            if (!form) {
                form = 'pagination';
            }
            string = $('#' + form).serialize();
            return string;
        } else {
            return '';
        }
    }
}
function end_act() {
    close_loading();
}
function captcha(image) {
    $('#captcha_block').show();
    $('#captchaput').attr('src', image);
}
// Show a saved dialog
function show_saved(msg, no_auto_close) {
    if (!msg) {
        msg = 'Saved';
    }
    if (no_auto_close == '1') {
        var saved_data = '<div id="saved">' + msg + '</div>';
    } else {
        var saved_data = '<div id="saved" onclick="return close_saved();">' + msg + '</div>';
    }
    $('body').append($(saved_data).hide().fadeIn(100));
    if (no_auto_close == '1') {
        setTimeout("close_saved()", 15000);
    } else {
        setTimeout("close_saved()", 6000);
    }
    return false;
}
function close_saved() {
    $('#saved').fadeOut('50', function () {
        $('#saved').remove();
    });
    return false;
}
/**

 * Delete items from the admin contorl panel.

 */



function compile_delete(scope, form, special) {
    if (!form) {
        form = 'table_checkboxes';
    }
    send_data = $('#' + form).serialize() + '&special=' + special;
    delete_item(scope, '', send_data)
}
function delete_item(scope, id, id_list, close_sliderA, close_popup) {
    var agree = confirm("Confirm deletion. This is irreversible!");
    if (agree) {
        show_loading();
        if (!id_list) {
            send_data = 'scope=' + scope + '&' + id + '=1';
        } else {
            send_data = 'scope=' + scope + '&' + id_list;
        }
        $.post('cp-functions/delete_item.php', send_data, function (theResponse) {
            var returned = theResponse.split('+++');
            if (debug == 1) {
                console.log(theResponse);
            }
            if (returned['0'] == '1') {
                var found_cell = 0;
                deleted_id = returned['1'].split(',');
                for (var i = 0; i < deleted_id.length; i++) {
                    table_cell_id = 'td-cell-' + deleted_id[i];
                    if ($("#" + table_cell_id).length > 0) {
                        found_cell = 1;
                        $("#" + table_cell_id).fadeTo('fast', 0.25);
                        $("#" + table_cell_id).addClass('been_deleted');
                    }
                }
                if (found_cell != 1) {
                    show_saved();
                    close_loading();
                }
                if (close_sliderA == 1) {
                    close_slider();
                }
                if (close_popup == 1) {
                    close_popup();
                }
                if (close_popup == 2) {
                    close_large_popup();
                }
                close_loading();
            } else {
                handle_error(returned['1']);
            }
        });
    }
    return false;
}
/**

 * Quick edit feature

 */

function quickedit(table, search_col, search_for, changes) {
    show_loading();
    send_data = 'table=' + table + '&search_col=' + search_col + '&search_for=' + search_for + '&changes=' + changes;
    $.post('cp-functions/quickedit.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            show_saved();
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
/**

 * E-mail Send

 */

function email(type, id, etype) {
    show_loading();

    if (CKEDITOR) {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
    }

    send_data = 'user_type=' + type + '&user_id=' + id + '&email_type=' + etype + '&' + $('#email_form').serialize();
    $.post('cp-functions/prep_email.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            if (returned['2'] == '1') {
                show_saved(returned['1']);
                close_slider();
                close_loading();
            } else {
                show_saved('Sent');
                get_slider_subpage('overview');
                close_loading();
            }
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
/**

 * E-mail Send

 */

function sendtext(user_id, user_type) {
    show_loading();
    send_data = 'user_type=' + user_type + '&user_id=' + user_id + '&' + $('#popupform').serialize();
    $.post('cp-functions/send_sms.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            show_saved('Sent');
            close_popup();
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
/**

 * Populate custom template

 */

function populate_template(id, skip_close) {
    show_loading();

    send_data = 'id=' + id;
    $.post('cp-functions/get_template.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        //console.log(theResponse);
        if (returned['0'] == '1') {
            // Clear it.
            $('input[name="track"]').val(returned['8']);
            $('input[name="track_links"]').val(returned['7']);
            $('input[name="save"]').val(returned['6']);
            $('#email_bcc').val(returned['5']);
            $('#email_cc').val(returned['4']);
            $('#email_from').val(returned['3']);
            $('#email_subject').val(returned['2']);
            $('#email_message').val(returned['1']);
            // CKEDITOR.insertText(returned['1']);
            //CKEDITOR.updateElement();
            for (instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].setData(returned['1']);
                CKEDITOR.instances[instance].updateElement();
                //console.log(instance);
            }
            //editor.execCommand('inserthtml', returned['1']);
            //editor.updateTextArea();
            //editor.focus();
            if (! skip_close) {
                close_popup();
            }
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
/**

 * E-mail Preview

 */

function previewEmail(type, id, templateid) {
    if (!templateid) {
        templateid = '';
    }
    show_loading();

    // Update CKEDITOR instances
    if (CKEDITOR) {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
    }

    send_data = 'user_type=' + type + '&user_id=' + id + '&templateid=' + templateid + '&' + $('#email_form').serialize();
    $.post('cp-functions/preview_email.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            popup('template-preview', 'temp_id=' + returned['1'], '1');
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
/**

 * Preview an HTML Template

 */

function preview_template(id, type) {
    show_loading();
    // Update CKEDITOR instances
    if (CKEDITOR) {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
    }
    send_data = 'type=' + type + '&id=' + id + '&' + $('#popupform').serialize();

    //console.log(send_data);

    $.post('cp-functions/preview_template.php', send_data, function (theResponse) {
        var returned = theResponse.split('+++');
        if (debug == 1) {
            console.log(theResponse);
        }
        if (returned['0'] == '1') {
            //html = '<div style="width:100%;position:absolute;border:1px solid #000;z-index:99999;">';
            //html += '<iframe src="cp-functions/preview_template_show.php?id=' + id + '&preview_id=' + returned['1'] + '"></iframe>';
            //html += '</div>';
            //$(body).append(html);
            url = 'cp-functions/preview_template_show.php?id=' + returned['1'];
            window.open(url, 'Template Preview', 'fullscreen=yes,', false);
            close_loading();
        } else {
            handle_error(returned['1']);
        }
    });
    return false;
}
function addcontent(id) {

    // content_options
    content += 1;
    send_data = 'action=content_entry&number=' + content + '&id=' + id;
    $.post('cp-functions/product_addition.php', send_data, function (repSo) {
        $('#content_options tbody').append(repSo);
    });
    return false;
}
function delete_content(id) {
    $('#content_opt-' + id).remove();
}
function regen_graph() {
    graph = $('#graph_form').serialize();
    load_page(active_page, active_act, active_id, '', '0', graph);
    return false;
}


/**
 *
 * @param action
 * @param number
 * @param id
 * @returns {boolean}
 */
function getAdminField(action, number, id) {
    send_data = 'action=' + action + '&number=' + number + '&id=' + id;
    $.post('cp-functions/product_addition.php', send_data, function (repSo) {
        return repSo;
    });
    return false;
}

/**
 *
 * @param data
 */
function populateFormJson(data)
{
    $.each(data, function(name, val){
        var $el = $('[name="'+name+'"]'),
            type = $el.attr('type');

        switch(type){
            case 'checkbox':
                $el.attr('checked', 'checked');
                break;
            case 'radio':
                $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                break;
            default:
                $el.val(val);
        }
    });
}

/**
 * Quick Search
 */

var typingTimer;

function doQuickSearch(query)
{
    $('#ajax_search').remove();

    var length = query.length;
    if (length > 1) {
        send_data = 'q=' + query;
        $.post('cp-functions/search-ajax.php', send_data, function (theResponse) {
            var returned = theResponse.split('+++');
            if (debug == 1) {
                console.log(theResponse);
            }
            if (returned['0'] == '1') {
                data = '<div id="ajax_search">';
                data += returned['1'];
                data += '<div class="clear"></div>';
                //data += '<div class="close_search"><a href="null.php" onclick="return close_search();">Close Search Results</a></div>';
                data += '</div>';

                $('#ajax_search').remove();
                $('body').append(data);

                close_loading();
            } else {
                handle_error(returned['1']);
            }
        });
    }

    return false;
}

function quick_search(query) {
    show_loading();

    clearTimeout(typingTimer);

    typingTimer = setTimeout(function() {
        doQuickSearch(query);
    }, 1000);
}


/**
 * Other Stuff
 */
function close_search() {
    $('#ajax_search').slideUp('50');
    $('input[name=query]').val('Search');
    return false;
}
function show_div(id) {
    $('#' + id).slideDown();
    //update_popup_height();
}
function hide_div(id) {
    $('#' + id).slideUp();
    //update_popup_height();
}
function swap_div(show, hide) {
    $('#' + hide).fadeOut('100', function () {
        $('#' + show).fadeIn('100');
        //update_popup_height();
    });
}
function swap_multi_div(show, hide) {
    var spliting = hide.split(',');
    for (var i = 0; i < spliting.length; i++) {
        $('#' + spliting[i]).hide();
    }
    var splitingA = show.split(',');
    for (var i = 0; i < splitingA.length; i++) {
        //$('#' + splitingA[i]).fadeIn('100');
        $('#' + splitingA[i]).show();
        $('#' + splitingA[i]).addClass('animated fadeInUp');
    }
    update_popup_height();
}
