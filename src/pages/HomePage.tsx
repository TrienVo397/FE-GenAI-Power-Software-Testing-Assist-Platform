import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import React from 'react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-[90%] mx-auto">
      <h1 className="text-2xl font-bold">Welcome Back, [User Name]!</h1>

      <section>
        <h2 className="text-xl font-semibold mb-1">Get Started</h2>
        <p className="text-sm text-gray-600 mb-4">
          Get started with free automated testing as we take care of your complete software testing needs.
        </p>
        <Button onClick={() => navigate('/new-test')} variant="default">
          Create a Test
        </Button>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Recent Tests</h2>
          <Button variant="link" size="sm">
            View All →
          </Button>
        </div>

        <div className="w-full p-8 bg-gray-100 border rounded flex flex-col items-center text-center text-sm text-gray-500">
          <FileText size={40} className="mb-4 text-gray-400" />
          <p>No past tests. Get started by creating your first one.</p>
          <Button
            onClick={() => navigate('/new-test')}
            variant="default"
            className="mt-4"
          >
            Create a Test
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
