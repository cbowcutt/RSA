const { TestScheduler } = require('jest')

const { byteArrayFrom, numberFromByteArray } = require('../helpers/number-to-byte-array')
test('byteArrayFrom()', () => {
    let buff = byteArrayFrom(0x4c4c4f);
    expect(buff[0]).toBe(0x4c)
    expect(buff[1]).toBe(0x4c)
    expect(buff[2]).toBe(0x4f)
});

test('numberFromByteArray()', () => {
    let buff = [0x4c, 0x4c, 0x4f]
    let number = numberFromByteArray(buff);
    expect(number).toBe(0x4c4c4f)
})