// import React from 'react';
// import ReactDOM from 'react-dom';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import App from './App';

// // Create a QueryClient instance
// const queryClient = new QueryClient();

// ReactDOM.render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );


// index.tsx or main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 uses react-dom/client
import App from './App'; // Your main App component
//import './index.css'; // Include any global styles
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

// Create the root element
const rootElement = document.getElementById('root'); // Ensure your HTML has <div id="root"></div>
if (!rootElement) {
  throw new Error("Root element not found. Please check your HTML.");
}

// Initialize React application using createRoot
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
     <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </React.StrictMode>
);