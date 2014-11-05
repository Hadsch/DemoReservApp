//Global variable "interval"!
interval = function () {

    /**
     * The numbers array represents the number axis.
     * @type {Array}
     */
    var numbers = [];

    /**
     * The number object holds a nbr which tells what number I am (e.g. I am 3)
     * and the value holds the "sum"
     * @returns {{nbr: *, value: number, toString: toString}}
     */
    var number = function () {

        var nbr = null;
        var value = 0;

        return {
            nbr: nbr,
            value: value
        }
    };

    /**
     * Look up the number-object ({nbr: x, value: x}) for nbr in the numbers array
     * If it not exists, it will be created.
     *
     * The numbers array is always be sorted. If a new number is inserted, it will be inserted at the right position
     *
     * e.g. numbers = [ {nbr:5, value:0},{nbr:8, value:0}];
     *      var abc = getNumber(6);
     *
     *      after this call numbers array will look like this:
     *      numbers = [ {nbr:5, value:0},{nbr:6, value:0},{nbr:8, value:0}];
     * @param nbr
     * @returns {*}
     */
    var getNumber = function (nbr) {
        var i, ln,
            myNbr = number(),
            actNumber,
            firstNumber,
            lastNumber,
            nextNumber;

        myNbr.nbr = nbr;
        if (numbers.length === 0) {
            numbers.push(myNbr);
            return myNbr;
        }

        firstNumber = numbers[0];
        lastNumber = numbers[numbers.length - 1];

        //add number as first element
        if (nbr < firstNumber.nbr)
            numbers.splice(0, 0, myNbr);

        //add number as last elemnt
        if (nbr > lastNumber.nbr)
            numbers.push(myNbr);

        //add number in between or return existing
        if (nbr >= firstNumber.nbr && nbr <= lastNumber.nbr && numbers.length >= 2) {

            for (i = 0, ln = numbers.length; i < (ln - 1); i++) {
                actNumber = numbers[i];
                nextNumber = numbers[i + 1];

                if (actNumber.nbr === nbr)
                    return actNumber;

                if (nbr > actNumber.nbr && nbr < nextNumber.nbr) {
                    numbers.splice(i + 1, 0, myNbr);
                    return myNbr;
                }
            }

            return lastNumber;
        }

        return myNbr;
    };

    /**
     * only except objects with following format
     * @param element  { start: nbr, end: nbr, value:nbr}
     * @returns {null}
     */
    this.addElement = function (element) {

        if (element === undefined || element === null ||
            typeof element.start !== "number" || typeof element.end !== "number" || typeof element.value !== "number"
            || element.end < element.start)
            return null;

        var i, ln,
            number;

        //start and end may have fractional parts...
        // e.g. 2,45 - 5,9; value: 3 -> add 3 to 3, 4, and 5
        element.start = Math.ceil(element.start);
        element.end = Math.floor(element.end);

        for (i = 0, ln = element.end - element.start; i <= ln; i++) {
            number = getNumber(element.start + i);
            //sum up the value
            number.value += element.value;
        }

        return element;
    }

    /**
     * Add an array of elements
     * @param elements
     */
    this.addElements = function (elements) {
        var i, ln;

        if (toString.call(elements) !== "[object Array]") return null;

        for (i = 0, ln = elements.length; i < ln; i++) {
            this.addElement(elements[i]);
        }
    };

    this.clearInput = function () {
        numbers = [];
    };

    var output = [];

    /**
     * Structure of an output number
     * @returns {{start: Number, end: Number, value: number}}
     */
    var outputNumber = function () {
        return { start: NaN, end: NaN, value: 0 };
    };

    /**
     * This function fills up missing numbers in the number axis (numbers array)
     * e.g. before: [ {nbr:5, value:0},{nbr:8, value:0}]
     *       after: [ {nbr:5, value:3},{nbr:6, value:0},{nbr:7, value:0},{nbr:8, value:3}]
     */
    var fillUpNumbersArray = function () {
        var i, ln,
            nbr;

        for (i = 1, ln = numbers.length; i < ln; i++) {
            if (numbers[i].nbr !== (numbers[i - 1].nbr + 1)) {
                nbr = number();
                nbr.nbr = numbers[i - 1].nbr + 1;
                numbers.splice(i, 0, nbr);

                ln++;
                i--;
            }
            if (i >= 1000) return;

        }
    }

    /**
     * Output all intervals with different values
     * @returns {Array}
     */
    this.getOutput = function () {
        var i, ln,
            number,
            lastNbr,
            outputNbr;

        output = [];

        if (numbers.length === 0)
            return output;

        fillUpNumbersArray();

        //init values
        lastNbr = numbers[0];
        outputNbr = outputNumber();
        outputNbr.start = outputNbr.end = lastNbr.nbr;

        //create output array
        for (i = 0, ln = numbers.length; i < ln; i++) {
            number = numbers[i];

            //for the first and last element we have to set the end value before we push the object to the
            //output array
            if (output.length === 0)
            //as long as the values are the same, we are making the interval bigger
                outputNbr.end = number.nbr;


            //value has changed?
            if (number.value !== lastNbr.value) {
                //store outputNbr to the output array and create a new one
                output.push(outputNbr);
                outputNbr = outputNumber();
                outputNbr.start = outputNbr.end = number.nbr;
            }

            //last element?
            if ((ln - 1) === i) {
                output.push(outputNbr);
                if (outputNbr.end === outputNbr.start)
                    outputNbr.start--;
            }

            //as long as the values are the same, we are making the interval bigger
            outputNbr.end = number.nbr;


            outputNbr.value = number.value;
            lastNbr = number;
        }

        return output;
    }


};

