# 🔌 Socket.IO ব্যবহারের সম্পূর্ণ গাইড (বাংলা)

## 📋 সূচিপত্র

1. [Client Side Setup](#client-side-setup)
2. [Authentication](#authentication)
3. [Message পাঠানো](#message-পাঠানো)
4. [Message গ্রহণ করা](#message-গ্রহণ-করা)
5. [Typing Indicator](#typing-indicator)
6. [Online/Offline Status](#onlineoffline-status)
7. [Message Seen Status](#message-seen-status)
8. [Room/Group Chat](#roomgroup-chat)
9. [Notifications](#notifications)
10. [Error Handling](#error-handling)

## 🚀 Client Side Setup

### React/Next.js এ Socket.IO Setup:

\`\`\`bash
npm install socket.io-client
\`\`\`

\`\`\`javascript
// utils/socket.js
import { io } from 'socket.io-client';

class SocketService {
constructor() {
this.socket = null;
this.isConnected = false;
}

// Socket connect করার function
connect(token) {
if (this.socket?.connected) return;

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token // আপনার JWT token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();

}

// Event listeners setup
setupEventListeners() {
this.socket.on('connect', () => {
console.log('✅ Socket connected');
this.isConnected = true;
});

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚫 Connection failed:', error.message);

      if (error.message === 'Authentication token required') {
        alert('Login করুন!');
      } else if (error.message === 'Invalid authentication token') {
        alert('Session expired! আবার login করুন।');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconnected');
      this.isConnected = true;
    });

}

// Socket disconnect করার function
disconnect() {
if (this.socket) {
this.socket.disconnect();
this.socket = null;
this.isConnected = false;
}
}

// Event emit করার helper function
emit(event, data) {
if (this.socket && this.isConnected) {
this.socket.emit(event, data);
} else {
console.warn('Socket not connected');
}
}

// Event listen করার helper function
on(event, callback) {
if (this.socket) {
this.socket.on(event, callback);
}
}

// Event listener remove করার function
off(event, callback) {
if (this.socket) {
this.socket.off(event, callback);
}
}
}

export const socketService = new SocketService();
\`\`\`

## 🔐 Authentication

### Login করার পর Socket Connect:

\`\`\`javascript
// Login component এ
const handleLogin = async (credentials) => {
try {
const response = await fetch('/api/v1/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(credentials)
});

    const data = await response.json();

    if (data.success) {
      const { token, user } = data.data;

      // Token save করুন
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Socket connect করুন
      socketService.connect(token);

      console.log('✅ Login successful and socket connected');
    }

} catch (error) {
console.error('❌ Login failed:', error);
}
};
\`\`\`

### App Load হওয়ার সময় Auto Connect:

\`\`\`javascript
// App.js বা \_app.js এ
import { useEffect } from 'react';
import { socketService } from '../utils/socket';

function App() {
useEffect(() => {
const token = localStorage.getItem('token');

    if (token) {
      // Auto connect if token exists
      socketService.connect(token);
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };

}, []);

return (
// Your app components
);
}
\`\`\`

### Logout করার সময় Socket Disconnect:

\`\`\`javascript
const handleLogout = () => {
localStorage.removeItem('token');
localStorage.removeItem('user');
socketService.disconnect();
window.location.href = '/login';
};
\`\`\`

## 📨 Message পাঠানো

### Text Message পাঠানো:

\`\`\`javascript
const sendMessage = (receiverId, messageText) => {
if (!socketService.isConnected) {
alert('Socket connected নেই!');
return;
}

if (!messageText.trim()) {
alert('Message লিখুন!');
return;
}

socketService.emit('sendMessage', {
receiverId: receiverId,
message: messageText,
media: null
});
};

// React component এ ব্যবহার:
const ChatComponent = () => {
const [message, setMessage] = useState('');
const [receiverId, setReceiverId] = useState('');

const handleSendMessage = (e) => {
e.preventDefault();

    if (message.trim() && receiverId) {
      sendMessage(receiverId, message);
      setMessage(''); // Input clear করুন
    }

};

return (

<form onSubmit={handleSendMessage}>
<input
value={message}
onChange={(e) => setMessage(e.target.value)}
placeholder="Message লিখুন..."
disabled={!socketService.isConnected}
/>
<button type="submit" disabled={!message.trim()}>
পাঠান
</button>
</form>
);
};
\`\`\`

### File/Image সহ Message পাঠানো:

\`\`\`javascript
const sendMessageWithFile = async (receiverId, messageText, file) => {
try {
// প্রথমে file upload করুন API দিয়ে
const formData = new FormData();
formData.append('file', file);
formData.append('senderId', getCurrentUserId());
formData.append('receiverId', receiverId);
formData.append('message', messageText);

    const token = localStorage.getItem('token');

    const response = await fetch('/api/v1/message/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Message with file sent:', data.data);
    } else {
      console.error('❌ Failed to send message:', data.message);
    }

} catch (error) {
console.error('❌ Error sending message with file:', error);
}
};

// File input component
const FileMessageInput = ({ receiverId }) => {
const [message, setMessage] = useState('');
const [selectedFile, setSelectedFile] = useState(null);

const handleFileSelect = (e) => {
const file = e.target.files[0];
if (file) {
// Check file size (max 10MB)
if (file.size > 10 _ 1024 _ 1024) {
alert('File size 10MB এর বেশি হতে পারবে না!');
return;
}
setSelectedFile(file);
}
};

const handleSendWithFile = () => {
if (selectedFile) {
sendMessageWithFile(receiverId, message, selectedFile);
setMessage('');
setSelectedFile(null);
}
};

return (

<div>
<input
type="text"
value={message}
onChange={(e) => setMessage(e.target.value)}
placeholder="Message লিখুন..."
/>
<input
        type="file"
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
{selectedFile && (
<div>
Selected: {selectedFile.name}
<button onClick={handleSendWithFile}>Send with File</button>
</div>
)}
</div>
);
};
\`\`\`

## 📬 Message গ্রহণ করা

### নতুন Message Listen করা:

\`\`\`javascript
// React component এ
const ChatComponent = () => {
const [messages, setMessages] = useState([]);
const [currentUserId, setCurrentUserId] = useState('');

useEffect(() => {
// Get current user
const user = JSON.parse(localStorage.getItem('user') || '{}');
setCurrentUserId(user.\_id);

    // নতুন message আসলে
    const handleNewMessage = (newMessage) => {
      console.log('📨 নতুন message পেয়েছি:', newMessage);

      setMessages(prevMessages => [...prevMessages, newMessage]);

      // Notification দেখান
      if (newMessage.senderId._id !== currentUserId) {
        showNotification(`${newMessage.senderId.name} থেকে নতুন message`);

        // Auto mark as seen if chat is open
        if (document.visibilityState === 'visible') {
          socketService.emit('markMessageSeen', {
            messageId: newMessage._id,
            senderId: newMessage.senderId._id
          });
        }
      }
    };

    // Message পাঠানোর confirmation
    const handleMessageSent = (sentMessage) => {
      console.log('✅ Message পাঠানো হয়েছে:', sentMessage);
      setMessages(prevMessages => [...prevMessages, sentMessage]);
    };

    // Message পাঠানোর error
    const handleMessageError = (error) => {
      console.error('❌ Message পাঠানো যায়নি:', error);
      alert(`Message পাঠানো যায়নি: ${error.error}`);
    };

    // Event listeners add করুন
    socketService.on('newMessage', handleNewMessage);
    socketService.on('messageSent', handleMessageSent);
    socketService.on('messageError', handleMessageError);

    // Cleanup
    return () => {
      socketService.off('newMessage', handleNewMessage);
      socketService.off('messageSent', handleMessageSent);
      socketService.off('messageError', handleMessageError);
    };

}, [currentUserId]);

// Notification function
const showNotification = (message) => {
if (Notification.permission === 'granted') {
new Notification('নতুন Message', {
body: message,
icon: '/favicon.ico'
});
}
};

// Request notification permission
useEffect(() => {
if (Notification.permission === 'default') {
Notification.requestPermission();
}
}, []);

return (

<div className="chat-messages">
{messages.map(msg => (
<div key={msg.\_id} className={`message ${msg.senderId._id === currentUserId ? 'sent' : 'received'}`}>
<div className="message-header">
<strong>{msg.senderId.name}</strong>
<span className="timestamp">
{new Date(msg.createdAt).toLocaleTimeString()}
</span>
</div>
<div className="message-content">
<p>{msg.message}</p>
{msg.media && (
<div className="message-media">
{msg.media.includes('image') ? (
<img src={msg.media || "/placeholder.svg"} alt="attachment" style={{maxWidth: '200px'}} />
) : (
<a href={msg.media} target="_blank" rel="noopener noreferrer">
📎 Attachment
</a>
)}
</div>
)}
</div>
{msg.senderId.\_id === currentUserId && (
<div className="message-status">
<span className={`seen-status ${msg.seen ? 'seen' : 'sent'}`}>
{msg.seen ? '✓✓' : '✓'}
</span>
</div>
)}
</div>
))}
</div>
);
};
\`\`\`

## ⌨️ Typing Indicator

### Typing Status পাঠানো:

\`\`\`javascript
const ChatInput = ({ receiverId }) => {
const [isTyping, setIsTyping] = useState(false);
const [message, setMessage] = useState('');
const typingTimeoutRef = useRef(null);

const handleInputChange = (e) => {
setMessage(e.target.value);

    // Typing start
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      socketService.emit('typing', {
        receiverId: receiverId,
        isTyping: true
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketService.emit('typing', {
          receiverId: receiverId,
          isTyping: false
        });
      }
    }, 2000); // 2 second পর typing stop

};

const handleInputFocus = () => {
if (message.length > 0 && !isTyping) {
setIsTyping(true);
socketService.emit('typing', {
receiverId: receiverId,
isTyping: true
});
}
};

const handleInputBlur = () => {
if (isTyping) {
setIsTyping(false);
socketService.emit('typing', {
receiverId: receiverId,
isTyping: false
});
}
};

return (
<input 
      value={message}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      placeholder="Message লিখুন..."
    />
);
};
\`\`\`

### Typing Status গ্রহণ করা:

\`\`\`javascript
const ChatComponent = () => {
const [typingUsers, setTypingUsers] = useState({});

useEffect(() => {
const handleUserTyping = (data) => {
const { userId, user, isTyping } = data;

      setTypingUsers(prev => ({
        ...prev,
        [userId]: isTyping ? user : null
      }));

      // Auto remove after 5 seconds
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: null
          }));
        }, 5000);
      }
    };

    socketService.on('userTyping', handleUserTyping);

    return () => {
      socketService.off('userTyping', handleUserTyping);
    };

}, []);

const getTypingText = () => {
const typing = Object.values(typingUsers).filter(Boolean);
if (typing.length === 0) return '';
if (typing.length === 1) return `${typing[0].name} লিখছে...`;
if (typing.length === 2) return `${typing[0].name} এবং ${typing[1].name} লিখছে...`;
return `${typing.length} জন লিখছে...`;
};

return (

<div>
{/_ Messages _/}
<div className="messages">
{/_ Your messages here _/}
</div>

      {/* Typing indicator */}
      {getTypingText() && (
        <div className="typing-indicator">
          <span className="typing-text">{getTypingText()}</span>
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>

);
};
\`\`\`

## 🟢 Online/Offline Status

### Online Users দেখা:

\`\`\`javascript
const OnlineUsers = () => {
const [onlineUsers, setOnlineUsers] = useState([]);
const [allUsers, setAllUsers] = useState([]); // Your users list

useEffect(() => {
// Online users list চান
socketService.emit('getOnlineUsers');

    // Online users list পান
    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };

    // কেউ online হলে
    const handleUserOnline = (data) => {
      console.log(`🟢 ${data.user.name} online হয়েছে`);
      setOnlineUsers(prev => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });

      // Show notification
      showNotification(`${data.user.name} এখন online`);
    };

    // কেউ offline হলে
    const handleUserOffline = (data) => {
      console.log(`🔴 User offline হয়েছে`);
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    };

    socketService.on('onlineUsers', handleOnlineUsers);
    socketService.on('userOnline', handleUserOnline);
    socketService.on('userOffline', handleUserOffline);

    return () => {
      socketService.off('onlineUsers', handleOnlineUsers);
      socketService.off('userOnline', handleUserOnline);
      socketService.off('userOffline', handleUserOffline);
    };

}, []);

const isUserOnline = (userId) => {
return onlineUsers.includes(userId);
};

return (

<div className="online-users">
<h3>Users ({onlineUsers.length} online)</h3>
{allUsers.map(user => (
<div key={user._id} className="user-item">
<div className="user-info">
<img src={user.avatar || "/placeholder.svg"} alt={user.name} />
<span>{user.name}</span>
</div>
<div className={`status ${isUserOnline(user._id) ? 'online' : 'offline'}`}>
{isUserOnline(user.\_id) ? '🟢' : '🔴'}
</div>
</div>
))}
</div>
);
};
\`\`\`

### User Status Component:

\`\`\`javascript
const UserStatus = ({ userId, userName }) => {
const [isOnline, setIsOnline] = useState(false);
const [lastSeen, setLastSeen] = useState(null);

useEffect(() => {
// Check initial online status
socketService.emit('getOnlineUsers');

    const handleOnlineUsers = (userIds) => {
      setIsOnline(userIds.includes(userId));
    };

    const handleUserOnline = (data) => {
      if (data.userId === userId) {
        setIsOnline(true);
        setLastSeen(null);
      }
    };

    const handleUserOffline = (data) => {
      if (data.userId === userId) {
        setIsOnline(false);
        setLastSeen(new Date());
      }
    };

    socketService.on('onlineUsers', handleOnlineUsers);
    socketService.on('userOnline', handleUserOnline);
    socketService.on('userOffline', handleUserOffline);

    return () => {
      socketService.off('onlineUsers', handleOnlineUsers);
      socketService.off('userOnline', handleUserOnline);
      socketService.off('userOffline', handleUserOffline);
    };

}, [userId]);

return (

<div className="user-status">
<span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
{isOnline ? '🟢' : '🔴'}
</span>
<span className="status-text">
{isOnline ? 'Online' : lastSeen ? `Last seen ${formatTime(lastSeen)}` : 'Offline'}
</span>
</div>
);
};

const formatTime = (date) => {
const now = new Date();
const diff = now - date;
const minutes = Math.floor(diff / 60000);

if (minutes < 1) return 'just now';
if (minutes < 60) return `${minutes}m ago`;

const hours = Math.floor(minutes / 60);
if (hours < 24) return `${hours}h ago`;

const days = Math.floor(hours / 24);
return `${days}d ago`;
};
\`\`\`

## 👁️ Message Seen Status

### Message দেখা হয়েছে mark করা:

\`\`\`javascript
const markMessageAsSeen = (messageId, senderId) => {
socketService.emit('markMessageSeen', {
messageId: messageId,
senderId: senderId
});
};

// Message component এ
const MessageItem = ({ message, currentUserId }) => {
const [isSeen, setIsSeen] = useState(message.seen);

useEffect(() => {
// যদি message আমার জন্য হয় এবং এখনো seen না হয়
if (message.receiverId === currentUserId && !message.seen) {
// Mark as seen when message comes into view
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
markMessageAsSeen(message.\_id, message.senderId.\_id);
observer.disconnect();
}
});
});

      const messageElement = document.getElementById(`message-${message._id}`);
      if (messageElement) {
        observer.observe(messageElement);
      }

      return () => observer.disconnect();
    }

}, [message, currentUserId]);

return (

<div id={`message-${message._id}`} className="message-item">
<div className="message-content">
<p>{message.message}</p>
{message.media && (
<img src={message.media || "/placeholder.svg"} alt="attachment" />
)}
</div>
<div className="message-info">
<span className="time">
{new Date(message.createdAt).toLocaleTimeString()}
</span>
{message.senderId.\_id === currentUserId && (
<span className={`seen-status ${isSeen ? 'seen' : 'sent'}`}>
{isSeen ? '✓✓' : '✓'}
</span>
)}
</div>
</div>
);
};
\`\`\`

### Message Seen Notification পাওয়া:

\`\`\`javascript
useEffect(() => {
const handleMessageSeen = (data) => {
const { messageId, seenBy, seenAt } = data;
console.log(`✓✓ Message দেখা হয়েছে: ${messageId} by ${seenBy}`);

    // Update message status in state
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId
          ? { ...msg, seen: true, seenAt: seenAt }
          : msg
      )
    );

};

socketService.on('messageSeen', handleMessageSeen);

return () => {
socketService.off('messageSeen', handleMessageSeen);
};
}, []);
\`\`\`

## 🏠 Room/Group Chat

### Room এ Join করা:

\`\`\`javascript
const GroupChat = ({ roomId, roomName }) => {
const [messages, setMessages] = useState([]);
const [members, setMembers] = useState([]);
const [newMessage, setNewMessage] = useState('');

useEffect(() => {
// Join room
socketService.emit('joinRoom', { roomId });

    // Room events
    const handleRoomJoined = (data) => {
      console.log(`🏠 Joined room: ${data.roomId}`);
      setMembers(data.members);
    };

    const handleUserJoinedRoom = (data) => {
      console.log(`👋 ${data.user.name} joined room`);
      setMembers(prev => [...prev, data.user.userId]);
    };

    const handleUserLeftRoom = (data) => {
      console.log(`👋 ${data.user.name} left room`);
      setMembers(prev => prev.filter(id => id !== data.user.userId));
    };

    const handleRoomMessage = (message) => {
      console.log('💬 Room message received:', message);
      setMessages(prev => [...prev, message]);
    };

    socketService.on('roomJoined', handleRoomJoined);
    socketService.on('userJoinedRoom', handleUserJoinedRoom);
    socketService.on('userLeftRoom', handleUserLeftRoom);
    socketService.on('roomMessage', handleRoomMessage);

    // Cleanup - leave room when component unmounts
    return () => {
      socketService.emit('leaveRoom', { roomId });
      socketService.off('roomJoined', handleRoomJoined);
      socketService.off('userJoinedRoom', handleUserJoinedRoom);
      socketService.off('userLeftRoom', handleUserLeftRoom);
      socketService.off('roomMessage', handleRoomMessage);
    };

}, [roomId]);

const sendRoomMessage = () => {
if (newMessage.trim()) {
socketService.emit('sendRoomMessage', {
roomId,
message: newMessage,
media: null
});
setNewMessage('');
}
};

return (

<div className="group-chat">
<div className="room-header">
<h3>{roomName}</h3>
<span>{members.length} members</span>
</div>

      <div className="room-messages">
        {messages.map(msg => (
          <div key={msg.id} className="room-message">
            <strong>{msg.sender.name}:</strong> {msg.message}
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="room-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Group এ message লিখুন..."
          onKeyPress={(e) => e.key === 'Enter' && sendRoomMessage()}
        />
        <button onClick={sendRoomMessage}>Send</button>
      </div>
    </div>

);
};
\`\`\`

## 🔔 Notifications

### Notification পাঠানো:

\`\`\`javascript
const sendNotification = (userId, notification) => {
socketService.emit('sendNotification', {
userId,
notification: {
title: notification.title,
message: notification.message,
type: notification.type || 'info', // 'info', 'success', 'warning', 'error'
data: notification.data || null
}
});
};

// Example usage
const notifyUser = () => {
sendNotification('user123', {
title: 'নতুন Message',
message: 'আপনার একটি নতুন message এসেছে',
type: 'info',
data: { messageId: 'msg123' }
});
};
\`\`\`

### Notification গ্রহণ করা:

\`\`\`javascript
const NotificationHandler = () => {
const [notifications, setNotifications] = useState([]);

useEffect(() => {
const handleNotification = (notification) => {
console.log('🔔 Notification received:', notification);

      setNotifications(prev => [notification, ...prev]);

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    socketService.on('notification', handleNotification);

    return () => {
      socketService.off('notification', handleNotification);
    };

}, []);

const removeNotification = (notificationId) => {
setNotifications(prev => prev.filter(n => n.id !== notificationId));
};

return (

<div className="notifications">
{notifications.map(notification => (
<div key={notification.id} className={`notification ${notification.type}`}>
<div className="notification-content">
<h4>{notification.title}</h4>
<p>{notification.message}</p>
</div>
<button onClick={() => removeNotification(notification.id)}>×</button>
</div>
))}
</div>
);
};
\`\`\`

## 🚨 Error Handling

### Connection এবং Authentication Errors:

\`\`\`javascript
const SocketErrorHandler = () => {
const [connectionStatus, setConnectionStatus] = useState('disconnected');
const [error, setError] = useState(null);

useEffect(() => {
const handleConnect = () => {
setConnectionStatus('connected');
setError(null);
console.log('✅ Socket connected successfully');
};

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      console.log('❌ Socket disconnected');
    };

    const handleConnectError = (error) => {
      setConnectionStatus('error');
      setError(error.message);
      console.error('🚫 Socket connection error:', error.message);

      if (error.message === 'Authentication token required') {
        alert('Login করুন!');
        window.location.href = '/login';
      } else if (error.message === 'Invalid authentication token') {
        alert('Session expired! আবার login করুন।');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.message === 'User not found') {
        alert('User account পাওয়া যায়নি!');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    const handleReconnect = () => {
      setConnectionStatus('connected');
      setError(null);
      console.log('🔄 Socket reconnected');
    };

    const handleReconnectError = (error) => {
      console.error('🚫 Reconnection failed:', error);
    };

    const handleError = (error) => {
      console.error('🚫 Socket error:', error);
      setError(error);
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('connect_error', handleConnectError);
    socketService.on('reconnect', handleReconnect);
    socketService.on('reconnect_error', handleReconnectError);
    socketService.on('error', handleError);

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('connect_error', handleConnectError);
      socketService.off('reconnect', handleReconnect);
      socketService.off('reconnect_error', handleReconnectError);
      socketService.off('error', handleError);
    };

}, []);

return (

<div className="socket-status">
<div className={`status-indicator ${connectionStatus}`}>
{connectionStatus === 'connected' && '🟢 Connected'}
{connectionStatus === 'disconnected' && '🔴 Disconnected'}
{connectionStatus === 'error' && '🚫 Connection Error'}
</div>
{error && (
<div className="error-message">
Error: {error}
</div>
)}
</div>
);
};
\`\`\`

### Message এবং Event Errors:

\`\`\`javascript
const ChatWithErrorHandling = () => {
const [messages, setMessages] = useState([]);
const [errors, setErrors] = useState([]);

useEffect(() => {
// Message errors
const handleMessageError = (error) => {
console.error('❌ Message error:', error);
setErrors(prev => [...prev, {
id: Date.now(),
type: 'message',
message: error.error,
details: error.details
}]);
};

    // Room message errors
    const handleRoomMessageError = (error) => {
      console.error('❌ Room message error:', error);
      setErrors(prev => [...prev, {
        id: Date.now(),
        type: 'room',
        message: error.error,
        details: error.details
      }]);
    };

    socketService.on('messageError', handleMessageError);
    socketService.on('roomMessageError', handleRoomMessageError);

    return () => {
      socketService.off('messageError', handleMessageError);
      socketService.off('roomMessageError', handleRoomMessageError);
    };

}, []);

const clearError = (errorId) => {
setErrors(prev => prev.filter(e => e.id !== errorId));
};

return (

<div>
{/_ Error notifications _/}
{errors.map(error => (
<div key={error.id} className="error-notification">
<strong>Error:</strong> {error.message}
{error.details && <div>Details: {error.details}</div>}
<button onClick={() => clearError(error.id)}>×</button>
</div>
))}

      {/* Your chat component */}
    </div>

);
};
\`\`\`

## 🎯 Complete Chat Application Example:

\`\`\`javascript
import React, { useState, useEffect, useRef } from 'react';
import { socketService } from '../utils/socket';

const CompleteChat = ({ currentUserId, receiverId, receiverName }) => {
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const [isTyping, setIsTyping] = useState(false);
const [typingUsers, setTypingUsers] = useState({});
const [isOnline, setIsOnline] = useState(false);
const [connectionStatus, setConnectionStatus] = useState('disconnected');
const messagesEndRef = useRef(null);
const typingTimeoutRef = useRef(null);

// Auto scroll to bottom
const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
scrollToBottom();
}, [messages]);

// Load existing messages
useEffect(() => {
const loadMessages = async () => {
try {
const token = localStorage.getItem('token');
const response = await fetch(`/api/v1/message/${receiverId}`, {
headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
if (data.success) {
setMessages(data.data);
}
} catch (error) {
console.error('Failed to load messages:', error);
}
};

    if (receiverId) {
      loadMessages();
    }

}, [receiverId]);

// Socket event listeners
useEffect(() => {
// Connection status
const handleConnect = () => setConnectionStatus('connected');
const handleDisconnect = () => setConnectionStatus('disconnected');
const handleConnectError = () => setConnectionStatus('error');

    // New message received
    const handleNewMessage = (message) => {
      if (message.senderId._id === receiverId || message.receiverId === currentUserId) {
        setMessages(prev => [...prev, message]);

        // Mark as seen if it's for me
        if (message.receiverId === currentUserId) {
          socketService.emit('markMessageSeen', {
            messageId: message._id,
            senderId: message.senderId._id
          });
        }
      }
    };

    // Message sent confirmation
    const handleMessageSent = (message) => {
      if (message.receiverId === receiverId) {
        setMessages(prev => [...prev, message]);
      }
    };

    // Typing indicator
    const handleUserTyping = (data) => {
      if (data.userId === receiverId) {
        setTypingUsers(prev => ({
          ...prev,
          [data.userId]: data.isTyping ? data.user : null
        }));
      }
    };

    // Online status
    const handleOnlineUsers = (userIds) => {
      setIsOnline(userIds.includes(receiverId));
    };

    const handleUserOnline = (data) => {
      if (data.userId === receiverId) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = (data) => {
      if (data.userId === receiverId) {
        setIsOnline(false);
      }
    };

    // Message seen
    const handleMessageSeen = (data) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === data.messageId
            ? { ...msg, seen: true }
            : msg
        )
      );
    };

    // Add event listeners
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('connect_error', handleConnectError);
    socketService.on('newMessage', handleNewMessage);
    socketService.on('messageSent', handleMessageSent);
    socketService.on('userTyping', handleUserTyping);
    socketService.on('onlineUsers', handleOnlineUsers);
    socketService.on('userOnline', handleUserOnline);
    socketService.on('userOffline', handleUserOffline);
    socketService.on('messageSeen', handleMessageSeen);

    // Get initial online users
    socketService.emit('getOnlineUsers');

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('connect_error', handleConnectError);
      socketService.off('newMessage', handleNewMessage);
      socketService.off('messageSent', handleMessageSent);
      socketService.off('userTyping', handleUserTyping);
      socketService.off('onlineUsers', handleOnlineUsers);
      socketService.off('userOnline', handleUserOnline);
      socketService.off('userOffline', handleUserOffline);
      socketService.off('messageSeen', handleMessageSeen);
    };

}, [currentUserId, receiverId]);

// Send message
const handleSendMessage = (e) => {
e.preventDefault();

    if (!newMessage.trim() || connectionStatus !== 'connected') return;

    socketService.emit('sendMessage', {
      receiverId: receiverId,
      message: newMessage,
      media: null
    });

    setNewMessage('');

    // Stop typing
    if (isTyping) {
      socketService.emit('typing', {
        receiverId: receiverId,
        isTyping: false
      });
      setIsTyping(false);
    }

};

// Handle typing
const handleInputChange = (e) => {
setNewMessage(e.target.value);

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      socketService.emit('typing', {
        receiverId: receiverId,
        isTyping: true
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        socketService.emit('typing', {
          receiverId: receiverId,
          isTyping: false
        });
        setIsTyping(false);
      }
    }, 2000);

};

return (

<div className="chat-container">
{/_ Header _/}
<div className="chat-header">
<div className="user-info">
<h3>{receiverName}</h3>
<span className={`status ${isOnline ? 'online' : 'offline'}`}>
{isOnline ? '🟢 Online' : '🔴 Offline'}
</span>
</div>
<div className={`connection-status ${connectionStatus}`}>
{connectionStatus === 'connected' && '🟢'}
{connectionStatus === 'disconnected' && '🔴'}
{connectionStatus === 'error' && '🚫'}
</div>
</div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${message.senderId._id === currentUserId ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <p>{message.message}</p>
              {message.media && (
                <img src={message.media || "/placeholder.svg"} alt="attachment" style={{maxWidth: '200px'}} />
              )}
            </div>
            <div className="message-info">
              <span className="time">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
              {message.senderId._id === currentUserId && (
                <span className={`seen-status ${message.seen ? 'seen' : 'sent'}`}>
                  {message.seen ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers[receiverId] && (
          <div className="typing-indicator">
            {receiverName} লিখছে...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Message লিখুন..."
          disabled={connectionStatus !== 'connected'}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || connectionStatus !== 'connected'}
        >
          পাঠান
        </button>
      </form>
    </div>

);
};

export default CompleteChat;
\`\`\`

## 🎉 সম্পূর্ণ Setup এর সারাংশ:

### ✅ যা যা পাবেন:

1. **Real-time Messaging** - তাৎক্ষণিক message পাঠানো এবং গ্রহণ
2. **Authentication** - JWT token দিয়ে secure connection
3. **Typing Indicators** - কে লিখছে সেটা দেখা
4. **Online/Offline Status** - কে online আছে জানা
5. **Message Status** - Message delivered/seen status
6. **Group Chat** - Room-based group messaging
7. **Notifications** - Push notifications
8. **Error Handling** - Proper error management
9. **File Sharing** - Image/file সহ message
10. **Auto Reconnection** - Connection lost হলে auto reconnect

### 🚀 Production Ready Features:

- Scalable architecture
- TypeScript support
- Error handling
- Authentication middleware
- Clean code structure
- Comprehensive documentation
