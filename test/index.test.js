const RSA = require('../index');
const key = RSA.key();

// test('encrypt "HELLO"', () => {
//     expect(RSA.decryptString(key, RSA.encryptString(key, "HELLO"))).toBe("HELLO")
// })

let validateEncryptionAndDecryption = (message) => {
    expect(RSA.decrypt(key, RSA.encrypt(key, message))).toBe(message)
}

let toEncrypt = [
    "H",
    "E",
    "L",
    "HE",
    "HELLO",
    "HELLO123!."
]
toEncrypt.map(m => {
    test(`encrypt ${m}`, () => { validateEncryptionAndDecryption(m)})
})

// test('encrypt HELLO', () => {
//     validateEncryptionAndDecryption("HELLO");
// })


// test('encrypt i..65535', () => {
//     for (let i = 1; i < 65535; i++) {
//         expect(RSA.decryptInteger(key, RSA.encryptInteger(key, i))).toBe(i)
//     }

// })



test('gcd(\u03BB(pq), e) == 1', () => {
    let actualGCD = 1;
    for (let i = 2; i < Math.max(key.e, key.lambda_n); i++) {
        if ((key.e % i) == 0 && (key.lambda_n == 0)) {
            actualGCD = i;
            break;
        }
    }
    expect(actualGCD).toBe(1)
})

test('d ≡ e^−1 (mod λ(n))', () => {
    expect(((key.e * key.d) - 1) % key.lambda_n).toBe(0);
    // expect(key.d).toBe(Math.pow(key.e, -1) % key.lambda_n);
})

test('e and λ(n) are coprime', () => {
    expect(require('mathjs').gcd(key.e, key.lambda_n)).toBe(1);
    // expect(key.d).toBe(Math.pow(key.e, -1) % key.lambda_n);
})

test('λ(n) == p - 1 * q - 1', () => {
    expect((key.p - 1) * ( key.q - 1)).toBe(key.lambda_n)
})

test ('e * d % λ(n) == 1', () => {
    expect((key.d * key.e )% key.lambda_n).toBe(1)
})

// test ('e * d % ((p - 1) * (q - 1)) == 1', () => {
//     expect((key.d * key.e )% ((key.p - 1) * (key.q - 1))).toBe(1)
// })