//Test cases
(function () {
    //test case
    var input1 = [
        {
            start: 1,
            end: 3,

            value: 1
        },
        {
            start: 5,
            end: 6,

            value: 1
        },
        {
            start: 10,
            end: 15,

            value: 1
        }
    ];

    var input2 = [
        {
            start: 5.75,
            end: 9.9,

            value: 5
        },
        {
            start: 3.1,
            end: 6.6,

            value: 2
        }
    ];

    var input3 = [{
        start       : 1,
        end         : 3,

        value       : 1
    }, {
        start       : 2,
        end         : 4,

        value       : 1
    }, {
        start       : 2,
        end         : 5,

        value       : 2
    }, {
        start       : 4,
        end         : 5,

        value       : 1
    }];
    //create interval
    var myInterval = new interval();

    //case 1
    myInterval.addElements(input1);
    console.log(myInterval.getOutput());

    //case 2
    myInterval.clearInput();
    myInterval.addElements(input2);
    console.log(myInterval.getOutput());

    //case 3
    myInterval.clearInput();
    myInterval.addElements(input3);
    console.log(myInterval.getOutput());

    var i, ln, str, groups, testUrls = [
        "http://bryntum.com/examples-1.2.3/advanced/advanced.html",
        "http://bryntum.com/doc/1.2.3/foo/bar.html",
        "http://cdn.sencha.io/ext-3.4.0/ext-all-debug.js",
        "http://cdn.sencha.io/ext-3.4.0-beta-1/ext-all.js",
        "http://cdn.sencha.io/extjs-4.1.0-rc-1/ext-all-debug.js",
        "http://bryntum.com/examplesfor/extjs-4.1.1/foo/bar.html",
        "http://bryntum.com/library/extjs-4.1.2/ext-all-debug.js",
        "http://bryntum.com/library/extjs-10.11.21/ext-all-debug.js",
        "http://bryntum.com/library/extjs-4.1.2/ext-all-this-is-not-ext.js"
    ];

    console.log("Example 3!");

    for (i = 0, ln = testUrls.length; i < ln; i++) {
        str = testUrls[i];
        groups = str.match(/ext.*?([0-9].*?)\//i);
        console.log((groups !== null && groups.length >= 2 ? groups[1] : "no match") + " // " + str);
    }

    var testCss = [
        "translate3d(0, 0, 0)",
        "translate3d(0,    0,     0)",
        "translate3d(1px, 10px, 100px)",
        "translate3d(-1px, -10px, -100px)",
        "translate3d(-1px, -10px; -100px)",  //should not match
        "translate3d(-1px -10px, -100px)"    //should not match
    ];

    for (i = 0, ln = testCss.length; i < ln; i++) {
        str = testCss[i];
        groups = str.match(/translate3d.*\(.*?(-?[0-9]+).*?,.*?(-?[0-9]+).*?,.*?(-?[0-9]+)/i);
        console.log((groups !== null && groups.length >= 3 ? groups[1] + ", " + groups[2] + ", " + groups[3] : "no match") + " // " + str);
    }


    var tree = {
        id: '1',
        children: [
            {
                id: '2',
                children: [
                    {
                        id: '5',
                        children: [
                            {
                                id: '9'
                            }
                        ]
                    },
                    {
                        id: '6'
                    }
                ]
            },
            {
                id: '3',
                children: [
                    {
                        id: '7'
                    },
                    {
                        id: '8'
                    }
                ]
            },
            {
                id: '4'
            }
        ]
    };

    var iterator = function (root, fn, scope) {

        var i, ln, node,
            queue = [];

        //push root to queue
        queue.push(root);

        while (queue.length > 0) {
            //get first element of the queue
            node = queue.splice(0, 1)[0];

            fn.call(scope, node);

            //push children to the queue
            if (node.children !== undefined) {
                for (i = 0, ln = node.children.length; i < ln; i++) {
                    queue.push(node.children[i]);
                }
            }
        }

    };

    console.log("Example 5: Tree!");
    iterator(tree, function (node) {
        console.log(node.id)
    });

    var array =  [ [1, 2, "a"], 3, function() { console.log("abc"); }, [ "bar", {} ] ];
    var createFlatArray = function(array) {
        var i, ln, output = [];

        for( i = 0, ln = array.length; i < ln; i++) {
            output = output.concat(array[i]);
        }

        return output;
    };

    console.log(createFlatArray(array));
}());


