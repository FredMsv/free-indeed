self.addEventListener('push', function(event) {
    if (!event.data) return;
  
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png', // Assurez-vous d'avoir une icône ou mettez null
      badge: '/badge-72x72.png', // Idem
      data: {
        url: data.url || '/'
      }
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  });