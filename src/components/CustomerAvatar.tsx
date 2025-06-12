import React from 'react';
import { CustomerAvatarProps } from '../data/types';
import './CustomerAvatar.css';

class CustomerAvatar extends React.Component<CustomerAvatarProps> {
  // Generate initials from customer name
  private getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Generate a consistent color based on the name
  private getAvatarColor = (name: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  render() {
    const { name, size = 50 } = this.props;
    const initials = this.getInitials(name);
    const backgroundColor = this.getAvatarColor(name);

    const avatarStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor,
      fontSize: `${size * 0.4}px`,
      lineHeight: `${size}px`
    };

    return (
      <div 
        className="customer-avatar"
        style={avatarStyle}
        title={name}
      >
        {initials}
      </div>
    );
  }
}

export default CustomerAvatar;