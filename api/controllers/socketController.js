module.exports = function(app, io){
    io.on("connection", function(socket){
        socket.on("update-for-client-list-exercises",(data)=>{
            io.sockets.emit("client-update-list-exercises",data);
        });

        socket.on("update-for-admin-list-submits",(data)=>{
            io.sockets.emit("admin-update-list-submits",data);
        });

        socket.on("update-for-admin-count-submits",(data)=>{
            io.sockets.emit("admin-update-count-submits",data);
        })
    })
}