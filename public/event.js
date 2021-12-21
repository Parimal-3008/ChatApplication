var socket = io();
socket.on('broadcast',function(data){
  
               
  //  document.getElementById("NoOfUsers").innerHTML=data.asd+" "+data.id+ " <br>"+ data.msg;
});
function door() {
  console.log("121514");
  let msg = document.getElementById("msg").value;
  console.log(msg);
  socket.emit("door23", function (data) {
    console.log("54545");
     console.log(data.asd);
  });
}
function toSearch()
{
console.log("in to search");
}
