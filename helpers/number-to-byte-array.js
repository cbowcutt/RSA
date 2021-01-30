
module.exports = {
    byteArrayFrom: function(number){
        let buff = [];
        let byteCount = Math.ceil(Math.log2(number)/8)
        for (let i = 0; i < byteCount; i++) {
            buff.push((number >> (8 * i)) & 0xff) 
        }
        return buff.reverse();
    },
    numberFromByteArray: function (byteArray) {
        let byteCount = byteArray.length;
        let number= 0;
        byteArray = byteArray.reverse()
        for (let i = 0; i < byteCount; i++) {
            number += byteArray[i] << (8 * i)
        }
        return number;
    }
};