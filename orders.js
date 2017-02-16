(function() {
    var recent = "";

    // Create WebSocket connection.
    const socket = new WebSocket('ws://127.0.0.1:1880/ws');

    socket.addEventListener('open', function (event) {
        swal("Connected!", "We connected to the server!", "success");
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        var data = JSON.parse(event.data);

        if (Array.isArray(data)) {
            data.forEach(function(entry) {
                document.querySelector('#order-' + entry).innerHTML = "Active";
            });
            [1, 2, 3].forEach(function(entry) {
                if (data.indexOf(entry) == -1) {
                    document.querySelector('#order-' + entry).innerHTML = "Inactive";
                }
            });
            swal("Awesome!", "Action completed successfully.", "success");
        }

        if ('msg' in data) {
            swal("Oops!", data.msg, "error");
        }

        if ('active' in data) {
            swal((data.active ? "Active" : "Inactive"), "Order #" + recent.replace(/^(check|active)\-/g, '') + " is " + (data.active ? "Active" : "Inactive"), "success");
        }
    });

    document.querySelectorAll('.activate').forEach(function(res) {
        res.addEventListener('click', function(evt) {
            recent = evt.target.id;
            socket.send(JSON.stringify({intent: "activate", unit: parseInt(evt.target.id.replace('active-', ''))}));
        });
    });

    document.querySelectorAll('.deactivate').forEach(function(res) {
        res.addEventListener('click', function(evt) {
            recent = evt.target.id;
            socket.send(JSON.stringify({intent: "deactivate", unit: parseInt(evt.target.id.replace('inactive-', ''))}));
        });
    });

    document.querySelectorAll('.check').forEach(function(res) {
        res.addEventListener('click', function(evt) {
            recent = evt.target.id;
            socket.send(JSON.stringify({intent: "status", unit: parseInt(evt.target.id.replace('check-', ''))}));
        });
    });
})();
