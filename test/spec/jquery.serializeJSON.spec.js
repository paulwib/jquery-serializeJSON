/* global jasmine, setFixtures, loadFixtures */

// Karma serves files from `/base`
jasmine.getFixtures().fixturesPath = '/base/test/fixtures';

describe('jquery.serializeJSON plugin', function() {

    'use strict';

    var $form;

    it('should be defined', function() {
        expect($.fn.serializeJSON).toBeDefined();
    });

    describe('serializing simple name attributes', function() {

        it('should create an object with string properties', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" name="foo" value="hello">' +
                    '<input type="text" name="bar" value="world">' +
                    '<textarea name="fred">wassup</textarea>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.foo).toEqual('hello');
            expect(data.bar).toEqual('world');
            expect(data.fred).toEqual('wassup');
        });
    });

    describe('serializing array[] name attributes', function() {

        it('should create an array of string values', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" id="foo" name="foo[]">' +
                    '<input type="text" id="bar" name="foo[]">' +
                    '<textarea id="fred" name="foo[]"></textarea>' +
                '</form>' +
            '').find('form');
            $form.find('#foo').val('hello');
            $form.find('#bar').val('world');
            $form.find('#fred').val('wassup');

            var data = $form.serializeJSON();
            expect(data.foo[0]).toEqual('hello');
            expect(data.foo[1]).toEqual('world');
            expect(data.foo[2]).toEqual('wassup');
        });
    });

    describe('serializing array[prop] name attributes', function() {

        it('should create an object of string values', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" id="foo" name="foo[a]">' +
                    '<input type="text" id="bar" name="foo[c]">' +
                    '<textarea id="fred" name="foo[b]"></textarea>' +
                '</form>' +
            '').find('form');
            $form.find('#foo').val('hello');
            $form.find('#bar').val('world');
            $form.find('#fred').val('wassup');

            var data = $form.serializeJSON();
            expect(data.foo.a).toEqual('hello');
            expect(data.foo.b).toEqual('wassup');
            expect(data.foo.c).toEqual('world');
        });
    });

    describe('serializing array[0][prop] name attributes', function() {

        it('should create an array of objects', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" id="a_0" name="foo[0][a]">' +
                    '<input type="text" id="a_1" name="foo[1][a]">' +
                    '<input type="text" id="c_0" name="foo[0][c]">' +
                    '<textarea id="b_0" name="foo[0][b]"></textarea>' +
                    '<input type="text" id="c_1" name="foo[1][c]">' +
                    '<textarea id="b_1" name="foo[1][b]"></textarea>' +
                '</form>' +
            '').find('form');
            $form.find('#a_0').val('hello 0');
            $form.find('#c_0').val('world 0');
            $form.find('#b_0').val('wassup 0');
            $form.find('#a_1').val('hello 1');
            $form.find('#c_1').val('world 1');
            $form.find('#b_1').val('wassup 1');

            var data = $form.serializeJSON();
            expect(data.foo[0].a).toEqual('hello 0');
            expect(data.foo[0].b).toEqual('wassup 0');
            expect(data.foo[0].c).toEqual('world 0');
            expect(data.foo[1].a).toEqual('hello 1');
            expect(data.foo[1].b).toEqual('wassup 1');
            expect(data.foo[1].c).toEqual('world 1');
        });
    });

    describe('serializing select inputs', function() {

        it('should pick the text of the selected option if no value', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<select name="foo">' +
                        '<option>x</option>' +
                        '<option selected>y</option>' +
                        '<option>z</option>' +
                    '</select>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.foo).toEqual('y');
        });

        it('should pick the value of the selected option', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<select name="foo">' +
                        '<option value="10">x</option>' +
                        '<option value="6" selected>y</option>' +
                        '<option value="94">z</option>' +
                    '</select>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.foo).toEqual('6');
        });

        it('should support select[multiple], but only with array name', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<select name="foo[]" multiple>' +
                        '<option value="10" selected>x</option>' +
                        '<option value="6" selected>y</option>' +
                        '<option value="94">z</option>' +
                    '</select>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.foo).toEqual(['10', '6']);
        });
    });

    describe('serializing radio inputs', function() {

        it('should pick the value of the checked radio', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="radio" name="foo" value="10">' +
                    '<input type="radio" name="foo" value="6" checked>' +
                    '<input type="radio" name="foo" value="94">' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.foo).toEqual('6');
        });
    });

    describe('serializing checkboxes', function() {

        it('should pick the value of the checked checkboxes', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="checkbox" name="foo" value="10">' +
                    '<input type="checkbox" name="bar" value="6" checked>' +
                    '<input type="checkbox" name="baz" value="94">' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.bar).toEqual('6');
            expect(data.foo).not.toBeDefined();
            expect(data.baz).not.toBeDefined();
        });

        it('should pick the last checkbox of multiple with same name', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="checkbox" name="foo" value="10" checked>' +
                    '<input type="checkbox" name="foo" value="6" checked>' +
                    '<input type="checkbox" name="foo" value="94" checked>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON();
            expect(data.foo).toEqual('94');
        });
    });

	describe('serializing a complicated form', function() {
	    it('should not get confused', function() {
            loadFixtures('all.html');
            var data = $('#test-form').serializeJSON();
            expect(data.txt).toEqual('quux');
            expect(data.txtArray[0]).toEqual('quux0');
            expect(data.txtArray[1]).toEqual('quux1');
            expect(data.txtArray[2]).toEqual('quux2');
            expect(data.obArray[0].a).toEqual('0a');
            expect(data.obArray[0].b).toEqual('0b');
            expect(data.obArray[0].c.d).toEqual('0d');
            expect(data.obArray[1].a).toEqual('1a');
            expect(data.obArray[1].b).toEqual('1b');
            expect(data.opt).toEqual('c');
            expect(data.optWithValue).toEqual('65');
            expect(data.optMultiple).toEqual(['a', 'c']);
            expect(data.radio).toEqual('B');
            expect(data['checkbox-two']).toEqual('B');
            expect(data['checkbox-one']).not.toBeDefined();
            expect(data['checkbox-three']).not.toBeDefined();
        });
	});

    describe('given a collection of inputs not in a form', function() {
        it('should work fine', function() {
            var data = $('<input type="text" id="foo" name="foo" value="hello">' +
                '<input type="text" id="bar" name="bar" value="world">' +
                '<textarea id="fred" name="fred">wassup</textarea>'
            ).serializeJSON();

            expect(data.foo).toEqual('hello');
            expect(data.bar).toEqual('world');
            expect(data.fred).toEqual('wassup');
        });
    });

    describe('excluding empty', function() {

        it('should not add empty text inputs', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" name="foo" value="hello">' +
                    '<input type="text" name="bar" value="        ">' +
                    '<textarea name="fred">\n\n       </textarea>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON({
                excludeEmpty: true
            });
            expect(data.foo).toEqual('hello');
            expect(data.bar).not.toBeDefined();
            expect(data.fred).not.toBeDefined();
        });

        it('should not use checkboxes that are not checked', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="checkbox" name="foo" value="10">' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON({
                excludeEmpty: true
            });
            expect(data.foo).not.toBeDefined();
        });

        it('should not include empty items in arrays', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" name="foo[]" value="hello">' +
                    '<input type="text" name="foo[]" value="">' +
                    '<textarea name="foo[]">wassup</textarea>' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON({
                excludeEmpty: true
            });
            expect(data.foo).toEqual(['hello', 'wassup']);
        });

        it('should not create an array if all items are empty', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" name="foo[]" value="">' +
                    '<input type="text" name="foo[]" value="">' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON({
                excludeEmpty: true
            });
            expect(data.foo).not.toBeDefined();
        });

        it('should not create nested objects if all properties are empty', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" name="foo[a]" value="hello">' +
                    '<input type="text" name="foo[bar][a]" value="">' +
                    '<input type="text" name="foo[bar][b]" value="">' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON({
                excludeEmpty: true
            });
            expect(data.foo.a).toEqual('hello');
            expect(data.foo.bar).not.toBeDefined();
        });

        it('should create nested objects if there is something deeper', function() {
            $form = setFixtures('' +
                '<form method="post">' +
                    '<input type="text" name="foo[a]" value="hello">' +
                    '<input type="text" name="foo[bar][a]" value="">' +
                    '<input type="text" name="foo[bar][b]" value="">' +
                    '<input type="text" name="foo[bar][b][c]" value="hello">' +
                '</form>' +
            '').find('form');

            var data = $form.serializeJSON({
                excludeEmpty: true
            });
            expect(data.foo.a).toEqual('hello');
            expect(data.foo.bar.b.c).toEqual('hello');
        });
    });

});
