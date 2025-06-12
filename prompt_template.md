# BrainDrive Plugin Creation Template

## User Input Section
**Plugin Name**: [PLUGIN_NAME]
**Plugin Description**: [PLUGIN_DESCRIPTION]
**Plugin Category**: [PLUGIN_CATEGORY] (e.g., monitoring, communication, utilities, entertainment)
**Specific Requirements**: [SPECIFIC_REQUIREMENTS]

---

## LLM Instructions for Plugin Creation

Using the NetworkEyes plugin located at `PluginBuild/NetworkEyes` as a reference, create a new plugin called `[PLUGIN_NAME]` located at `PluginBuild/[PLUGIN_NAME]`.

The plugin should implement the functionality described in `[PLUGIN_DESCRIPTION]` and meet the specific requirements outlined in `[SPECIFIC_REQUIREMENTS]`.

### Core Plugin Requirements

**Design Consistency**: Match the styling patterns used in existing BrainDrive plugins, including support for both light and dark themes. Use standard CSS with modern styling patterns.

**Self-Contained Logic**: Do not use React's useState or other hooks. The plugin must be fully modular and compatible with the BrainDrive plugin loader using React class components.

**Performance**: Ensure the plugin is optimized for performance and doesn't impact the overall BrainDrive application.

**Modularity**: The plugin should be completely self-contained and not depend on external services unless explicitly required.

**Layout and Sizing**: Use appropriate layout structure and dimensions to maintain UI consistency with other BrainDrive plugins.

### Critical Implementation Guidelines & Solutions

#### 1. TypeScript Configuration
**MANDATORY**: Configure TypeScript properly to avoid compilation issues:
- Set `"strict": false` in tsconfig.json
- Set `"noEmit": false` in tsconfig.json  
- Use `any` type for timer variables instead of `NodeJS.Timeout`
- Include proper lib arrays: `["dom", "dom.iterable", "es6"]`

#### 2. CSS and Styling Configuration
**CRITICAL**: Avoid TailwindCSS PostCSS configuration issues:
- **DO NOT** include TailwindCSS in dependencies or configuration
- Configure postcss.config.js to only include `autoprefixer`
- Use standard CSS classes with modern styling patterns
- Implement responsive design with CSS media queries
- Support dark mode with `@media (prefers-color-scheme: dark)`

#### 3. React Component Architecture
**REQUIRED**: Use React class components for plugin compatibility:
- Extend `React.Component<{}, StateInterface>`
- Use `this.state` and `this.setState()` for state management
- Implement `componentDidMount()` and `componentWillUnmount()` lifecycle methods
- Use class methods with arrow functions for proper `this` binding
- **NEVER** use functional components or hooks

#### 4. Timer and Async Operations Management
**IMPORTANT**: Handle timers and async operations properly:
- Use `any` type for timer variables: `private timer: any = null;`
- Always clear timers in `componentWillUnmount()` to prevent memory leaks
- Use `setTimeout` and `clearTimeout` for timing control
- Handle async operations with proper error handling

#### 5. Module Federation Configuration
**ESSENTIAL**: Configure webpack properly for BrainDrive integration:
- Ensure webpack.config.js exposes the main component correctly
- Use consistent naming between library name and exposed module
- Set unique port number (avoid conflicts with existing plugins)
- Configure shared React dependencies properly

#### 6. Lifecycle Manager Implementation
**CRITICAL**: The lifecycle_manager.py script is essential for plugin installation, updates, and deletion in the BrainDrive system. This script must be implemented following the exact pattern from NetworkEyes.

**Required Implementation:**
```python
class [PLUGIN_NAME]LifecycleManager:
    def __init__(self, plugins_base_dir: str = None):
        # Initialize with proper plugin metadata
        self.PLUGIN_DATA = {
            "name": "BrainDrive[PLUGIN_NAME]",
            "description": "[PLUGIN_DESCRIPTION]",
            "version": "1.0.0",
            "type": "frontend",
            "icon": "[APPROPRIATE_ICON]",
            "category": "[PLUGIN_CATEGORY]",
            "plugin_slug": "BrainDrive[PLUGIN_NAME]",
            "bundle_location": "dist/remoteEntry.js",
            # ... other required fields
        }
        
        self.MODULE_DATA = [
            {
                "name": "Component[PLUGIN_NAME]",
                "display_name": "[DISPLAY_NAME]",
                "description": "[MODULE_DESCRIPTION]",
                "category": "[PLUGIN_CATEGORY]",
                "layout": {
                    "minWidth": 3,
                    "minHeight": 2,
                    "defaultWidth": 4,
                    "defaultHeight": 3
                },
                # ... configuration fields and other metadata
            }
        ]
```

**Essential Methods to Implement:**
- `async def install_plugin(self, user_id: str, db: AsyncSession)` - Complete plugin installation
- `async def delete_plugin(self, user_id: str, db: AsyncSession)` - Clean plugin removal
- `async def get_plugin_status(self, user_id: str, db: AsyncSession)` - Status checking
- `async def _check_existing_plugin()` - Check if plugin exists for user
- `async def _create_user_plugin_directory()` - Create user-specific directories
- `async def _copy_plugin_files()` - Copy plugin files to user directory
- `async def _create_database_records()` - Create plugin and module database records
- `async def _delete_database_records()` - Remove database records
- `async def _validate_installation()` - Validate installation integrity
- `async def _check_modules_status()` - Verify module status
- `async def _cleanup_user_directory()` - Clean up directories on failure

