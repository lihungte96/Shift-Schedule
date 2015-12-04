'use strict';

(function (exports) {
    /**
     *
     *  @constructor
     *  @this {Calendar}
     */
    var view_date = null;
    var db = null;
    var schedule_type;
    var schedule_code;
    var Calendar = function () {
        this.view_date = new Date();
        this.schedule_type = [
            { id: 0, color: '#555555', word: '休假' },
            { id: 1, color: '#cc0000', word: '早班' },
            { id: 2, color: '#00cc00', word: '小夜' },
            { id: 3, color: '#0000cc', word: '大夜' }];
        this.schedule_code = -1;
    };
    Calendar.prototype = {
        /**
         * 
         * @this {Calendar}
         */
        start() {
            var now_date = new Date();
            document.getElementById('return').textContent = now_date.getFullYear() + '/' + (now_date.getMonth() + 1);
            window.addEventListener('click', this);
            this.init_db(this).then(this.paint_online.bind(this)).catch(this.paint_offline.bind(this));
        },
        init_db(calendar_object) {
            return new Promise((function (resolve, reject) {
                console.log('init_db');

                if (!window.indexedDB) {
                    alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                }

                var DBOpenRequest = window.indexedDB.open('indexedDB', 3);
                DBOpenRequest.onerror = function (event) {
                    console.log('db error');
                    reject();
                };

                DBOpenRequest.onupgradeneeded = function (event) {
                    console.log('db upgrade');
                    calendar_object.db = event.target.result;
                    calendar_object.db.onerror = function (event) {
                        alert('db upgrade error')
                    };

                    var dateobjectStore = calendar_object.db.createObjectStore("date", { keyPath: "ssn" });
                    dateobjectStore.createIndex("year", "year", { unique: false });
                    dateobjectStore.createIndex("mounth", "mounth", { unique: false });

                    var colorobjectStore = calendar_object.db.createObjectStore("color", { keyPath: "id" });
                    colorobjectStore.onsuccess = function (event) {
                    }
                    for (var i in calendar_object.schedule_type) {
                        colorobjectStore.add(calendar_object.schedule_type[i])
                    }
                    reject();
                };
                DBOpenRequest.onsuccess = function (event) {
                    console.log('db success');
                    calendar_object.db = DBOpenRequest.result;
                    var objectStore = calendar_object.db.transaction("color").objectStore("color");
                    calendar_object.schedule_type = [];

                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            calendar_object.schedule_type.push(cursor.value);
                            cursor.continue();
                        } else {
                            resolve();
                        }
                    };
                    //resolve();
                };
            }).bind(this));
        },
        paint_online() {
            console.log('paint_online');
            var display_mounth = document.getElementById('display_mounth');
            display_mounth.textContent = (this.view_date.getFullYear()) + '年' + (this.view_date.getMonth() + 1) + '月';

            this.view_date.setDate(0);
            while (this.view_date.getDay() > 0) {
                this.view_date.setDate(this.view_date.getDate() - 1);
            }

            var display = document.getElementById('display');
            display.innerHTML = '';
            var a_mounth = document.createElement('table');
            display.appendChild(a_mounth);
            a_mounth.id = 'display_table';
            var color_class = "previous_mounth";
            for (var i = 1; i <= 6; i++) {
                var a_week = document.createElement('tr');
                a_mounth.appendChild(a_week);
                for (var j = 0; j < 7; j++, this.view_date.setDate(this.view_date.getDate() + 1)) {
                    var a_day = document.createElement('td');
                    a_week.appendChild(a_day);
                    if (this.view_date.getDate() == 1) {
                        if (color_class == "previous_mounth") {
                            color_class = "this_mounth";
                        }
                        else
                            color_class = "next_mounth";
                    }
                    var id = this.view_date.getFullYear() + '/' + (this.view_date.getMonth() + 1) + '/' + this.view_date.getDate();
                    a_day.setAttribute('id', id);
                    a_day.classList.add(color_class);
                    a_day.textContent = this.view_date.getDate();
                    this.read(id).then(this.show_schedule.bind(this)).catch(this.show_schedule.bind(this));
                }
            }
            this.view_date.setMonth(this.view_date.getMonth() - 1);
            var today = new Date();
            if (today.getMonth() - 1 == this.view_date.getMonth() || today.getMonth() == this.view_date.getMonth() || today.getMonth() + 1 == this.view_date.getMonth())
                document.getElementById(today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()).classList.add('today');
            var a = this.show_schedule_check(this);
            console.log(a);
        },
        paint_offline() {
            console.log('paint_offline');
            var display_mounth = document.getElementById('display_mounth');
            display_mounth.textContent = (this.view_date.getFullYear()) + '年' + (this.view_date.getMonth() + 1) + '月';

            this.view_date.setDate(0);
            while (this.view_date.getDay() > 0) {
                this.view_date.setDate(this.view_date.getDate() - 1);
            }

            var display = document.getElementById('display');
            var a_mounth = document.createElement('table');
            a_mounth.id = 'display_table';
            var color_class = "previous_mounth";
            for (var i = 1; i <= 6; i++) {
                var a_week = document.createElement('tr');
                for (var j = 0; j < 7; j++, this.view_date.setDate(this.view_date.getDate() + 1)) {
                    if (this.view_date.getDate() == 1) {
                        if (color_class == "previous_mounth") {
                            color_class = "this_mounth";
                        }
                        else
                            color_class = "next_mounth";
                    }
                    var a_day = document.createElement('td');
                    var id = this.view_date.getFullYear() + '/' + (this.view_date.getMonth() + 1) + '/' + this.view_date.getDate();
                    a_day.setAttribute('id', id);
                    a_day.classList.add(color_class);
                    a_day.textContent = this.view_date.getDate();
                    a_day.classList.add(this.schedule_type[0].word);
                    a_day.innerHTML += '<br/>' + this.schedule_type[0].word;
                    a_week.appendChild(a_day);
                }
                a_mounth.appendChild(a_week);
            }
            this.view_date.setMonth(this.view_date.getMonth() - 1);
            display.innerHTML = '';
            display.appendChild(a_mounth);
            var today = new Date();
            document.getElementById(today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()).classList.add('today');
        },
        show_schedule_check(calendar_object) {
            var objectStore = this.db.transaction("date").objectStore("date");
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    console.log("Name for SSN " + cursor.value.mounth + " is " + cursor.value.schedule_type_word);
                    if (cursor.value.mounth - 1 == calendar_object.view_date.getMonth() || cursor.value.mounth == calendar_object.view_date.getMonth() || cursor.value.mounth + 1 == calendar_object.view_date.getMonth()) {
                        return true;
                        cursor.continue();
                    }
                }
                else {
                    console.log("No more entries!");
                    return false;
                }
            };
        },
        show_schedule(read_data) {
            var a_day = document.getElementById(read_data.id);
            a_day.classList.add(read_data.schedule_type_word);
            a_day.innerHTML += '<br/>' + read_data.schedule_type_word;
            if (a_day.classList.contains('this_mounth')) {
                var i = 1;
                for (i in this.schedule_type) {
                    if (read_data.schedule_type_word == this.schedule_type[i].word) {
                        a_day.style.backgroundColor = this.schedule_type[i].color;
                    }
                }
            }
        },
        handleEvent(event) {
            switch (event.type) {
                case 'click':
                    if (event.target.classList.contains('previous_mounth')) {
                        if (this.schedule_code == -1) {
                            this.view_date.setMonth(this.view_date.getMonth() - 1);
                            this.paint_online();
                        }
                    }
                    if (event.target.classList.contains('next_mounth')) {
                        if (this.schedule_code == -1) {
                            this.view_date.setMonth(this.view_date.getMonth() + 1);
                            this.paint_online();
                        }
                    }
                    if (event.target.id == 'more') {
                        $('#menutable').toggle();
                        //$('#previous_mounth').toggle();
                        //$('#next_mounth').toggle();
                        $('#previous_mounth')[0].style.display = 'inline-block';
                        $('#next_mounth')[0].style.display = 'inline-block';
                        if ($('#menutable')[0].style.display == 'block')
                            $('#menutable')[0].style.display = 'inline';
                        $('#edittable')[0].style.display = 'none';
                        $('#edit')[0].style.backgroundColor = '#FF7F12';
                        this.schedule_code = -1;
                    }
                    if (event.target.id == 'setting') {
                        window.location.assign('./setting.html')
                    }
                    if (event.target.id == 'edit') {
                        $('#edittable').toggle();
                        $('#previous_mounth').toggle();
                        $('#next_mounth').toggle();
                        //$('#previous_mounth')[0].style.display = 'none';
                        //$('#next_mounth')[0].style.display = 'none';
                        $('#edit')[0].style.backgroundColor = '#FF7F12';
                        this.paint_edittable();
                        this.schedule_code = -1;
                    }
                    if (event.target.id == 'return') {
                        if (this.schedule_code == -1) {
                            this.view_date = new Date();
                            this.paint_online();
                        }
                    }
                    if (event.target.classList.contains('edit_button')) {
                        for (var i in this.schedule_type) {
                            if (event.target.id == this.schedule_type[i].word) {
                                this.schedule_code = this.schedule_type[i].id;
                                $('#edit')[0].style.backgroundColor = this.schedule_type[i].color;
                                break;
                            }
                        }
                    }
                    if (this.schedule_code != -1) {
                        if (''.contains) {//for firefox os
                            if (event.target.id.contains('/')) {
                                this.save_schedule(event.target.id);
                            }
                        }
                        else {//for web browser
                            if (event.target.id.includes('/')) {
                                this.save_schedule(event.target.id);
                            }
                        }
                    }
                    break;
            }
        },
        paint_edittable() {
            var edittable = document.getElementById('edittable');
            edittable.innerHTML = '';
            for (var i in this.schedule_type) {
                var edit_option = document.createElement('button');
                edit_option.className = 'edit_button';
                edit_option.classList.add(this.schedule_type[i].word);
                edit_option.id = this.schedule_type[i].word;
                edit_option.innerHTML = this.schedule_type[i].word;
                edit_option.style.backgroundColor = this.schedule_type[i].color;
                edittable.appendChild(edit_option);
            }
        },
        save_schedule(id) {
            var a_day = document.getElementById(id);
            for (var i in this.schedule_type) {
                a_day.classList.remove(this.schedule_type[i].word);
            }
            a_day.classList.add(this.schedule_type[this.schedule_code].word);
            a_day.innerHTML = id.slice(id.lastIndexOf('/') + 1, id.length) + '<br/>' + this.schedule_type[this.schedule_code].word;
            if (a_day.classList.contains('this_mounth')) {
                a_day.style.backgroundColor = this.schedule_type[this.schedule_code].color;
            }
            var year = id.slice(0, id.indexOf('/', 0));
            var mounth = id.slice(id.indexOf('/', 0) + 1, id.lastIndexOf('/'));
            var data = { ssn: id, year: year, mounth: mounth, schedule_type_word: this.schedule_type[this.schedule_code].word };
            this.save(data);
        },
        save(data) {
            var transaction = this.db.transaction(["date"], "readwrite");

            transaction.onerror = function (event) {
                console.log('save error')
                // Don't forget to handle errors!
            };
            var objectStore = transaction.objectStore("date");
            var objectStoreRequest = objectStore.put(data);
            objectStoreRequest.onsuccess = function (event) {
                console.log("save done");
            };
        },
        read(id) {
            return new Promise((function (resolve, reject) {
                var transaction = this.db.transaction(["date"]);
                var objectStore = transaction.objectStore("date");
                var request = objectStore.get(id);
                var read_data = {
                    id: id,
                    schedule_type_word: '休假'
                };

                request.onerror = function (event) {
                    console.log(id + 'read error');
                    reject(read_data);
                };
                request.onsuccess = function (event) {
                    // Do something with the request.result!
                    if (request.result) {
                        read_data.schedule_type_word = request.result.schedule_type_word;
                        resolve(read_data);
                    }
                    else {
                        console.log("Name for SSN id is empty");
                        resolve(read_data);
                    }
                };
            }).bind(this));
        }
    };
    exports.Calendar = Calendar;
})(window);
