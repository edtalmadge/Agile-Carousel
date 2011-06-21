/*
 * Agile Carousel v alpha 1.1
 * http://agilecarousel.com/
 *
 * Copyright 2011, Ed Talmadge
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * 
 */

(function ($) {

    $.fn.agile_carousel = function (options) {

        var defaults = {
            timer: 0,
            continuous_scrolling: false,
            transition_type: "slide",
            transition_time: 600,
			number_slides_visible: 1,
			change_on_hover: "",
            control_set_1: "",
            control_set_2: "",
            control_set_3: "",
            control_set_4: "",
            control_set_5: ""
        };

        options = $.extend(defaults, options);


        return this.each(function () {

            var combined_slide_width = 0;
            var number_of_slides = 0;
            var ac_html = "";
            var ac_content = "";
            var ac_numbered_buttons = "";
            var ac_group_numbered_buttons = "";
            var ac_thumbnails = "";
            var ac_content_buttons = "";
            var ac_pause = "";
            var ac_previous_button = "";
            var ac_next_button = "";
            var ac_hover_previous_button = "";
            var ac_hover_next_button = "";
            var ac_slide_count = "";
            var ac_current_slide_number = "";
            var ac_trigger_type = "ac_click";
            var bd = "";
            var button_type = "";
            var trigger_type = "";
            var button_action = "";
            var go_direct = "";
            var ac_disabled = "";
            var current_slide_number = "";
            var next_slide_number = false;
            var current_slide_index = "";
            var next_slide_index = "";
            var current_slide = "";
            var next_slide = "";
            var continuous_scrolling = options.continuous_scrolling;
            var carousel_outer_width = options.carousel_outer_width;
            var carousel_outer_height = options.carousel_outer_height;
            var carousel_data = options.carousel_data;
            var change_on_hover = options.change_on_hover;
            var slide_width = options.slide_width;
            var slide_height = options.slide_height;
            var control_set_1 = options.control_set_1;
            var control_set_2 = options.control_set_2;
            var control_set_3 = options.control_set_3;
            var control_set_4 = options.control_set_4;
            var control_set_5 = options.control_set_5;
            var no_control_set = options.no_control_set;
            var persistent_content = options.persistent_content;
            var number_slides_visible = options.number_slides_visible;
            var transition_type = options.transition_type;
            var transition_time = options.transition_time;
            var timer = options.timer;
            var content = "";
            var obj_inner = "";
            var content_button = "";
			var $this = "";
			var timer_data = "";
			var ac_timer = "";

            // get the number of slides
            $.each(carousel_data, function (key, value) {
                number_of_slides++;
            });

            var slide_remainder = number_of_slides % number_slides_visible;

            var slide_number_conversion_array = [];
            var new_num = "";

            function get_trigger_type(check_me) {
                if (change_on_hover !== "") {
                    ac_trigger_type = "ac_click";
                    var change_on_hover_array = change_on_hover.split(",");
                    if ($.inArray(check_me, change_on_hover_array) != -1) {
                        ac_trigger_type = "ac_hover";
                    }
                }
                return ac_trigger_type;
            } // function

            ////////////////////////
            // Group Numbered Buttons
            //////////////////////// 

            var j = 0;
            var i = 0;
            for (i = 0; i < number_of_slides; i++) {

                if (i === 0) {
                    ac_group_numbered_buttons += "<div class='group_numbered_buttons_container button_container'>";
                } // if
                var curr_num = Math.floor((i + 1) / number_slides_visible) * number_slides_visible + 1;
                if (curr_num !== new_num && curr_num <= number_of_slides) {
                    slide_number_conversion_array[j] = curr_num;

                    ac_group_numbered_buttons += "<div class='slide_number_" + curr_num + " group_numbered_button slide_button " + get_trigger_type("group_numbered_buttons") + "' data-options='{\"button_type\":\"group_numbered_button\",\"button_action\":\"direct\",\"go_to\":" + curr_num + ", \"trigger_type\":\"" + ac_trigger_type + "\",\"disabled\": false}'>" + (j + 1) + "</div>";

                    new_num = curr_num;
                    
                    j++;
                }

                if (i === number_of_slides - 1) {
                    ac_group_numbered_buttons += "</div>";
                }

            } // for
            ////////////////////////
            // Pause Button
            //////////////////////// 
            ac_pause += "<span class='pause_button slide_button pause' data-options='{\"button_type\":\"pause_button\",\"trigger_type\": \"none\",\"disabled\": false,\"paused\": false}'>Pause</span>";

            ////////////////////////
            // Previous Button
            //////////////////////// 
            ac_previous_button += "<span class='previous_next_button previous_button slide_button " + get_trigger_type("previous_button") + "' data-options='{\"button_type\":\"previous_button\",\"button_action\":\"previous\",\"trigger_type\": \"" + ac_trigger_type + "\",\"disabled\": false}'>Prev</span>";

            ////////////////////////
            // Next Button
            //////////////////////// 
            ac_next_button += "<span class='previous_next_button next_button slide_button " + get_trigger_type("next_button") + "' data-options='{\"button_type\":\"next_button\",\"button_action\":\"next\",\"trigger_type\": \"" + ac_trigger_type + "\",\"disabled\": false}'>Next</span>";

            ////////////////////////
            // Hover Previous Button
            //////////////////////// 
            ac_hover_previous_button += "<div class='hover_previous_next_button hover_previous_button slide_button " + get_trigger_type("hover_previous_button") + "' data-options='{\"button_type\":\"hover_previous_button\",\"button_action\":\"previous\",\"trigger_type\": \"" + ac_trigger_type + "\",\"disabled\": false}'><span style='opacity: 0;' class='hover_previous_next_button_inner'>Prev</span></div>";

            ////////////////////////
            // Hover Next Button
            //////////////////////// 
            ac_hover_next_button += "<div class='hover_previous_next_button hover_next_button slide_button " + get_trigger_type("hover_next_button") + "' data-options='{\"button_type\":\"hover_next_button\",\"button_action\":\"next\",\"trigger_type\": \"" + ac_trigger_type + "\",\"disabled\": false}'><span style='opacity: 0;' class='hover_previous_next_button_inner'>Next</span></div>";

            ////////////////////////
            // Slide Count
            //////////////////////// 
            ac_slide_count += "<span class='slide_count'>" + number_of_slides + "</span>";

            ////////////////////////
            // Current Slide Number
            //////////////////////// 
            ac_current_slide_number += "<span class='current_slide_number'>1</span>";

            // render beginning of div containers
            ac_html += "<div class='agile_carousel' style='overflow: hidden; position: relative; width: " + carousel_outer_width + "px; height: " + carousel_outer_height + "px;'>";

            var obj = $(this);
            i = 1;
            for (var key in carousel_data) {

                if (carousel_data.hasOwnProperty(key)) {


                    obj_inner = carousel_data[key];
                    content = obj_inner.content;
                    var thumbnail_button = obj_inner.thumbnail_button;
                    content_button = obj_inner.content_button;


                    ////////////////////////
                    // Slides
                    ////////////////////////


                    if (i === 1) {
                        ac_html += "<div class='slides' style='width: " + slide_width * number_of_slides + "px; height: " + slide_height + "px;'>";
                    } // if
                    if (content) {
                        // render
                        ac_html += "<div class='slide_" + i + " slide' style='border: none; margin: 0; padding: 0; height: " + slide_height + "px; width: " + slide_width + "px;'>" + content + "</div>";
                    } // if obj_inner.content
                    if (i === number_of_slides) {
                        ac_html += "</div>";
                    }


                    ////////////////////////
                    // Numbered Buttons
                    ////////////////////////
                    if (i == 1) {
                        ac_numbered_buttons += "<div class='numbered_buttons_container  button_container'>";
                    } // if
                    ac_numbered_buttons += "<div class='slide_number_" + i + " numbered_button slide_button " + get_trigger_type("numbered_buttons") + "' data-options='{\"button_type\":\"numbered_button\",\"button_action\":\"direct\",\"go_to\":" + i + ", \"trigger_type\":\"" + ac_trigger_type + "\",\"disabled\": false}'>" + i + "</div>";

                    if (i == number_of_slides) {
                        ac_numbered_buttons += "</div>";
                    }



                    ////////////////////////
                    // Thumbnails
                    ////////////////////////						
                    if (thumbnail_button) {

                        if (i == 1) {
                            ac_thumbnails += "<div class='thumbnail_buttons_container  button_container'>";
                        } // if
                        ac_thumbnails += "<div class='slide_number_" + i + " thumbnail_button slide_button " + get_trigger_type("thumbnails") + "'  data-options='{\"button_type\":\"thumbnail_button\",\"button_action\":\"direct\",\"go_to\":" + i + ",\"trigger_type\": \"" + ac_trigger_type + "\",\"disabled\": false}'>" + thumbnail_button + "</div>";

                        if (i == number_of_slides) {
                            ac_thumbnails += "</div>";
                        } // if

                    } // if

                    ////////////////////////
                    // Content Button
                    ////////////////////////
                    if (content_button) {

                        if (i == 1) {
                            ac_content_buttons += "<div class='content_buttons_container  button_container'>";
                        } // if
                        ac_content_buttons += "<div class='slide_number_" + i + " content_button_" + i + " content_button slide_button " + get_trigger_type("content_buttons") + "' data-options='{\"button_type\":\"content_button\",\"button_action\":\"direct\",\"go_to\":" + i + ",\"trigger_type\": \"" + ac_trigger_type + "\",\"disabled\": false}'><div class='content_button_inner'>" + content_button + "</div></div>";

                        if (i == number_of_slides) {
                            ac_content_buttons += "</div>";
                        } // if
                    }

                    i++;


                } // if has own property
            } // for
            var create_control_set = function (set, set_number) {
                var control_set_html = "";
                if (set !== "") {
                    if (set_number) {
                        control_set_html += "<div class='control_set_" + set_number + " control_set'><div class='control_set_" + set_number + "_inner control_set_inner'>";
                    }

                    var control_set_array = set.split(",");

                    for (j = 0; j < control_set_array.length; j++) {

                        // numbered_buttons
                        if (control_set_array[j] == "numbered_buttons") {
                            control_set_html += ac_numbered_buttons;
                        }

                        // group_numbered_buttons
                        if (control_set_array[j] == "group_numbered_buttons") {
                            control_set_html += ac_group_numbered_buttons;
                        }

                        // thumbnails
                        if (control_set_array[j] == "thumbnails") {
                            control_set_html += ac_thumbnails;
                        }
                        // content_buttons
                        if (control_set_array[j] == "content_buttons") {
                            control_set_html += ac_content_buttons;
                        }
                        // pause_button
                        if (control_set_array[j] == "pause_button") {
                            control_set_html += ac_pause;
                        }
                        // previous_button
                        if (control_set_array[j] == "previous_button") {
                            control_set_html += ac_previous_button;
                        }
                        // previous_button
                        if (control_set_array[j] == "next_button") {
                            control_set_html += ac_next_button;
                        }
                        // hover_previous_button
                        if (control_set_array[j] == "hover_previous_button") {
                            control_set_html += ac_hover_previous_button;
                        }
                        // hover_next_button
                        if (control_set_array[j] == "hover_next_button") {
                            control_set_html += ac_hover_next_button;
                        }
                        // slide_count
                        if (control_set_array[j] == "slide_count") {
                            control_set_html += ac_slide_count;
                        }
                        // current_slide_number
                        if (control_set_array[j] == "current_slide_number") {
                            control_set_html += ac_current_slide_number;
                        }

                    } // for

                    if (set_number) {
                        control_set_html += "</div></div>";
                    }

                    ac_html += control_set_html;

                } // if
            }; // function


            if (options.control_set_1) {
                create_control_set(control_set_1, 1);
            } // if
            if (options.control_set_2) {
                create_control_set(control_set_2, 2);
            } // if
            if (options.control_set_3) {
                create_control_set(control_set_3, 3);
            } // if
            if (options.control_set_4) {
                create_control_set(control_set_4, 4);
            } // if
            if (options.control_set_5) {
                create_control_set(control_set_5, 5);
            } // if
            if (options.no_control_set) {
                create_control_set(no_control_set);
            } // if
            if (persistent_content) {
                ac_html += persistent_content;
            }

            ac_html += "</div>";

            obj.html(ac_html);

            var ac_slides = obj.find(".slide");
            var ac_slides_container = obj.find(".slides");
            var ac_slide_buttons = obj.find(".slide_button");
            var ac_slide_buttons_length = ac_slide_buttons.length;
            var agile_carousel = obj.find(".agile_carousel");

            var ac_previous_buttons = obj.find(".previous_button, .hover_previous_button");
            var ac_previous_buttons_length = ac_previous_buttons.length;
            var ac_next_buttons = obj.find(".next_button, .hover_next_button");

            // kludge - above variables not working in disable_buttons function - disabled is undefined in disable_buttons function
            var previous_button = obj.find(".previous_button");
            var previous_button_length = previous_button.length;
            var hover_previous_button = obj.find(".hover_previous_button");
            var hover_previous_button_length = hover_previous_button.length;
            var next_button = obj.find(".next_button");
            var next_button_length = next_button.length;
            var hover_next_button = obj.find(".hover_next_button");
            var hover_next_button_length = hover_next_button.length;

            
            function disable_buttons(slide_num) {

                if (continuous_scrolling === false && number_slides_visible < 2) {

                    // if first slide
                    if (slide_num == 1) {
                        if (previous_button_length > 0) {
                            previous_button.addClass("ac_disabled");
                            previous_button.data("options").disabled = true;
                        } // if
                        // error
                        if (hover_previous_button_length > 0) {
                            hover_previous_button.addClass("ac_disabled");
                            hover_previous_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (previous_button_length > 0) {
                            previous_button.removeClass("ac_disabled");
                            previous_button.data("options").disabled = false;
                        } // if
                        if (hover_previous_button_length > 0) {
                            hover_previous_button.removeClass("ac_disabled");
                            hover_previous_button.data("options").disabled = false;
                        } // if
                    }

                    // if last slide
                    if (slide_num == number_of_slides) {
                        if (next_button_length > 0) {
                            next_button.addClass("ac_disabled");
                            next_button.data("options").disabled = true;
                        } // if
                        if (hover_next_button_length > 0) {
                            hover_next_button.addClass("ac_disabled");
                            hover_next_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (next_button_length > 0) {
                            next_button.removeClass("ac_disabled");
                            next_button.data("options").disabled = false;
                        } // if
                        if (hover_next_button_length > 0) {
                            hover_next_button.removeClass("ac_disabled");
                            hover_next_button.data("options").disabled = false;
                        } // if
                    }

                } // if
				
                if (continuous_scrolling === false && number_slides_visible > 1) {

                    // if first slide
                    if (slide_num <= number_slides_visible) {
                        if (previous_button_length > 0) {
                            previous_button.addClass("ac_disabled");
                            previous_button.data("options").disabled = true;
                        } // if
                        if (hover_previous_button_length > 0) {
                            hover_previous_button.addClass("ac_disabled");
                            hover_previous_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (previous_button_length > 0) {
                            previous_button.removeClass("ac_disabled");
                            previous_button.data("options").disabled = false;
                        } // if
                        if (hover_previous_button_length > 0) {
                            hover_previous_button.removeClass("ac_disabled");
                            hover_previous_button.data("options").disabled = false;
                        } // if
                    }

                    // if last slide
                    if (slide_num >= (number_of_slides - number_slides_visible + slide_remainder)) {
                        if (next_button_length > 0) {
                            next_button.addClass("ac_disabled");
                            next_button.data("options").disabled = true;
                        } // if
                        if (hover_next_button_length > 0) {
                            hover_next_button.addClass("ac_disabled");
                            hover_next_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (next_button_length > 0) {
                            next_button.removeClass("ac_disabled");
                            next_button.data("options").disabled = false;
                        } // if
                        if (hover_next_button_length > 0) {
                            hover_next_button.removeClass("ac_disabled");
                            hover_next_button.data("options").disabled = false;
                        } // if
                    }

                } // if

            } // function

            var current_slide_number_display = obj.find(".current_slide_number");
            var current_slide_number_display_length = current_slide_number_display.length;

            // update slide number

            function update_current_slide_number(slide_num) {
                if (current_slide_number_display_length > 0) {
                    current_slide_number_display.html(slide_num);
                }
            }

            // add/remove class for buttons corresponding to selected slides


            function add_selected_class(slide_num) {
                obj.find(".ac_selected").removeClass("ac_selected");
                obj.find(".slide_number_" + slide_num).addClass("ac_selected");
            }
            
            // prepare carousel for number_slides_visible = 1
            if (number_slides_visible == 1) {
                ac_slides.eq(0).css({
                    "position": "absolute",
                    "top": 0,
                    "left": 0
                });
                ac_slides.slice(1, number_of_slides).css({
                    "position": "absolute",
                    "top": "-5000px",
                    "left": 0
                });
                ac_slides_container.css("width", slide_width + "px");

            }

            // prepare carousel for number_slides_visible > 1
            if (number_slides_visible > 1) {

                agile_carousel.css("width", number_slides_visible * slide_width + "px");

                var k = 0;

                for (k = 1; k <= number_of_slides; k++) {

                    ac_slides.eq(k).css({
                        "position": "absolute",
                        "top": 0,
                        "left": slide_width * k + "px"

                    });
                } // for
            } // if

            var fade_complete = function () {
                current_slide.css({
                    "z-index": 10,
                    top: -5000
                });
            };

            var slide_complete = function () {
                current_slide.css({
                    "position": "absolute",
                    "top": "-5000px",
                    "left": 0
                });
            };


            // prepare carousel for all
            disable_buttons(1);
            update_current_slide_number(1);
            add_selected_class(1);

            // if a hoveer transition button is hovered over for 1 seconds, then simulate click
            button_type = bd.button_type;
            current_slide_number = 1;


            var slide_number_conversion_array_last = slide_number_conversion_array[slide_number_conversion_array.length - 1];

            ///////////////////////////////
            ///////////////////////////////
            ///////// Transition Slides
            ///////////////////////////////
            ///////////////////////////////

            function transition_slides(button_data) {

                bd = $(button_data)[0];
                var ac_disabled = bd.disabled;

                if (ac_disabled !== true) {

                    button_type = bd.button_type;
                    trigger_type = bd.trigger_type;
                    button_action = bd.button_action;
                    var go_to = bd.go_to;
                    ac_disabled = bd.disabled;

                    if (next_slide_number !== false) {
                        current_slide_number = next_slide_number;
                    }


                    current_slide_index = current_slide_number - 1;
                    current_slide = $(ac_slides).eq(current_slide_index);


                    // calculate the next_slide_number
                    ///////////////////////////
                    ///////////////////////////
                    ////// One Slide Visible
                    ///////////////////////////
                    ///////////////////////////
                    if (number_slides_visible < 2) {
                        if (button_action == "next" && current_slide_number < number_of_slides) {
                            next_slide_number = current_slide_number + 1;
                        } else if (button_action == "next" && current_slide_number == number_of_slides) {
                            next_slide_number = 1;
                        }


                        // go back
                        if (button_action == "previous" && current_slide_number > 1) {
                            next_slide_number = current_slide_number - 1;

                            // go to last slide position
                        } else if (button_action == "previous" && current_slide_number == 1) {
                            next_slide_number = number_of_slides;
                        }

                    } // if
                    ///////////////////////////
                    ///////////////////////////
                    ////// Multiple Slides Visible
                    ///////////////////////////
                    ///////////////////////////
                    if (number_slides_visible > 1) {


                        if (button_action == "next" && current_slide_number < (number_of_slides - number_slides_visible + slide_remainder)) {

                            next_slide_number = slide_number_conversion_array[Math.ceil(current_slide_number / number_slides_visible)];


                        } else if (button_action == "next" && current_slide_number >= (number_of_slides - number_slides_visible + slide_remainder) && number_slides_visible > 1) {
                            next_slide_number = 1;

                        }

                        // go back
                        if (button_action == "previous" && current_slide_number > number_slides_visible && number_slides_visible > 1) {
                            var curr_lookup = Math.floor(current_slide_number / number_slides_visible);
                            curr_lookup = curr_lookup - 1;
                            next_slide_number = slide_number_conversion_array[curr_lookup];

                            // go to last slide position
                        } else if (button_action == "previous" && current_slide_number <= number_slides_visible && number_slides_visible > 1) {
                            next_slide_number = slide_number_conversion_array_last;
                        }

                    } // if
                    if (button_action == "direct") {
                        next_slide_number = go_to;
                    }


                    next_slide_index = next_slide_number - 1;
                    next_slide = $(ac_slides).eq(next_slide_index);

                    add_selected_class(next_slide_number);
                    update_current_slide_number(next_slide_number);


                    if (next_slide_index != current_slide_index) {


                        /////////////////////////////////
                        /////////////////////////////////
                        ///// Sliding Transition - more than one slide visible
                        /////////////////////////////////
                        /////////////////////////////////
                        if (transition_type == "slide" && number_slides_visible > 1) {


                            ac_slides_container.stop().animate({
                                "left": ((next_slide_number * slide_width) - slide_width) * -1 + "px"
                            }, {
                                duration: transition_time
                            });



                        } // if

                        /////////////////////////////////
                        /////////////////////////////////
                        ///// Sliding Transition - 1 slide visible
                        /////////////////////////////////
                        /////////////////////////////////
                        if (transition_type == "slide" && number_slides_visible == 1) {

                            // change slide position - go forward
                            var animate_current_slide_to = "";

                            if (button_action == "next" || (next_slide_number > current_slide_number) && button_action == "direct") {
                                next_slide.css({
                                    top: 0,
                                    left: slide_width
                                });

                                animate_current_slide_to = slide_width * -1;

                            }

                            // change slide position - go back
                            if (button_action == "previous" || (next_slide_number < current_slide_number && button_action == "direct")) {
                                next_slide.css({
                                    top: 0,
                                    left: slide_width * -1
                                });

                                animate_current_slide_to = slide_width;
                            }

                            // animate slides


                            //,{  duration:300, complete: fade_complete}
                            current_slide.stop().animate({
                                "left": animate_current_slide_to + "px"
                            }, {
                                duration: transition_time,
                                complete: slide_complete
                            });
                            next_slide.stop().animate({
                                "left": "0px"
                            }, {
                                duration: transition_time
                            });
							
                        } // if transition type is slide										


                        /////////////////////////////////
                        /////////////////////////////////
                        ///// Fade Transition - 1 slide visible
                        /////////////////////////////////
                        /////////////////////////////////
                        if (transition_type == "fade" && number_slides_visible == 1) {

                            //if(trigger_type == "ac_hover"){
                            //ac_slides.stop();
                            //}
                            // change slide position
                            // rest of the slides 
                            ac_slides.not(current_slide, next_slide).css({
                                "top": "-5000px",
                                "left": 0,
                                "z-index": 0,
                                "opacity": 0
                            });

                            // next slide
                            if (button_action) {
                                next_slide.css({
                                    "top": 0,
                                    "left": 0,
                                    "z-index": 20
                                });

                                // current slide
                                current_slide.css({
                                    "z-index": 10,
                                    "opacity": 1
                                });


                            } // if
                            // animate slides
                            next_slide.stop().animate({
                                "opacity": 1
                            }, {
                                duration: transition_time,
                                complete: fade_complete
                            });



                        } // if transition type is slide	
                    } // if current slide is not the next slide
                } // if slide button is not disabled && transition complete

                disable_buttons(next_slide_number);
                add_selected_class(next_slide_number);

            } // transition_slides;
			



			/////////////////////
			///////// button behavior
			////////////////////
			
			
            var agile_carousel_buttons_click = obj.find(".ac_click");
            var agile_carousel_buttons_hover = obj.find(".ac_hover");
			
            // start timer
            if(timer !== 0){
                ac_timer = setInterval(timer_transition, timer);
            }

            var pause_button = obj.find(".pause_button");

            function pause_slideshow() {

                if(pause_button.length > 0){
					pause_button.html("play");
               		pause_button.data("options").paused = true;
                	pause_button.addClass("play_button");
				}
                clearInterval(ac_timer);
            } // function


			/////////////////
			//////// click button
			////////////////
		
			 $(agile_carousel_buttons_click).click(function(){
				 pause_slideshow();
				if(obj.find(':animated').length < 1){
					transition_slides($(this).data().options);
				} else {
					$this = $(this);
					// don't use timer on next & previous buttons... causes strage, infinite cycle
					if($this.data("options").button_action != "next" && $this.data("options").button_action != "previous") {
							function check_transition(){
									
									if(ac_slides_container.find(':animated').length < 1){
										transition_slides($this.data().options);
										clearInterval($this.data("options").timeout);
									} // if
								} // function
								
							t = setInterval(check_transition,30);	
								
							$this.data("options").timeout = t;
					}// if
				} // else
			
			}); // click
			
			
			/////////////////
			//////// hover button
			////////////////
			
			$(agile_carousel_buttons_hover).hover(function() {
				pause_slideshow();
    			if(ac_slides_container.find(':animated').length < 1){
					transition_slides($(this).data().options);

				} else {
						$this = $(this);
						
						function check_transition(){
								
								if(ac_slides_container.find(':animated').length < 1){
									transition_slides($this.data().options);
									clearInterval($this.data("options").timeout);
								} // if
							} // function
							
						t = setInterval(check_transition,30);	
							
						$this.data("options").timeout = t;
					
					} // else
				
				}, function() {
    				$this = $(this);
					clearInterval($this.data("options").timeout);
			});


            ////////////////////////////
            ////////////////////////////
            //////// Timer
            ////////////////////////////
            ////////////////////////////


			 timer_data = {
                "button_action": "next",
                "button_type": "pause",
                "disabled": false,
                "trigger_type": "ac_click"
            };

			
            function timer_transition() {
                transition_slides(timer_data);
            }

           

            function play_slideshow() {
                clearInterval(ac_timer);
                pause_button.html("pause");
                pause_button.data("options").paused = false;
                pause_button.addClass("pause_button");
				pause_button.removeClass("play_button");
                transition_slides(timer_data);
                ac_timer = setInterval(timer_transition, timer);
                return ac_timer;
            } // function
            // play/pause button behavior
            pause_button.click(function () {
                var $this = $(this);
                if ($this.data("options").paused === true) {
                    play_slideshow();

                } else if ($this.data("options").paused === false) {
                    pause_slideshow();
                    clearInterval(ac_timer);
                }
            }); // click

            // hover previous and hover next buttons
            
            $('.hover_previous_next_button').hover(function() {
                $(this).find(".hover_previous_next_button_inner").stop().fadeTo("fast", 0.85);
            },
            // function
            function() {
                $(this).find(".hover_previous_next_button_inner").stop().fadeTo("fast", 0.00);
            }); // hover

        }); // each
    }; // function
})(jQuery);