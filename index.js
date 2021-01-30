const mathjs = require('mathjs');
const { byteArrayFrom, numberFromByteArray } = require('./helpers/number-to-byte-array')
function gcd(a, b) {
    if (b == 0) {
        return b;
    }
    let t = b;
    b = a % b;
    a = t;
    while (b != 0) {
        t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function encryptChar(key, char) {
    let charCode = char.charCodeAt(0);
    let encryptedCharCode = exponentialMod(charCode , key.e, key.n)
    let encryptedChar = String.fromCharCode(encryptedCharCode);
    // console.log(`${char} (${charCode}) -> ${encryptedChar} (${encryptedCharCode})`)
    return encryptedChar
};
function decryptChar(key, char) {
    let charCode = char.charCodeAt(0);
    let decryptedCharCode = exponentialMod(charCode, key.d, key.n)
    let decryptedChar = String.fromCharCode(decryptedCharCode);
    // console.log(`${char} (${charCode}) -> ${decryptedChar} (${decryptedCharCode})`)
    return decryptedChar;
}

function exponentialMod(a, e, divisor) {
    let remainder = (a * a) % divisor;
    for (let i = 3; i <= e; i++) {
        remainder = (a * remainder) % divisor;
    }
    return remainder;
}

module.exports = {
    encryptChar, 
    decryptChar,
    gcd,
    key: () => {
        let s = require('prime-number-sequence').primeNumbersUpToN(1000);
        s = s.slice(s.length - 100, s.length - 1)
        let length = s.length;
        let randomIndex = Math.floor(Math.random() * length - 1);
        let p = s[randomIndex];
        let randomIndexB = (randomIndex + 100) % (length);

        let q = s[randomIndexB];
        let n = p * q;


        let totient = (p - 1) * (q - 1);
        let lambda_n = totient
        let e = 3;
        while (e < totient - 1) {
            if ((gcd(e, totient) == 1)) {
                break;
            }
            e++;
        }
        if (gcd(e, lambda_n) != 1) {
            throw Error(`(gcd(e, λ(n)) shoulb be 1 but is (gcd(${e}, ${lambda_n}) = ${gcd(e, lambda_n)}`)
        }
        if (e >= lambda_n) {
            throw Error(`e := ${e} is not less than \u03BB(pq) = ${lambda_n}`)
        }
        // let e = 170
        if (gcd(lambda_n, e) > 1) {
            throw Error("e is not relatively prime with lambda_n")
        }
        let d = undefined;
        let x = 2;
        while (d == undefined) {
            let possible_value = ((lambda_n * x) + 1) / e;
            if ((Math.floor(possible_value) == possible_value)) {
                d = possible_value;
            }
            x++;
        }

        if ((d * e) % lambda_n != 1)
        {
            throw Error(`d := ${d} does not satisfy d = 1 (mod \u03BB(pq)) / e = 1 (mod ${lambda_n}) / ${e} = ${d}`)
        }
        
        let key = { p, n, q, lambda_n, e, d, totient };
        return key;
    },

    encryptChar,
    decryptChar,
    encryptString: (key, string) => {
        return string.split("").map(char => encryptChar(key, char)).join("");
    },

    decryptString: (key, string) => {
        return string.split("").map(char => decryptChar(key, char)).join("");
    },

    encryptInteger: (key, number) => {
        return exponentialMod(number, key.e, key.n)
    },

    decryptInteger: (key, number) => {
        return exponentialMod(number, key.d, key.n)
    },

    encrypt(key, string) {
        let byteCount = Math.ceil(Math.log2(key.n)/8);
        let unencryptedBuffer = string.split("").map(c => c.charCodeAt(0));

        let encryptedBuffer = unencryptedBuffer.map(charCode => { 
            let intermediateBuffer = byteArrayFrom(this.encryptInteger(key, charCode))
            while(intermediateBuffer.length < byteCount) {
                intermediateBuffer.unshift(0)
            }
            return intermediateBuffer;
        });
        encryptedBuffer = [].concat.apply([], encryptedBuffer);
        // console.log(encryptedBuffer)
        return encryptedBuffer.map(i => String.fromCharCode(i)).join("")
    },

    decrypt(key, string) {
        let byteCount = Math.ceil(Math.log2(key.n)/8);

        let encryptedBuffer = Array.from(string).map(c => c.charCodeAt(0));
        let unencryptedBuffer = [];
        for (let i = 0; i < encryptedBuffer.length; i+=byteCount) {
            let partition = encryptedBuffer.slice(i, i+3);
            let encryptedNumber = numberFromByteArray(partition);
            let unencryptedNumber = this.decryptInteger(key, encryptedNumber)
            // console.log(`partition: ${partition} -> ${encryptedNumber}; decrypt(${encryptedNumber}) = ${unencryptedNumber} `);
            unencryptedBuffer.push(unencryptedNumber);
        }
        return unencryptedBuffer.map(i => String.fromCharCode(i)).join("")
    }

}