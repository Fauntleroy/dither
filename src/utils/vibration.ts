export function hapticBuzz() {
	if ('vibrate' in navigator) {
		try {
			// Check and request permission if needed
			// await navigator.permissions.query({ name: 'vibrate' });

			// A short, sharp vibration pattern
			navigator.vibrate([50]); // Vibrate for 50 milliseconds
		} catch (error) {
			console.error('Error triggering vibration:', error);
		}
	}
}
