import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Lock, Key, AlertCircle } from 'lucide-react';
import { getApiUrl, getAuthHeaders } from '../config/api';
import logo from '../logo.png';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    accessToken: '',
    password: ''
  });
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenStatus, setTokenStatus] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTokenCheck = async () => {
    if (!formData.accessToken) {
      setError('Please enter your access token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/pro/check-token'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ accessToken: formData.accessToken })
      });

      const data = await response.json();

      if (data.status === 'valid') {
        setTokenStatus(data);
        setIsFirstTime(true);
      } else if (data.status === 'used') {
        setTokenStatus(null);
        setIsFirstTime(false);
      } else {
        setError(data.message || 'Invalid access token');
      }
    } catch (err) {
      setError('Failed to verify token. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.accessToken || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (isFirstTime) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isFirstTime ? '/api/pro/activate' : '/api/pro/login';
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          accessToken: formData.accessToken,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('proToken', data.token);
        localStorage.setItem('proUser', JSON.stringify(data.user));
        localStorage.setItem('accessToken', formData.accessToken);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-56 h-26 mb-4">
            <img src={logo} alt="CyberRazor Logo" className="w-full h-full rounded-lg" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Pro Portal
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isFirstTime ? 'First time? Enter your access token from the payment confirmation email' : 'Enter your credentials to access the portal'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {tokenStatus && isFirstTime && (
              <div className="bg-blue-500/10 border border-blue-500 text-blue-500 p-3 rounded-md">
                <p className="text-sm font-medium">✅ Valid Access Token!</p>
                <p className="text-xs mt-1">Email: {tokenStatus.email}</p>
                <p className="text-xs">Plan: {tokenStatus.plan}</p>
                <p className="text-xs mt-2 text-blue-400">Now create a secure password for your account</p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  name="accessToken"
                  type="text"
                  placeholder="Enter your access token"
                  value={formData.accessToken}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={tokenStatus !== null}
                  required
                />
              </div>
              {!tokenStatus && (
                <Button 
                  type="button"
                  onClick={handleTokenCheck}
                  disabled={loading || !formData.accessToken}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? 'Verifying...' : 'Verify Access Token'}
                </Button>
              )}
            </div>

            {(tokenStatus !== null || !isFirstTime) && (
              <>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type="password"
                      placeholder={isFirstTime ? 'Create password' : 'Enter password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {isFirstTime && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? 'Please wait...' : (isFirstTime ? 'Activate Account' : 'Sign In')}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
