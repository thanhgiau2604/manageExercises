const globalTime = require('global-time');
(async () => {
  const time = await globalTime();
  var d = new Date(time+7*3600000);
  console.log(d.getDate()+"-"+(d.getMonth()+1) +"-"+d.getFullYear()+" "+
     d.getHours()+"h"+d.getMinutes()+"m"+d.getSeconds()+"s");
})();