**Database Integration Requirements:**
- Use SQLAlchemy async sessions for all database operations
- Implement proper transaction handling with rollback on failure
- Create both plugin and module records in the database
- Handle user-specific plugin installations
- Include proper error handling and logging with structlog

**File Management Requirements:**
- Create user-specific plugin directories under plugins_base_dir/user_id/
- Copy all necessary plugin files (dist/, src/, package.json, etc.)
- Generate plugin_metadata.json with installation details
- Implement proper cleanup on installation failure
- Validate file integrity after installation

**Critical Implementation Notes:**
- **MUST** follow the exact pattern from `PluginBuild/NetworkEyes/lifecycle_manager.py`
- **MUST** include all required imports: `json`, `logging`, `datetime`, `os`, `shutil`, `asyncio`, `pathlib`, `typing`, `sqlalchemy`
- **MUST** implement proper async/await patterns for all database operations
- **MUST** include comprehensive error handling and logging
- **MUST** support both installation and deletion operations
- **MUST** validate installation integrity before committing to database

#### 7. Required File Structure
**MANDATORY**: Create the following file structure:
```
PluginBuild/[PLUGIN_NAME]/
├── package.json (with correct braindrive metadata)
├── webpack.config.js (Module Federation setup)
├── tsconfig.json (permissive TypeScript config)
├── postcss.config.js (autoprefixer only)
├── build.sh (executable build script)
├── lifecycle_manager.py (plugin lifecycle management - CRITICAL)
├── README.md (comprehensive documentation)
├── public/index.html (HTML template)
└── src/
    ├── index.tsx (main export)
    ├── index.css (global styles, standard CSS only)
    ├── bootstrap.tsx (React initialization)
    ├── Component[PLUGIN_NAME].tsx (main component)
    └── Component[PLUGIN_NAME].css (component styles)
```

#### 8. Package.json Configuration
**REQUIRED**: Include proper metadata and dependencies:
```json
{
  "name": "braindrive[PLUGIN_NAME]",
  "version": "1.0.0",
  "braindrive": {
    "pluginType": "frontend",
    "initializer": "plugin_initializer.py",
    "compatibility": ">=1.0.0",
    "category": "[PLUGIN_CATEGORY]",
    "permissions": ["storage.read", "storage.write"]
  }
}
```

#### 9. Build Process Verification
**MANDATORY**: Ensure the build process works:
1. `npm install` - Install dependencies
2. `npm run build` - Build for production
3. Verify `dist/` directory contains `remoteEntry.js`
4. Test that no TypeScript or PostCSS errors occur

### Component Implementation Guidelines

#### State Management
- Use class-based state with proper TypeScript interfaces
- Initialize state in constructor
- Use `setState()` with proper state updates
- Handle state cleanup in `componentWillUnmount()`

#### Styling Approach
- Write standard CSS with descriptive class names
- Use CSS custom properties for theming
- Implement responsive design with media queries
- Support both light and dark themes
- Follow BrainDrive design patterns

#### Error Handling
- Implement proper error boundaries if needed
- Handle async operation failures gracefully
- Provide user feedback for error states
- Log errors appropriately for debugging

#### Performance Considerations
- Minimize re-renders with proper state management
- Clean up resources in component unmount
- Optimize animations and transitions
- Avoid memory leaks with proper cleanup

### Testing and Validation

Before completion, ensure:
1. **Build Success**: Plugin builds without errors
2. **File Structure**: All required files are present
3. **TypeScript**: No compilation errors
4. **CSS**: No PostCSS or styling issues
5. **Functionality**: Core features work as specified
6. **Responsive**: Works on different screen sizes
7. **Themes**: Supports both light and dark modes
8. **Performance**: No memory leaks or performance issues
9. **Lifecycle Manager**: lifecycle_manager.py implements all required methods
10. **Database Integration**: Proper async database operations with error handling
11. **Plugin Installation**: Can be installed/deleted through BrainDrive system

### Documentation Requirements

Create comprehensive documentation including:
- **README.md**: Installation, usage, and development instructions
- **Code Comments**: Explain complex logic and component structure
- **Type Definitions**: Proper TypeScript interfaces and types
- **Build Instructions**: Clear steps for building and deploying

### Common Pitfalls to Avoid

1. **TailwindCSS Dependencies**: Do not include TailwindCSS in package.json or configuration
2. **TypeScript Strict Mode**: Use permissive TypeScript configuration
3. **React Hooks**: Never use functional components or hooks
4. **Timer Leaks**: Always clean up timers and intervals
5. **Module Federation**: Ensure proper webpack configuration
6. **Port Conflicts**: Use unique port numbers for development
7. **CSS Conflicts**: Use scoped CSS classes to avoid conflicts
8. **State Management**: Use class-based state, not external state libraries
9. **Lifecycle Manager Missing**: Forgetting to implement lifecycle_manager.py will prevent plugin installation
10. **Database Transaction Errors**: Not implementing proper async/await and rollback handling
11. **File Path Issues**: Incorrect file paths in lifecycle manager will cause installation failures
12. **Plugin Metadata Errors**: Incorrect PLUGIN_DATA or MODULE_DATA will break plugin registration
13. **Missing Dependencies**: lifecycle_manager.py requires specific imports (sqlalchemy, structlog, etc.)

This template provides a comprehensive guide for creating robust, compatible BrainDrive plugins while avoiding common technical pitfalls.