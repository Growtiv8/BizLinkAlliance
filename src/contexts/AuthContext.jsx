import React, { createContext, useContext, useState, useEffect } from 'react';

    const AuthContext = createContext();

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Check for existing user session in localStorage
        const savedUser = localStorage.getItem('bizlink_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        setLoading(false);
      }, []);

      const login = async (email, password) => {
        // Mock authentication - replace with real auth later
        const mockUser = {
          id: '1',
          email,
          name: 'John Doe',
          membershipType: 'premium', // free, premium, board
          businessName: 'Doe Consulting',
          industry: 'Consulting',
          joinDate: new Date().toISOString(),
          socials: {
            linkedin: 'https://linkedin.com/in/johndoe',
            twitter: 'https://twitter.com/johndoe',
            website: 'https://doecunsulting.com'
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('bizlink_user', JSON.stringify(mockUser));
        return mockUser;
      };

      const register = async (userData) => {
        // Mock registration - replace with real auth later
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          membershipType: 'free',
          joinDate: new Date().toISOString(),
          socials: {
            linkedin: '',
            twitter: '',
            website: ''
          }
        };
        
        setUser(newUser);
        localStorage.setItem('bizlink_user', JSON.stringify(newUser));
        
        const activities = JSON.parse(localStorage.getItem('bizlink_activities')) || [];
        activities.unshift({
          id: Date.now(),
          type: 'new_member',
          text: `${newUser.name} joined as a free member.`,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('bizlink_activities', JSON.stringify(activities.slice(0, 10)));

        return newUser;
      };

      const logout = () => {
        setUser(null);
        localStorage.removeItem('bizlink_user');
      };

      const updateMembership = (membershipType) => {
        if (user) {
          const updatedUser = { ...user, membershipType };
          setUser(updatedUser);
          localStorage.setItem('bizlink_user', JSON.stringify(updatedUser));

          const activities = JSON.parse(localStorage.getItem('bizlink_activities')) || [];
          activities.unshift({
            id: Date.now(),
            type: 'upgrade',
            text: `${user.name} upgraded to ${membershipType} membership.`,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('bizlink_activities', JSON.stringify(activities.slice(0, 10)));
        }
      };

      const value = {
        user,
        login,
        register,
        logout,
        updateMembership,
        loading
      };

      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
    };