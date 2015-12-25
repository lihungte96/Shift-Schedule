var assert = require('assert');
var cal = require('../js/calendar/calendar_core.js');
describe('calendar_layout', function () {
	describe('today', function () {
		var today = new Date();
		var mounth = cal.core_paint(today);
		today = new Date();
		var same = 0;		
		for (var i=0;i<42;i++){
			if(mounth[i].id==today.toDateString())
				same = i;
		}
		it('week', function () {
			assert.equal(today.getDay(), same%7);
    	})
		it('mounth_first', function () {
			assert.notEqual(today.getDay(), mounth[0]);
    	})
		it('mounth_last', function () {
			assert.notEqual(today.getDay(), mounth[41]);
    	})
	})
	describe('random_few_days', function () {
		var random = Math.round(Math.random()*365);
		var today = new Date()
		today.setDate(random);
		var mounth = cal.core_paint(today);
		today = new Date();
		today.setDate(random);
		var same = 0;		
		for (var i=0;i<42;i++){
			if(mounth[i].id==today.toDateString())
				same = i;
		}
		it('week', function () {
			assert.equal(today.getDay(), same%7);
    	})
		it('mounth_first', function () {
			assert.notEqual(today.getDay(), mounth[0]);
    	})
		it('mounth_last', function () {
			assert.notEqual(today.getDay(), mounth[41]);
    	})
	})
	describe('random_few_years', function () {
		var random = Math.round(Math.random()*365100);
		var today = new Date()
		today.setDate(random);
		var mounth = cal.core_paint(today);
		today = new Date();
		today.setDate(random);
		var same = 0;		
		for (var i=0;i<42;i++){
			if(mounth[i].id==today.toDateString())
				same = i;
		}
		it('week', function () {
			assert.equal(today.getDay(), same%7);
    	})
		it('mounth_first', function () {
			assert.notEqual(today.getDay(), mounth[0]);
    	})
		it('mounth_last', function () {
			assert.notEqual(today.getDay(), mounth[41]);
    	})
	})
})
