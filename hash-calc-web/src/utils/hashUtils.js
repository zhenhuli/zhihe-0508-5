const MD5 = (function () {
  function rotateLeft(x, n) {
    return (x << n) | (x >>> (32 - n));
  }

  function addUnsigned(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | (~z)); }

  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str) {
    const wordCount = (((str.length + 8) - ((str.length + 8) % 64)) / 64 + 1) * 16;
    const wordArray = new Array(wordCount - 1);
    let bytePosition = 0;
    let byteCount = 0;
    while (byteCount < str.length) {
      const wordArrayPosition = (byteCount - (byteCount % 4)) / 4;
      bytePosition = (byteCount % 4) * 8;
      wordArray[wordArrayPosition] = (wordArray[wordArrayPosition] | (str.charCodeAt(byteCount) << bytePosition));
      byteCount++;
    }
    const wordArrayPosition = (byteCount - (byteCount % 4)) / 4;
    bytePosition = (byteCount % 4) * 8;
    wordArray[wordArrayPosition] = wordArray[wordArrayPosition] | (0x80 << bytePosition);
    wordArray[wordCount - 2] = str.length << 3;
    wordArray[wordCount - 1] = str.length >>> 29;
    return wordArray;
  }

  function wordToHex(value) {
    let hex = '';
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ('0' + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  return function (str) {
    const x = convertToWordArray(str);
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let k = 0; k < x.length; k += 16) {
      const AA = a, BB = b, CC = c, DD = d;
      a = FF(a, b, c, d, x[k + 0], 7, -680876936);
      d = FF(d, a, b, c, x[k + 1], 12, -389564586);
      c = FF(c, d, a, b, x[k + 2], 17, 606105819);
      b = FF(b, c, d, a, x[k + 3], 22, -1044525330);
      a = FF(a, b, c, d, x[k + 4], 7, -176418897);
      d = FF(d, a, b, c, x[k + 5], 12, 1200080426);
      c = FF(c, d, a, b, x[k + 6], 17, -1473231341);
      b = FF(b, c, d, a, x[k + 7], 22, -45705983);
      a = FF(a, b, c, d, x[k + 8], 7, 1770035416);
      d = FF(d, a, b, c, x[k + 9], 12, -1958414417);
      c = FF(c, d, a, b, x[k + 10], 17, -42063);
      b = FF(b, c, d, a, x[k + 11], 22, -1990404162);
      a = FF(a, b, c, d, x[k + 12], 7, 1804603682);
      d = FF(d, a, b, c, x[k + 13], 12, -40341101);
      c = FF(c, d, a, b, x[k + 14], 17, -1502002290);
      b = FF(b, c, d, a, x[k + 15], 22, 1236535329);
      a = GG(a, b, c, d, x[k + 1], 5, -165796510);
      d = GG(d, a, b, c, x[k + 6], 9, -1069501632);
      c = GG(c, d, a, b, x[k + 11], 14, 643717713);
      b = GG(b, c, d, a, x[k + 0], 20, -373897302);
      a = GG(a, b, c, d, x[k + 5], 5, -701558691);
      d = GG(d, a, b, c, x[k + 10], 9, 38016083);
      c = GG(c, d, a, b, x[k + 15], 14, -660478335);
      b = GG(b, c, d, a, x[k + 4], 20, -405537848);
      a = GG(a, b, c, d, x[k + 9], 5, 568446438);
      d = GG(d, a, b, c, x[k + 14], 9, -1019803690);
      c = GG(c, d, a, b, x[k + 3], 14, -187363961);
      b = GG(b, c, d, a, x[k + 8], 20, 1163531501);
      a = GG(a, b, c, d, x[k + 13], 5, -1444681467);
      d = GG(d, a, b, c, x[k + 2], 9, -51403784);
      c = GG(c, d, a, b, x[k + 7], 14, 1735328473);
      b = GG(b, c, d, a, x[k + 12], 20, -1926607734);
      a = HH(a, b, c, d, x[k + 5], 4, -378558);
      d = HH(d, a, b, c, x[k + 8], 11, -2022574463);
      c = HH(c, d, a, b, x[k + 11], 16, 1839030562);
      b = HH(b, c, d, a, x[k + 14], 23, -35309556);
      a = HH(a, b, c, d, x[k + 1], 4, -1530992060);
      d = HH(d, a, b, c, x[k + 4], 11, 1272893353);
      c = HH(c, d, a, b, x[k + 7], 16, -155497632);
      b = HH(b, c, d, a, x[k + 10], 23, -1094730640);
      a = HH(a, b, c, d, x[k + 13], 4, 681279174);
      d = HH(d, a, b, c, x[k + 0], 11, -358537222);
      c = HH(c, d, a, b, x[k + 3], 16, -722521979);
      b = HH(b, c, d, a, x[k + 6], 23, 76029189);
      a = HH(a, b, c, d, x[k + 9], 4, -640364487);
      d = HH(d, a, b, c, x[k + 12], 11, -421815835);
      c = HH(c, d, a, b, x[k + 15], 16, 530742520);
      b = HH(b, c, d, a, x[k + 2], 23, -995338651);
      a = II(a, b, c, d, x[k + 0], 6, -198630844);
      d = II(d, a, b, c, x[k + 7], 10, 1126891415);
      c = II(c, d, a, b, x[k + 14], 15, -1416354905);
      b = II(b, c, d, a, x[k + 5], 21, -57434055);
      a = II(a, b, c, d, x[k + 12], 6, 1700485571);
      d = II(d, a, b, c, x[k + 3], 10, -1894986606);
      c = II(c, d, a, b, x[k + 10], 15, -1051523);
      b = II(b, c, d, a, x[k + 1], 21, -2054922799);
      a = II(a, b, c, d, x[k + 8], 6, 1873313359);
      d = II(d, a, b, c, x[k + 15], 10, -30611744);
      c = II(c, d, a, b, x[k + 6], 15, -1560198380);
      b = II(b, c, d, a, x[k + 13], 21, 1309151649);
      a = II(a, b, c, d, x[k + 4], 6, -145523070);
      d = II(d, a, b, c, x[k + 11], 10, -1120210379);
      c = II(c, d, a, b, x[k + 2], 15, 718787259);
      b = II(b, c, d, a, x[k + 9], 21, -343485551);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  };
})();

