# NetworkReview Plugin

A rotating review display widget that shows customer testimonials and reviews in an attractive card format for the BrainDrive platform.

## Features

- **Automatic Rotation**: Reviews change every 10 seconds automatically
- **5 Sample Reviews**: Includes realistic customer testimonials with ratings
- **Professional Design**: Clean, modern card layout with customer avatars
- **Star Ratings**: Visual 5-star rating system
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme Support**: Automatically adapts to system theme preferences
- **Accessibility**: Full keyboard navigation and screen reader support
- **Smooth Transitions**: Elegant fade animations between reviews
- **Manual Navigation**: Click indicators to jump to specific reviews
- **Hover Pause**: Rotation pauses when hovering over the widget

## Installation

1. **Build the Plugin**:
   ```bash
   cd PluginBuild/NetworkReview
   chmod +x build.sh
   ./build.sh
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## Usage

### Basic Integration

The plugin exports a main component that can be integrated into any React application:

```tsx
import NetworkReview from './NetworkReview';

function App() {
  return (
    <div>
      <NetworkReview />
    </div>
  );
}
```

### BrainDrive Integration

The plugin is designed to work seamlessly with the BrainDrive plugin system through Module Federation.

## Architecture

### Modular Structure

```
src/
├── components/          # Reusable UI components
│   ├── ReviewCard.tsx   # Individual review display
│   ├── StarRating.tsx   # Star rating component
│   └── CustomerAvatar.tsx # Customer avatar/initials
├── data/               # Data management
│   ├── types.ts        # TypeScript interfaces
│   └── reviewData.ts   # Sample review data
├── utils/              # Utility functions
│   ├── reviewRotation.ts # Rotation logic
│   └── animations.ts   # Animation helpers
└── hooks/              # Future hook utilities
```

### Key Components

#### ComponentNetworkReview
Main container component that manages:
- Review rotation timer
- State management
- User interactions
- Accessibility features

#### ReviewCard
Displays individual reviews with:
- Customer avatar with initials
- Name and designation
- Star rating
- Review text
- Professional styling

#### StarRating
Renders star ratings with:
- Filled/empty star visualization
- Numeric rating display
- Accessibility labels

#### CustomerAvatar
Generates customer avatars with:
- Initials from customer names
- Consistent color generation
- Responsive sizing

## Configuration

### Review Data

Customize reviews by editing `src/data/reviewData.ts`:

```typescript
export const reviewData: Review[] = [
  {
    id: 1,
    name: "John Smith",
    designation: "Client Designation",
    rating: 4,
    text: "Your review text here..."
  },
  // Add more reviews...
];
```

### Rotation Settings

Modify rotation behavior in `ComponentNetworkReview.tsx`:

```typescript
// Change rotation interval (milliseconds)
this.rotationManager = new ReviewRotationManager(
  this.state.reviews.length,
  this.handleRotation,
  15000 // 15 seconds instead of 10
);
```

### Styling

The plugin uses CSS custom properties for easy theming:

```css
:root {
  --network-review-primary-color: #3498db;
  --network-review-secondary-color: #2c3e50;
  --network-review-text-color: #34495e;
  /* ... more variables */
}
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn
- TypeScript knowledge
- React experience

### Development Workflow

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **View in Browser**:
   Open `http://localhost:3007`

3. **Make Changes**:
   - Edit components in `src/components/`
   - Modify styles in corresponding `.css` files
   - Update data in `src/data/reviewData.ts`

4. **Build for Production**:
   ```bash
   npm run build
   ```

### Adding New Reviews

1. Edit `src/data/reviewData.ts`
2. Add new review objects to the array
3. Follow the existing structure:
   ```typescript
   {
     id: 6,
     name: "Customer Name",
     designation: "Job Title",
     rating: 5,
     text: "Review content..."
   }
   ```

### Customizing Appearance

1. **Colors**: Modify CSS custom properties in `src/index.css`
2. **Layout**: Edit component-specific CSS files
3. **Animations**: Adjust timing in `src/utils/animations.ts`
4. **Responsive**: Update media queries in CSS files

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Clear focus indicators

## Performance

- **Optimized Rendering**: Minimal re-renders
- **Memory Management**: Proper cleanup of timers
- **Lazy Loading**: Components load efficiently
- **Small Bundle**: Optimized build size

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Ensure Node.js 16+ is installed
   - Run `npm install` to install dependencies
   - Check TypeScript configuration

2. **Styling Issues**:
   - Verify CSS files are imported correctly
   - Check for CSS conflicts with parent application
   - Ensure PostCSS is configured properly

3. **Timer Issues**:
   - Check browser console for errors
   - Verify component lifecycle methods
   - Ensure proper cleanup in `componentWillUnmount`

### Debug Mode

Enable debug logging by setting:
```typescript
// In ComponentNetworkReview.tsx
private debug = true;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review the component documentation
- Submit issues through the project repository

## Changelog

### v1.0.0
- Initial release
- 5 sample reviews
- Automatic 10-second rotation
- Responsive design
- Dark theme support
- Accessibility features
- Modular architecture