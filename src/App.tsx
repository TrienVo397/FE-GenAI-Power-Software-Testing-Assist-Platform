import { BrowserRouter } from "react-router-dom";
import RouteConfig from "./routes/RouteConfig";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RouteConfig />
    </BrowserRouter>
  );
};

export default App;
