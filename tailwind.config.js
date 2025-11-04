// This file configures Tailwind CSS for the extension.
// By keeping this file, we ensure the Tailwind CDN script is activated.
// We are now using default Tailwind classes directly in the components
// instead of a custom theme to ensure compatibility with the CDN build.
tailwind.config = {
    darkMode: 'media',
    theme: {
      extend: {}
    }
}