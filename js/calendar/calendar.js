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
    var salary;
    var Calendar = function () {
        this.view_date = new Date();
        this.schedule_type = [
            { id: 0, color: '#FFC2FF', word: '休假', salary: 0 },
            { id: 1, color: '#FFFF00', word: '白班', salary: 300 },
            { id: 2, color: '#0BF80B', word: '小夜', salary: 400 },
            { id: 3, color: '#2AEAEA', word: '大夜', salary: 500 },
            { id: 4, color: '#cc00cc', word: '其他', salary: 1000 }];
        this.schedule_code = -1;
        this.salary = [0, 0, 0, 0, 0];
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

                    var dateobjectStore = calendar_object.db.createObjectStore("date", { keyPath: "date" });
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
                    calendar_object.salary = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            calendar_object.schedule_type.push(cursor.value);
                            calendar_object.salary.push(cursor.value.salary);
                            cursor.continue();
                        } else {
                            calendar_object.salary.push(0);
                            resolve();
                        }
                    };
                };
            }).bind(this));
        },
        paint_online() {
            console.log('paint_online');
            var display_mounth = document.getElementById('display_mounth');
            display_mounth.textContent = (this.view_date.getFullYear()) + '年' + (this.view_date.getMonth() + 1) + '月';

            var display = document.getElementById('display');
            display.innerHTML = '';
            var a_mounth = document.createElement('table');
            var week = document.createElement('tr');
            week.classList.add('week');
            var day0 = document.createElement('td');
            day0.innerHTML = '日';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '一';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '二';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '三 ';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '四';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '五';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '六';
            week.appendChild(day0);
            a_mounth.appendChild(week);
            display.appendChild(a_mounth);
            a_mounth.id = 'display_table';
            var color_class = "previous_mounth";
            var today = new Date();
            var calendar_core_data = core_paint(this.view_date);
            for (var i = 1, index = 0; i <= 6; i++) {
                var a_week = document.createElement('tr');
                a_mounth.appendChild(a_week);
                for (var j = 0; j < 7; j++, index++) {
                    var a_day = document.createElement('td');
                    a_week.appendChild(a_day);
                    if (calendar_core_data[index].date == 1) {
                        if (color_class == "previous_mounth") {
                            color_class = "this_mounth";
                        }
                        else
                            color_class = "next_mounth";
                    }
                    a_day.setAttribute('id', calendar_core_data[index].id);
                    a_day.classList.add(color_class);
                    a_day.textContent = calendar_core_data[index].date;
                    this.read(calendar_core_data[index].id).then(this.show_schedule.bind(this)).catch(this.show_schedule.bind(this));
                    if (today.toDateString() == calendar_core_data[index].id)
                        document.getElementById(today.toDateString()).classList.add('today');
                }
            }
            this.view_date.setMonth(this.view_date.getMonth() - 1);
        },
        paint_offline() {
            console.log('paint_offline');
            var display_mounth = document.getElementById('display_mounth');
            display_mounth.textContent = (this.view_date.getFullYear()) + '年' + (this.view_date.getMonth() + 1) + '月';

            var display = document.getElementById('display');
            display.innerHTML = '';
            var a_mounth = document.createElement('table');
            var week = document.createElement('tr');
            week.classList.add('week');
            var day0 = document.createElement('td');
            day0.innerHTML = '日';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '一';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '二';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '三 ';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '四';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '五';
            week.appendChild(day0);
            var day0 = document.createElement('td');
            day0.innerHTML = '六';
            week.appendChild(day0);
            a_mounth.appendChild(week);
            display.appendChild(a_mounth);
            a_mounth.id = 'display_table';
            var color_class = "previous_mounth";
            var today = new Date();
            var calendar_core_data = core_paint(this.view_date);
            for (var i = 1, index = 0; i <= 6; i++) {
                var a_week = document.createElement('tr');
                a_mounth.appendChild(a_week);
                for (var j = 0; j < 7; j++, index++) {
                    var a_day = document.createElement('td');
                    a_week.appendChild(a_day);
                    if (calendar_core_data[index].date == 1) {
                        if (color_class == "previous_mounth") {
                            color_class = "this_mounth";
                        }
                        else
                            color_class = "next_mounth";
                    }
                    a_day.setAttribute('id', calendar_core_data[index].id);
                    a_day.classList.add(color_class);
                    a_day.textContent = calendar_core_data[index].date;
                    a_day.innerHTML += "<br/>休假";
                    if (today.toDateString() == calendar_core_data[index].id)
                        document.getElementById(today.toDateString()).classList.add('today');
                }
            }
            this.view_date.setMonth(this.view_date.getMonth() - 1);

        },
        show_schedule(read_data) {
            var a_day = document.getElementById(read_data.id);
            a_day.classList.add(read_data.schedule_type_word);
            a_day.innerHTML += '<br/>' + read_data.schedule_type_word;
            if (a_day.classList.contains('this_mounth')) {
                for (var i in this.schedule_type) {
                    if (read_data.schedule_type_word == this.schedule_type[i].word) {
                        a_day.style.backgroundColor = this.schedule_type[i].color;
                        this.salary[this.salary.length - 1] += this.salary[i];
                        break;
                    }
                    else {
                        if (i == this.schedule_type.length - 1) {
                            a_day.style.backgroundColor = this.schedule_type[this.schedule_type.length - 1].color;
                            this.salary[this.salary.length - 1] += this.salary[this.salary.length - 2];

                        }
                    }
                }
            }
            document.getElementById('salary').innerHTML = '$:' + this.salary[this.salary.length - 1];
        },
        handleEvent(event) {
            switch (event.type) {
                case 'click':
                    if (event.target.classList.contains('previous_mounth')) {
                        if (this.schedule_code == -1) {
                            this.salary[this.salary.length - 1] = 0;
                            this.view_date.setMonth(this.view_date.getMonth() - 1);
                            this.paint_online();
                        }
                    }
                    if (event.target.classList.contains('next_mounth')) {
                        if (this.schedule_code == -1) {
                            this.salary[this.salary.length - 1] = 0;
                            this.view_date.setMonth(this.view_date.getMonth() + 1);
                            this.paint_online();
                        }
                    }
                    if (event.target.id == 'more') {
                        $('#previous_mounth')[0].style.display = 'inline-block';
                        $('#next_mounth')[0].style.display = 'inline-block';
                        $('.menutable')[0].style.backgroundImage = '../pic/setting.png'
                        $('.menutable').toggle();
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
                            if (event.target.id.contains(' ')) {
                                this.save_schedule(event.target.id);
                            }
                        }
                        else {//for web browser
                            if (event.target.id.includes(' ')) {
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
            var word = this.schedule_type[this.schedule_code].word;
            if (this.schedule_code == this.schedule_type.length - 1)
                word = this.special_input();
            var a_day = document.getElementById(id);
            var year = id.slice(11, id.length);
            var mounth = id.slice(4, 7);
            var date = id.slice(8, 10);
            for (var i in this.schedule_type) {
                if (a_day.classList.contains(this.schedule_type[i].word)) {
                    a_day.classList.remove(this.schedule_type[i].word)
                    if (a_day.classList.contains('this_mounth')) {
                        this.salary[this.salary.length - 1] -= this.salary[i];
                    }
                }
            }
            a_day.classList.add(this.schedule_type[this.schedule_code].word);
            a_day.innerHTML = date + '<br/>' + word;
            if (a_day.classList.contains('this_mounth')) {
                a_day.style.backgroundColor = this.schedule_type[this.schedule_code].color;
                this.salary[this.salary.length - 1] += this.salary[this.schedule_code];
            }
            var data = { date: id, year: year, mounth: mounth, schedule_type_word: word };
            document.getElementById('salary').innerHTML = '$:' + this.salary[this.salary.length - 1];
            this.save(data);
        },
        special_input() {
            var person = prompt("請輸入行事曆名稱", "其他");
            if (person != null) {
                return person;
            }
            return '其他';
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
