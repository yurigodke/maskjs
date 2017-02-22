(function (window, document) {
    "use strict";

    window.inputMask = {
        patterns: {
            'brphone': '(00) 0?0000-0000',
            'rg': '00.000.000-0',
            'cpf': '000.000.000-00',
            'date2dig': '00/00/00',
            'hour': '00:00:00'
        },
        espChar: {
            '0': /[0-9]/,
            'A': /[A-Z]/,
            'a': /[a-z]/,
            'i': /[a-zA-Z]/
        },
        keyAccept: [8,9,13,16,18,37,38,39,40,112,113,114,115,116,117,118,119,120,121,122,123],
        input: null,
        masking: function (event) {
            inputMask.input = event.target;
            var data = inputMask.input.getAttribute('data-mask');

            var key = event.charCode || event.keyCode;
            console.log(key);
            var maskFix = 0;
            if (key == 8) {
                maskFix = -1;
            } else {
                for (var chars in inputMask.espChar) {
                    if (String.fromCharCode(key).search(inputMask.espChar[chars]) >= 0) {
                        maskFix = 1;
                        break;
                    }
                }
            }

            var mask = inputMask.getPattern(data, inputMask.input.value.length + maskFix);
            if (inputMask.keyAccept.indexOf(key) >= 0) {
                if (inputMask.checkMask(inputMask.input.value, mask)) {
                    event.preventDefault();
                }
                return true;
            }
            key = String.fromCharCode(key);

            if (!inputMask.maskSet(key, mask)) {
                event.preventDefault();
            }

        },
        maskSet: function (valKey, mask) {
            inputMask.checkMask(inputMask.input.value, mask);

            return inputMask.maskProcess(inputMask.input.value.length, valKey, mask);
        },
        maskProcess: function (cursor, valKey, mask) {
            var maskIndex = cursor;
            var maskKey = mask[maskIndex];

            if (maskKey) {
                while (!inputMask.espChar[maskKey]) {
                    inputMask.input.value += maskKey;
                    maskIndex++;
                    maskKey = mask[maskIndex];
                }

                if (maskKey) {
                    if (valKey.search(inputMask.espChar[maskKey]) >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        },
        getPattern: function (label, length) {
            var mask = inputMask.patterns[label] ? inputMask.patterns[label] : label;
            var maskAlternative = {};
            maskAlternative[mask.replace(/([0Aa])\?/i, '$1').length] = mask.replace(/([0Aa])\?/i, '$1');
            var maskFilter = mask.replace(/([0Aa])\?/i, '');

            while (maskFilter.search(/([0Aa])\?/i) >= 0) {
                maskAlternative[mask.replace(/([0Aa])\?/i, '$1').length] = mask.replace(/([0Aa])\?/i, '$1');
                maskFilter = maskFilter.replace(/([0Aa])\?/i, '');
            }



            if (maskAlternative[length]) {
                return maskAlternative[length];
            } else if (length <= maskFilter.length) {
                return maskFilter;
            } else {
                var maskReturn = '';
                for (var len in maskAlternative) {
                    if (length > len) {
                        maskReturn = maskAlternative[len];
                    }
                }
                return maskReturn;
            }

        },
        checkMask: function (val, mask) {
            val = val.split('');
            var initCount = val.length;
            var valReturn = new Array();
            for (var i = 0; i < val.length; i++) {
                for (var pattern in inputMask.espChar) {
                    if (val[i].search(inputMask.espChar[pattern]) >= 0) {
                        valReturn.push(val[i]);
                    }
                }
            }
            inputMask.input.value = ''
            for (var i = 0; i < valReturn.length; i++) {
                if (inputMask.maskProcess(inputMask.input.value.length, valReturn[i], mask)) {
                    inputMask.input.value += valReturn[i];
                }
            }
            var finalCount = inputMask.input.value.length;

            return initCount - finalCount;
        }
    };

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var dataValue = inputs[i].getAttribute('data-mask');

        if (dataValue) {
            inputs[i].addEventListener('keydown', inputMask.masking);
        }
    }
})(window, document);

function tel_mask(src) {
    var val = src.value
    val = val.split('');
    var key = val[val.length - 1];

    var more_dig = '11';

    var val_return = new Array();
    if (key.search(/[0-9]/) <= 0) {
        for (i = 0; i < val.length; i++) {
            if ((i == 0) && (val[i] != '(')) {
                val_return[i] = '(';
                val_return[i + 1] = val[i];
            } else if ((i == 3) && (val[i] != ')')) {
                val_return[i] = ') ';
                val_return[i + 2] = val[i];
            } else if ((i == 9) && (val[i] != '-')) {
                if (val[10] != '-') {
                    val_return[i] = '-';
                    val_return[i + 1] = val[i];
                } else {
                    val_return[i] = val[i];
                }
                if (more_dig.indexOf(Number(val[1] + val[2])) >= 0) {
                    src.maxLength = 15;
                } else {
                    src.maxLength = 14;
                }
            } else if ((i == 13) && (val[10] == '-')) {
                val_return[i] = val[i];
                if ((val[9] != '-') && (val[14] == undefined)) {
                    val_return[10] = val[9];
                    val_return[9] = val[10];
                }
            } else if ((i == 14) && (val[9] == '-')) {
                if (val[10] != '-') {
                    val_return[9] = val[10];
                    val_return[10] = val[9];
                }
                val_return[i] = val[i];

                /*if(more_dig.indexOf(Number(val[1]+val[2])) >= 0){
                 val_return[i] = '-';
                 val_return[i+1] = val[i];
                 } else {
                 val_return[i] = val[i];	
                 }*/
            } else {
                val_return[i] = val[i];
            }
        }
    } else {
        val.pop();
        val_return = val;
    }
    /* else if((i==9)&&(val[i] != '-')){
     if(more_dig.indexOf(Number(val[1]+val[2])) < 0){
     val_return[i] = '-';
     val_return[i+1] = val[i];
     src.maxLength = 14
     } else {
     val_return[i] = val[i];
     }
     } else if((i==10)&&(val[i] != '-')){
     if(more_dig.indexOf(Number(val[1]+val[2])) >= 0){
     val_return[i] = '-';
     val_return[i+1] = val[i];
     src.maxLength = 15
     } else {
     val_return[i] = val[i];	
     }
     }*/
    val_return = val_return.join('');
    src.value = val_return;
}