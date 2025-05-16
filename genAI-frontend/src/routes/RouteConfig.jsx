import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layouts/Layout.jsx';
import HomePage from '../pages/HomePage';
import NewTestPage from '../pages/NewTestPage';
import AllTestsPage from '../pages/AllTestsPage';
import ProfilePage from '../pages/ProfilePage';

const RouteConfig = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="new-test" element={<NewTestPage />} />
        <Route path="all-tests" element={<AllTestsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default RouteConfig;
