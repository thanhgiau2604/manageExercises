const globalTime = require('global-time');
 
// (async () => {
//     console.log(1);
//   const time = await globalTime();
//   console.log(2);
//   const date = new Date(time);
//   console.log(3);
//   console.log(time);  // 1560529986678.603
//   console.log(date.toLocaleString());  // 2019-06-14T16:33:06.678Z
// })();

async function getDateTime(){
    const time = await globalTime();
    const date = new Date(time);
    const str = date.toLocaleString();
    return new Date(str).getTime();
}

getDateTime().then( result => console.log(result));

