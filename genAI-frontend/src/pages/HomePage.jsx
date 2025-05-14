import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Welcome Back, [User Name]!</h1>

      <section>
        <h2 className="text-xl font-semibold mb-1">Get Started</h2>
        <p className="text-sm text-gray-600 mb-4">
          Get started with free automated testing as we take care of your complete software testing needs.
        </p>
        <button
          onClick={() => navigate('/new-test')}
          className="px-4 py-2 bg-blue-900 text-white text-sm rounded hover:bg-blue-800 transition"
        >
          Create a Test
        </button>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Recent Tests</h2>
          <button className="text-sm text-gray-600 hover:text-black transition">
            View All →
          </button>
        </div>

        <div className="w-full p-8 bg-gray-100 border rounded flex flex-col items-center text-center text-sm text-gray-500">
          <FileText size={40} className="mb-4 text-gray-400" />
          <p>No past tests. Get started by creating your first one.</p>
          <button
            onClick={() => navigate('/new-test')}
            className="mt-4 px-4 py-2 bg-blue-900 text-white text-sm rounded hover:bg-blue-800 transition"
          >
            Create a Test
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
