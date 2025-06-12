#!/usr/bin/env python3
"""
NetworkReview Plugin Lifecycle Manager (Updated)

Enhanced lifecycle manager that extends BaseLifecycleManager for the new
multi-user plugin architecture with shared storage and logical references.
"""

import json
import datetime
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import structlog

# Import the base lifecycle manager
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'app', 'plugins'))
from base_lifecycle_manager import BaseLifecycleManager

logger = structlog.get_logger()


class NetworkReviewLifecycleManager(BaseLifecycleManager):
    """Enhanced lifecycle manager for NetworkReview plugin"""
    
    def __init__(self, plugin_slug: str, version: str, shared_storage_path: Path):
        super().__init__(plugin_slug, version, shared_storage_path)
        
        # Plugin metadata
        self.PLUGIN_DATA = {
            "name": "BrainDriveNetworkReview",
            "description": "A rotating review display widget that shows customer testimonials and reviews in an attractive card format",
            "version": version,
            "type": "frontend",
            "icon": "Star",
            "category": "marketing",
            "official": False,
            "author": "BrainDrive",
            "compatibility": "1.0.0",
            "scope": "BrainDriveNetworkReview",
            "bundle_method": "webpack",
            "bundle_location": "dist/remoteEntry.js",
            "is_local": False,
            "long_description": "Display customer testimonials and reviews in a professional rotating card format with automatic 10-second rotation, star ratings, and customer avatars. Perfect for marketing and social proof.",
            "plugin_slug": plugin_slug,
            "source_type": "local",
            "source_url": "https://github.com/BrainDrive/NetworkReview",
            "update_check_url": "https://api.github.com/repos/BrainDrive/NetworkReview/releases/latest",
            "last_update_check": None,
            "update_available": False,
            "latest_version": None,
            "installation_type": "production",
            "permissions": ["storage.read", "storage.write"]
        }
        
        # Module definitions
        self.MODULE_DATA = [
            {
                "name": "ComponentNetworkReview",
                "display_name": "Customer Review Display",
                "description": "Rotating customer testimonial and review display widget",
                "icon": "Star",
                "category": "marketing",
                "priority": 1,
                "props": {},
                "config_fields": {
                    "rotation_interval": {
                        "type": "number",
                        "description": "Auto-rotation interval in seconds",
                        "default": 10
                    },
                    "show_indicators": {
                        "type": "boolean",
                        "description": "Show navigation indicators",
                        "default": True
                    },
                    "pause_on_hover": {
                        "type": "boolean",
                        "description": "Pause rotation when hovering",
                        "default": True
                    },
                    "transition_duration": {
                        "type": "number",
                        "description": "Transition duration in milliseconds",
                        "default": 500
                    }
                },
                "messages": {},
                "required_services": {},
                "dependencies": [],
                "layout": {
                    "minWidth": 3,
                    "minHeight": 3,
                    "defaultWidth": 4,
                    "defaultHeight": 4
                },
                "tags": ["marketing", "reviews", "testimonials", "customers", "social-proof"]
            }
        ]
    
    async def get_plugin_metadata(self) -> Dict[str, Any]:
        """Return plugin metadata and configuration"""
        return self.PLUGIN_DATA.copy()
    
    async def get_module_metadata(self) -> List[Dict[str, Any]]:
        """Return module definitions for this plugin"""
        return self.MODULE_DATA.copy()
    
    async def _perform_user_installation(self, user_id: str, db: AsyncSession, shared_plugin_path: Path) -> Dict[str, Any]:
        """Plugin-specific installation logic using shared plugin path"""
        try:
            logger.info(f"Installing NetworkReview plugin for user {user_id} using shared path {shared_plugin_path}")
            
            # Check if plugin already exists for user
            existing_check = await self._check_existing_plugin(user_id, db)
            if existing_check['exists']:
                return {
                    'success': False, 
                    'error': f"Plugin already installed for user {user_id}",
                    'plugin_id': existing_check['plugin_id']
                }
            
            # Validate shared plugin files exist
            if not await self._validate_shared_installation(shared_plugin_path):
                return {'success': False, 'error': 'Invalid shared plugin installation'}
            
            # Create database records
            db_result = await self._create_database_records(user_id, db)
            if not db_result['success']:
                return db_result
            
            logger.info(f"NetworkReview plugin installed successfully for user {user_id}")
            
            return {
                'success': True,
                'plugin_id': db_result['plugin_id'],
                'plugin_slug': self.plugin_slug,
                'modules_created': db_result['modules_created'],
                'shared_path': str(shared_plugin_path)
            }
            
        except Exception as e:
            logger.error(f"Plugin installation failed for user {user_id}: {e}")
            return {'success': False, 'error': str(e)}
    
    async def _perform_user_uninstallation(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Plugin-specific uninstallation logic"""
        try:
            logger.info(f"Uninstalling NetworkReview plugin for user {user_id}")
            
            existing_check = await self._check_existing_plugin(user_id, db)
            if not existing_check['exists']:
                return {'success': False, 'error': 'Plugin not found for user'}
            
            plugin_id = existing_check['plugin_id']
            
            # Delete database records
            delete_result = await self._delete_database_records(user_id, plugin_id, db)
            if not delete_result['success']:
                return delete_result
            
            logger.info(f"NetworkReview plugin uninstalled successfully for user {user_id}")
            
            return {
                'success': True,
                'plugin_id': plugin_id,
                'deleted_modules': delete_result['deleted_modules']
            }
            
        except Exception as e:
            logger.error(f"Plugin uninstallation failed for user {user_id}: {e}")
            return {'success': False, 'error': str(e)}
    
    async def _check_existing_plugin(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Check if plugin already exists for user"""
        try:
            plugin_query = text("""
            SELECT id, name, version, enabled, created_at, updated_at
            FROM plugin 
            WHERE user_id = :user_id AND plugin_slug = :plugin_slug
            """)
            
            result = await db.execute(plugin_query, {
                'user_id': user_id,
                'plugin_slug': self.plugin_slug
            })
            
            plugin_row = result.fetchone()
            if plugin_row:
                return {
                    'exists': True,
                    'plugin_id': plugin_row.id,
                    'plugin_info': {
                        'id': plugin_row.id,
                        'name': plugin_row.name,
                        'version': plugin_row.version,
                        'enabled': plugin_row.enabled,
                        'created_at': plugin_row.created_at,
                        'updated_at': plugin_row.updated_at
                    }
                }
            else:
                return {'exists': False}
                
        except Exception as e:
            logger.error(f"Error checking existing plugin: {e}")
            return {'exists': False, 'error': str(e)}
    
    async def _validate_shared_installation(self, shared_plugin_path: Path) -> bool:
        """Validate shared plugin installation"""
        try:
            required_files = ["package.json"]
            missing_files = []
            
            for file_path in required_files:
                if not (shared_plugin_path / file_path).exists():
                    missing_files.append(file_path)
            
            if missing_files:
                logger.error(f"Missing required files in shared installation: {', '.join(missing_files)}")
                return False
            
            # Validate package.json content
            try:
                package_json_path = shared_plugin_path / "package.json"
                with open(package_json_path, 'r') as f:
                    package_data = json.load(f)
                
                if package_data.get('name') != self.plugin_slug:
                    logger.warning(f"Package name mismatch: expected {self.plugin_slug}, got {package_data.get('name')}")
                
            except (json.JSONDecodeError, KeyError) as e:
                logger.error(f'Invalid package.json file: {e}')
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating shared installation: {e}")
            return False
    
    async def _create_database_records(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Create plugin and module records in database"""
        try:
            current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            plugin_id = f"{user_id}_{self.plugin_slug}"
            
            # Create plugin record
            plugin_stmt = text("""
            INSERT INTO plugin
            (id, name, description, version, type, enabled, icon, category, status,
            official, author, last_updated, compatibility, downloads, scope,
            bundle_method, bundle_location, is_local, long_description,
            config_fields, messages, dependencies, created_at, updated_at, user_id,
            plugin_slug, source_type, source_url, update_check_url, last_update_check,
            update_available, latest_version, installation_type, permissions)
            VALUES
            (:id, :name, :description, :version, :type, :enabled, :icon, :category,
            :status, :official, :author, :last_updated, :compatibility, :downloads,
            :scope, :bundle_method, :bundle_location, :is_local, :long_description,
            :config_fields, :messages, :dependencies, :created_at, :updated_at, :user_id,
            :plugin_slug, :source_type, :source_url, :update_check_url, :last_update_check,
            :update_available, :latest_version, :installation_type, :permissions)
            """)
            
            await db.execute(plugin_stmt, {
                'id': plugin_id,
                'name': self.PLUGIN_DATA['name'],
                'description': self.PLUGIN_DATA['description'],
                'version': self.PLUGIN_DATA['version'],
                'type': self.PLUGIN_DATA['type'],
                'enabled': True,
                'icon': self.PLUGIN_DATA['icon'],
                'category': self.PLUGIN_DATA['category'],
                'status': 'activated',
                'official': self.PLUGIN_DATA['official'],
                'author': self.PLUGIN_DATA['author'],
                'last_updated': current_time,
                'compatibility': self.PLUGIN_DATA['compatibility'],
                'downloads': 0,
                'scope': self.PLUGIN_DATA['scope'],
                'bundle_method': self.PLUGIN_DATA['bundle_method'],
                'bundle_location': self.PLUGIN_DATA['bundle_location'],
                'is_local': self.PLUGIN_DATA['is_local'],
                'long_description': self.PLUGIN_DATA['long_description'],
                'config_fields': json.dumps({}),
                'messages': None,
                'dependencies': None,
                'created_at': current_time,
                'updated_at': current_time,
                'user_id': user_id,
                'plugin_slug': self.plugin_slug,
                'source_type': self.PLUGIN_DATA['source_type'],
                'source_url': self.PLUGIN_DATA['source_url'],
                'update_check_url': self.PLUGIN_DATA['update_check_url'],
                'last_update_check': self.PLUGIN_DATA['last_update_check'],
                'update_available': self.PLUGIN_DATA['update_available'],
                'latest_version': self.PLUGIN_DATA['latest_version'],
                'installation_type': self.PLUGIN_DATA['installation_type'],
                'permissions': json.dumps(self.PLUGIN_DATA['permissions'])
            })
            
            # Create module records
            modules_created = []
            for module_data in self.MODULE_DATA:
                module_id = f"{user_id}_{self.plugin_slug}_{module_data['name']}"
                
                module_stmt = text("""
                INSERT INTO module
                (id, plugin_id, name, display_name, description, icon, category,
                enabled, priority, props, config_fields, messages, required_services,
                dependencies, layout, tags, created_at, updated_at, user_id)
                VALUES
                (:id, :plugin_id, :name, :display_name, :description, :icon, :category,
                :enabled, :priority, :props, :config_fields, :messages, :required_services,
                :dependencies, :layout, :tags, :created_at, :updated_at, :user_id)
                """)
                
                await db.execute(module_stmt, {
                    'id': module_id,
                    'plugin_id': plugin_id,
                    'name': module_data['name'],
                    'display_name': module_data['display_name'],
                    'description': module_data['description'],
                    'icon': module_data['icon'],
                    'category': module_data['category'],
                    'enabled': True,
                    'priority': module_data['priority'],
                    'props': json.dumps(module_data['props']),
                    'config_fields': json.dumps(module_data['config_fields']),
                    'messages': json.dumps(module_data['messages']),
                    'required_services': json.dumps(module_data['required_services']),
                    'dependencies': json.dumps(module_data['dependencies']),
                    'layout': json.dumps(module_data['layout']),
                    'tags': json.dumps(module_data['tags']),
                    'created_at': current_time,
                    'updated_at': current_time,
                    'user_id': user_id
                })
                
                modules_created.append(module_id)
            
            logger.info(f"Created database records for plugin {plugin_id} with {len(modules_created)} modules")
            return {'success': True, 'plugin_id': plugin_id, 'modules_created': modules_created}
            
        except Exception as e:
            logger.error(f"Error creating database records: {e}")
            return {'success': False, 'error': str(e)}
    
    async def _delete_database_records(self, user_id: str, plugin_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Delete plugin and module records from database"""
        try:
            # Delete modules first
            module_delete_stmt = text("""
            DELETE FROM module 
            WHERE plugin_id = :plugin_id AND user_id = :user_id
            """)
            
            module_result = await db.execute(module_delete_stmt, {
                'plugin_id': plugin_id,
                'user_id': user_id
            })
            
            deleted_modules = module_result.rowcount
            
            # Delete plugin
            plugin_delete_stmt = text("""
            DELETE FROM plugin 
            WHERE id = :plugin_id AND user_id = :user_id
            """)
            
            plugin_result = await db.execute(plugin_delete_stmt, {
                'plugin_id': plugin_id,
                'user_id': user_id
            })
            
            if plugin_result.rowcount == 0:
                return {'success': False, 'error': 'Plugin not found or not owned by user'}
            
            logger.info(f"Deleted database records for plugin {plugin_id} ({deleted_modules} modules)")
            return {'success': True, 'deleted_modules': deleted_modules}
            
        except Exception as e:
            logger.error(f"Error deleting database records: {e}")
            return {'success': False, 'error': str(e)}
    
    async def _export_user_data(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """Export user-specific data for migration"""
        try:
            # Get user's plugin configuration
            user_config = {}
            
            # Export any user-specific settings or data
            # This could include user preferences, custom configurations, etc.
            
            base_data = await super()._export_user_data(user_id, db)
            base_data.update({
                'user_config': user_config,
                'plugin_metadata': self.PLUGIN_DATA,
                'module_metadata': self.MODULE_DATA
            })
            
            return base_data
            
        except Exception as e:
            logger.error(f"Error exporting user data: {e}")
            return {}
    
    async def _import_user_data(self, user_id: str, db: AsyncSession, user_data: Dict[str, Any]):
        """Import user-specific data after migration"""
        try:
            # Import any user-specific settings or data
            user_config = user_data.get('user_config', {})
            
            # Apply user configuration if needed
            if user_config:
                logger.info(f"Importing user configuration for {user_id}: {user_config}")
                # Implementation would depend on what user data needs to be restored
            
        except Exception as e:
            logger.error(f"Error importing user data: {e}")


# For backward compatibility, create an alias
BrainDriveNetworkReviewLifecycleManager = NetworkReviewLifecycleManager