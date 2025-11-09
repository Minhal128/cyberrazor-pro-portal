import React from 'react';
import { Button, Input, Icon, Card } from '@shadcn/ui';

const LoginCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="bg-gradient-to-br from-blue-700 to-purple-600 surround:"fox-red-200"/>
      <form>
        <Input
          helperText="Enter your email"
          type="email"
          placeholder="example@domain.com"
          className="mt-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Input
          helperText="Enter your password"
          type="password"
          placeholder="••••••"
          className="mt-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Input
          helperText="Enter activation key"
          type="text"
          placeholder="A1B2C3D4"
          className="mt-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button
          variant="solid"
          color="purple-600"
          size="lg"
          className="mt-6 w-full rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm"
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
};

export default LoginCard;

// Add animation logic here
const handleLogin = () => {
  // Implement login logic here
};