const SHA1 = (function () {
  function rotateLeft(n, s) {
    return (n << s) | (n >>> (32 - s));
  }

  function cvtHex(val) {
    let str = '';
    for (let i = 7; i >= 0; i--) {
      str += ((val >>> (i * 4)) & 0x0f).toString(16);
    }
    return str.toLowerCase();
  }

  return function (msg) {
    let w = new Array(80);
    let H0 = 0x67452301;
    let H1 = 0xefcdab89;
    let H2 = 0x98badcfe;
    let H3 = 0x10325476;
    let H4 = 0xc3d2e1f0;
    let msgLen = msg.length;
    let wordArray = [];
    for (let i = 0; i < msgLen - 3; i += 4) {
      wordArray[i >> 2] = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    }
    switch (msgLen % 4) {
      case 0:
        wordArray[msgLen >> 2] = 0x80 << 24;
        break;
      case 1:
        wordArray[msgLen >> 2] = msg.charCodeAt(msgLen - 1) << 24 | 0x80 << 16;
        break;
      case 2:
        wordArray[msgLen >> 2] = msg.charCodeAt(msgLen - 2) << 24 | msg.charCodeAt(msgLen - 1) << 16 | 0x80 << 8;
        break;
      case 3:
        wordArray[msgLen >> 2] = msg.charCodeAt(msgLen - 3) << 24 | msg.charCodeAt(msgLen - 2) << 16 | msg.charCodeAt(msgLen - 1) << 8 | 0x80;
        break;
    }
    while ((wordArray.length % 16) != 14) wordArray.push(0);
    wordArray.push(msgLen >>> 29);
    wordArray.push((msgLen << 3) & 0x0ffffffff);
    for (let m = 0; m < wordArray.length; m += 16) {
      for (let i = 0; i < 16; i++) w[i] = wordArray[m + i];
      for (let i = 16; i < 80; i++) w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
      let A = H0;
      let B = H1;
      let C = H2;
      let D = H3;
      let E = H4;
      for (let i = 0; i < 20; i++) {
        let temp = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + w[i] + 0x5a827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotateLeft(B, 30);
        B = A;
        A = temp;
      }
      for (let i = 20; i < 40; i++) {
        let temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + w[i] + 0x6ed9eba1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotateLeft(B, 30);
        B = A;
        A = temp;
      }
      for (let i = 40; i < 60; i++) {
        let temp = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + w[i] + 0x8f1bbcdc) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotateLeft(B, 30);
        B = A;
        A = temp;
      }
      for (let i = 60; i < 80; i++) {
        let temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + w[i] + 0xca62c1d6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotateLeft(B, 30);
        B = A;
        A = temp;
      }
      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;
    }
    return (cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4)).toLowerCase();
  };
})();

async function SHA256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function calculateAllHashes(text) {
  return {
    md5: MD5(text),
    sha1: SHA1(text),
    sha256: await SHA256(text)
  };
}

async function calculateFileHashes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const hashes = await calculateAllHashes(text);
      resolve(hashes);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export { MD5, SHA1, SHA256, calculateAllHashes, calculateFileHashes };
