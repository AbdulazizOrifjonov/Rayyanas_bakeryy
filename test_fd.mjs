const buffer = Buffer.from('aGVsbG8=', 'base64');
const blob = new Blob([buffer], { type: 'text/plain' });
const fd = new FormData();
fd.append('file', blob, 'test.txt');
console.log('Blob and FormData exist!');
