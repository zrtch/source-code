const obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
  },
}

Object.defineProperties(obj, 'a', {
  get() {
    console.log('get')
  },
  set() {
    console.log('set')
  },
})

obj.a;
obj.a = 2