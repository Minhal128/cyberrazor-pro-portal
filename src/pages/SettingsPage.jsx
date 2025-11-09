import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Settings, Lock, User, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { getApiUrl, getAuthHeaders } from '../config/api';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('proUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(getApiUrl('/api/pro/password'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password updated successfully!');
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto mb-2 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="mt-1 p-3 bg-secondary rounded-md">
                <p className="text-sm">{user?.email || 'Not available'}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Access Token</label>
              <div className="mt-1 p-3 bg-secondary rounded-md">
                <p className="text-sm font-mono break-all">
                  {localStorage.getItem('accessToken') || 'Not available'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Subscription Plan</label>
              <div className="mt-1 p-3 bg-secondary rounded-md">
                <p className="text-sm capitalize font-semibold text-blue-500">{user?.subscriptionPlan || 'Pro'}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Subscription Status</label>
              <div className="mt-1 p-3 bg-secondary rounded-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-semibold">
                    {user?.subscriptionStatus === 'active' ? 'Active' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative mt-1">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 characters)"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={updating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {updating ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Additional Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Last Login</p>
              <p className="text-sm">
                {user?.lastLogin 
                  ? new Date(user.lastLogin).toLocaleString() 
                  : 'Not available'}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Subscription Expires</p>
              <p className="text-sm">
                {user?.subscriptionEndDate 
                  ? new Date(user.subscriptionEndDate).toLocaleDateString() 
                  : '30 days from activation'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
