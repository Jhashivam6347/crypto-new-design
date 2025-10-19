import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Profile {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'merchant' | 'admin';
}

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setProfile(parsed);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        reject(new Error('Invalid email or password'));
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setUser(foundUser);
      setProfile(foundUser);
      resolve();
    });
  };

  const signUp = async (email: string, password: string, username: string, role: string) => {
    return new Promise<void>((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((u: any) => u.email === email)) {
        reject(new Error('Email already registered'));
        return;
      }

      const newUser: Profile & { password: string } = {
        id: crypto.randomUUID(),
        email,
        username,
        role: role as 'user' | 'merchant' | 'admin',
        password,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      setProfile(newUser);
      resolve();
    });
  };

  const signOut = async () => {
    return new Promise<void>((resolve) => {
      localStorage.removeItem('currentUser');
      setUser(null);
      setProfile(null);
      resolve();
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
