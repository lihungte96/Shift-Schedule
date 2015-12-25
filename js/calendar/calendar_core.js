function core_paint(view_date) {
    view_date.setDate(0);
    while (view_date.getDay() > 0) {
        view_date.setDate(view_date.getDate() - 1);
    }
    view_date.setDate(view_date.getDate() - 1);
    var a = [];
    view_date.set
    for (var i = 0; i < 42; i++) {
        view_date.setDate(view_date.getDate() + 1);
        var day = {
            id: view_date.toDateString(),
            date: view_date.getDate()
        };
        a.push(day);
    }
    return a;
}
module.exports.core_paint = core_paint;
