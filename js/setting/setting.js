'use strict';

(function (exports) {
    /**
     *
     *  @constructor
     *  @this {Calendar}
     */
    var Setting = function () {
        this.schedule_type = [];
        this.schedule_code = 0;
    };
    Setting.prototype = {
        /**
         * 
         * @this {Clock}
         */
        start() {
            window.addEventListener('click', this);
            //window.addEventListener('touchmove', this, false);
            this.init_db(this).then((function () {
                var panel = document.getElementById('panel');
                for (var i in this.schedule_type) {
                    var option = document.createElement('div');
                    if (i == 0 || i == this.schedule_type.length - 1) {
                        var text = document.createElement('p');
                        text.innerHTML = this.schedule_type[i].word;
                    } else {
                        var text = document.createElement('input');
                        text.setAttribute('value', this.schedule_type[i].word);
                    }
                    text.setAttribute('class', this.schedule_type[i].id);
                    text.style.width = '30%';
                    text.style.display = 'inline-block';
                    option.id = this.schedule_type[i].id;
                    var a = document.createElement('p');
                    a.innerHTML = ':';
                    a.style.display = 'inline-block';
                    var color = document.createElement('input');
                    color.setAttribute('value', this.schedule_type[i].color);
                    color.setAttribute('class', this.schedule_type[i].id);
                    color.setAttribute('type', 'color');
                    color.style.width = '30%';
                    color.style.display = 'inline-block';
                    option.appendChild(text);
                    option.appendChild(a);
                    option.appendChild(color);
                    panel.appendChild(option);
                }
            }).bind(this));
        },
        init_db(calendar_object) {
            return new Promise((function (resolve, reject) {
                console.log('init_db');
                if (!window.indexedDB) {
                    alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                }
                console.log('open db');
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

                    var objectStore = calendar_object.db.createObjectStore("color", { keyPath: "word" });
                    resolve();
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
                        }
                        else {
                            resolve();
                        }
                    };
                };
            }).bind(this));
        },
        handleEvent(event) {
            switch (event.type) {
                case 'click':
                    if (event.target.id == 'save') {
                        this.save();
                        window.location.assign('index.html');
                    }
                    if (event.target.id == 'cancel') {
                        window.location.assign('index.html');
                    }
                    break;
            }
        },
        save(data) {
            for (var i in this.schedule_type) {
                if (i != 0 && i != this.schedule_type.length - 1) {
                    this.schedule_type[i].word = $('.' + i)[0].value;
                }
                this.schedule_type[i].color = $('.' + i)[1].value;
            }
            var transaction = this.db.transaction(["color"], "readwrite");

            transaction.onerror = function (event) {
                console.log('save error')
                // Don't forget to handle errors!
            };
            var objectStore = transaction.objectStore("color");
            for (var i in this.schedule_type) {
                var objectStoreRequest = objectStore.put(this.schedule_type[i]);
            }
            objectStoreRequest.onsuccess = function (event) {
                console.log("save done");
            };
        },
        read(id) {
            return new Promise((function (resolve, reject) {
                var transaction = this.db.transaction(["color"]);
                var objectStore = transaction.objectStore("color");
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
    exports.Setting = Setting;
})(window);
