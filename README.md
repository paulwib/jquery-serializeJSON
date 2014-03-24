# jquery.serializeJSON

Serializes an HTML form to a JSON object. Arrays are supported e.g. `<input name="foo[]">`. Named arrays e.g. `<input name="foo[bar]">` will be converted to objects recursively to any depth.

## Usage

Example form:

```html
<form id="test-form" action="./" method="post">
    <input type="text" name="txt" value="quux">
    <input type="text" name="txtArray[]" value="quux0">
    <input type="text" name="txtArray[]" value="quux1">
    <input type="text" name="txtArray[]" value="quux2">
    <input type="text" name="obArray[0][a]" value="0a">
    <input type="text" name="obArray[1][a]" value="1a">
    <input type="text" name="obArray[0][b]" value="0b">
    <input type="text" name="obArray[0][c][d]" value="0d">
    <textarea name="obArray[1][b]">1b</textarea>
    <select name="opt">
        <option>a</option>
        <option>b</option>
        <option selected>c</option>
    </select>
    <select name="optMultiple[]" multiple>
        <option selected>a</option>
        <option>b</option>
        <option selected>c</option>
    </select>
    <select name="optWithValue">
        <option value="23">a</option>
        <option value="86">b</option>
        <option value="65" selected>c</option>
    </select>
    <input type="radio" name="radio" value="A">
    <input type="radio" name="radio" value="B" checked>
    <input type="radio" name="radio" value="C">
    <input type="checkbox" name="checkbox-one" value="A">
    <input type="checkbox" name="checkbox-two" value="B" checked>
    <input type="checkbox" name="checkbox-three" value="C">
</form>
```

Javascript:

```javascript
JSON.stringify($('#test-form').serializeJSON());
```

Result:

```
{
    "txt": "quux",
    "txtArray": [
        "quux0",
        "quux1",
        "quux2"
    ],
    "obArray": [
        {
            "a": "0a",
            "b": "0b",
            "c": {
                "d": "0d"
            }
        },
        {
            "a": "1a",
            "b": "1b"
        }
    ],
    "opt": "c",
    "optMultiple": [
        "a",
        "c"
    ],
    "optWithValue": "65",
    "radio": "B",
    "checkbox-two": "B"
}
```

## Options

Pass options as an object like:

    $('#test-form').serializeJSON({
        excludeEmpty: true
    });

### excludeEmpty `bool`

Do not include empty fields in the resulting object, defaults to false.

Excluding empty values can make validation agasint JSN schemas simpler (when using libraries like [tv4][]).

##Caveats

If you have multiple inputs with the same name only the last value will be used. So if, for example, you want to have a multiple select it will need to have array brackets on the end of the name i.e. `<select name="things[]" multiple>`.

[tv4]:https://github.com/geraintluff/tv4
