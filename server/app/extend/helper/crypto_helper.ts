/*
 * @Author: cuiweiqiang
 * @Date:   2018-03-01 14:49:37
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 15:09:01
 */
import * as crypto from 'crypto';

// /**
//  * node原始加密对象
//  * @returns {*}
//  */
// export { crypto };

/**
 * RsaSha256Sign签名
 * @param text 需要签名的文本
 * @param key  签名用的私key
 * @param digest 数据格式
 * @returns {string} 签名之后的文本
 */
export function rsaSha256Sign(text, privatekey, digest = "hex") {
    let sign = crypto.createSign('RSA-SHA256')
    sign.update(text)
    return sign.sign(privatekey, digest as crypto.HexBase64Latin1Encoding);
};

/**
 * 签名验证
 * @param text 需要签名的文本
 * @param sign 签名
 * @param publickKey 公key
 * @param digest 数据格式
 * @returns {bool}
 */
export function rsaSha256Verify(text, sign, publickKey, digest = "hex") {
    let verify = crypto.createVerify('RSA-SHA256');
    verify.update(text);
    return verify.verify(publickKey, sign, digest as crypto.HexBase64Latin1Encoding);
};

/**
 * sha512加密
 * @param text 需要加密的内容
 * @param digest 格式
 * @param digest 数据格式
 * @returns {string}
 */
export function sha512(text, digest = "hex") {
    return crypto.createHash('sha512').update(text).digest(digest as crypto.HexBase64Latin1Encoding);
};

/**
 * hmacSha1加密
 * @param text 需要加密的内容
 * @param key  加密使用的key
 * @param digest 数据格式
 */
export function hmacSha1(text, key, digest = "hex") {
    return crypto.createHmac('sha1', key).update(text).digest(digest as crypto.HexBase64Latin1Encoding);
};

/**
 * md5加密
 * @param text 需要加密的文本
 * @returns {string}
 */
export function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
};

/**
 * 3des加密
 * @param text 加密文本
 * @param key  加密key
 * @param iv   加密iv
 * @returns {string}
 */
export function des3Cipher(text, key, iv) {
    let cipher = crypto.createCipheriv('des-ede3', new Buffer(key), new Buffer(iv ? iv : 0));
    let ciph = cipher.update(text, 'utf8', 'hex');
    ciph += cipher.final('hex');
    return ciph
};

/**
 * 3des解密
 * @param text 待解密文本
 * @param key  加密/解密key
 * @param iv   加密/解密iv
 * @returns {string}
 */
export function des3Decipher(text, key, iv) {
    let decipher = crypto.createDecipheriv('des-ede3', new Buffer(key), new Buffer(iv ? iv : 0));
    let txt = decipher.update(text, 'hex', 'utf8');
    txt += decipher.final('utf8');
    return txt
};

/**
 * base64编码
 * @param text
 * @returns {string}
 */
export function base64Encode(text) {
    return new Buffer(text).toString('base64');
};

/**
 * base64解码
 * @param text
 * @returns {string}
 */
export function base64Decode(text) {
    return new Buffer(text, 'base64').toString();
};