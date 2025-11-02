/**
 * Напишите функцию, которая проверяет, является ли число целым используя побитовые операторы
 * @param {*} n
 */
function isInteger(n) {
    if ((n|0) == n) {
        return true;
    }
    else {
        return false;
    }    
}

/**
 * Напишите функцию, которая возвращает массив четных чисел от 2 до 20 включительно
 */
function even() {
    let arr = [];
    for (var i = 1; i < 21; i++) {
        if (!(i%2)) {
            arr.push(i);
        }
    }
    return arr;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя цикл
 * @param {*} n
 */
function sumTo(n) {
    var i = 1;
    var sum = 0;
    while(i<n+1) {
        sum += i;
        i += 1;
    }
    return sum;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя рекурсию
 * @param {*} n
 */
function recSumTo(n) {
    function sumRecursion(n, sum) {
        if (n === 0) {
            return sum;  
        }
        return sumRecursion(n - 1, sum + n);
    }
    return sumRecursion(n, 0);
}

/**
 * Напишите функцию, считающую факториал заданного числа
 * @param {*} n
 */
function factorial(n) {
    var i = 1;
    var factorial = 1;
    while(i<n+1) {
        factorial *= i;
        i += 1;
    }
    return factorial;
}

/**
 * Напишите функцию, которая определяет, является ли число двойкой, возведенной в степень
 * @param {*} n
 */
function isBinary(n) {

    while (n > 1) {
        n = n / 2;
    }
    if (n == 1) {
        return true;
    }
    return false;
}

/**
 * Напишите функцию, которая находит N-е число Фибоначчи
 * @param {*} n
 */
function fibonacci(n) {
    var fibonacciArr = [0,1];
    for (var i = 2; i < n+1; i++) {
        fibonacciArr[i] = fibonacciArr[i-1] + fibonacciArr[i-2];
    }
    return fibonacciArr[n];
}

/** Напишите функцию, которая принимает начальное значение и функцию операции
 * и возвращает функцию - выполняющую эту операцию.
 * Если функция операции (operatorFn) не задана - по умолчанию всегда
 * возвращается начальное значение (initialValue)
 * @param initialValue
 * @param operatorFn - (storedValue, newValue) => {operation}
 * @example
 * const sumFn =  getOperationFn(10, (a,b) => a + b);
 * console.log(sumFn(5)) - 15
 * console.log(sumFn(3)) - 18
 */
function getOperationFn(initialValue, operatorFn) {
    let storedValue = initialValue;
    return function(newValue) {
        if(!operatorFn) {
            return storedValue;
        }
        storedValue = operatorFn(storedValue, newValue);
        return storedValue;
    }
}

/**
 * Напишите функцию создания генератора арифметической последовательности.
 * При ее вызове, она возвращает новую функцию генератор - generator().
 * Каждый вызов функции генератора возвращает следующий элемент последовательности.
 * Если начальное значение не передано, то оно равно 0.
 * Если шаг не указан, то по дефолту он равен 1.
 * Генераторов можно создать сколько угодно - они все независимые.
 *
 * @param {number} start - число с которого начинается последовательность
 * @param {number} step  - число шаг последовательности
 * @example
 * const generator = sequence(5, 2);
 * console.log(generator()); // 5
 * console.log(generator()); // 7
 * console.log(generator()); // 9
 */
function sequence(start = 0, step = 1) {
    let index = start;
    return function generator() {
        const iterator = index;
        index += step;
        return iterator;

    };
}

/**
 * Напишите функцию deepEqual, которая принимает два значения
 * и возвращает true только в том случае, если они имеют одинаковое значение
 * или являются объектами с одинаковыми свойствами,
 * значения которых также равны при сравнении с рекурсивным вызовом deepEqual.
 * Учитывать специфичные объекты(такие как Date, RegExp и т.п.) не обязательно
 *
 * @param {object} firstObject - первый объект
 * @param {object} secondObject - второй объект
 * @returns {boolean} - true если объекты равны(по содержанию) иначе false
 * @example
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 33], text: 'text'}) // true
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 3], text: 'text2'}) // false
 */
function deepEqual(firstObject, secondObject) {

    if (Number.isNaN(firstObject) && Number.isNaN(secondObject)) {
        return true;
    }

    if (firstObject === secondObject) {
        return true;
    }

    if (typeof firstObject !== "object" || firstObject === null || typeof secondObject !== "object" || secondObject === null) {
        return false;
    }

    const key1 = Object.keys(firstObject);
    const key2 = Object.keys(secondObject);

    if (key1.length !== key2.length) {
        return false;
    }

    for (let key of key1) {

        if (!secondObject.hasOwnProperty(key)) {
            return false;
        }
        
        if (!deepEqual(firstObject[key], secondObject[key])) {
            return false;
        }
    }
    return true;
}

module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};
