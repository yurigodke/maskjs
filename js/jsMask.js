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
        keyIgnore: [8, 17, 18],
        input: null,
        ignoreKey: false,
        masking: function (event) {
            inputMask.input = event.target;
            var data = inputMask.input.getAttribute('data-mask');
            var value = inputMask.input.value;
            var key = event.charCode || event.keyCode;
            var maskFix = 0;

            if (inputMask.keyIgnore.indexOf(key) >= 0 || inputMask.ignoreKey) {
                inputMask.ignoreKey = true;
                return true;
            } else {
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

                var mask = inputMask.getPattern(data, value.length + maskFix);

                var charKey = String.fromCharCode(key);

				if(!event.shiftKey){
					charKey = charKey.toLowerCase();
				}

                if (!inputMask.maskSet(charKey, mask)) {
                    event.preventDefault();
                }
            }
        },
        maskSet: function (valKey, mask) {
            var valueChecked = inputMask.checkMask(inputMask.input.value+valKey, mask);

			if(valueChecked == inputMask.input.value){
				return false;
			} else {
				inputMask.input.value = valueChecked;
			}
        },
        getPattern: function (label, length, nomask) {
            var mask = inputMask.patterns[label] ? inputMask.patterns[label] : label;
            var maskAlternative = {};
            maskAlternative[mask.replace(/([0Aa])\?/i, '$1').length] = mask.replace(/([0Aa])\?/i, '$1');
            var maskFilter = mask.replace(/([0Aa])\?/i, '');

            while (maskFilter.search(/([0Aa])\?/i) >= 0) {
                maskAlternative[mask.replace(/([0Aa])\?/i, '$1').length] = mask.replace(/([0Aa])\?/i, '$1');
                maskFilter = maskFilter.replace(/([0Aa])\?/i, '');
            }

            if (nomask) {
                var nomaskCount = 0
                for(var i=0;i<maskFilter.length;i++){
                    var maskKey = maskFilter[i];
                    if(!inputMask.espChar[maskKey]){
                        nomaskCount++;
                    }
                }
                length += nomaskCount;
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
            var valArr = val.split('');
            var maskArr = mask.split('');
            var valChecked = '';

            var valIndex = 0;
            for(var i=0;i<maskArr.length;i++){
                if(valIndex >= valArr.length){
                    break;
                }
                var charRegex = inputMask.espChar[maskArr[i]];
                if(charRegex){
                    var whileCond = valArr[valIndex] != undefined && valArr[valIndex].search(charRegex) < 0;
                    while(whileCond){
                        valIndex++;
                        whileCond = valArr[valIndex] != undefined && valArr[valIndex].search(charRegex) < 0;
                    }
                    if(valArr[valIndex] != undefined && valArr[valIndex].search(charRegex) >= 0){
                        valChecked += valArr[valIndex];
                        valIndex++;
                    }
                } else {
                    if(valArr[valIndex] == maskArr[i]){
                        valChecked += valArr[valIndex];
                        valIndex++;
                    } else {
                        valChecked += maskArr[i];
                    }
                }
            }

            return valChecked;
        }
    };

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var dataValue = inputs[i].getAttribute('data-mask');

        if (dataValue) {
            inputs[i].addEventListener('keydown', inputMask.masking);
            inputs[i].addEventListener('keyup', function(event){
                var key = event.charCode || event.keyCode;
                if (inputMask.keyIgnore.indexOf(key) >= 0) {
					console.log("keyup");
                    var input = event.target;
                    var data = input.getAttribute('data-mask');

                    var mask = inputMask.getPattern(data, input.value.length, true);
                    inputMask.ignoreKey = false;
                    input.value = inputMask.checkMask(input.value, mask);
                }
            })
        }
    }
})(window, document);
