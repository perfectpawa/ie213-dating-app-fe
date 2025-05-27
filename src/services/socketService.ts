import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private static instance: SocketService;
    private userId: string | null = null;

    private constructor() {}

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    connect(userId: string) {
        console.log('SocketService: Attempting to connect with userId:', userId);
        
        if (this.userId === userId && this.socket?.connected) {
            // console.log('SocketService: Already connected with this user');
            return;
        }

        // Disconnect existing connection if any
        this.disconnect();

        this.userId = userId;
        // console.log('SocketService: Creating new socket connection');
        
        this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling'],
            autoConnect: true,
            forceNew: true
        });

        // Setup connection event handlers
        this.socket.on('connect', () => {
            // console.log('SocketService: Socket connected successfully');
            // Join user's notification room after connection
            this.socket?.emit('join', userId);
            console.log('SocketService: Emitted join event for userId:', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('SocketService: Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('SocketService: Connection error:', error);
        });

        this.socket.on('error', (error) => {
            console.error('SocketService: Socket error:', error);
        });
    }

    disconnect() {
        // console.log('SocketService: Disconnecting socket');
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.userId = null;
            console.log('SocketService: Socket disconnected and cleaned up');
        }
    }

    onNotification(callback: (notification: any) => void) {
        // console.log('SocketService: Setting up notification listener');
        if (this.socket) {
            // Remove any existing listeners to prevent duplicates
            this.socket.off('notification');
            // Add the new listener
            this.socket.on('notification', (notification) => {
                console.log('SocketService: Received notification:', notification);
                callback(notification);
            });
            // console.log('SocketService: Notification listener set up successfully');
        } else {
            console.warn('SocketService: Cannot set up notification listener - socket is null');
        }
    }

    offNotification(callback: (notification: any) => void) {
        // console.log('SocketService: Removing notification listener');
        if (this.socket) {
            this.socket.off('notification', callback);
            // console.log('SocketService: Notification listener removed');
        }
    }

    isConnected(): boolean {
        const connected = this.socket?.connected || false;
        console.log('SocketService: Connection status:', connected);
        return connected;
    }
}

export const socketService = SocketService.getInstance(); 