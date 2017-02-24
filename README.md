#JS Mask
The mask for input in pure JS. This mask require only basic knowledge in HTML to use.

Required file: ```js/jsMask.js```
Other files are use in example

#####How to use
Link jsMask script in your HTML:
```<script src="js/jsMask.js" type="text/javascript"></script>```

In your input, add ```data-mask``` attribute with your mask.

```<input type="text" data-mask="00:00:00"/>```

######The mask character
```
0 = Any numbers
a = Letters from a to z smallcase
A = Letters from a to z uppercase
i = Letters from a to z unsensitivy case
```
Others character will be literarity write in input on your position.

Beyond this characters the mask accept a name of pattern like ```hour```
```<input type="text" data-mask="hour"/>```
Accepted patterns
```
brphone = (00) 0?0000-0000,
rg = 00.000.000-0,
cpf = 000.000.000-00,
date2dig = 00/00/00,
hour = 00:00:00
```
---

**Version**

v1.0.0 - release: 22/02/2017

Change log:
- First release