// Immediately take control of the page, see the 'Immediate Claim' recipe
// for a detailed explanation of the implementation of the following two
// event listeners.

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
    console.log('install')
});

self.addEventListener('activate', function(event) {
    console.log('activate')
    event.waitUntil(self.clients.claim());
});

// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
    event.waitUntil(
        // Retrieve a list of the clients of this service worker.
        self.clients.matchAll().then(function(clientList) {
            // Check if there's at least one focused client.
            const data = event.data ? event.data.text() : 'Error'
            const focused = clientList.some(function(client) {
                return client.focused;
            });
            console.log(data)
            const {title, message, fromWho} = JSON.parse(data)
            let notificationMessage ;
            if (focused) {
                notificationMessage = message;
            } else if (clientList.length > 0) {
                notificationMessage = 'Tenes una notificacion de ' + fromWho + '!!!';
            } else {
                notificationMessage = 'Cerraste la App, Tenes una notificacion!!!';
            }
            return self.registration.showNotification(title, {
                body: notificationMessage,
            });
        })
    );
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
    event.waitUntil(
        // Retrieve a list of the clients of this service worker.
        self.clients.matchAll().then(function(clientList) {
            // If there is at least one client, focus it.
            if (clientList.length > 0) {
                return clientList[0].focus();
            }


            // Otherwise, open a new page.
            return self.clients.openWindow('../push-clients_demo.html');
        })
    );  });
