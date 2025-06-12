import React from 'react';
import ReactDOM from 'react-dom/client';
import ComponentNetworkReview from './ComponentNetworkReview';
import './index.css';

// Bootstrap function for standalone development
const bootstrap = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <div className="network-review-plugin">
          <ComponentNetworkReview />
        </div>
      </React.StrictMode>
    );
  }
};

// Auto-bootstrap if running in standalone mode
if (process.env.NODE_ENV === 'development' && document.getElementById('root')) {
  bootstrap();
}

export default bootstrap;